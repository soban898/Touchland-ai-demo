import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Star, Radio, Package, Users, Swords,
  Sparkles, FileText, Bell, Settings, ChevronDown,
  Zap, Moon, Sun, LogOut, CreditCard, Key
} from 'lucide-react'
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup,
  SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarRail, SidebarSeparator, useSidebar
} from '@/components/ui/sidebar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useTheme } from '@/components/theme-provider'
import { notifications } from '@/lib/data'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/app/reviews', icon: Star, label: 'Reviews', badge: '47' },
  { href: '/app/social', icon: Radio, label: 'Social Listening' },
  { href: '/app/products', icon: Package, label: 'Products' },
  { href: '/app/influencers', icon: Users, label: 'Influencers' },
  { href: '/app/competitors', icon: Swords, label: 'Competitor Intel' },
  { href: '/app/ai-recommendations', icon: Sparkles, label: 'AI Recommendations', isNew: true },
  { href: '/app/reports', icon: FileText, label: 'Reports' },
  { href: '/app/notifications', icon: Bell, label: 'Notifications', badge: String(notifications.filter(n => !n.read).length) },
]

const workspaces = [
  { name: 'Touchland', plan: 'Pro', initials: 'TL' },
  { name: 'Touchland EU', plan: 'Starter', initials: 'TE' },
]

export function AppSidebar() {
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <Sidebar collapsible="icon" className="border-r border-border/50">
      <SidebarHeader className="px-3 py-4">
        {/* Logo */}
        <div className={cn("flex items-center gap-3 px-1", isCollapsed && "justify-center")}>
          <div className="size-8 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-primary-foreground font-bold text-sm">T</span>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-sm text-foreground leading-tight">Touchland</span>
              <span className="text-xs text-muted-foreground leading-tight">Intelligence</span>
            </div>
          )}
        </div>

        {/* Workspace Selector */}
        {!isCollapsed && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-sidebar-accent transition-colors text-left mt-2">
                <div className="size-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary text-xs font-semibold">TL</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-sidebar-foreground truncate">Touchland</p>
                  <p className="text-xs text-muted-foreground">Pro Plan</p>
                </div>
                <ChevronDown className="size-3 text-muted-foreground flex-shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {workspaces.map((ws) => (
                <DropdownMenuItem key={ws.name} className="gap-2">
                  <div className="size-6 rounded-md bg-primary/10 flex items-center justify-center">
                    <span className="text-primary text-xs font-semibold">{ws.initials}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{ws.name}</p>
                    <p className="text-xs text-muted-foreground">{ws.plan}</p>
                  </div>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span className="text-xs text-muted-foreground">+ Add workspace</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
            Platform
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={cn(
                        "rounded-lg transition-all duration-200",
                        isActive && "bg-primary/10 text-primary font-medium"
                      )}
                    >
                      <Link to={item.href} className="flex items-center gap-2.5">
                        <item.icon className={cn("size-4", isActive ? "text-primary" : "text-muted-foreground")} />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="h-4 px-1.5 text-xs bg-primary/10 text-primary border-0">
                            {item.badge}
                          </Badge>
                        )}
                        {item.isNew && !item.badge && (
                          <Badge variant="secondary" className="h-4 px-1.5 text-xs bg-primary text-primary-foreground border-0">
                            New
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Settings">
                  <Link to="/app/settings" className="flex items-center gap-2.5">
                    <Settings className="size-4 text-muted-foreground" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Billing">
                  <Link to="/app/settings" className="flex items-center gap-2.5">
                    <CreditCard className="size-4 text-muted-foreground" />
                    <span>Billing</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="API Keys">
                  <Link to="/app/settings" className="flex items-center gap-2.5">
                    <Key className="size-4 text-muted-foreground" />
                    <span>API Keys</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="pb-4">
        {/* Upgrade Banner */}
        {!isCollapsed && (
          <div className="mx-2 p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="size-3.5 text-primary" />
              <span className="text-xs font-semibold text-primary">Upgrade to Enterprise</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">Unlock custom AI models, white-label reports, and dedicated support.</p>
            <button className="w-full py-1.5 px-3 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
              Upgrade now
            </button>
          </div>
        )}

        {/* Theme Toggle */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Toggle theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-lg"
            >
              {theme === 'dark' ? (
                <Sun className="size-4 text-muted-foreground" />
              ) : (
                <Moon className="size-4 text-muted-foreground" />
              )}
              <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator />

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors w-full text-left",
              isCollapsed && "justify-center"
            )}>
              <div className="size-8 rounded-full bg-gradient-to-br from-primary to-[oklch(0.45_0.2_290)] flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-white text-xs font-semibold">SL</span>
              </div>
              {!isCollapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-sidebar-foreground truncate">Sarah Lee</p>
                    <p className="text-xs text-muted-foreground truncate">sarah@touchland.com</p>
                  </div>
                  <ChevronDown className="size-3 text-muted-foreground flex-shrink-0" />
                </>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-52">
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Account settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/auth/login" className="flex items-center gap-2 text-destructive">
                <LogOut className="size-4" />
                Sign out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
