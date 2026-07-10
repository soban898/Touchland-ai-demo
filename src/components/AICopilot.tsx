import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Send, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const suggestions = [
  "Summarize today's sentiment",
  "Why is Wild Watermelon trending?",
  "Compare us with Purell",
  "Suggest next campaign",
  "Forecast revenue",
  "Generate executive report",
  "Which product is underperforming?",
  "Which influencer should we contact?",
]

const responses: Record<string, string> = {
  "Summarize today's sentiment": "Today's sentiment analysis across all platforms:\n\n- 🟢 **Overall sentiment: 91% positive** (up 8.3% from last week)\n- 📊 **47 new reviews** — 41 positive, 4 neutral, 2 negative\n- 🎵 **TikTok mentions: 18,420** — Wild Watermelon leading with 43% spike\n- 📸 **Instagram: 8,240 mentions** — Vanilla Blossom aesthetic posts trending\n- 💬 **Reddit: 2,140 organic mentions** — Aloe You recommended in sensitive skin community\n\n**Top insight:** 3 reviews mention Valentine's Day gifting intent. Wild Watermelon has gone viral with 3 videos over 500K views. Aloe You needs inventory attention (12-day runway).",
  "Why is Wild Watermelon trending": "Wild Watermelon is trending due to a **viral TikTok moment**:\n\n- 🎵 **3 viral videos** with combined 1.8M views in the last 6 hours\n- @jademorrison (2.8M followers) posted a POV review — 284K likes, 42K shares\n- @mayaxbeauty (5.2M followers) ranked all Touchland flavors — 521K likes\n- Hashtag #WildWatermelon has 12,840 mentions (+67% in 24h)\n- Sentiment on these posts: **94% positive**\n\n**Why it's resonating:** The watermelon aesthetic is peak summer, the bottle design is highly photogenic, and the scent is described as 'nostalgic' and 'refreshing.'\n\n**Recommendation:** Launch a creator fund campaign within 72 hours to amplify this momentum. Estimated 8.4x ROI on $25K budget.",
  "Compare us with Purell": "Here's how Touchland stacks up against Purell:\n\n| Metric | Touchland | Purell |\n|--------|-----------|--------|\n| Sentiment | **91%** 🟢 | 68% 🔴 |\n| Avg Rating | **4.7** | 4.1 |\n| Market Share | 34.2% (+4.8%) | 41.8% (-2.1%) |\n| TikTok Presence | **94 score** | 12 score |\n| Price Range | $14-17 | $4-13 |\n\n**Key takeaway:** Purell leads in distribution and price, but you're winning on sentiment, social, and premium positioning. Their new moisturizing line shows they're reacting to your formula advantage — but reviews are weak (68% sentiment). **Action: Accelerate your skincare-adjacent marketing before they improve.**",
  "Suggest next campaign": "Based on your current data, here are 3 high-potential campaign concepts:\n\n**1. 'Refresh Your Valentine' Bundle Campaign** 🌸\n- Bundle Berry Bliss + Vanilla Blossom + Peachy Lychee\n- Target: Gift shoppers, Feb 1-14\n- Estimated revenue: $420K\n\n**2. TikTok Creator Fund — Wild Watermelon Viral Push** 🍉\n- Commission 12 micro-influencers (100K-500K followers)\n- Format: Authentic 'first reaction' videos\n- Budget: $25K | Est. ROI: 8.4x\n\n**3. 'Clean Skin Club' Aloe You Sensitive Skin Series** 🌿\n- Partner with 3 dermatology-focused creators\n- Target: Skincare community, rosacea/eczema segment\n- Est. reach: 2.8M qualified impressions",
  "Forecast revenue": "Revenue forecast for the next 4 weeks based on current trends:\n\n| Week | Forecast | Confidence | Key Driver |\n|------|----------|------------|-----------|\n| W7 | $1.42M | 92% | Wild Watermelon viral momentum |\n| W8 | $1.58M | 88% | Valentine's bundle launch |\n| W9 | $1.34M | 84% | Post-holiday normalization |\n| W10 | $1.48M | 86% | Aloe You restock + influencer campaign |\n\n**Total 4-week forecast: $5.82M** (vs. $4.8M target — 21% above plan)\n\n**Key risks:** Aloe You stockout could reduce W7-W8 by $200K. Purell's new moisturizing line could capture 2-3% market share if they improve sentiment.",
  "Generate executive report": "I've generated your **Weekly Executive Report**:\n\n📊 **Brand Health Score: 87/100** (↑3 from last week)\n\n**Key Highlights:**\n- Revenue: $3.58M (+18.2% MoM)\n- Sentiment: 91% positive (+8.3%)\n- Social mentions: 284K (+43.2%)\n- 47 new reviews, avg 4.7 rating\n- 2 critical AI recommendations pending\n\n**Top Product:** Wild Watermelon — $842K revenue, 94% sentiment\n**Top Risk:** Aloe You inventory (12-day runway)\n**Top Opportunity:** Valentine's Day gifting bundle\n\nThe full report has been generated in the Reports section. You can export it as PDF, CSV, or schedule email delivery to your team.",
  "Summarize today's reviews": "Today you received **47 new reviews** across all platforms:\n\n- 🟢 **41 Positive** (87%) — Customers are loving Wild Watermelon's scent and Vanilla Blossom's gift appeal.\n- 🟡 **4 Neutral** (8%) — Mostly about scent longevity.\n- 🔴 **2 Negative** (5%) — Both mention pump issues on Amazon orders. I've prepared suggested responses for each.\n\n**Top insight:** 3 reviews specifically mention gifting intent for Valentine's Day. This is a buying signal worth acting on immediately.",
  "Generate campaign ideas": "Based on your current data, here are 3 high-potential campaign concepts:\n\n**1. 'Refresh Your Valentine' Bundle Campaign** 🌸\n- Bundle Berry Bliss + Vanilla Blossom + Peachy Lychee\n- Target: Gift shoppers, Feb 1-14\n- Estimated revenue: $420K\n\n**2. TikTok Creator Fund — Wild Watermelon Viral Push** 🍉\n- Commission 12 micro-influencers (100K-500K followers)\n- Format: Authentic 'first reaction' videos\n- Budget: $25K | Est. ROI: 8.4x\n\n**3. 'Clean Skin Club' Aloe You Sensitive Skin Series** 🌿\n- Partner with 3 dermatology-focused creators\n- Target: Skincare community, rosacea/eczema segment\n- Est. reach: 2.8M qualified impressions",
}

