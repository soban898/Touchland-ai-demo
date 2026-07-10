import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border/60 bg-card p-4 space-y-3", className)}>
      <div className="flex items-center gap-3">
        <div className="size-9 rounded-xl bg-muted animate-pulse" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 w-20 rounded bg-muted animate-pulse" />
          <div className="h-2.5 w-16 rounded bg-muted animate-pulse" />
        </div>
      </div>
      <div className="h-2 w-full rounded bg-muted animate-pulse" />
      <div className="h-2 w-3/4 rounded bg-muted animate-pulse" />
    </div>
  )
}

export function SkeletonChart({ className, height = 200 }: { className?: string; height?: number }) {
  return (
    <div className={cn("rounded-xl border border-border/60 bg-card p-4", className)}>
      <div className="space-y-2 mb-4">
        <div className="h-3 w-32 rounded bg-muted animate-pulse" />
        <div className="h-2.5 w-48 rounded bg-muted animate-pulse" />
      </div>
      <div className="space-y-2" style={{ height }}>
        <div className="flex items-end gap-2 h-full">
          {[40, 65, 50, 80, 60, 90, 70, 85, 55, 75].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-muted animate-pulse"
              style={{ height: `${h}%`, animationDelay: `${i * 80}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function SkeletonList({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card divide-y divide-border/40">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-4">
          <div className="size-8 rounded-full bg-muted animate-pulse" />
          <div className="space-y-1.5 flex-1">
            <div className="h-3 w-32 rounded bg-muted animate-pulse" />
            <div className="h-2.5 w-48 rounded bg-muted animate-pulse" />
          </div>
          <div className="size-6 rounded bg-muted animate-pulse" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <div className="border-b border-border/40 p-3 flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-3 flex-1 rounded bg-muted animate-pulse" style={{ animationDelay: `${i * 60}ms` }} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="border-b border-border/20 last:border-0 p-3 flex gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-3 flex-1 rounded bg-muted animate-pulse" style={{ animationDelay: `${(r * cols + c) * 40}ms` }} />
          ))}
        </div>
      ))}
    </div>
  )
}

export function PageSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="h-8 w-48 rounded-lg bg-muted animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SkeletonChart />
        <SkeletonChart />
      </div>
      <SkeletonList rows={4} />
    </motion.div>
  )
}
