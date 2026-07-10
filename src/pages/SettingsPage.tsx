import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2, Bell, CreditCard, Shield, Key, Plug,
  Palette, Globe, Users, Lock, Activity, Brain, Check, Plus, Trash2
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const tabs = [
  { id: 'general', label: 'General', icon: Building2 },
  { id: 'company', label: 'Company Info', icon: Building2 },
  { id: 'brand', label: 'Brand Settings', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Globe },
  { id: 'language', label: 'Language', icon: Globe },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'team', label: 'Team Members', icon: Users },
  { id: 'roles', label: 'Roles & Permissions', icon: Shield },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'api', label: 'API Keys', icon: Key },
  { id: 'ai', label: 'AI Preferences', icon: Brain },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'activity', label: 'Activity Log', icon: Activity },
]

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')

  return (
    <div className="flex gap-6">
      {/* Sidebar Nav */}
      <div className="w-48 flex-shrink-0">
        <nav className="space-y-0.5">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <tab.icon className="size-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'general' && <GeneralSettings />}
            {activeTab === 'company' && <CompanySettings />}
            {activeTab === 'brand' && <BrandSettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'appearance' && <AppearanceSettings />}
            {activeTab === 'language' && <LanguageSettings />}
            {activeTab === 'billing' && <BillingSettings />}
            {activeTab === 'team' && <TeamSettings />}
            {activeTab === 'roles' && <RolesSettings />}
            {activeTab === 'integrations' && <IntegrationSettings />}
            {activeTab === 'api' && <APISettings />}
            {activeTab === 'ai' && <AIPreferences />}
            {activeTab === 'security' && <SecuritySettings />}
            {activeTab === 'activity' && <ActivityLog />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </div>
  )
}

function GeneralSettings() {
  return (
    <div className="space-y-6">
      <SectionHeader title="General" desc="Manage your workspace preferences" />
      <Card className="border-border/60">
        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm">Workspace name</Label>
              <Input defaultValue="Touchland" className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Industry</Label>
              <Input defaultValue="Beauty & Personal Care" className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Brand URL</Label>
              <Input defaultValue="touchland.com" className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Timezone</Label>
              <Select defaultValue="est">
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="est">America/New_York (EST)</SelectItem>
                  <SelectItem value="pst">America/Los_Angeles (PST)</SelectItem>
                  <SelectItem value="gmt">Europe/London (GMT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={() => toast.success('Settings saved')}>Save changes</Button>
        </CardContent>
      </Card>
    </div>
  )
}

function CompanySettings() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Company Information" desc="Your company details" />
      <Card className="border-border/60">
        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm">Legal company name</Label>
              <Input defaultValue="Touchland Inc." className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Company size</Label>
              <Select defaultValue="50">
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">1-10 employees</SelectItem>
                  <SelectItem value="50">11-50 employees</SelectItem>
                  <SelectItem value="200">51-200 employees</SelectItem>
                  <SelectItem value="500">200+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Headquarters</Label>
              <Input defaultValue="New York, NY" className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Founded</Label>
              <Input defaultValue="2018" className="h-9" />
            </div>
          </div>
          <Button onClick={() => toast.success('Company info saved')}>Save changes</Button>
        </CardContent>
      </Card>
    </div>
  )
}

