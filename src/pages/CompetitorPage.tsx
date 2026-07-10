import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Star, Sparkles, Shield, AlertTriangle, Target, Eye } from 'lucide-react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { competitors } from '@/lib/data'
import { cn } from '@/lib/utils'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

const radarData = [
  { metric: 'Brand Sentiment', touchland: 91, purell: 68, drbronner: 82 },
  { metric: 'Social Presence', touchland: 94, purell: 45, drbronner: 62 },
  { metric: 'Pricing', touchland: 65, purell: 85, drbronner: 72 },
  { metric: 'Distribution', touchland: 70, purell: 95, drbronner: 68 },
  { metric: 'Innovation', touchland: 92, purell: 58, drbronner: 75 },
  { metric: 'Product Quality', touchland: 90, purell: 72, drbronner: 85 },
]

const featureComparison = [
  { feature: 'Moisturizing Formula', touchland: true, purell: false, drbronner: true },
  { feature: 'Fragrance Variety', touchland: true, purell: false, drbronner: true },
  { feature: 'Premium Packaging', touchland: true, purell: false, drbronner: false },
  { feature: 'Organic Certified', touchland: false, purell: false, drbronner: true },
  { feature: 'TikTok Presence', touchland: true, purell: false, drbronner: false },
  { feature: 'Gift Market', touchland: true, purell: false, drbronner: false },
  { feature: 'Mass Distribution', touchland: false, purell: true, drbronner: true },
  { feature: 'Price Accessibility', touchland: false, purell: true, drbronner: true },
]

const competitorHistory = [
  { month: 'Aug', touchland: 29, purell: 44, drbronner: 13 },
  { month: 'Sep', touchland: 31, purell: 43, drbronner: 13 },
  { month: 'Oct', touchland: 32, purell: 43, drbronner: 12 },
  { month: 'Nov', touchland: 33, purell: 42, drbronner: 12 },
  { month: 'Dec', touchland: 34, purell: 42, drbronner: 12 },
  { month: 'Jan', touchland: 34, purell: 42, drbronner: 12 },
]

