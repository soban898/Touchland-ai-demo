import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  secondaryLabel?: string
  onSecondary?: () => void
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  className,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex flex-col items-center justify-center py-16 px-6 text-center",
        className
      )}
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 blur-2xl bg-primary/10 rounded-full" />
        <div className="relative size-16 rounded-2xl bg-primary/5 border border-primary/15 flex items-center justify-center">
          <div className="text-primary">{icon}</div>
        </div>
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-6">{description}</p>
      <div className="flex items-center gap-3">
        {actionLabel && (
          <Button size="sm" onClick={onAction}>{actionLabel}</Button>
        )}
        {secondaryLabel && (
          <Button variant="outline" size="sm" onClick={onSecondary}>{secondaryLabel}</Button>
        )}
      </div>
    </motion.div>
  )
}
