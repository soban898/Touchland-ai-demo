import { useState } from 'react'
import { FileText, FileSpreadsheet, Presentation, Mail, Download, Check } from 'lucide-react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ExportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
}

const formats = [
  { id: 'pdf', label: 'PDF Document', icon: FileText, desc: 'Formatted report with charts', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30' },
  { id: 'csv', label: 'CSV Spreadsheet', icon: FileSpreadsheet, desc: 'Raw data for analysis', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  { id: 'excel', label: 'Excel Workbook', icon: FileSpreadsheet, desc: 'Multi-sheet with formulas', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  { id: 'ppt', label: 'PowerPoint', icon: Presentation, desc: 'Presentation-ready slides', color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950/30' },
  { id: 'email', label: 'Email Report', icon: Mail, desc: 'Send to team members', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/30' },
]

export function ExportModal({ open, onOpenChange, title = 'Export Report', description = 'Choose a format to export your data' }: ExportModalProps) {
  const [selected, setSelected] = useState<string[]>(['pdf'])
  const [email, setEmail] = useState('')
  const [generating, setGenerating] = useState(false)

  const toggle = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  const handleExport = async () => {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 1200))
    setGenerating(false)
    onOpenChange(false)
    toast.success(`Exported as ${selected.map(s => s.toUpperCase()).join(', ')}`, {
      description: 'Your file has been generated and downloaded.',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {formats.map(fmt => {
            const isSelected = selected.includes(fmt.id)
            return (
              <button
                key={fmt.id}
                onClick={() => toggle(fmt.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                  isSelected
                    ? "border-primary/40 bg-primary/5"
                    : "border-border/60 hover:bg-muted/40"
                )}
              >
                <div className={cn("size-9 rounded-lg flex items-center justify-center flex-shrink-0", fmt.bg)}>
                  <fmt.icon className={cn("size-4", fmt.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{fmt.label}</p>
                  <p className="text-xs text-muted-foreground">{fmt.desc}</p>
                </div>
                <div className={cn(
                  "size-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all",
                  isSelected ? "border-primary bg-primary" : "border-border"
                )}>
                  {isSelected && <Check className="size-3 text-primary-foreground" />}
                </div>
              </button>
            )
          })}
        </div>

        {selected.includes('email') && (
          <div className="space-y-1.5">
            <Label className="text-sm">Recipient email(s)</Label>
            <Input
              placeholder="team@touchland.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="h-9"
            />
            <p className="text-xs text-muted-foreground">Separate multiple emails with commas</p>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1 h-9" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="flex-1 h-9 gap-2" onClick={handleExport} disabled={generating || selected.length === 0}>
            {generating ? (
              <>
                <div className="size-3.5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="size-3.5" />
                Generate
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
