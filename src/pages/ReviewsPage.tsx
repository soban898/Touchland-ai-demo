import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Search, ThumbsUp, ChevronDown, MessageSquare, Sparkles, TrendingUp, AlertCircle, Heart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { reviews } from '@/lib/data'
import { cn } from '@/lib/utils'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } }
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } }

const emotionConfig: Record<string, { bg: string; text: string; emoji: string }> = {
  Excited: { bg: 'bg-yellow-50 dark:bg-yellow-950/30', text: 'text-yellow-700', emoji: '🤩' },
  Happy: { bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-700', emoji: '😊' },
  Satisfied: { bg: 'bg-blue-50 dark:bg-blue-950/30', text: 'text-blue-700', emoji: '😌' },
  Neutral: { bg: 'bg-gray-50 dark:bg-gray-950/30', text: 'text-gray-600', emoji: '😐' },
  Frustrated: { bg: 'bg-orange-50 dark:bg-orange-950/30', text: 'text-orange-700', emoji: '😤' },
  Angry: { bg: 'bg-red-50 dark:bg-red-950/30', text: 'text-red-700', emoji: '😠' },
}

const sentimentConfig: Record<string, string> = {
  Positive: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30',
  Neutral: 'bg-muted text-muted-foreground',
  Negative: 'bg-red-50 text-red-700 dark:bg-red-950/30',
}

export function ReviewsPage() {
  const [search, setSearch] = useState('')
  const [ratingFilter, setRatingFilter] = useState('all')
  const [sentimentFilter, setSentimentFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = reviews.filter(r => {
    const matchSearch = search === '' ||
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.text.toLowerCase().includes(search.toLowerCase()) ||
      r.product.toLowerCase().includes(search.toLowerCase())
    const matchRating = ratingFilter === 'all' || r.rating === parseInt(ratingFilter)
    const matchSentiment = sentimentFilter === 'all' || r.sentiment === sentimentFilter
    return matchSearch && matchRating && matchSentiment
  })

  const positiveCount = reviews.filter(r => r.sentiment === 'Positive').length
  const neutralCount = reviews.filter(r => r.sentiment === 'Neutral').length
  const negativeCount = reviews.filter(r => r.sentiment === 'Negative').length

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Reviews', value: reviews.length, icon: MessageSquare, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Avg Rating', value: '4.7', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
          { label: 'Positive', value: `${positiveCount}`, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
          { label: 'Need Response', value: `${negativeCount}`, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30' },
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

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Reviews List */}
        <div className="flex-1 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search reviews, products, customers..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm bg-background"
              />
            </div>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-[120px] h-9 text-sm">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ratings</SelectItem>
                {[5, 4, 3, 2, 1].map(r => (
                  <SelectItem key={r} value={String(r)}>{r} stars</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sentimentFilter} onValueChange={setSentimentFilter}>
              <SelectTrigger className="w-[130px] h-9 text-sm">
                <SelectValue placeholder="Sentiment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sentiment</SelectItem>
                <SelectItem value="Positive">Positive</SelectItem>
                <SelectItem value="Neutral">Neutral</SelectItem>
                <SelectItem value="Negative">Negative</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline" className="text-xs text-muted-foreground">
              {filtered.length} results
            </Badge>
          </div>

          {/* Review Cards */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={search + ratingFilter + sentimentFilter}
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-3"
            >
              {filtered.map(review => {
                const emotion = emotionConfig[review.emotion]
                const isExpanded = expandedId === review.id
                return (
                  <motion.div key={review.id} variants={item} layout>
                    <Card className="border-border/60 hover:shadow-sm transition-all duration-200 hover:border-primary/20">
                      <CardContent className="p-5">
                        <div className="space-y-3">
                          {/* Header */}
                          <div className="flex items-start gap-3">
                            <Avatar className="size-9 flex-shrink-0">
                              <AvatarFallback className="text-sm bg-primary/10 text-primary font-medium">{review.initials}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-semibold">{review.customerName}</span>
                                {review.verified && (
                                  <Badge variant="secondary" className="h-4 px-1.5 text-[10px] bg-blue-50 text-blue-600 border-0">
                                    ✓ Verified
                                  </Badge>
                                )}
                                <Badge variant="secondary" className={cn("h-4 px-1.5 text-[10px] border-0", sentimentConfig[review.sentiment])}>
                                  {review.sentiment}
                                </Badge>
                                <Badge variant="secondary" className={cn("h-4 px-1.5 text-[10px] border-0", emotion.bg, emotion.text)}>
                                  {emotion.emoji} {review.emotion}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <div className="flex items-center gap-0.5">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star key={i} className={cn("size-3", i < review.rating ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30")} />
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground">{review.platform} · {review.country}</span>
                                <span className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              </div>
                            </div>
                          </div>

                          {/* Product */}
                          <div className="text-xs text-muted-foreground bg-muted/40 px-3 py-1.5 rounded-md w-fit">
                            📦 {review.product}
                          </div>

                          {/* Review text */}
                          <p className="text-sm text-foreground leading-relaxed">{review.text}</p>

                          {/* AI Summary */}
                          <div className="bg-primary/5 border border-primary/15 rounded-lg p-3">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <Sparkles className="size-3 text-primary" />
                              <span className="text-xs font-semibold text-primary">AI Summary</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{review.aiSummary}</p>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5">
                            {review.tags.map(tag => (
                              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-3">
                              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
                                <ThumbsUp className="size-3" />
                                {review.helpfulCount} helpful
                              </button>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs gap-1.5"
                              onClick={() => setExpandedId(isExpanded ? null : review.id)}
                            >
                              <MessageSquare className="size-3" />
                              {isExpanded ? 'Hide' : 'Suggested Response'}
                              <ChevronDown className={cn("size-3 transition-transform", isExpanded && "rotate-180")} />
                            </Button>
                          </div>

                          {/* Suggested Response */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="bg-muted/40 rounded-lg p-3 space-y-2 mt-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-muted-foreground">AI Suggested Response</span>
                                    <Button variant="ghost" size="sm" className="h-6 text-xs">Copy</Button>
                                  </div>
                                  <p className="text-xs text-foreground leading-relaxed">{review.suggestedResponse}</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Sidebar */}
        <div className="lg:w-72 xl:w-80 space-y-4 flex-shrink-0">
          {/* Sentiment Breakdown */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Sentiment Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: 'Positive', count: positiveCount, total: reviews.length, color: 'bg-emerald-500' },
                { label: 'Neutral', count: neutralCount, total: reviews.length, color: 'bg-amber-400' },
                { label: 'Negative', count: negativeCount, total: reviews.length, color: 'bg-red-500' },
              ].map(item => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium">{Math.round((item.count / item.total) * 100)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / item.total) * 100}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={cn("h-full rounded-full", item.color)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Common Themes */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Common Positive Themes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { theme: 'Beautiful packaging', count: 24 },
                { theme: 'Scent quality', count: 31 },
                { theme: 'Moisturizing formula', count: 19 },
                { theme: 'Gift appeal', count: 16 },
                { theme: 'Fast-drying', count: 22 },
              ].map(t => (
                <div key={t.theme} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <Heart className="size-3 text-emerald-500" />
                    <span className="text-xs text-foreground">{t.theme}</span>
                  </div>
                  <Badge variant="secondary" className="h-4 px-1.5 text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 border-0">
                    {t.count}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Common Complaints</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { issue: 'Pump issues', count: 8 },
                { issue: 'Price-to-size ratio', count: 12 },
                { issue: 'Scent longevity', count: 15 },
                { issue: 'Packaging damage', count: 4 },
                { issue: 'Availability', count: 6 },
              ].map(t => (
                <div key={t.issue} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="size-3 text-red-400" />
                    <span className="text-xs text-foreground">{t.issue}</span>
                  </div>
                  <Badge variant="secondary" className="h-4 px-1.5 text-[10px] bg-red-50 text-red-700 dark:bg-red-950/30 border-0">
                    {t.count}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* AI Recommendation */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <span className="text-xs font-semibold text-primary">AI Recommendation</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                15 reviews mention pump issues — this is a product quality signal. Consider requesting a QC audit on your current production batch before next shipment.
              </p>
              <Button size="sm" variant="secondary" className="w-full h-7 text-xs">
                Create action item
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
