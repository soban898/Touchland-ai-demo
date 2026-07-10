import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell, Brain, AtSign, FileText, Zap, CheckCircle, Archive,
  Search, Trash2, Inbox
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/EmptyState'
import { notifications as initialNotifications } from '@/lib/data'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.04 } } }
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string; label: string; dot: string }> = {
  mention: { icon: <AtSign className="size-4" />, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30', label: 'Mention', dot: 'bg-blue-500' },
  report: { icon: <FileText className="size-4" />, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/30', label: 'Report', dot: 'bg-purple-500' },
  alert: { icon: <Bell className="size-4" />, color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/30', label: 'Alert', dot: 'bg-red-500' },
  insight: { icon: <Brain className="size-4" />, color: 'text-primary', bg: 'bg-primary/10', label: 'AI Insight', dot: 'bg-primary' },
  campaign: { icon: <Zap className="size-4" />, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30', label: 'Campaign', dot: 'bg-amber-500' },
}

const priorityConfig: Record<string, { color: string; bg: string; emoji: string }> = {
  high: { color: 'text-red-700', bg: 'bg-red-50 dark:bg-red-950/30', emoji: '🔴' },
  medium: { color: 'text-amber-700', bg: 'bg-amber-50 dark:bg-amber-950/30', emoji: '🟡' },
  low: { color: 'text-muted-foreground', bg: 'bg-muted', emoji: '🔵' },
}

const filters = [
  { id: 'all', label: 'All', icon: Inbox },
  { id: 'unread', label: 'Unread' },
  { id: 'alert', label: 'Alerts' },
  { id: 'insight', label: 'AI Insights' },
  { id: 'mention', label: 'Mentions' },
  { id: 'report', label: 'Reports' },
  { id: 'campaign', label: 'Campaigns' },
  { id: 'archived', label: 'Archived' },
]

interface NotificationItem {
  id: string
  type: 'mention' | 'report' | 'alert' | 'insight' | 'campaign'
  title: string
  description: string
  time: string
  read: boolean
  priority: 'high' | 'medium' | 'low'
  icon: string
  archived?: boolean
}

export function NotificationsPage() {
  const [allNotifications, setAllNotifications] = useState<NotificationItem[]>(
    initialNotifications.map(n => ({ ...n, archived: false }))
  )
  const [activeFilter, setActiveFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return allNotifications.filter(n => {
      if (activeFilter === 'archived') return n.archived
      if (n.archived) return false
      if (activeFilter === 'unread') return !n.read
      if (activeFilter === 'all') return true
      return n.type === activeFilter
    }).filter(n => {
      if (!search) return true
      return n.title.toLowerCase().includes(search.toLowerCase()) ||
             n.description.toLowerCase().includes(search.toLowerCase())
    })
  }, [allNotifications, activeFilter, search])

  const unreadCount = allNotifications.filter(n => !n.read && !n.archived).length
  const archivedCount = allNotifications.filter(n => n.archived).length

  const markAllRead = () => {
    setAllNotifications(prev => prev.map(n => ({ ...n, read: true })))
    toast.success('All notifications marked as read')
  }

  const markRead = (id: string) => {
    setAllNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const archive = (id: string) => {
    setAllNotifications(prev => prev.map(n => n.id === id ? { ...n, archived: true } : n))
    toast.success('Notification archived')
  }

  const unarchive = (id: string) => {
    setAllNotifications(prev => prev.map(n => n.id === id ? { ...n, archived: false } : n))
  }

  const remove = (id: string) => {
    setAllNotifications(prev => prev.filter(n => n.id !== id))
    toast.success('Notification deleted')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h2 className="text-base font-semibold">Notifications</h2>
            <p className="text-xs text-muted-foreground">{unreadCount} unread · {archivedCount} archived</p>
          </div>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="h-5 px-2 text-xs bg-primary/10 text-primary border-0">
              {unreadCount}
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" onClick={markAllRead}>
            <CheckCircle className="size-3" />
            Mark all read
          </Button>
        </div>
      </div>

      {/* Stats */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Object.entries(typeConfig).map(([type, cfg]) => {
          const count = allNotifications.filter(n => n.type === type && !n.archived).length
          return (
            <motion.div key={type} variants={item}>
              <Card className="border-border/60 hover:shadow-sm transition-all cursor-pointer" onClick={() => setActiveFilter(cfg.label)}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-2">
                    <div className={cn("size-7 rounded-lg flex items-center justify-center", cfg.bg)}>
                      <span className={cfg.color}>{cfg.icon}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold">{count}</p>
                      <p className="text-[10px] text-muted-foreground">{cfg.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Search + Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search notifications..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm bg-background max-w-md"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                activeFilter === f.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {f.icon && <f.icon className="size-3" />}
              {f.label}
              {f.id === 'unread' && unreadCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px]">
                  {unreadCount}
                </span>
              )}
              {f.id === 'archived' && archivedCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-muted-foreground/20 text-[10px]">
                  {archivedCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      {filtered.length === 0 ? (
        <Card className="border-border/60">
          {activeFilter === 'archived' ? (
            <EmptyState
              icon={<Archive className="size-7" />}
              title="No archived notifications"
              description="Archived notifications will appear here. You can restore them anytime."
              actionLabel="Back to all"
              onAction={() => setActiveFilter('all')}
            />
          ) : search ? (
            <EmptyState
              icon={<Search className="size-7" />}
              title="No matching notifications"
              description={`No notifications match "${search}". Try a different search term.`}
              actionLabel="Clear search"
              onAction={() => setSearch('')}
            />
          ) : (
            <EmptyState
              icon={<Bell className="size-7" />}
              title="No notifications"
              description="You're all caught up! New notifications about your brand will appear here."
              actionLabel="Refresh"
              onAction={() => toast.info('Checking for new notifications...')}
            />
          )}
        </Card>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-2">
          <AnimatePresence>
            {filtered.map(notif => {
              const isRead = notif.read
              const typeConf = typeConfig[notif.type]
              const priority = priorityConfig[notif.priority]
              return (
                <motion.div key={notif.id} variants={item} layout exit={{ opacity: 0, x: -20 }}>
                  <Card
                    className={cn(
                      "border transition-all hover:shadow-sm group",
                      !isRead ? "border-primary/20 bg-primary/5" : "border-border/60"
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={cn("size-10 rounded-xl flex items-center justify-center flex-shrink-0", typeConf.bg)}>
                          <span className={typeConf.color}>{typeConf.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs">{priority.emoji}</span>
                                <p className="text-sm font-semibold text-foreground">{notif.title}</p>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{notif.description}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Badge variant="secondary" className={cn("h-4 px-1.5 text-[10px] border-0", priority.bg, priority.color)}>
                                {notif.priority}
                              </Badge>
                              {!isRead && <div className="size-2 rounded-full bg-primary" />}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[11px] text-muted-foreground">{notif.time}</span>
                            <Badge variant="secondary" className="h-4 px-1.5 text-[10px] bg-muted text-muted-foreground border-0">
                              {typeConf.label}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 mt-3 pt-2 border-t border-border/30 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!isRead && !notif.archived && (
                          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => markRead(notif.id)}>
                            <CheckCircle className="size-3" />
                            Mark read
                          </Button>
                        )}
                        {!notif.archived ? (
                          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => archive(notif.id)}>
                            <Archive className="size-3" />
                            Archive
                          </Button>
                        ) : (
                          <>
                            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => unarchive(notif.id)}>
                              <Inbox className="size-3" />
                              Restore
                            </Button>
                            <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-destructive" onClick={() => remove(notif.id)}>
                              <Trash2 className="size-3" />
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