function BrandSettings() {
  const colors = ['#D86CB2', '#F7A8CF', '#FFDCEB', '#111827', '#6B7280']
  return (
    <div className="space-y-6">
      <SectionHeader title="Brand Settings" desc="Customize your brand appearance" />
      <Card className="border-border/60">
        <CardContent className="p-6 space-y-5">
          <div className="space-y-3">
            <Label className="text-sm">Brand logo</Label>
            <div className="flex items-center gap-4">
              <div className="size-16 rounded-2xl bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-2xl">T</span>
              </div>
              <div>
                <Button variant="outline" size="sm">Upload new logo</Button>
                <p className="text-xs text-muted-foreground mt-1">SVG, PNG up to 5MB</p>
              </div>
            </div>
          </div>
          <Separator />
          <div className="space-y-3">
            <Label className="text-sm">Brand primary color</Label>
            <div className="flex items-center gap-3">
              {colors.map((c, i) => (
                <button
                  key={c}
                  className={cn("size-8 rounded-lg transition-all", i === 0 ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "hover:scale-110")}
                  style={{ background: c }}
                />
              ))}
              <Input defaultValue="#D86CB2" className="w-28 h-9" />
            </div>
          </div>
          <Separator />
          <div className="space-y-3">
            <Label className="text-sm">Brand voice & tone</Label>
            <Select defaultValue="premium">
              <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="premium">Premium & Luxurious</SelectItem>
                <SelectItem value="friendly">Friendly & Approachable</SelectItem>
                <SelectItem value="professional">Professional & Corporate</SelectItem>
                <SelectItem value="playful">Playful & Fun</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={() => toast.success('Brand settings saved')}>Save changes</Button>
        </CardContent>
      </Card>
    </div>
  )
}

