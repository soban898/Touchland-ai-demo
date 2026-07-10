import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FileText, Download, Mail, Calendar, Clock, CheckCircle,
  Sparkles, BarChart3, Users, Package, Swords, Share2,
  TrendingUp, MessageCircle
} from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { ExportModal } from '@/components/ExportModal'
import { EmptyState } from '@/components/EmptyState'
import { chartData } from '@/lib/data'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }

interface ReportType {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bg: string
  lastGenerated: string
  frequency: string
  pages: number
  formats: string[]
  healthScore: number
  aiSummary: string
  kpis: { label: string; value: string; change: string }[]
  chartType: 'area' | 'bar' | 'line' | 'pie'
}

const reportTypes: ReportType[] = [
  {
    id: '1',
    title: 'Executive Summary',
    description: 'High-level overview of brand health, revenue, sentiment, and key wins — designed for C-suite and board presentations.',
    icon: BarChart3,
    color: 'text-primary',
    bg: 'bg-primary/10',
    lastGenerated: '2 hours ago',
    frequency: 'Weekly',
    pages: 8,
    formats: ['PDF', 'PPT'],
    healthScore: 87,
    aiSummary: 'Brand health is strong at 87/100 (+3 from last week). Revenue grew 18.2% MoM to $3.58M, driven by Wild Watermelon virality. Sentiment improved to 91% positive. Two critical AI recommendations require attention: TikTok creator fund launch and Aloe You inventory replenishment.',
    kpis: [
      { label: 'Brand Health Score', value: '87/100', change: '+3' },
      { label: 'Monthly Revenue', value: '$3.58M', change: '+18.2%' },
      { label: 'Sentiment Score', value: '91%', change: '+8.3%' },
      { label: 'Social Mentions', value: '284K', change: '+43.2%' },
    ],
    chartType: 'area',
  },
  {
    id: '2',
    title: 'Weekly Brand Report',
    description: 'Comprehensive weekly performance breakdown across all channels, products, and customer touchpoints.',
    icon: FileText,
    color: 'text-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
    lastGenerated: '1 day ago',
    frequency: 'Weekly',
    pages: 12,
    formats: ['PDF', 'CSV'],
    healthScore: 85,
    aiSummary: 'This week delivered exceptional results across all metrics. Wild Watermelon went viral on TikTok with 3 videos exceeding 500K views. Vanilla Blossom leads in gifting intent. Aloe You is your fastest-growing SKU but needs urgent inventory attention. Overall brand momentum is accelerating.',
    kpis: [
      { label: 'Total Reviews', value: '48.2K', change: '+12.4%' },
      { label: 'Avg Rating', value: '4.7', change: '+0.2' },
      { label: 'Returning Customers', value: '67.4%', change: '+5.8%' },
      { label: 'Conversion Rate', value: '4.8%', change: '+1.2%' },
    ],
    chartType: 'bar',
  },
  {
    id: '3',
    title: 'Monthly Executive Report',
    description: 'Board-ready monthly report with strategic insights, competitive analysis, and growth recommendations.',
    icon: TrendingUp,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    lastGenerated: '5 days ago',
    frequency: 'Monthly',
    pages: 24,
    formats: ['PDF', 'PPT', 'XLSX'],
    healthScore: 89,
    aiSummary: 'January delivered $3.58M in revenue, exceeding target by 21%. Market share grew to 34.2% (+4.8%). Touchland now leads the premium hand sanitizer segment in sentiment (91%) and social presence (94 score). Strategic recommendation: expand to UK/EU markets via Aisha Thompson partnership for $1.2M first-year revenue potential.',
    kpis: [
      { label: 'Monthly Revenue', value: '$3.58M', change: '+18.2%' },
      { label: 'Market Share', value: '34.2%', change: '+4.8%' },
      { label: 'Influencer Reach', value: '28.4M', change: '+31.4%' },
      { label: 'Campaign ROI', value: '5.1x', change: '+0.8x' },
    ],
    chartType: 'line',
  },
  {
    id: '4',
    title: 'Product Performance Report',
    description: 'SKU-level analytics including revenue, reviews, inventory health, and AI-powered growth recommendations.',
    icon: Package,
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    lastGenerated: '1 day ago',
    frequency: 'Weekly',
    pages: 16,
    formats: ['PDF', 'CSV', 'XLSX'],
    healthScore: 82,
    aiSummary: 'Wild Watermelon ($842K, +23.4%) and Vanilla Blossom ($712K, +16.8%) are your top performers. Aloe You is the fastest-growing SKU (+28.3%) but critically low on inventory. Rainwater is declining (-2.1%) and needs a marketing refresh. Berry Bliss shows strong bundle potential with Wild Watermelon for summer promotion.',
    kpis: [
      { label: 'Top SKU Revenue', value: '$842K', change: '+23.4%' },
      { label: 'Avg Product Sentiment', value: '90%', change: '+4.2%' },
      { label: 'Total Reviews', value: '19.9K', change: '+12.4%' },
      { label: 'Inventory Health', value: '82%', change: '-3.1%' },
    ],
    chartType: 'bar',
  },
  {
    id: '5',
    title: 'Social Listening Report',
    description: 'Cross-platform social intelligence with trending hashtags, viral content, and sentiment analysis.',
    icon: MessageCircle,
    color: 'text-pink-600',
    bg: 'bg-pink-50 dark:bg-pink-950/30',
    lastGenerated: '6 hours ago',
    frequency: 'Weekly',
    pages: 14,
    formats: ['PDF', 'CSV'],
    healthScore: 93,
    aiSummary: 'Social mentions reached 284K this week (+43.2%). TikTok is your dominant channel with 18,420 mentions and 42M reach. Wild Watermelon hashtag grew 67% in 24 hours. Reddit skincare community is organically recommending Aloe You. Overall sentiment across platforms: 91% positive. LinkedIn B2B content performing well for brand positioning.',
    kpis: [
      { label: 'Total Mentions', value: '36.5K', change: '+43.2%' },
      { label: 'Total Reach', value: '85.7M', change: '+31.4%' },
      { label: 'Avg Engagement', value: '7.2%', change: '+2.1%' },
      { label: 'Sentiment', value: '91%', change: '+8.3%' },
    ],
    chartType: 'bar',
  },
  {
    id: '6',
    title: 'Competitor Intelligence Report',
    description: 'Competitive landscape analysis including market share, sentiment comparison, feature gaps, and strategic opportunities.',
    icon: Swords,
    color: 'text-orange-600',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    lastGenerated: '3 days ago',
    frequency: 'Monthly',
    pages: 18,
    formats: ['PDF'],
    healthScore: 78,
    aiSummary: 'Touchland leads premium segment with 34.2% market share (+4.8%). Purell holds 41.8% but declining (-2.1%). Their new moisturizing formula launched with weak 68% sentiment. Dr. Bronner\'s stable at 12.4%. Key opportunity: Purell\'s failed moisturizing launch creates a window to capture their dissatisfied customers. Recommend aggressive skincare-adjacent marketing.',
    kpis: [
      { label: 'Market Share', value: '34.2%', change: '+4.8%' },
      { label: 'Sentiment Lead', value: '+23pts', change: 'vs Purell' },
      { label: 'Social Score', value: '94', change: '+12' },
      { label: 'Price Premium', value: '+287%', change: 'vs Purell' },
    ],
    chartType: 'pie',
  },
  {
    id: '7',
    title: 'Influencer Campaign Report',
    description: 'Complete influencer program analysis including reach, engagement, ROI, audience match, and campaign recommendations.',
    icon: Users,
    color: 'text-teal-600',
    bg: 'bg-teal-50 dark:bg-teal-950/30',
    lastGenerated: '4 days ago',
    frequency: 'Monthly',
    pages: 14,
    formats: ['PDF'],
    healthScore: 91,
    aiSummary: 'Influencer program delivered 28.4M combined reach with 5.1x average ROI. Top performer: Ariana Luz (7.2x ROI, 99% compatibility). Jade Morrison generated organic Wild Watermelon virality. 3 high-priority partnership opportunities identified for LATAM expansion, sensitive skin niche, and male grooming market.',
    kpis: [
      { label: 'Combined Reach', value: '14.2M', change: '+31.4%' },
      { label: 'Avg ROI', value: '5.1x', change: '+0.8x' },
      { label: 'Active Influencers', value: '6', change: '+2' },
      { label: 'Campaign Budget', value: '$49.3K', change: '+12%' },
    ],
    chartType: 'bar',
  },
]

