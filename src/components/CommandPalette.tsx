import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Star, Radio, Package, Users, Swords,
  Sparkles, FileText, Bell, Settings, Search, Bot, CreditCard, Key,
  ArrowRight, Command as CommandIcon
} from 'lucide-react'
import {
  Dialog, DialogContent, DialogTitle
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const commands = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'Navigation', shortcut: 'G D' },
  { id: 'reviews', label: 'Reviews', icon: Star, category: 'Navigation', shortcut: 'G R' },
  { id: 'social', label: 'Social Listening', icon: Radio, category: 'Navigation', shortcut: 'G S' },
  { id: 'products', label: 'Products', icon: Package, category: 'Navigation', shortcut: 'G P' },
  { id: 'influencers', label: 'Influencers', icon: Users, category: 'Navigation', shortcut: 'G I' },
  { id: 'competitors', label: 'Competitor Intelligence', icon: Swords, category: 'Navigation', shortcut: 'G C' },
  { id: 'ai-recommendations', label: 'AI Recommendations', icon: Sparkles, category: 'Navigation', shortcut: 'G A' },
  { id: 'reports', label: 'Reports', icon: FileText, category: 'Navigation', shortcut: 'G B' },
  { id: 'notifications', label: 'Notifications', icon: Bell, category: 'Navigation', shortcut: 'G N' },
  { id: 'settings', label: 'Settings', icon: Settings, category: 'Navigation', shortcut: 'G T' },
  { id: 'billing', label: 'Billing & Subscription', icon: CreditCard, category: 'Settings' },
  { id: 'api-keys', label: 'API Keys', icon: Key, category: 'Settings' },
  { id: 'copilot', label: 'Open AI Copilot', icon: Bot, category: 'Actions' },
  { id: 'search', label: 'Search Products, Reviews, Influencers...', icon: Search, category: 'Actions' },
]

const productResults = [
  { label: 'Wild Watermelon', type: 'Product', path: '/app/products' },
  { label: 'Berry Bliss', type: 'Product', path: '/app/products' },
  { label: 'Vanilla Blossom', type: 'Product', path: '/app/products' },
  { label: 'Aloe You', type: 'Product', path: '/app/products' },
  { label: 'Peachy Lychee', type: 'Product', path: '/app/products' },
  { label: 'Rainwater', type: 'Product', path: '/app/products' },
]

const reportResults = [
  { label: 'Executive Summary Report', type: 'Report', path: '/app/reports' },
  { label: 'Weekly Brand Report', type: 'Report', path: '/app/reports' },
  { label: 'Competitor Intelligence Report', type: 'Report', path: '/app/reports' },
]

const influencerResults = [
  { label: 'Jade Morrison', type: 'Influencer', path: '/app/influencers' },
  { label: 'Maya Patel', type: 'Influencer', path: '/app/influencers' },
  { label: 'Zara Ali', type: 'Influencer', path: '/app/influencers' },
]

const competitorResults = [
  { label: 'Purell', type: 'Competitor', path: '/app/competitors' },
  { label: "Dr. Bronner's", type: 'Competitor', path: '/app/competitors' },
  { label: 'EO Products', type: 'Competitor', path: '/app/competitors' },
]

const allResults = [...productResults, ...reportResults, ...influencerResults, ...competitorResults]

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const filteredCommands = commands.filter(c =>
    c.label.toLowerCase().includes(query.toLowerCase())
  )
  const filteredResults = allResults.filter(r =>
    r.label.toLowerCase().includes(query.toLowerCase())
  )

  const combined = [
    ...filteredCommands.map(c => ({ ...c, kind: 'command' as const })),
    ...filteredResults.map(r => ({ ...r, kind: 'result' as const })),
  ]

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const handleSelect = (item: typeof combined[0]) => {
    if (item.kind === 'command') {
      if (item.id === 'copilot') {
        onOpenChange(false)
        document.dispatchEvent(new CustomEvent('open-copilot'))
        return
      }
      if (item.id === 'search') {
        onOpenChange(false)
        return
      }
      navigate(`/app/${item.id}`)
    } else if (item.kind === 'result') {
      navigate(item.path)
    }
    onOpenChange(false)
    setQuery('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex(prev => Math.min(prev + 1, combined.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (combined[activeIndex]) handleSelect(combined[activeIndex])
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 sm:max-w-xl overflow-hidden" showCloseButton={false}>
        <DialogTitle className="sr-only">Command Palette</DialogTitle>

        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60">
          <Search className="size-4 text-muted-foreground" />
          <input
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search pages, products, reports, or type a command..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded bg-muted px-1.5 text-[10px] font-medium text-muted-foreground border border-border">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto p-2">
          {combined.length === 0 ? (
            <div className="py-8 text-center">
              <Search className="size-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No results for "{query}"</p>
            </div>
          ) : (
            <>
              {filteredCommands.length > 0 && (
                <div className="mb-2">
                  <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider px-2 py-1.5">Commands</p>
                  {filteredCommands.map((cmd) => {
                    const Icon = cmd.icon
                    const idx = combined.findIndex(c => c.kind === 'command' && c.id === cmd.id)
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => handleSelect({ ...cmd, kind: 'command' })}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={cn(
                          "w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-colors",
                          activeIndex === idx ? "bg-primary/10" : "hover:bg-muted/40"
                        )}
                      >
                        <Icon className={cn("size-4", activeIndex === idx ? "text-primary" : "text-muted-foreground")} />
                        <span className="flex-1 text-sm">{cmd.label}</span>
                        <span className="text-[10px] text-muted-foreground/60">{cmd.category}</span>
                        {cmd.shortcut && (
                          <kbd className="text-[10px] text-muted-foreground/60 font-medium">{cmd.shortcut}</kbd>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}

              {filteredResults.length > 0 && (
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider px-2 py-1.5">Results</p>
                  {filteredResults.map((result) => {
                    const idx = combined.findIndex(c => c.kind === 'result' && c.label === result.label)
                    return (
                      <button
                        key={result.label}
                        onClick={() => handleSelect({ ...result, kind: 'result' })}
                        onMouseEnter={() => setActiveIndex(idx)}
                        className={cn(
                          "w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-colors",
                          activeIndex === idx ? "bg-primary/10" : "hover:bg-muted/40"
                        )}
                      >
                        <div className="size-4 rounded bg-muted flex items-center justify-center">
                          <ArrowRight className="size-2.5 text-muted-foreground" />
                        </div>
                        <span className="flex-1 text-sm">{result.label}</span>
                        <span className="text-[10px] text-muted-foreground/60">{result.type}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-border/60 bg-muted/20">
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <kbd className="inline-flex h-4 items-center rounded bg-background px-1 text-[9px] border border-border">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="inline-flex h-4 items-center rounded bg-background px-1 text-[9px] border border-border">↵</kbd>
              Select
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <CommandIcon className="size-2.5" /> Touchland Intelligence
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
