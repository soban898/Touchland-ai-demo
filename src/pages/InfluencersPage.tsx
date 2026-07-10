import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, TrendingUp, Star, DollarSign, Sparkles, ExternalLink, MessageSquare, BarChart3 } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { influencers } from '@/lib/data'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

const platformConfig: Record<string, { color: string; bg: string; emoji: string }> = {
  TikTok: { color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-950/30', emoji: '🎵' },
  Instagram: { color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/30', emoji: '📸' },
  YouTube: { color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/30', emoji: '▶️' },
  Twitter: { color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-950/30', emoji: '🐦' },
  Pinterest: { color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30', emoji: '📌' },
}

function formatFollowers(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toString()
}

const engagementHistory = [
  { month: 'Aug', rate: 7.8 }, { month: 'Sep', rate: 9.2 }, { month: 'Oct', rate: 8.4 },
  { month: 'Nov', rate: 10.1 }, { month: 'Dec', rate: 11.8 }, { month: 'Jan', rate: 12.4 },
]

const contentPerformance = [
  { type: 'Reel', views: 840, engagement: 12.4 },
  { type: 'Story', views: 320, engagement: 8.2 },
  { type: 'Post', views: 280, engagement: 6.8 },
  { type: 'Live', views: 124, engagement: 14.2 },
]

export function InfluencersPage() {
  const [selectedInfluencer, setSelectedInfluencer] = useState<typeof influencers[0] | null>(null)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Influencers', value: '6', color: 'text-primary', bg: 'bg-primary/10', icon: Users },
          { label: 'Combined Reach', value: '14.2M', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30', icon: TrendingUp },
          { label: 'Avg ROI', value: '5.1x', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30', icon: Star },
          { label: 'Campaign Budget', value: '$49.3K', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30', icon: DollarSign },
        ].map(stat => (
          <motion.div key={stat.label} variants={item}>
            <Card className="border-border/60">
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

      {/* Influencer Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {influencers.map(inf => {
          const platform = platformConfig[inf.platform]
          const score = inf.compatibilityScore
          return (
            <motion.div key={inf.id} variants={item}>
              <Card className="group border-border/60 hover:shadow-md hover:border-primary/20 transition-all duration-300 cursor-pointer" onClick={() => setSelectedInfluencer(inf)}>
                <CardContent className="p-5 space-y-4">
                  {/* Header */}
                  <div className="flex items-start gap-3">
                    <Avatar className="size-12 flex-shrink-0">
                      <AvatarFallback className="text-base font-semibold bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                        {inf.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-foreground">{inf.name}</span>
                        {inf.compatibilityScore >= 95 && (
                          <Badge variant="secondary" className="h-4 px-1.5 text-[10px] bg-primary text-primary-foreground border-0">
                            ⭐ Top Match
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{inf.handle}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className={cn("h-4 px-1.5 text-[10px] border-0", platform.bg, platform.color)}>
                          {platform.emoji} {inf.platform}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{inf.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-muted/30 rounded-lg p-2">
                      <p className="text-sm font-bold">{formatFollowers(inf.followers)}</p>
                      <p className="text-[10px] text-muted-foreground">Followers</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-2">
                      <p className="text-sm font-bold">{inf.engagement}%</p>
                      <p className="text-[10px] text-muted-foreground">Engagement</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-2">
                      <p className="text-sm font-bold">{inf.campaignROI}x</p>
                      <p className="text-[10px] text-muted-foreground">ROI</p>
                    </div>
                  </div>

                  {/* Compatibility Score */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Compatibility Score</span>
                      <span className={cn(
                        "text-xs font-bold",
                        score >= 95 ? "text-primary" : score >= 85 ? "text-emerald-500" : "text-amber-500"
                      )}>{score}%</span>
                    </div>
                    <Progress value={score} className="h-2" />
                  </div>

                  {/* Category Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {inf.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* AI Partnership Suggestion */}
                  <div className="bg-primary/5 border border-primary/15 rounded-lg p-2.5">
                    <div className="flex items-start gap-1.5">
                      <Sparkles className="size-3 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{inf.suggestedPartnership}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button variant="default" size="sm" className="flex-1 h-8 text-xs gap-1" onClick={() => toast.success(`Contact request sent to ${inf.name}`)}>
                      <MessageSquare className="size-3" />
                      Contact
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-1" onClick={() => setSelectedInfluencer(inf)}>
                      <BarChart3 className="size-3" />
                      Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Influencer Profile Drawer */}
      <Sheet open={!!selectedInfluencer} onOpenChange={(open) => !open && setSelectedInfluencer(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto p-0">
          {selectedInfluencer && (
            <>
              {/* Hero */}
              <div className="h-28 bg-gradient-to-br from-primary/20 to-primary/5 relative flex-shrink-0">
                <div className="absolute inset-0 opacity-30"
                  style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, var(--primary) 0%, transparent 60%)' }} />
              </div>

              <SheetHeader className="px-6 pb-4 border-b border-border/60 -mt-8 relative">
                <div className="flex items-end justify-between pr-8">
                  <Avatar className="size-16 border-4 border-background shadow-lg">
                    <AvatarFallback className="text-xl font-bold bg-gradient-to-br from-primary/30 to-primary/10 text-primary">
                      {selectedInfluencer.initials}
                    </AvatarFallback>
                  </Avatar>
                  {selectedInfluencer.compatibilityScore >= 95 && (
                    <Badge className="bg-primary text-primary-foreground">⭐ Top Match</Badge>
                  )}
                </div>
                <div className="pt-2">
                  <SheetTitle className="text-base">{selectedInfluencer.name}</SheetTitle>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-muted-foreground">{selectedInfluencer.handle}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <Badge variant="secondary" className={cn("h-4 px-1.5 text-[10px] border-0", platformConfig[selectedInfluencer.platform].bg, platformConfig[selectedInfluencer.platform].color)}>
                      {platformConfig[selectedInfluencer.platform].emoji} {selectedInfluencer.platform}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{selectedInfluencer.location}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => toast.success(`Contact request sent to ${selectedInfluencer.name}`)}>
                    <MessageSquare className="size-3.5" />
                    Contact
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                    <ExternalLink className="size-3.5" />
                    View profile
                  </Button>
                </div>
              </SheetHeader>

              <div className="px-6 py-5 space-y-5">
                {/* Stats */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Followers', value: formatFollowers(selectedInfluencer.followers) },
                    { label: 'Engagement', value: `${selectedInfluencer.engagement}%` },
                    { label: 'Avg Views', value: formatFollowers(selectedInfluencer.avgViews) },
                    { label: 'Est. Rate', value: `$${(selectedInfluencer.price / 1000).toFixed(1)}K` },
                  ].map(kpi => (
                    <div key={kpi.label} className="text-center p-2 rounded-xl border border-border/60 bg-card">
                      <p className="text-sm font-bold">{kpi.value}</p>
                      <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
                    </div>
                  ))}
                </div>

                {/* Compatibility & Audience */}
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Compatibility Score</span>
                      <span className="font-bold text-primary">{selectedInfluencer.compatibilityScore}%</span>
                    </div>
                    <Progress value={selectedInfluencer.compatibilityScore} className="h-2" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Audience Match</span>
                      <span className="font-medium">{selectedInfluencer.audienceMatch}%</span>
                    </div>
                    <Progress value={selectedInfluencer.audienceMatch} className="h-1.5" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Campaign ROI</span>
                      <span className="font-medium">{selectedInfluencer.campaignROI}x</span>
                    </div>
                    <Progress value={(selectedInfluencer.campaignROI / 8) * 100} className="h-1.5" />
                  </div>
                </div>

                {/* Engagement Trend */}
                <div>
                  <p className="text-xs font-semibold text-foreground mb-3">Engagement Rate Trend</p>
                  <div className="p-3 rounded-xl border border-border/60 bg-card">
                    <ResponsiveContainer width="100%" height={140}>
                      <LineChart data={engagementHistory} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="rate" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Content Performance */}
                <div>
                  <p className="text-xs font-semibold text-foreground mb-3">Content Type Performance</p>
                  <div className="p-3 rounded-xl border border-border/60 bg-card">
                    <ResponsiveContainer width="100%" height={120}>
                      <BarChart data={contentPerformance} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                        <XAxis dataKey="type" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
                        <Tooltip />
                        <Bar dataKey="views" fill="var(--chart-1)" radius={[3, 3, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">Content Categories</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedInfluencer.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Partnership Suggestion */}
                <div className="bg-primary/5 border border-primary/15 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="size-4 text-primary" />
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">AI Partnership Recommendation</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedInfluencer.suggestedPartnership}</p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
