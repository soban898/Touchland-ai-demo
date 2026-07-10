import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, Bell, Bot, Calendar, Download, ChevronDown } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { notifications } from '@/lib/data'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const routeTitles: Record<string, string> = {
  '/app/dashboard': 'Dashboard',
  '/app/reviews': 'Reviews',
  '/app/social': 'Social Listening',
  '/app/products': 'Products',
  '/app/influencers': 'Influencers',
  '/app/competitors': 'Competitor Intelligence',
  '/app/ai-recommendations': 'AI Recommendations',
  '/app/reports': 'Reports',
  '/app/notifications': 'Notifications',
  '/app/settings': 'Settings',
}

interface TopNavbarProps {
  onCommandOpen: () => void
}

export function TopNavbar({ onCommandOpen }: TopNavbarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const unreadCount = notifications.filter(n => !n.read).length
  const title = routeTitles[location.pathname] || 'Dashboard'

  const searchResults = [
    { label: 'Wild Watermelon', type: 'Product', path: '/app/products' },
    { label: 'Berry Bliss', type: 'Product', path: '/app/products' },
    { label: 'Vanilla Blossom', type: 'Product', path: '/app/products' },
    { label: 'Aloe You', type: 'Product', path: '/app/products' },
    { label: 'Jade Morrison', type: 'Influencer', path: '/app/influencers' },
    { label: 'Maya Patel', type: 'Influencer', path: '/app/influencers' },
    { label: 'Purell', type: 'Competitor', path: '/app/competitors' },
    { label: 'Executive Summary', type: 'Report', path: '/app/reports' },
    { label: 'Weekly Brand Report', type: 'Report', path: '/app/reports' },
  ].filter(r => searchQuery && r.label.toLowerCase().includes(searchQuery.toLowerCase()))

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSearchFocus = () => {
    setSearchFocused(true)
    setShowResults(true)
  }

  const handleResultClick = (path: string) => {
    navigate(path)
    setShowResults(false)
    setSearchQuery('')
    setSearchFocused(false)
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border/60 bg-background/80 backdrop-blur-xl px-4 md:px-6">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

      <div className="hidden sm:block">
        <h1 className="text-sm font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex-1" />

      {/* Global Search */}
      <div ref={searchRef} className="relative hidden md:block">
        <div className={cn(
          "flex items-center gap-2 px-3 h-8 rounded-lg border text-sm cursor-pointer transition-all duration-200",
          searchFocused
            ? "w-80 border-primary/50 bg-background shadow-sm"
            : "w-48 border-border/80 bg-muted/30 text-muted-foreground hover:bg-muted/50"
        )}>
          <Search className="size-3.5 flex-shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={handleSearchFocus}
            onBlur={() => setSearchFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setShowResults(false)
              if (e.key === 'Enter' && searchResults[0]) handleResultClick(searchResults[0].path)
            }}
            placeholder="Search products, reviews, influencers..."
            className="flex-1 bg-transparent outline-none text-xs text-foreground placeholder:text-muted-foreground"
          />
          <button
            onClick={onCommandOpen}
            className="inline-flex h-5 items-center gap-0.5 rounded bg-muted px-1.5 text-[10px] font-medium text-muted-foreground border border-border hover:bg-muted/80"
          >
            ⌘K
          </button>
        </div>

        {/* Search Results Dropdown */}
        {showResults && searchQuery && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-popover border border-border/60 rounded-xl shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto">
            {searchResults.length > 0 ? (
              <>
                <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider px-3 py-2 border-b border-border/40">
                  {searchResults.length} results
                </p>
                {searchResults.map(result => (
                  <button
                    key={result.label}
                    onClick={() => handleResultClick(result.path)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/40 transition-colors text-left"
                  >
                    <div className="size-7 rounded-lg bg-primary/5 flex items-center justify-center flex-shrink-0">
                      <Search className="size-3 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{result.label}</p>
                      <p className="text-xs text-muted-foreground">{result.type}</p>
                    </div>
                  </button>
                ))}
              </>
            ) : (
              <div className="py-6 text-center">
                <Search className="size-6 text-muted-foreground/30 mx-auto mb-1.5" />
                <p className="text-sm text-muted-foreground">No results for "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Date Range */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="hidden md:flex h-8 gap-1.5 text-xs border-border/80">
            <Calendar className="size-3.5" />
            Last 30 days
            <ChevronDown className="size-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          {['Last 7 days', 'Last 30 days', 'Last 90 days', 'Last year', 'Custom range'].map(range => (
            <DropdownMenuItem key={range} className="text-sm">{range}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Export */}
      <Button
        variant="outline"
        size="sm"
        className="hidden md:flex h-8 gap-1.5 text-xs border-border/80"
        onClick={() => toast.success('Export started', { description: 'Your report is being generated...' })}
      >
        <Download className="size-3.5" />
        Export
      </Button>

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="relative h-8 w-8 rounded-lg">
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 size-2 rounded-full bg-primary" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 p-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="h-4 px-1.5 text-xs bg-primary/10 text-primary border-0">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground">
              Mark all read
            </Button>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.slice(0, 5).map(notif => (
              <div key={notif.id} className={cn(
                "px-4 py-3 hover:bg-muted/30 transition-colors cursor-pointer border-b border-border/40 last:border-0",
                !notif.read && "bg-primary/5"
              )}>
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "mt-0.5 size-2 rounded-full flex-shrink-0",
                    !notif.read ? "bg-primary" : "bg-transparent"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground leading-snug">{notif.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">{notif.description}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">{notif.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-2 border-t border-border">
            <Link to="/app/notifications" className="text-xs text-primary hover:underline">
              View all notifications
            </Link>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* AI Assistant */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="h-8 w-8 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary"
        title="AI Copilot"
        onClick={() => document.dispatchEvent(new CustomEvent('open-copilot'))}
      >
        <Bot className="size-4" />
      </Button>

      {/* User Avatar */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 rounded-lg hover:bg-muted/50 p-1 pr-2 transition-colors">
            <div className="size-7 rounded-full bg-gradient-to-br from-primary to-[oklch(0.45_0.2_290)] flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-semibold">SL</span>
            </div>
            <span className="hidden md:block text-xs font-medium text-foreground">Sarah Lee</span>
            <ChevronDown className="hidden md:block size-3 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Workspace settings</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/auth/login">Sign out</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