function getAIResponse(message: string): string {
  const lower = message.toLowerCase()
  const key = Object.keys(responses).find(k =>
    lower.includes(k.toLowerCase().substring(0, 12))
  )
  if (key) return responses[key]

  if (lower.includes('product') && lower.includes('underperform')) {
    return "**Rainwater** is your underperforming SKU:\n\n- Revenue: $478K (-2.1% MoM)\n- Social mentions: 5,240 (-5.4%)\n- Sentiment: 85% (lowest of all SKUs)\n- Reviews: 2,432 (avg 4.5 stars)\n\nThe product quality is strong (4.5 stars), but marketing has gone stale. **Recommendation:** Commission new lifestyle photography and reposition as 'mindfulness & clean living' for the wellness audience. Partner with yoga/meditation influencers for a 'Clean Slate Challenge' on TikTok."
  }

  if (lower.includes('influencer') || lower.includes('contact')) {
    return "Based on your brand goals, here are your top influencer matches:\n\n**1. Ariana Luz** (@arianaluz) — 99% compatibility\n- 3.68M TikTok followers, 12.4% engagement\n- LATAM expansion ambassador opportunity\n- Est. ROI: 7.2x on $12K budget\n\n**2. Jade Morrison** (@jademorrison) — 97% compatibility\n- 2.84M TikTok followers, already posted organically about you\n- Perfect for Wild Watermelon viral amplification\n- Est. ROI: 4.8x on $8.5K budget\n\n**3. Zara Ali** (@zaraali_beauty) — 95% compatibility\n- 840K YouTube subscribers, sensitive skin niche\n- Ideal for Aloe You dermatology campaign\n- Est. ROI: 5.2x on $6.8K budget"
  }

  if (lower.includes('complaint') || lower.includes('negative')) {
    return "Customer complaint analysis (last 30 days):\n\n**Top complaints by frequency:**\n1. 🔴 **Pump issues** (8 mentions) — Product quality signal, needs QC audit\n2. 🟡 **Price-to-size ratio** (12 mentions) — Consider value bundle options\n3. 🟡 **Scent longevity** (15 mentions) — Educate on pulse-point application\n4. 🟠 **Packaging damage** (4 mentions) — Shipping protection issue\n\n**AI Recommendation:** The pump issue is most actionable — 8 reviews mention broken pumps, suggesting a production batch issue. Request a QC audit on your current supplier before the next shipment."
  }

  if (lower.includes('predict') || lower.includes('trend') || lower.includes('forecast')) {
    return "Next week's trend forecast:\n\n📈 **Wild Watermelon** — Will continue viral momentum (85% confidence). Expect 15-20% sales lift.\n📈 **Aloe You** — Growth accelerating (+52% above forecast). Risk: stockout within 12 days.\n📊 **Vanilla Blossom** — Stable, Valentine's gifting surge expected in 10 days.\n📉 **Rainwater** — Continued decline unless marketing refresh launches.\n📈 **Berry Bliss** — Steady growth, bundle opportunity with Wild Watermelon.\n\n**Overall prediction:** Revenue will exceed target by 18-22% next week, driven primarily by Wild Watermelon virality and Valentine's pre-season gifting."
  }

  return `I've analyzed your brand data to answer that:\n\n**Based on your current metrics**, here's what I found:\n\n- Your overall sentiment score is **91%** — top quartile for your category\n- Wild Watermelon is your highest-momentum product with 43% mention growth\n- Aloe You needs inventory attention (12-day runway)\n- Purell launched a new moisturizing formula with weak reception (68% sentiment)\n\nWould you like me to dive deeper into any specific aspect? I can analyze reviews, social data, competitor positioning, or generate specific recommendations.`
}