export function CompetitorPage() {
  const [selectedCompetitor, setSelectedCompetitor] = useState<typeof competitors[0] | null>(null)

  return (
    <div className="space-y-6">
      {/* Competitor Overview Cards */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {competitors.map(comp => (
          <motion.div key={comp.id} variants={item}>
            <Card
              className={cn(
                "border-border/60 hover:shadow-sm transition-all cursor-pointer",
                comp.name === 'Touchland' && "border-primary/30 bg-primary/5"
              )}
              onClick={() => setSelectedCompetitor(comp)}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{comp.logo}</span>
                    <div>
                      <p className="text-sm font-semibold">{comp.name}</p>
                      <p className="text-xs text-muted-foreground">{comp.priceRange}</p>
                    </div>
                  </div>
                  {comp.name === 'Touchland' && (
                    <Badge variant="secondary" className="h-4 px-1.5 text-[10px] bg-primary text-primary-foreground border-0">You</Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-lg font-bold">{comp.marketShare}%</p>
                    <div className="flex items-center gap-0.5 text-[10px]">
                      {comp.marketShareChange >= 0 ? (
                        <TrendingUp className="size-2.5 text-emerald-500" />
                      ) : (
                        <TrendingDown className="size-2.5 text-red-500" />
                      )}
                      <span className={comp.marketShareChange >= 0 ? "text-emerald-500" : "text-red-500"}>
                        {Math.abs(comp.marketShareChange)}%
                      </span>
                      <span className="text-muted-foreground ml-0.5">market share</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-0.5">
                      <Star className="size-2.5 text-amber-400 fill-amber-400" />
                      <p className="text-sm font-bold">{comp.avgRating}</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{(comp.totalReviews / 1000).toFixed(0)}K reviews</p>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-muted-foreground">Sentiment</span>
                    <span className="font-medium">{comp.sentiment}%</span>
                  </div>
                  <Progress value={comp.sentiment} className="h-1.5" />
                </div>

                <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">{comp.recentActivity}</p>
                <div className="flex items-center gap-1 text-[10px] text-primary font-medium pt-1">
                  <Eye className="size-2.5" />
                  View details
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Competitive Radar</CardTitle>
            <CardDescription className="text-xs">Multi-dimensional competitive analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} />
                <Radar name="Touchland" dataKey="touchland" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.2} strokeWidth={2} />
                <Radar name="Purell" dataKey="purell" stroke="var(--chart-3)" fill="var(--chart-3)" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 4" />
                <Radar name="Dr. Bronner's" dataKey="drbronner" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 4" />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 justify-center mt-2">
              {[
                { label: 'Touchland', dotColor: 'var(--chart-1)' },
                { label: 'Purell', dotColor: 'var(--chart-3)' },
                { label: "Dr. Bronner's", dotColor: 'var(--chart-2)' },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="size-2 rounded-full" style={{ background: l.dotColor }} />
                  {l.label}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Feature Comparison Table */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Feature Comparison</CardTitle>
            <CardDescription className="text-xs">Key differentiators across top brands</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground">Feature</th>
                    {['Touchland', 'Purell', "Dr. B"].map(name => (
                      <th key={name} className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">{name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {featureComparison.map(row => (
                    <tr key={row.feature} className="border-b border-border/20 last:border-0 hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-2.5 text-xs text-foreground">{row.feature}</td>
                      {[row.touchland, row.purell, row.drbronner].map((val, i) => (
                        <td key={i} className="px-3 py-2.5 text-center">
                          {val ? <span className="text-emerald-500 text-base">✓</span> : <span className="text-muted-foreground/40 text-base">—</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SWOT Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {competitors.slice(0, 2).map(comp => (
          <Card key={comp.id} className="border-border/60">
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="text-xl">{comp.logo}</span>
                <CardTitle className="text-sm font-semibold">{comp.name} — SWOT</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Shield className="size-3 text-emerald-500" />
                  <span className="text-xs font-semibold text-emerald-600">Strengths</span>
                </div>
                <ul className="space-y-1">
                  {comp.strengths.map(s => (
                    <li key={s} className="text-[11px] text-muted-foreground flex items-start gap-1">
                      <span className="text-emerald-400 mt-0.5">+</span> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="size-3 text-red-500" />
                  <span className="text-xs font-semibold text-red-600">Weaknesses</span>
                </div>
                <ul className="space-y-1">
                  {comp.weaknesses.map(w => (
                    <li key={w} className="text-[11px] text-muted-foreground flex items-start gap-1">
                      <span className="text-red-400 mt-0.5">−</span> {w}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Competitive Insight */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary mb-1">AI Competitive Intelligence</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Touchland leads the premium segment with 34.2% market share and best-in-class sentiment (91%). Your key competitive advantage is design-first positioning and TikTok virality — areas where Purell and Dr. Bronner's cannot easily compete. Purell's new moisturizing launch shows they're aware of your formula advantage, but their 68% sentiment on this product suggests poor execution. <strong className="text-foreground">Recommendation: Double down on the "luxury wellness" positioning and expand the influencer program before Purell can close the social media gap.</strong>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competitor Analysis Drawer */}
      <Sheet open={!!selectedCompetitor} onOpenChange={(open) => !open && setSelectedCompetitor(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto p-0">
          {selectedCompetitor && (
            <>
              <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/60">
                <div className="flex items-center gap-3 pr-8">
                  <div className="size-12 rounded-xl bg-muted flex items-center justify-center text-3xl">{selectedCompetitor.logo}</div>
                  <div>
                    <SheetTitle className="text-base">{selectedCompetitor.name}</SheetTitle>
                    <SheetDescription className="text-xs">Price: {selectedCompetitor.priceRange} · {selectedCompetitor.totalReviews.toLocaleString()} reviews</SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <div className="px-6 py-5 space-y-5">
                {/* KPIs */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Market Share', value: `${selectedCompetitor.marketShare}%`, change: `${selectedCompetitor.marketShareChange >= 0 ? '+' : ''}${selectedCompetitor.marketShareChange}%`, up: selectedCompetitor.marketShareChange >= 0 },
                    { label: 'Sentiment', value: `${selectedCompetitor.sentiment}%`, change: selectedCompetitor.sentiment >= 80 ? 'Strong' : 'Weak', up: selectedCompetitor.sentiment >= 80 },
                    { label: 'Avg Rating', value: selectedCompetitor.avgRating.toString(), change: `${selectedCompetitor.totalReviews.toLocaleString()} reviews`, up: true },
                    { label: 'Price Range', value: selectedCompetitor.priceRange, change: 'vs $14-17', up: selectedCompetitor.priceRange.startsWith('$1') || selectedCompetitor.priceRange.startsWith('$14') },
                  ].map(kpi => (
                    <div key={kpi.label} className="p-3 rounded-xl border border-border/60 bg-card">
                      <p className="text-xs text-muted-foreground">{kpi.label}</p>
                      <p className="text-lg font-bold text-foreground mt-0.5">{kpi.value}</p>
                      <p className={cn("text-xs font-medium", kpi.up ? "text-emerald-600" : "text-red-500")}>{kpi.change}</p>
                    </div>
                  ))}
                </div>

                {/* Market Share Trend */}
                <div>
                  <p className="text-xs font-semibold text-foreground mb-3">Market Share Trend (6 months)</p>
                  <div className="p-3 rounded-xl border border-border/60 bg-card">
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart data={competitorHistory} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                        <Tooltip />
                        <Bar dataKey="touchland" fill="var(--chart-1)" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="purell" fill="var(--chart-3)" radius={[2, 2, 0, 0]} />
                        <Bar dataKey="drbronner" fill="var(--chart-2)" radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* SWOT */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/20">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Shield className="size-3 text-emerald-500" />
                      <span className="text-xs font-semibold text-emerald-600">Strengths</span>
                    </div>
                    <ul className="space-y-1">
                      {selectedCompetitor.strengths.map(s => (
                        <li key={s} className="text-[11px] text-muted-foreground flex items-start gap-1">
                          <span className="text-emerald-400 mt-0.5">+</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
                    <div className="flex items-center gap-1.5 mb-2">
                      <AlertTriangle className="size-3 text-red-500" />
                      <span className="text-xs font-semibold text-red-600">Weaknesses</span>
                    </div>
                    <ul className="space-y-1">
                      {selectedCompetitor.weaknesses.map(w => (
                        <li key={w} className="text-[11px] text-muted-foreground flex items-start gap-1">
                          <span className="text-red-400 mt-0.5">−</span> {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="p-3 rounded-xl border border-border/60 bg-muted/30">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Target className="size-3 text-primary" />
                    <span className="text-xs font-semibold text-primary">Recent Activity</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{selectedCompetitor.recentActivity}</p>
                </div>

                {/* AI Insight */}
                <div className="bg-primary/5 border border-primary/15 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="size-4 text-primary" />
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">AI Strategic Insight</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedCompetitor.name === 'Touchland'
                      ? 'You are the market leader in sentiment and social presence. Continue investing in TikTok virality and premium design. Your main vulnerability is price accessibility — consider a value tier or bundle strategy to capture price-sensitive segments.'
                      : `${selectedCompetitor.name} is ${selectedCompetitor.marketShare > 40 ? 'your primary competitor' : 'a secondary competitor'}. Their ${selectedCompetitor.sentiment >= 80 ? 'strong' : 'weak'} sentiment (${selectedCompetitor.sentiment}%) ${selectedCompetitor.sentiment >= 80 ? 'makes them a credible threat' : 'is an opportunity for you to differentiate'}. Focus on your advantages in design, social, and premium positioning.`}
                  </p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
