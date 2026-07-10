import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Star, DollarSign, BarChart3, MessageSquare, Package, Sparkles } from 'lucide-react'
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { products, reviews } from '@/lib/data'
import { cn } from '@/lib/utils'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

function formatCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

function formatNumber(n: number) {
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

const monthlyData = [
  { month: 'Aug', revenue: 284, sentiment: 85 },
  { month: 'Sep', revenue: 312, sentiment: 87 },
  { month: 'Oct', revenue: 358, sentiment: 86 },
  { month: 'Nov', revenue: 421, sentiment: 89 },
  { month: 'Dec', revenue: 584, sentiment: 92 },
  { month: 'Jan', revenue: 642, sentiment: 94 },
]

export function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null)
  const [drawerMode, setDrawerMode] = useState<'analytics' | 'reviews'>('analytics')

  const productReviews = selectedProduct
    ? reviews.filter(r => r.product.toLowerCase().includes(selectedProduct.name.split('—')[1]?.trim().toLowerCase() || ''))
    : []

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Revenue', value: '$3.58M', change: '+18.2%', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
          { label: 'Avg Sentiment', value: '91%', change: '+8.3%', icon: BarChart3, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Total Reviews', value: '19.9K', change: '+12.4%', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
          { label: 'Active SKUs', value: '6', change: '+1 new', icon: Package, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
        ].map(stat => (
          <motion.div key={stat.label} variants={item}>
            <Card className="border-border/60 hover:shadow-sm transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn("size-9 rounded-xl flex items-center justify-center", stat.bg)}>
                    <stat.icon className={cn("size-4", stat.color)} />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Products Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {products.map(product => (
          <motion.div key={product.id} variants={item}>
            <Card className="group border-border/60 hover:shadow-md hover:border-primary/20 transition-all duration-300 overflow-hidden">
              <CardContent className="p-5 space-y-4">
                {/* Product Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="size-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm"
                      style={{ background: `${product.color}20` }}
                    >
                      <div className="size-8 rounded-xl" style={{ background: product.color }} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground leading-tight">
                        {product.name.split('—')[0].trim()}
                      </h3>
                      <p className="text-xs text-primary font-medium">— {product.name.split('—')[1]?.trim()}</p>
                      <p className="text-xs text-muted-foreground">{product.tagline}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-foreground flex-shrink-0">${product.price}</span>
                </div>

                {/* Mini Sparkline */}
                <div className="h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={product.trend.map((v, i) => ({ i, v }))} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                      <defs>
                        <linearGradient id={`grad-${product.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={product.color} stopOpacity={0.3} />
                          <stop offset="100%" stopColor={product.color} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="v" stroke={product.color} fill={`url(#grad-${product.id})`} strokeWidth={1.5} dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <p className="text-sm font-bold">{formatCurrency(product.revenue)}</p>
                    <p className="text-[10px] text-muted-foreground">Revenue</p>
                    <div className={cn("flex items-center justify-center gap-0.5 text-[10px]", product.revenueChange >= 0 ? "text-emerald-500" : "text-red-500")}>
                      {product.revenueChange >= 0 ? <TrendingUp className="size-2.5" /> : <TrendingDown className="size-2.5" />}
                      {Math.abs(product.revenueChange)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold">{product.sentiment}%</p>
                    <p className="text-[10px] text-muted-foreground">Sentiment</p>
                    <div className="h-1 rounded-full bg-muted mt-1 overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${product.sentiment}%` }} />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-0.5">
                      <Star className="size-2.5 text-amber-400 fill-amber-400" />
                      <p className="text-sm font-bold">{product.rating}</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground">Rating</p>
                    <p className="text-[10px] text-muted-foreground">{formatNumber(product.reviews)} reviews</p>
                  </div>
                </div>

                {/* Inventory */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Inventory</span>
                    <span className="text-xs font-medium">{formatNumber(product.inventory)} units</span>
                  </div>
                  <Progress value={(product.inventory / 25000) * 100} className="h-1.5" />
                </div>

                {/* Social */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="size-3" />
                    {formatNumber(product.mentions)} mentions
                    <span className={cn("font-medium", product.mentionsChange >= 0 ? "text-emerald-500" : "text-red-500")}>
                      ({product.mentionsChange >= 0 ? '+' : ''}{product.mentionsChange}%)
                    </span>
                  </div>
                </div>

                {/* AI Recommendation */}
                <div className="bg-primary/5 border border-primary/15 rounded-lg p-2.5">
                  <div className="flex items-start gap-1.5">
                    <Sparkles className="size-3 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{product.aiRecommendation}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => { setSelectedProduct(product); setDrawerMode('analytics') }}>
                    Analytics
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={() => { setSelectedProduct(product); setDrawerMode('reviews') }}>
                    Reviews
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Product Analytics / Reviews Drawer */}
      <Sheet open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto p-0">
          {selectedProduct && (
            <>
              <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/60">
                <div className="flex items-center gap-3 pr-8">
                  <div className="size-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm" style={{ background: `${selectedProduct.color}20` }}>
                    <div className="size-7 rounded-xl" style={{ background: selectedProduct.color }} />
                  </div>
                  <div>
                    <SheetTitle className="text-base">{selectedProduct.name}</SheetTitle>
                    <SheetDescription className="text-xs">{selectedProduct.category} · SKU: {selectedProduct.sku}</SheetDescription>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant={drawerMode === 'analytics' ? 'default' : 'outline'} className="h-7 text-xs" onClick={() => setDrawerMode('analytics')}>Analytics</Button>
                  <Button size="sm" variant={drawerMode === 'reviews' ? 'default' : 'outline'} className="h-7 text-xs" onClick={() => setDrawerMode('reviews')}>Reviews ({productReviews.length})</Button>
                </div>
              </SheetHeader>

              <div className="px-6 py-5 space-y-5">
                {drawerMode === 'analytics' ? (
                  <>
                    {/* KPIs */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: 'Revenue', value: formatCurrency(selectedProduct.revenue), change: `${selectedProduct.revenueChange >= 0 ? '+' : ''}${selectedProduct.revenueChange}%` },
                        { label: 'Sentiment', value: `${selectedProduct.sentiment}%`, change: '+4.2%' },
                        { label: 'Mentions', value: formatNumber(selectedProduct.mentions), change: `${selectedProduct.mentionsChange >= 0 ? '+' : ''}${selectedProduct.mentionsChange}%` },
                        { label: 'Avg Rating', value: selectedProduct.rating.toString(), change: '+0.1' },
                      ].map(kpi => (
                        <div key={kpi.label} className="p-3 rounded-xl border border-border/60 bg-card">
                          <p className="text-xs text-muted-foreground">{kpi.label}</p>
                          <p className="text-lg font-bold text-foreground mt-0.5">{kpi.value}</p>
                          <p className="text-xs text-emerald-600 font-medium">{kpi.change}</p>
                        </div>
                      ))}
                    </div>

                    {/* Revenue Chart */}
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-3">Revenue & Sentiment Trend</p>
                      <div className="p-4 rounded-xl border border-border/60 bg-card">
                        <ResponsiveContainer width="100%" height={180}>
                          <AreaChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="productRevGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={selectedProduct.color} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={selectedProduct.color} stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                            <Tooltip />
                            <Area type="monotone" dataKey="revenue" stroke={selectedProduct.color} fill="url(#productRevGrad)" strokeWidth={2} dot={false} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Sentiment Chart */}
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-3">Sentiment Score Over Time</p>
                      <div className="p-4 rounded-xl border border-border/60 bg-card">
                        <ResponsiveContainer width="100%" height={140}>
                          <LineChart data={monthlyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} domain={[80, 100]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="sentiment" stroke="var(--chart-2)" strokeWidth={2} dot={{ r: 3 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* AI Recommendation */}
                    <div className="bg-primary/5 border border-primary/15 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="size-4 text-primary" />
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">AI Recommendation</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{selectedProduct.aiRecommendation}</p>
                    </div>

                    {/* Inventory */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-foreground">Inventory Status</p>
                        <span className="text-xs text-muted-foreground">{formatNumber(selectedProduct.inventory)} units</span>
                      </div>
                      <Progress value={(selectedProduct.inventory / 25000) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {selectedProduct.inventory > 12000 ? 'Healthy stock levels' : selectedProduct.inventory > 8000 ? 'Moderate — reorder recommended' : 'Low — urgent reorder needed'}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {productReviews.length > 0 ? (
                      <div className="space-y-3">
                        {productReviews.map(review => (
                          <div key={review.id} className="p-3 rounded-xl border border-border/60 bg-card space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">{review.initials}</div>
                                <span className="text-xs font-medium">{review.customerName}</span>
                              </div>
                              <div className="flex items-center gap-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star key={i} className={cn("size-2.5", i < review.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30")} />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{review.text}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className={cn("h-4 px-1.5 text-[10px] border-0",
                                review.sentiment === 'Positive' ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30" :
                                review.sentiment === 'Negative' ? "bg-red-50 text-red-700 dark:bg-red-950/30" : "bg-muted text-muted-foreground"
                              )}>{review.sentiment}</Badge>
                              <span className="text-[10px] text-muted-foreground">{review.platform}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <Star className="size-8 text-muted-foreground/30 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No reviews yet for this product</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