export function AICopilot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "Hi Sarah! 👋 I'm your Touchland Intelligence AI copilot. I have full context on your brand — reviews, social listening, competitors, and products. What would you like to know?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  useEffect(() => {
    const handler = () => setOpen(true)
    document.addEventListener('open-copilot', handler)
    return () => document.removeEventListener('open-copilot', handler)
  }, [])

  const sendMessage = async (text?: string) => {
    const content = text || input.trim()
    if (!content) return
    setInput('')

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setTyping(true)

    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800))

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: getAIResponse(content),
      timestamp: new Date()
    }
    setMessages(prev => [...prev, aiMsg])
    setTyping(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!open && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => setOpen(true)}
              className="size-14 rounded-full bg-primary shadow-lg flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors group relative"
            >
              <Bot className="size-6" />
              <span className="absolute -top-1 -right-1 size-4 rounded-full bg-emerald-500 border-2 border-background animate-pulse" />
              <div className="absolute right-16 bg-card shadow-lg rounded-xl px-3 py-1.5 text-xs font-medium text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-border/60">
                AI Copilot
              </div>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Chat Window */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute bottom-0 right-0 w-[380px] sm:w-[420px] h-[580px] bg-card rounded-2xl shadow-2xl border border-border/60 flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-border/60 bg-gradient-to-r from-primary/5 to-transparent flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-primary flex items-center justify-center">
                    <Bot className="size-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">AI Copilot</p>
                    <div className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] text-muted-foreground">Online · Full brand context</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon-sm" onClick={() => setOpen(false)} className="size-7 text-muted-foreground">
                  <X className="size-4" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={cn("flex gap-2.5", msg.role === 'user' ? "justify-end" : "justify-start")}
                  >
                    {msg.role === 'assistant' && (
                      <div className="size-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sparkles className="size-3 text-primary-foreground" />
                      </div>
                    )}
                    <div className={cn(
                      "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed",
                      msg.role === 'user'
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted/60 text-foreground rounded-tl-sm"
                    )}>
                      <MarkdownRenderer content={msg.content} />
                    </div>
                    {msg.role === 'user' && (
                      <div className="size-6 rounded-full bg-gradient-to-br from-primary to-[oklch(0.45_0.2_290)] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-[9px] font-semibold">SL</span>
                      </div>
                    )}
                  </div>
                ))}

                {typing && (
                  <div className="flex gap-2.5">
                    <div className="size-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="size-3 text-primary-foreground" />
                    </div>
                    <div className="bg-muted/60 rounded-2xl rounded-tl-sm px-3.5 py-3 flex items-center gap-1">
                      {[0, 0.15, 0.3].map((delay, i) => (
                        <motion.span
                          key={i}
                          className="size-1.5 rounded-full bg-muted-foreground/50"
                          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8, delay }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions */}
              {messages.length === 1 && (
                <div className="px-4 pb-3 flex-shrink-0">
                  <p className="text-[10px] text-muted-foreground mb-2 uppercase tracking-wider font-medium">Suggested prompts</p>
                  <div className="flex flex-wrap gap-1.5">
                    {suggestions.slice(0, 6).map(s => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="px-2.5 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-[11px] text-muted-foreground hover:text-foreground transition-colors border border-border/40"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="px-4 py-3 border-t border-border/60 flex-shrink-0">
                <div className="flex items-end gap-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask anything about your brand..."
                      className="w-full resize-none rounded-xl bg-muted/40 border border-border/60 px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all min-h-[40px] max-h-24"
                      rows={1}
                    />
                  </div>
                  <Button
                    size="icon-sm"
                    className="size-9 rounded-xl flex-shrink-0 self-end"
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || typing}
                  >
                    <Send className="size-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n')

  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**') && !line.slice(2, -2).includes('**')) {
          return <p key={i} className="font-semibold">{line.slice(2, -2)}</p>
        }
        if (line.startsWith('| ') || line.startsWith('|---')) {
          return null
        }
        if (line.startsWith('- ')) {
          const parsed = parseInline(line.slice(2))
          return <div key={i} className="flex items-start gap-1.5"><span className="mt-0.5 flex-shrink-0">·</span><span>{parsed}</span></div>
        }
        if (line.trim() === '') return <div key={i} className="h-1" />
        return <p key={i}>{parseInline(line)}</p>
      })}

      {/* Simple table rendering */}
      {content.includes('| ') && (
        <div className="overflow-x-auto">
          <table className="text-[11px] border-collapse mt-1">
            {content.split('\n').filter(l => l.startsWith('| ') && !l.startsWith('|---')).map((row, i) => {
              const cells = row.split('|').filter(c => c.trim() !== '').map(c => c.trim())
              return (
                <tr key={i} className={i === 0 ? "border-b border-border/60" : ""}>
                  {cells.map((cell, j) => (
                    <td key={j} className={cn("px-2 py-1", i === 0 && "font-semibold")}>{cell}</td>
                  ))}
                </tr>
              )
            })}
          </table>
        </div>
      )}
    </div>
  )
}

function parseInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}
