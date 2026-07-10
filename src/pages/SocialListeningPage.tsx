import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Heart, MessageCircle, Share2, Eye, Hash, Sparkles } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { socialPosts } from '@/lib/data'
import { cn } from '@/lib/utils'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }

const platformConfig: Record<string, { color: string; bg: string; emoji: string }> = {
  TikTok: { color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-950/30', emoji: '🎵' },
  Instagram: { color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/30', emoji: '📸' },
  Twitter: { color: 'text-sky-500', bg: 'bg-sky-50 dark:bg-sky-950/30', emoji: '🐦' },
  Facebook: { color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30', emoji: '👤' },
  Reddit: { color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/30', emoji: '💬' },
  YouTube: { color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/30', emoji: '▶️' },
  LinkedIn: { color: 'text-blue-700', bg: 'bg-blue-50 dark:bg-blue-950/30', emoji: '💼' },
}

function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`
  return n.toString()
}

const platforms = ['All', 'TikTok', 'Instagram', 'Twitter', 'Facebook', 'Reddit', 'YouTube', 'LinkedIn']

const trendingHashtags = [
  { tag: '#Touchland', posts: 28400, change: 43.2, trending: true },
  { tag: '#PowerMist', posts: 18200, change: 28.4, trending: true },
  { tag: '#WildWatermelon', posts: 12840, change: 67.1, trending: true },
  { tag: '#HandSanitizer', posts: 84000, change: 5.2, trending: false },
  { tag: '#BeautyTok', posts: 124000, change: 18.4, trending: false },
  { tag: '#SkincareTok', posts: 284000, change: 12.1, trending: false },
  { tag: '#AestheticBeauty', posts: 42000, change: 22.3, trending: false },
  { tag: '#CleanBeauty', posts: 62000, change: 8.4, trending: false },
]

const platformStats = [
  { platform: 'TikTok', mentions: 18420, reach: '42M', engagement: '12.4%', sentiment: 94 },
  { platform: 'Instagram', mentions: 8240, reach: '18M', engagement: '6.8%', sentiment: 91 },
  { platform: 'Twitter', mentions: 4820, reach: '8.2M', engagement: '4.2%', sentiment: 88 },
  { platform: 'Reddit', mentions: 2140, reach: '3.4M', engagement: '8.9%', sentiment: 86 },
  { platform: 'YouTube', mentions: 840, reach: '6.8M', engagement: '9.2%', sentiment: 90 },
  { platform: 'Facebook', mentions: 1640, reach: '5.2M', engagement: '3.4%', sentiment: 87 },
  { platform: 'LinkedIn', mentions: 420, reach: '2.1M', engagement: '5.1%', sentiment: 92 },
]

export function SocialListeningPage() {
  const [activePlatform, setActivePlatform] = useState('All')

  const filteredPosts = activePlatform === 'All'
    ? socialPosts
    : socialPosts.filter(p => p.platform === activePlatform)

  return (
    <div className="space-y-6">
      {/* Stats */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Mentions', value: '36.5K', change: '+43.2%', up: true, icon: MessageCircle, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Total Reach', value: '85.7M', change: '+31.4%', up: true, icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
          { label: 'Avg Engagement', value: '7.2%', change: '+2.1%', up: true, icon: Heart, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-950/30' },
          { label: 'Sentiment Score', value: '91%', change: '+8.3%', up: true, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
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
                <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 font-medium">
                  <TrendingUp className="size-3" />
                  {stat.change} this week
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Posts Feed */}
        <div className="lg:col-span-2 space-y-4">
          {/* Platform Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {platforms.map(p => (
              <button
                key={p}
                onClick={() => setActivePlatform(p)}
                className={cn(
                  "flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  activePlatform === p
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {p !== 'All' && platformConfig[p]?.emoji} {p}
              </button>
            ))}
          </div>

          {/* AI Summary */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="size-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-primary mb-1">AI Social Digest</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    TikTok is your highest-performing channel this week with 18,420 mentions and 42M reach. Wild Watermelon has gone viral with 3 videos crossing 500K views. Sentiment across all platforms is 91% positive. Reddit's skincare community is organically recommending Aloe You for sensitive skin — a highly authentic signal worth amplifying.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Posts */}
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
            {filteredPosts.map(post => {
              const config = platformConfig[post.platform]
              return (
                <motion.div key={post.id} variants={item}>
                  <Card className="border-border/60 hover:shadow-sm hover:border-primary/20 transition-all">
                    <CardContent className="p-5">
                      <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-9">
                              <AvatarFallback className="text-sm bg-primary/10 text-primary font-medium">{post.initials}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">{post.author}</span>
                                <Badge variant="secondary" className={cn("h-4 px-1.5 text-[10px] border-0", config.bg, config.color)}>
                                  {config.emoji} {post.platform}
                                </Badge>
                              </div>
                              <span className="text-xs text-muted-foreground">{post.authorHandle} · {post.date}</span>
                            </div>
                          </div>
                          <Badge variant="secondary" className={cn(
                            "h-5 px-2 text-xs border-0 flex-shrink-0",
                            post.sentiment === 'Positive' ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30" :
                            post.sentiment === 'Negative' ? "bg-red-50 text-red-700 dark:bg-red-950/30" :
                            "bg-muted text-muted-foreground"
                          )}>
                            {post.sentiment}
                          </Badge>
                        </div>

                        {/* Content */}
                        <p className="text-sm text-foreground leading-relaxed">{post.content}</p>

                        {/* Hashtags */}
                        <div className="flex flex-wrap gap-1.5">
                          {post.hashtags.slice(0, 4).map(tag => (
                            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/5 text-primary font-medium">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Metrics */}
                        <div className="flex items-center gap-4 pt-1 border-t border-border/40">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Heart className="size-3" /> {formatNumber(post.likes)}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MessageCircle className="size-3" /> {formatNumber(post.comments)}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Share2 className="size-3" /> {formatNumber(post.shares)}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-auto">
                            <Eye className="size-3" /> {formatNumber(post.reach)} reach
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Platform Performance */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Platform Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {platformStats.map(p => {
                const config = platformConfig[p.platform]
                return (
                  <div key={p.platform} className="flex items-center justify-between py-1.5 border-b border-border/30 last:border-0">
                    <div className="flex items-center gap-2">
                      <div className={cn("size-7 rounded-lg flex items-center justify-center text-sm", config.bg)}>
                        {config.emoji}
                      </div>
                      <div>
                        <p className="text-xs font-medium">{p.platform}</p>
                        <p className="text-[10px] text-muted-foreground">{formatNumber(p.mentions)} mentions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">{p.sentiment}%</p>
                      <p className="text-[10px] text-muted-foreground">sentiment</p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Trending Hashtags */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Trending Hashtags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {trendingHashtags.map(tag => (
                <div key={tag.tag} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <Hash className="size-3 text-primary" />
                    <span className="text-xs font-medium">{tag.tag.replace('#', '')}</span>
                    {tag.trending && (
                      <Badge variant="secondary" className="h-3.5 px-1 text-[9px] bg-primary/10 text-primary border-0">Hot</Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium">{formatNumber(tag.posts)}</p>
                    <p className={cn("text-[10px]", tag.change > 0 ? "text-emerald-500" : "text-red-500")}>
                      +{tag.change}%
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
