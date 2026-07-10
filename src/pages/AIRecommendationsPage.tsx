import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Clock, Target, ChevronDown, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { aiRecommendations } from '@/lib/data'
import { cn } from '@/lib/utils'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.07 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

const categoryConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  Marketing: { icon: <span className="text-sm">📢</span>, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/30' },
  Pricing: { icon: <span className="text-sm">💲</span>, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  Product: { icon: <span className="text-sm">📦</span>, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  Sales: { icon: <span className="text-sm">📈</span>, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/30' },
  Content: { icon: <span className="text-sm">📝</span>, color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-950/30' },
}

const priorityConfig: Record<string, { color: string; bg: string; border: string }> = {
  Critical: { color: 'text-red-700', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-900' },
  High: { color: 'text-amber-700', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-900' },
  Medium: { color: 'text-blue-700', bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-blue-200 dark:border-blue-900' },
  Low: { color: 'text-muted-foreground', bg: 'bg-muted', border: 'border-border' },
}

const difficultyConfig: Record<string, { color: string }> = {
  Easy: { color: 'text-emerald-600' },
  Medium: { color: 'text-amber-600' },
  Hard: { color: 'text-red-600' },
}

const filters = ['All', 'Critical', 'High', 'Medium', 'Marketing', 'Product', 'Content', 'Pricing', 'Sales']

export function AIRecommendationsPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [expandedId, setExpandedId] = useState<string | null>('1')

  const filtered = aiRecommendations.filter(r => {
    if (activeFilter === 'All') return true
    if (['Critical', 'High', 'Medium', 'Low'].includes(activeFilter)) return r.priority === activeFilter
    return r.category === activeFilter
  })

  const criticalCount = aiRecommendations.filter(r => r.priority === 'Critical').length
  const highCount = aiRecommendations.filter(r => r.priority === 'High').length

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="size-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-base font-semibold">AI Recommendations Engine</h2>
                  <Badge variant="secondary" className="h-4 px-1.5 text-[10px] bg-primary/10 text-primary border-0">
                    {aiRecommendations.length} active
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  AI has analyzed your reviews, social data, competitor intelligence, and market signals to generate {aiRecommendations.length} prioritized recommendations. 
                  <span className="text-primary font-medium"> {criticalCount} critical</span> and <span className="text-amber-500 font-medium">{highCount} high-priority</span> actions require immediate attention.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Critical', value: criticalCount, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/30' },
          { label: 'High Priority', value: highCount, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
          { label: 'Avg. Confidence', value: '88%', color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Est. Total ROI', value: '$4.2M', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
        ].map(s => (
          <motion.div key={s.label} variants={item}>
            <Card className="border-border/60">
              <CardContent className="p-4">
                <p className={cn("text-2xl font-bold", s.color)}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              activeFilter === f
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Recommendations */}
      <AnimatePresence mode="popLayout">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
          {filtered.map((rec) => {
            const isExpanded = expandedId === rec.id
            const category = categoryConfig[rec.category]
            const priority = priorityConfig[rec.priority]
            const difficulty = difficultyConfig[rec.difficulty]

            return (
              <motion.div key={rec.id} variants={item} layout>
                <Card className={cn("border transition-all duration-200 hover:shadow-sm", priority.border)}>
                  <CardContent className="p-5">
                    {/* Header */}
                    <div
                      className="flex items-start gap-4 cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                    >
                      <div className={cn("size-10 rounded-xl flex items-center justify-center flex-shrink-0", category.bg)}>
                        <span className={category.color}>{category.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <Badge variant="secondary" className={cn("h-5 px-2 text-xs border-0", priority.bg, priority.color)}>
                            {rec.priority}
                          </Badge>
                          <Badge variant="secondary" className={cn("h-5 px-2 text-xs bg-muted text-muted-foreground border-0")}>
                            {rec.category}
                          </Badge>
                          <span className={cn("text-xs font-medium", difficulty.color)}>
                            {rec.difficulty} to implement
                          </span>
                        </div>
                        <h3 className="text-sm font-semibold text-foreground leading-snug">{rec.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">{rec.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-sm font-bold text-emerald-600">{rec.roi}</p>
                          <p className="text-[10px] text-muted-foreground">estimated ROI</p>
                        </div>
                        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
                      </div>
                    </div>

                    {/* Metrics Bar */}
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Impact</span>
                          <span className="font-medium">{rec.impact}%</span>
                        </div>
                        <Progress value={rec.impact} className="h-1.5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Confidence</span>
                          <span className="font-medium">{rec.confidence}%</span>
                        </div>
                        <Progress value={rec.confidence} className="h-1.5" />
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="size-3" />
                        <span>Timeline: <span className="font-medium text-foreground">{rec.timeline}</span></span>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4 space-y-4">
                            {/* Action Steps */}
                            <div>
                              <p className="text-xs font-semibold text-foreground mb-2">Action Steps</p>
                              <div className="space-y-2">
                                {rec.actionSteps.map((step, i) => (
                                  <div key={i} className="flex items-start gap-2.5">
                                    <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <span className="text-[10px] font-semibold text-primary">{i + 1}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{step}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Expected Outcome */}
                            <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-3">
                              <div className="flex items-center gap-1.5 mb-1">
                                <Target className="size-3 text-emerald-600" />
                                <span className="text-xs font-semibold text-emerald-700">Expected Outcome</span>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">{rec.expectedOutcome}</p>
                            </div>

                            {/* CTA */}
                            <div className="flex gap-2">
                              <Button size="sm" className="h-8 text-xs gap-1.5">
                                <Zap className="size-3" />
                                Start implementation
                              </Button>
                              <Button variant="outline" size="sm" className="h-8 text-xs">
                                Assign to team
                              </Button>
                              <Button variant="ghost" size="sm" className="h-8 text-xs">
                                Dismiss
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