function NotificationSettings() {
  const [prefs, setPrefs] = useState({
    email_reviews: true, email_weekly: true, email_alerts: true,
    push_reviews: false, push_ai: true, push_alerts: true,
    slack_alerts: false, slack_daily: true,
  })
  const toggle = (key: keyof typeof prefs) => setPrefs(prev => ({ ...prev, [key]: !prev[key] }))

  const groups = [
    { title: 'Email Notifications', items: [
      { key: 'email_reviews', label: 'New reviews', desc: 'Notify when new reviews are received' },
      { key: 'email_weekly', label: 'Weekly digest', desc: 'Weekly performance summary every Monday' },
      { key: 'email_alerts', label: 'Critical alerts', desc: 'Sentiment drops, viral activity, inventory warnings' },
    ]},
    { title: 'Push Notifications', items: [
      { key: 'push_reviews', label: 'New reviews', desc: 'Real-time review notifications' },
      { key: 'push_ai', label: 'AI insights', desc: 'When AI detects significant patterns' },
      { key: 'push_alerts', label: 'Urgent alerts', desc: 'Critical business alerts' },
    ]},
    { title: 'Slack Integration', items: [
      { key: 'slack_alerts', label: 'Critical alerts in Slack', desc: 'Send critical alerts to #touchland-alerts' },
      { key: 'slack_daily', label: 'Daily summary', desc: 'Daily brand health summary in Slack' },
    ]},
  ]

  return (
    <div className="space-y-6">
      <SectionHeader title="Notification Preferences" desc="Configure how you receive notifications" />
      <Card className="border-border/60">
        <CardContent className="p-6 space-y-6">
          {groups.map((group, gi) => (
            <div key={group.title}>
              {gi > 0 && <Separator className="mb-5" />}
              <p className="text-sm font-medium mb-3">{group.title}</p>
              <div className="space-y-3">
                {group.items.map(it => (
                  <div key={it.key} className="flex items-center justify-between py-1">
                    <div>
                      <p className="text-sm font-medium">{it.label}</p>
                      <p className="text-xs text-muted-foreground">{it.desc}</p>
                    </div>
                    <Switch checked={prefs[it.key as keyof typeof prefs]} onCheckedChange={() => toggle(it.key as keyof typeof prefs)} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function AppearanceSettings() {
  const [theme, setTheme] = useState('light')
  const [density, setDensity] = useState('comfortable')
  return (
    <div className="space-y-6">
      <SectionHeader title="Appearance" desc="Customize how Touchland Intelligence looks" />
      <Card className="border-border/60">
        <CardContent className="p-6 space-y-6">
          <div>
            <p className="text-sm font-medium mb-3">Theme</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'light', label: 'Light', preview: 'bg-white border-border' },
                { id: 'dark', label: 'Dark', preview: 'bg-slate-900 border-slate-700' },
                { id: 'system', label: 'System', preview: 'bg-gradient-to-br from-white to-slate-900 border-border' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={cn(
                    "p-3 rounded-xl border-2 transition-all text-center",
                    theme === t.id ? "border-primary" : "border-border hover:border-border/80"
                  )}
                >
                  <div className={cn("h-16 rounded-lg border mb-2", t.preview)} />
                  <span className="text-xs font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
          <Separator />
          <div>
            <p className="text-sm font-medium mb-3">Layout density</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'comfortable', label: 'Comfortable', desc: 'More spacing, easier to read' },
                { id: 'compact', label: 'Compact', desc: 'Tighter spacing, more content' },
              ].map(d => (
                <button
                  key={d.id}
                  onClick={() => setDensity(d.id)}
                  className={cn(
                    "p-4 rounded-xl border-2 transition-all text-left",
                    density === d.id ? "border-primary bg-primary/5" : "border-border hover:border-border/80"
                  )}
                >
                  <p className="text-sm font-medium">{d.label}</p>
                  <p className="text-xs text-muted-foreground">{d.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <Button onClick={() => toast.success('Appearance updated')}>Save preferences</Button>
        </CardContent>
      </Card>
    </div>
  )
}

function LanguageSettings() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Language & Region" desc="Set your language and regional preferences" />
      <Card className="border-border/60">
        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm">Display language</Label>
              <Select defaultValue="en">
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English (US)</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Date format</Label>
              <Select defaultValue="mdy">
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                  <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Currency</Label>
              <Select defaultValue="usd">
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Number format</Label>
              <Select defaultValue="us">
                <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">1,234.56</SelectItem>
                  <SelectItem value="eu">1.234,56</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={() => toast.success('Language settings saved')}>Save changes</Button>
        </CardContent>
      </Card>
    </div>
  )
}

function BillingSettings() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Billing" desc="Manage your subscription and billing" />
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold">Pro Plan</p>
                <Badge className="bg-primary text-primary-foreground">Current</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">$299/month · Billed monthly</p>
              <p className="text-xs text-muted-foreground mt-2">Next billing date: February 1, 2024</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.info('Upgrade dialog would open here')}>Upgrade to Enterprise</Button>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-3 gap-3">
        {[
          { name: 'Starter', price: '$99', features: ['5 users', '3 brands', 'Basic AI', '10K reviews/mo'] },
          { name: 'Pro', price: '$299', features: ['15 users', '10 brands', 'Advanced AI', '100K reviews/mo'], current: true },
          { name: 'Enterprise', price: 'Custom', features: ['Unlimited users', 'Unlimited brands', 'Custom AI', 'Unlimited reviews'] },
        ].map(plan => (
          <Card key={plan.name} className={cn("border-border/60", plan.current && "border-primary/30 bg-primary/5")}>
            <CardContent className="p-4 space-y-3">
              <div>
                <p className="text-sm font-semibold">{plan.name}</p>
                <p className="text-xl font-bold mt-1">{plan.price}{plan.price !== 'Custom' && <span className="text-xs text-muted-foreground font-normal">/mo</span>}</p>
              </div>
              <ul className="space-y-1">
                {plan.features.map(f => (
                  <li key={f} className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Check className="size-3 text-primary" /> {f}
                  </li>
                ))}
              </ul>
              <Button variant={plan.current ? "secondary" : "outline"} className="w-full h-8 text-xs" disabled={plan.current}>
                {plan.current ? 'Current plan' : plan.name === 'Enterprise' ? 'Contact sales' : 'Upgrade'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-border/60">
        <CardContent className="p-6">
          <p className="text-sm font-medium mb-3">Payment method</p>
          <div className="flex items-center justify-between p-3 rounded-lg border border-border/60">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded bg-muted flex items-center justify-center text-xs font-bold">VISA</div>
              <div>
                <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                <p className="text-xs text-muted-foreground">Expires 12/25</p>
              </div>
            </div>
            <Button variant="outline" size="sm">Update</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TeamSettings() {
  const members = [
    { name: 'Sarah Lee', email: 'sarah@touchland.com', role: 'Admin', initials: 'SL', status: 'Active' },
    { name: 'James Chen', email: 'james@touchland.com', role: 'Editor', initials: 'JC', status: 'Active' },
    { name: 'Maria Garcia', email: 'maria@touchland.com', role: 'Viewer', initials: 'MG', status: 'Invited' },
    { name: 'David Kim', email: 'david@touchland.com', role: 'Editor', initials: 'DK', status: 'Active' },
  ]
  return (
    <div className="space-y-6">
      <SectionHeader title="Team Members" desc="Manage who has access to your workspace" />
      <div className="flex justify-end">
        <Button size="sm" className="gap-2" onClick={() => toast.info('Invite dialog would open here')}>
          <Plus className="size-4" />
          Invite member
        </Button>
      </div>
      <Card className="border-border/60">
        <CardContent className="p-0">
          {members.map((m, i) => (
            <div key={m.email} className={cn("flex items-center justify-between p-4", i < members.length - 1 && "border-b border-border/40")}>
              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarFallback className="text-sm bg-primary/10 text-primary font-medium">{m.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className={cn("h-5 px-2 text-xs border-0",
                  m.status === 'Active' ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30" : "bg-amber-50 text-amber-700 dark:bg-amber-950/30"
                )}>
                  {m.status}
                </Badge>
                <Select defaultValue={m.role.toLowerCase()}>
                  <SelectTrigger className="h-7 w-24 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="sm" className="h-7 text-destructive">
                  <Trash2 className="size-3" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

function RolesSettings() {
  const roles = [
    { name: 'Admin', desc: 'Full access to all features and settings', users: 1, color: 'text-primary', bg: 'bg-primary/10' },
    { name: 'Editor', desc: 'Can edit reports, manage influencers, view analytics', users: 2, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' },
    { name: 'Viewer', desc: 'Read-only access to dashboards and reports', users: 1, color: 'text-muted-foreground', bg: 'bg-muted' },
  ]
  const permissions = [
    { feature: 'Dashboard', admin: true, editor: true, viewer: true },
    { feature: 'Reviews', admin: true, editor: true, viewer: true },
    { feature: 'AI Recommendations', admin: true, editor: true, viewer: false },
    { feature: 'Reports — Generate', admin: true, editor: true, viewer: false },
    { feature: 'Reports — Export', admin: true, editor: true, viewer: true },
    { feature: 'Settings', admin: true, editor: false, viewer: false },
    { feature: 'Team Management', admin: true, editor: false, viewer: false },
    { feature: 'Billing', admin: true, editor: false, viewer: false },
  ]
  return (
    <div className="space-y-6">
      <SectionHeader title="Roles & Permissions" desc="Define what each role can access" />
      <div className="grid grid-cols-3 gap-3">
        {roles.map(r => (
          <Card key={r.name} className="border-border/60">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("size-7 rounded-lg flex items-center justify-center", r.bg)}>
                  <Shield className={cn("size-3.5", r.color)} />
                </div>
                <p className="text-sm font-semibold">{r.name}</p>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{r.desc}</p>
              <p className="text-xs font-medium">{r.users} {r.users === 1 ? 'member' : 'members'}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="border-border/60">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Feature</th>
                <th className="px-3 py-2.5 text-center text-xs font-medium text-muted-foreground">Admin</th>
                <th className="px-3 py-2.5 text-center text-xs font-medium text-muted-foreground">Editor</th>
                <th className="px-3 py-2.5 text-center text-xs font-medium text-muted-foreground">Viewer</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map(p => (
                <tr key={p.feature} className="border-b border-border/20 last:border-0 hover:bg-muted/20">
                  <td className="px-4 py-2.5 text-xs font-medium">{p.feature}</td>
                  {[p.admin, p.editor, p.viewer].map((val, i) => (
                    <td key={i} className="px-3 py-2.5 text-center">
                      {val ? <Check className="size-3.5 text-emerald-500 mx-auto" /> : <span className="text-muted-foreground/30">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

function IntegrationSettings() {
  const integrations = [
    { name: 'Shopify', desc: 'Sync product data and reviews', connected: true, icon: '🛍️' },
    { name: 'Amazon Seller', desc: 'Monitor Amazon reviews and ratings', connected: true, icon: '📦' },
    { name: 'Google Business', desc: 'Sync Google My Business reviews', connected: false, icon: '🔍' },
    { name: 'Sephora', desc: 'Monitor Sephora product reviews', connected: true, icon: '💄' },
    { name: 'TikTok Business', desc: 'Connect TikTok analytics', connected: false, icon: '🎵' },
    { name: 'Meta Business', desc: 'Sync Facebook and Instagram insights', connected: false, icon: '📘' },
    { name: 'Slack', desc: 'Receive alerts in Slack', connected: false, icon: '💬' },
    { name: 'Zapier', desc: 'Connect 1000+ apps via Zapier', connected: false, icon: '⚡' },
  ]
  return (
    <div className="space-y-6">
      <SectionHeader title="Integrations" desc="Connect your business tools and platforms" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {integrations.map(int => (
          <Card key={int.name} className="border-border/60 hover:shadow-sm transition-all">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{int.icon}</span>
                  <div>
                    <p className="text-sm font-medium">{int.name}</p>
                    <p className="text-xs text-muted-foreground">{int.desc}</p>
                  </div>
                </div>
                <Button
                  variant={int.connected ? "secondary" : "outline"}
                  size="sm"
                  className="h-7 text-xs flex-shrink-0"
                  onClick={() => toast.success(int.connected ? `${int.name} disconnected` : `${int.name} connected`)}
                >
                  {int.connected ? 'Connected' : 'Connect'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function APISettings() {
  return (
    <div className="space-y-6">
      <SectionHeader title="API Keys" desc="Manage your API access credentials" />
      <Card className="border-border/60">
        <CardContent className="p-6 space-y-4">
          {[
            { name: 'Production API Key', key: 'tl_prod_ak_••••••••••••••••••••1a2b', created: 'Dec 1, 2023', lastUsed: '2 hours ago' },
            { name: 'Development API Key', key: 'tl_dev_ak_••••••••••••••••••••3c4d', created: 'Nov 15, 2023', lastUsed: '3 days ago' },
          ].map(apiKey => (
            <div key={apiKey.name} className="flex items-start justify-between gap-4 p-4 rounded-lg bg-muted/30 border border-border/40">
              <div className="space-y-1">
                <p className="text-sm font-medium">{apiKey.name}</p>
                <code className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">{apiKey.key}</code>
                <p className="text-xs text-muted-foreground">Created {apiKey.created} · Last used {apiKey.lastUsed}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => toast.success('API key copied to clipboard')}>Copy</Button>
                <Button variant="outline" size="sm" className="h-7 text-xs text-destructive" onClick={() => toast.success('API key revoked')}>Revoke</Button>
              </div>
            </div>
          ))}
          <Button variant="outline" className="gap-2" onClick={() => toast.success('New API key generated')}>
            <Key className="size-4" />
            Generate new API key
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function AIPreferences() {
  const [prefs, setPrefs] = useState({
    auto_insights: true, auto_responses: true, predictive: true,
    competitor_monitoring: true, sentiment_threshold: 'medium',
  })
  return (
    <div className="space-y-6">
      <SectionHeader title="AI Preferences" desc="Configure how AI analyzes your brand data" />
      <Card className="border-border/60">
        <CardContent className="p-6 space-y-5">
          {[
            { key: 'auto_insights', label: 'Automatic AI insights', desc: 'AI proactively analyzes data and surfaces insights' },
            { key: 'auto_responses', label: 'Auto-generate review responses', desc: 'AI prepares suggested responses for new reviews' },
            { key: 'predictive', label: 'Predictive forecasting', desc: 'AI predicts trends and revenue based on historical data' },
            { key: 'competitor_monitoring', label: 'Competitor monitoring', desc: 'AI continuously tracks competitor activity and sentiment' },
          ].map(it => (
            <div key={it.key} className="flex items-center justify-between py-1">
              <div>
                <p className="text-sm font-medium">{it.label}</p>
                <p className="text-xs text-muted-foreground">{it.desc}</p>
              </div>
              <Switch
                checked={prefs[it.key as keyof typeof prefs] as boolean}
                onCheckedChange={() => setPrefs(prev => ({ ...prev, [it.key]: !prev[it.key as keyof typeof prefs] }))}
              />
            </div>
          ))}
          <Separator />
          <div className="space-y-1.5">
            <Label className="text-sm">Sentiment alert threshold</Label>
            <Select defaultValue={prefs.sentiment_threshold} onValueChange={(v) => setPrefs(prev => ({ ...prev, sentiment_threshold: v }))}>
              <SelectTrigger className="h-9 w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High (alert at 85%+)</SelectItem>
                <SelectItem value="medium">Medium (alert at 75%+)</SelectItem>
                <SelectItem value="low">Low (alert at 65%+)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Get alerted when sentiment drops below this threshold</p>
          </div>
          <Button onClick={() => toast.success('AI preferences saved')}>Save preferences</Button>
        </CardContent>
      </Card>
    </div>
  )
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      <SectionHeader title="Security" desc="Manage your account security" />
      <Card className="border-border/60">
        <CardContent className="p-6 space-y-5">
          <div className="space-y-1.5">
            <Label className="text-sm">Current password</Label>
            <Input type="password" placeholder="••••••••" className="h-9 max-w-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">New password</Label>
            <Input type="password" placeholder="••••••••" className="h-9 max-w-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Confirm password</Label>
            <Input type="password" placeholder="••••••••" className="h-9 max-w-sm" />
          </div>
          <Button onClick={() => toast.success('Password updated')}>Update password</Button>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Two-factor authentication</p>
              <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.info('2FA setup would begin here')}>Enable 2FA</Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Active sessions</p>
              <p className="text-xs text-muted-foreground">Manage devices logged into your account</p>
            </div>
            <Button variant="outline" size="sm">View sessions</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ActivityLog() {
  const activities = [
    { action: 'Generated Executive Summary report', user: 'Sarah Lee', time: '2 hours ago', type: 'report' },
    { action: 'Connected Shopify integration', user: 'James Chen', time: '5 hours ago', type: 'integration' },
    { action: 'Updated brand settings', user: 'Sarah Lee', time: '1 day ago', type: 'settings' },
    { action: 'Invited Maria Garcia to workspace', user: 'Sarah Lee', time: '2 days ago', type: 'team' },
    { action: 'Exported Product Performance report', user: 'David Kim', time: '3 days ago', type: 'export' },
    { action: 'Generated API key', user: 'Sarah Lee', time: '1 week ago', type: 'api' },
  ]
  const typeColors: Record<string, string> = {
    report: 'bg-primary/10 text-primary',
    integration: 'bg-blue-50 text-blue-600 dark:bg-blue-950/30',
    settings: 'bg-muted text-muted-foreground',
    team: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30',
    export: 'bg-amber-50 text-amber-600 dark:bg-amber-950/30',
    api: 'bg-purple-50 text-purple-600 dark:bg-purple-950/30',
  }
  return (
    <div className="space-y-6">
      <SectionHeader title="Activity Log" desc="Recent activity in your workspace" />
      <Card className="border-border/60">
        <CardContent className="p-0">
          {activities.map((a, i) => (
            <div key={i} className={cn("flex items-center gap-3 p-4", i < activities.length - 1 && "border-b border-border/40")}>
              <div className={cn("size-8 rounded-lg flex items-center justify-center flex-shrink-0", typeColors[a.type])}>
                <Activity className="size-3.5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{a.action}</p>
                <p className="text-xs text-muted-foreground">{a.user} · {a.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