const scheduledReports = [
  { name: 'Weekly Executive Summary', next: 'Tomorrow, 9:00 AM', email: 'sarah@touchland.com, ceo@touchland.com', type: 'Email + PDF' },
  { name: 'Monthly Marketing Report', next: 'Feb 1, 9:00 AM', email: 'marketing@touchland.com', type: 'Email + PDF' },
  { name: 'Competitor Intelligence', next: 'Feb 5, 9:00 AM', email: 'sarah@touchland.com', type: 'Email + PDF' },
]

export function ReportsPage() {
  const [generating, setGenerating] = useState<string | null>(null)
  const [previewReport, setPreviewReport] = useState<ReportType | null>(null)
  const [exportOpen, setExportOpen] = useState(false)
  const [showEmpty, setShowEmpty] = useState(false)

  const handleGenerate = async (id: string) => {
    setGenerating(id)
    await new Promise(r => setTimeout(r, 1500))
    setGenerating(null)
    toast.success('Report generated successfully', {
      description: 'Your report is ready to view and download.',
    })
  }

  const handleShare = (report: ReportType) => {
    toast.success(`Share link copied`, {
      description: `${report.title} share link copied to clipboard.`,
    })
  }

  const renderChart = (report: ReportType) => {
    if (report.chartType === 'area') {
      return (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData.revenueTrends} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="reportGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} tickFormatter={(v) => `$${(v / 1_000_000).toFixed(1)}M`} />
            <Tooltip />
            <Area type="monotone" dataKey="revenue" stroke="var(--chart-1)" fill="url(#reportGrad)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      )
    }
    if (report.chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData.socialMentions} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
            <Tooltip />
            <Bar dataKey="tiktok" fill="var(--chart-1)" radius={[2, 2, 0, 0]} />
            <Bar dataKey="instagram" fill="var(--chart-3)" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )
    }
    if (report.chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData.sentimentTimeline} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} domain={[55, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="touchland" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="purell" stroke="var(--chart-3)" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      )
    }
    return (
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={chartData.marketShare} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value">
            {chartData.marketShare.map((entry, idx) => (
              <Cell key={idx} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Reports Generated', value: '124', icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
          { label: 'Scheduled Reports', value: '3', icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
          { label: 'Avg Generation Time', value: '8s', icon: Clock, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
          { label: 'Email Deliveries', value: '47', icon: Mail, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30' },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Types */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Available Reports</h2>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground" onClick={() => setShowEmpty(!showEmpty)}>
              {showEmpty ? 'Show reports' : 'View empty state'}
            </Button>
          </div>

          {showEmpty ? (
            <Card className="border-border/60">
              <EmptyState
                icon={<FileText className="size-7" />}
                title="No reports yet"
                description="Generate your first AI-powered report to get instant insights about your brand performance."
                actionLabel="Generate report"
                onAction={() => setShowEmpty(false)}
              />
            </Card>
          ) : (
            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {reportTypes.map(report => (
                <motion.div key={report.id} variants={item}>
                  <Card className="group border-border/60 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer" onClick={() => setPreviewReport(report)}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={cn("size-9 rounded-xl flex items-center justify-center flex-shrink-0", report.bg)}>
                            <report.icon className={cn("size-4", report.color)} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{report.title}</p>
                            <p className="text-[10px] text-muted-foreground">{report.frequency} · {report.pages} pages</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-foreground">{report.healthScore}</p>
                          <p className="text-[9px] text-muted-foreground">health</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{report.description}</p>
                      <div className="flex items-center gap-2">
                        {report.formats.map(fmt => (
                          <Badge key={fmt} variant="outline" className="h-4 px-1.5 text-[10px]">{fmt}</Badge>
                        ))}
                        <span className="text-[10px] text-muted-foreground ml-auto">Last: {report.lastGenerated}</span>
                      </div>
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          className="flex-1 h-7 text-xs gap-1.5"
                          disabled={generating === report.id}
                          onClick={() => handleGenerate(report.id)}
                        >
                          {generating === report.id ? (
                            <>
                              <div className="size-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Sparkles className="size-3" />
                              Generate
                            </>
                          )}
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => { setPreviewReport(report); setTimeout(() => setExportOpen(true), 300) }}>
                          <Download className="size-3" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => handleShare(report)}>
                          <Share2 className="size-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Scheduled Reports */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Scheduled Reports</h2>
          <div className="space-y-3">
            {scheduledReports.map(r => (
              <Card key={r.name} className="border-border/60">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-semibold text-foreground">{r.name}</p>
                    <Badge variant="secondary" className="h-4 px-1.5 text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 border-0">
                      Active
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Clock className="size-3" />
                      Next: {r.next}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Mail className="size-3" />
                      {r.email}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <FileText className="size-3" />
                      {r.type}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button variant="outline" className="w-full h-9 text-sm gap-2" onClick={() => toast.info('Schedule dialog would open here')}>
            <Calendar className="size-4" />
            Schedule new report
          </Button>

          {/* Recent Activity */}
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold">Recent Generations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {[
                { name: 'Executive Summary', time: '2h ago', status: 'Complete' },
                { name: 'Sentiment Analysis', time: '6h ago', status: 'Complete' },
                { name: 'Product Performance', time: '1d ago', status: 'Complete' },
                { name: 'Marketing Report', time: '1d ago', status: 'Complete' },
              ].map(r => (
                <div key={r.name} className="flex items-center justify-between px-4 py-2.5 border-b border-border/30 last:border-0">
                  <div>
                    <p className="text-xs font-medium">{r.name}</p>
                    <p className="text-[10px] text-muted-foreground">{r.time}</p>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <CheckCircle className="size-3" />
                    <span className="text-[10px] font-medium">{r.status}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Report Preview Drawer */}
      <Sheet open={!!previewReport} onOpenChange={(open) => !open && setPreviewReport(null)}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto p-0">
          {previewReport && (
            <>
              <SheetHeader className="px-6 pt-6 pb-4 border-b border-border/60">
                <div className="flex items-start justify-between gap-4 pr-8">
                  <div className="flex items-center gap-3">
                    <div className={cn("size-10 rounded-xl flex items-center justify-center flex-shrink-0", previewReport.bg)}>
                      <previewReport.icon className={cn("size-5", previewReport.color)} />
                    </div>
                    <div>
                      <SheetTitle className="text-base">{previewReport.title}</SheetTitle>
                      <SheetDescription className="text-xs">{previewReport.frequency} · {previewReport.pages} pages · Generated {previewReport.lastGenerated}</SheetDescription>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => setExportOpen(true)}>
                    <Download className="size-3.5" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={() => handleShare(previewReport)}>
                    <Share2 className="size-3.5" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={() => toast.info('Schedule dialog would open here')}>
                    <Calendar className="size-3.5" />
                    Schedule
                  </Button>
                </div>
              </SheetHeader>

              <div className="px-6 py-5 space-y-5">
                {/* Brand Health Score */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/15">
                  <div className="relative">
                    <svg className="size-16 -rotate-90">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="var(--border)" strokeWidth="4" />
                      <circle
                        cx="32" cy="32" r="28" fill="none" stroke="var(--primary)" strokeWidth="4"
                        strokeDasharray={`${(previewReport.healthScore / 100) * 176} 176`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-foreground">{previewReport.healthScore}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary uppercase tracking-wider">Brand Health Score</p>
                    <p className="text-sm text-foreground mt-0.5">
                      {previewReport.healthScore >= 85 ? 'Excellent' : previewReport.healthScore >= 75 ? 'Good' : 'Needs attention'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">+3 from last period</p>
                  </div>
                </div>

                {/* AI Summary */}
                <div className="bg-primary/5 border border-primary/15 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="size-4 text-primary" />
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">AI Generated Summary</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{previewReport.aiSummary}</p>
                </div>

                {/* KPIs */}
                <div>
                  <p className="text-xs font-semibold text-foreground mb-3">Key Performance Indicators</p>
                  <div className="grid grid-cols-2 gap-3">
                    {previewReport.kpis.map(kpi => (
                      <div key={kpi.label} className="p-3 rounded-xl border border-border/60 bg-card">
                        <p className="text-xs text-muted-foreground">{kpi.label}</p>
                        <p className="text-lg font-bold text-foreground mt-0.5">{kpi.value}</p>
                        <p className="text-xs text-emerald-600 font-medium">{kpi.change}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart */}
                <div>
                  <p className="text-xs font-semibold text-foreground mb-3">Performance Chart</p>
                  <div className="p-4 rounded-xl border border-border/60 bg-card">
                    {renderChart(previewReport)}
                  </div>
                </div>

                {/* Action Items */}
                <div>
                  <p className="text-xs font-semibold text-foreground mb-3">AI Recommendations</p>
                  <div className="space-y-2">
                    {[
                      'Launch TikTok creator fund campaign within 72 hours',
                      'Replenish Aloe You inventory — 12-day runway remaining',
                      'Prepare Valentine\'s Day gifting bundle campaign',
                      'Monitor Purell\'s new moisturizing formula reception',
                    ].map((action, i) => (
                      <div key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-muted/30">
                        <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[10px] font-semibold text-primary">{i + 1}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <ExportModal open={exportOpen} onOpenChange={setExportOpen} title={`Export ${previewReport?.title || 'Report'}`} />
    </div>
  )
}
