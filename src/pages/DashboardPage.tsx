import { useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { TrendingUp, TrendingDown, Star, BarChart3, DollarSign, Users, Heart, Repeat2, MousePointerClick, Radio, Sparkles, ArrowRight } from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { stats, chartData, reviews, aiRecommendations, notifications } from '@/lib/data'
import { cn } from '@/lib/utils'

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } }
}
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
}

function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toString()
}

function formatCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

const statCards = [
  { key: 'totalReviews', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30', format: formatNumber },
  { key: 'avgRating', icon: BarChart3, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30', format: (v: number) => v.toFixed(1) },
  { key: 'sentiment', icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-950/30', format: (v: number) => `${v}%` },
  { key: 'revenue', icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-950/30', format: formatCurrency },
  { key: 'socialMentions', icon: Radio, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30', format: formatNumber },
  { key: 'returningCustomers', icon: Repeat2, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-950/30', format: (v: number) => `${v}%` },
  { key: 'conversionRate', icon: MousePointerClick, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/30', format: (v: number) => `${v}%` },
  { key: 'influencerReach', icon: Users, color: 'text-teal-500', bg: 'bg-teal-50 dark:bg-teal-950/30', format: formatNumber },
]

const reviewChartConfig = {
  positive: { label: 'Positive', color: 'var(--chart-2)' },
  neutral: { label: 'Neutral', color: 'var(--chart-4)' },
  negative: { label: 'Negative', color: 'var(--chart-5)' },
}

const revenueChartConfig = {
  revenue: { label: 'Revenue', color: 'var(--chart-1)' },
  target: { label: 'Target', color: 'var(--chart-3)' },
}

const sentimentChartConfig = {
  touchland: { label: 'Touchland', color: 'var(--chart-1)' },
  purell: { label: 'Purell', color: 'var(--chart-3)' },
  drbronner: { label: "Dr. Bronner's", color: 'var(--chart-2)' },
}

const socialChartConfig = {
  tiktok: { label: 'TikTok', color: 'var(--chart-1)' },
  instagram: { label: 'Instagram', color: 'var(--chart-3)' },
  twitter: { label: 'Twitter', color: 'var(--chart-2)' },
  reddit: { label: 'Reddit', color: 'var(--chart-4)' },
}

const kpiDetails: Record<string, { history: { label: string; value: number }[]; forecast: string; explanation: string; recommendations: string[] }> = {
  totalReviews: {
    history: [{ label: 'Aug', value: 39200 }, { label: 'Sep', value: 41800 }, { label: 'Oct', value: 43200 }, { label: 'Nov', value: 45100 }, { label: 'Dec', value: 47400 }, { label: 'Jan', value: 48200 }],
    forecast: '52,400 reviews by next month',
    explanation: 'Review volume is growing steadily at 12.4% MoM. The acceleration in December is driven by holiday gifting and Vanilla Blossom seasonal demand.',
    recommendations: ['Enable auto-response for 5-star reviews', 'Send review request emails 7 days post-purchase', 'Target Amazon reviews with follow-up sequences'],
  },
  avgRating: {
    history: [{ label: 'Aug', value: 4.5 }, { label: 'Sep', value: 4.5 }, { label: 'Oct', value: 4.6 }, { label: 'Nov', value: 4.6 }, { label: 'Dec', value: 4.7 }, { label: 'Jan', value: 4.7 }],
    forecast: '4.8 rating target achievable in 90 days',
    explanation: 'Average rating improved from 4.5 to 4.7 over 6 months. Pump quality improvement in October drove the uplift. Wild Watermelon (4.8) and Vanilla Blossom (4.9) are top performers.',
    recommendations: ['Resolve pump quality issue to push toward 4.9', 'Respond to all 3-star reviews within 24 hours', 'Highlight positive reviews in marketing'],
  },
  sentiment: {
    history: [{ label: 'Aug', value: 84 }, { label: 'Sep', value: 86 }, { label: 'Oct', value: 85 }, { label: 'Nov', value: 88 }, { label: 'Dec', value: 90 }, { label: 'Jan', value: 91 }],
    forecast: '94% sentiment achievable with creator campaign',
    explanation: 'Sentiment score has improved 7 points since August. Wild Watermelon viral content drove a spike in January. Aloe You has the highest segment sentiment (97%) in the sensitive skin community.',
    recommendations: ['Launch TikTok creator fund campaign within 72h', 'Address pump complaints to prevent sentiment erosion', 'Amplify Aloe You sensitive skin testimonials'],
  },
  revenue: {
    history: [{ label: 'Aug', value: 2840000 }, { label: 'Sep', value: 3120000 }, { label: 'Oct', value: 3580000 }, { label: 'Nov', value: 4820000 }, { label: 'Dec', value: 6240000 }, { label: 'Jan', value: 3584200 }],
    forecast: '$4.2M next month with Valentine\'s bundle',
    explanation: 'January revenue normalizes post-December peak. Growth is driven by Wild Watermelon (23.4%), Vanilla Blossom (16.8%), and Aloe You (28.3%). Rainwater is the only declining SKU.',
    recommendations: ['Launch Valentine\'s Day gifting bundle for Feb', 'Address Aloe You inventory to prevent $2.1M revenue loss', 'Revitalize Rainwater marketing campaign'],
  },
  socialMentions: {
    history: [{ label: 'Aug', value: 142000 }, { label: 'Sep', value: 168000 }, { label: 'Oct', value: 184000 }, { label: 'Nov', value: 212000 }, { label: 'Dec', value: 248000 }, { label: 'Jan', value: 284000 }],
    forecast: '380K mentions next week with viral momentum',
    explanation: 'Social mentions have grown 100% since August. TikTok drives 65% of volume. Wild Watermelon hashtag grew 67% in 24h after viral videos. Reddit skincare community is organically recommending Aloe You.',
    recommendations: ['Creator fund campaign to amplify viral momentum', 'Monitor and engage with negative mentions within 2h', 'Explore Reddit AMA opportunity in skincare subreddits'],
  },
  returningCustomers: {
    history: [{ label: 'Aug', value: 62 }, { label: 'Sep', value: 63.2 }, { label: 'Oct', value: 63.8 }, { label: 'Nov', value: 65.1 }, { label: 'Dec', value: 66.2 }, { label: 'Jan', value: 67.4 }],
    forecast: '70% returning customer rate by Q2',
    explanation: 'Returning customer rate improved 5.4 points in 6 months. Gift purchasers show 72% repeat rate. Aloe You has the highest loyalty at 78% due to sensitive skin dependency.',
    recommendations: ['Launch subscription / refill program', 'Create loyalty rewards program', 'Target gift purchasers with bundle follow-up emails'],
  },
  conversionRate: {
    history: [{ label: 'Aug', value: 3.6 }, { label: 'Sep', value: 3.8 }, { label: 'Oct', value: 4.0 }, { label: 'Nov', value: 4.2 }, { label: 'Dec', value: 4.6 }, { label: 'Jan', value: 4.8 }],
    forecast: '5.5% conversion rate achievable by Q2',
    explanation: 'Conversion rate grew from 3.6% to 4.8% driven by improved product photography, social proof widgets, and TikTok-to-website traffic. The 4.8% is above industry average of 3.2% for beauty.',
    recommendations: ['A/B test new checkout flow', 'Add TikTok videos to product pages', 'Enable bundle suggestions at checkout'],
  },
  influencerReach: {
    history: [{ label: 'Aug', value: 18200000 }, { label: 'Sep', value: 20400000 }, { label: 'Oct', value: 22100000 }, { label: 'Nov', value: 24800000 }, { label: 'Dec', value: 26200000 }, { label: 'Jan', value: 28400000 }],
    forecast: '40M reach with creator fund campaign',
    explanation: 'Influencer reach grew 56% since August. Jade Morrison and Maya Patel drove 68% of total reach in January. Ariana Luz (99% compatibility) presents the highest untapped opportunity.',
    recommendations: ['Launch Ariana Luz LATAM ambassador partnership', 'Add 3-5 micro-influencers (100K-500K) in sensitive skin niche', 'Negotiate performance-based contracts for better ROI'],
  },
}


const sentimentEmoji: Record<string, string> = {
  Positive: '😊',
  Neutral: '😐',
  Negative: '😠',
}

interface KpiDrawerProps {
  statKey: string | null
  onClose: () => void
}

function KpiDrawer({ statKey, onClose }: KpiDrawerProps) {
  if (!statKey) return null
  const detail = kpiDetails[statKey]
  const statDef = statCards.find(s => s.key === statKey)
  const stat = stats[statKey as keyof typeof stats]
  if (!detail || !statDef) return null

  return (
    <Sheet open={!!statKey} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/60">
          <div className="flex items-center gap-3 pr-8">
            <div className={cn("size-10 rounded-xl flex items-center justify-center", statDef.bg)}>
              <statDef.icon className={cn("size-5", statDef.color)} />
            </div>
            <div>
              <SheetTitle className="text-base">{stat.label}</SheetTitle>
              <SheetDescription className="text-xs">
                Current: <strong>{statDef.format(stat.value)}</strong> ·
                <span className="text-emerald-600 ml-1">+{stat.change}%</span> vs. last period
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <div className="px-6 py-5 space-y-5">
          {/* History Chart */}
          <div>
            <p className="text-xs font-semibold text-foreground mb-3">6-Month History</p>
            <div className="p-3 rounded-xl border border-border/60 bg-card">
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={detail.history} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="kpiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="var(--chart-1)" fill="url(#kpiGrad)" strokeWidth={2} dot={{ r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Forecast */}
          <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/20">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="size-3 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700">AI Forecast</span>
            </div>
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-400">{detail.forecast}</p>
          </div>

          {/* Explanation */}
          <div className="bg-primary/5 border border-primary/15 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="size-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">AI Explanation</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{detail.explanation}</p>
          </div>

          {/* Recommendations */}
          <div>
            <p className="text-xs font-semibold text-foreground mb-3">Recommendations</p>
            <div className="space-y-2">
              {detail.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/30">
                  <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[10px] font-semibold text-primary">{i + 1}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function DashboardPage() {
  const [activeKpi, setActiveKpi] = useState<string | null>(null)

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* AI Executive Summary */}
      <motion.div variants={item}>
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="size-5 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">AI Executive Summary</span>
                  <Badge variant="secondary" className="h-4 px-1.5 text-[10px] bg-primary/10 text-primary border-0">Live</Badge>
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  <span className="font-semibold">This week, customer sentiment increased by 8.3%.</span>{' '}
                  Wild Watermelon is generating 43% more positive mentions, largely driven by 3 viral TikTok videos (combined 1.8M views). Vanilla Blossom leads Q4 gifting intent with a 96% sentiment score. Aloe You is your fastest-growing SKU (+52% above forecast) but inventory needs urgent attention — 12-day runway remaining at current velocity. Competitor Purell launched a moisturizing formula with weak reception (68% sentiment).{' '}
                  <span className="font-semibold">Recommended action: Launch creator fund campaign within 72 hours to amplify current viral momentum.</span>
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <Button size="sm" variant="secondary" className="h-7 text-xs gap-1.5">
                    <Sparkles className="size-3" />
                    Explore AI insights
                    <ArrowRight className="size-3" />
                  </Button>
                  <span className="text-xs text-muted-foreground">Updated 2 minutes ago</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        {statCards.map(({ key, icon: Icon, color, bg, format }) => {
          const stat = stats[key as keyof typeof stats]
          const isPositive = stat.change >= 0
          return (
            <Card
              key={key}
              className="group hover:shadow-md transition-all duration-300 border-border/60 hover:border-primary/20 cursor-pointer"
              onClick={() => setActiveKpi(key)}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className={cn("size-8 rounded-lg flex items-center justify-center", bg)}>
                    <Icon className={cn("size-4", color)} />
                  </div>
                  <div className={cn(
                    "flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-full",
                    isPositive ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30" : "text-red-500 bg-red-50 dark:bg-red-950/30"
                  )}>
                    {isPositive ? <TrendingUp className="size-3" /> : <TrendingDown className="size-3" />}
                    {Math.abs(stat.change)}%
                  </div>
                </div>
                <div>
                  <p className="text-xl font-bold text-foreground leading-none">{format(stat.value)}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-tight">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </motion.div>

      {/* Charts Row 1 */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Trends */}
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Revenue Trends</CardTitle>
            <CardDescription className="text-xs">Monthly revenue vs. target</CardDescription>
            <CardAction>
              <Badge variant="outline" className="text-xs">+18.2%</Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueChartConfig} className="h-[200px]">
              <AreaChart data={chartData.revenueTrends} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" fill="url(#revenueGrad)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="target" stroke="var(--chart-3)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Market Share */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Market Share</CardTitle>
            <CardDescription className="text-xs">Premium hand sanitizer segment</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ touchland: { label: 'Market', color: 'var(--chart-1)' } }} className="h-[160px]">
              <PieChart>
                <Pie data={chartData.marketShare} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
                  {chartData.marketShare.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(val) => [`${val}%`, 'Share']} />
              </PieChart>
            </ChartContainer>
            <div className="space-y-1.5 mt-2">
              {chartData.marketShare.slice(0, 4).map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full" style={{ background: item.fill }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts Row 2 */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Review Trends */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Review Sentiment Trends</CardTitle>
            <CardDescription className="text-xs">6-month breakdown by sentiment</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={reviewChartConfig} className="h-[200px]">
              <BarChart data={chartData.reviewTrends} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="positive" stackId="a" fill="var(--chart-2)" radius={[0, 0, 0, 0]} />
                <Bar dataKey="neutral" stackId="a" fill="var(--chart-4)" />
                <Bar dataKey="negative" stackId="a" fill="var(--chart-5)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Sentiment Timeline */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Competitive Sentiment</CardTitle>
            <CardDescription className="text-xs">Touchland vs competitors, 6 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={sentimentChartConfig} className="h-[200px]">
              <LineChart data={chartData.sentimentTimeline} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} domain={[55, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="touchland" stroke="var(--chart-1)" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="purell" stroke="var(--chart-3)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                <Line type="monotone" dataKey="drbronner" stroke="var(--chart-2)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Bottom Grid */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Social Mentions Chart */}
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Social Mentions This Week</CardTitle>
            <CardDescription className="text-xs">Daily breakdown by platform</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={socialChartConfig} className="h-[200px]">
              <BarChart data={chartData.socialMentions} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="tiktok" fill="var(--chart-1)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="instagram" fill="var(--chart-3)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="twitter" fill="var(--chart-2)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="reddit" fill="var(--chart-4)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
            <CardAction>
              <Button variant="ghost" size="sm" className="h-6 text-xs text-muted-foreground">View all</Button>
            </CardAction>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/40">
              {notifications.slice(0, 5).map((notif) => (
                <div key={notif.id} className="px-6 py-3 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "size-1.5 rounded-full mt-2 flex-shrink-0",
                      notif.priority === 'high' ? "bg-red-500" : notif.priority === 'medium' ? "bg-amber-500" : "bg-muted-foreground"
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground leading-snug truncate">{notif.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{notif.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Reviews + AI Insights */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Reviews */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Recent Reviews</CardTitle>
            <CardDescription className="text-xs">Latest customer feedback</CardDescription>
            <CardAction>
              <Button variant="ghost" size="sm" className="h-6 text-xs">View all</Button>
            </CardAction>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/40">
              {reviews.slice(0, 4).map(review => (
                <div key={review.id} className="px-6 py-3.5 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start gap-3">
                    <Avatar className="size-8 flex-shrink-0">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">{review.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-foreground">{review.customerName}</span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={cn("size-2.5", i < review.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30")} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">{review.text}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="secondary" className={cn(
                          "h-4 px-1.5 text-[10px] border-0",
                          review.sentiment === 'Positive' ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30" :
                          review.sentiment === 'Negative' ? "bg-red-50 text-red-700 dark:bg-red-950/30" :
                          "bg-muted text-muted-foreground"
                        )}>
                          {sentimentEmoji[review.sentiment]} {review.sentiment}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{review.platform}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Top AI Recommendations</CardTitle>
            <CardDescription className="text-xs">High-priority actions to take now</CardDescription>
            <CardAction>
              <Button variant="ghost" size="sm" className="h-6 text-xs">View all</Button>
            </CardAction>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/40">
              {aiRecommendations.slice(0, 4).map(rec => (
                <div key={rec.id} className="px-6 py-3.5 hover:bg-muted/20 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "size-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5",
                      rec.priority === 'Critical' ? "bg-red-50 dark:bg-red-950/30" :
                      rec.priority === 'High' ? "bg-amber-50 dark:bg-amber-950/30" :
                      "bg-blue-50 dark:bg-blue-950/30"
                    )}>
                      <Sparkles className={cn(
                        "size-3",
                        rec.priority === 'Critical' ? "text-red-500" :
                        rec.priority === 'High' ? "text-amber-500" :
                        "text-blue-500"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground leading-snug line-clamp-1">{rec.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">{rec.description}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="secondary" className={cn(
                          "h-4 px-1.5 text-[10px] border-0",
                          rec.priority === 'Critical' ? "bg-red-50 text-red-700 dark:bg-red-950/30" :
                          rec.priority === 'High' ? "bg-amber-50 text-amber-700 dark:bg-amber-950/30" :
                          "bg-blue-50 text-blue-700 dark:bg-blue-950/30"
                        )}>
                          {rec.priority}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{rec.roi}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      {/* KPI Drill-down Drawer */}
      <KpiDrawer statKey={activeKpi} onClose={() => setActiveKpi(null)} />
    </motion.div>
  )
}
