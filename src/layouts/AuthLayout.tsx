import { Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary flex-col justify-between p-12">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[oklch(0.45_0.2_290)] opacity-90" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, oklch(1 0 0 / 0.15) 0%, transparent 50%), 
                            radial-gradient(circle at 80% 80%, oklch(0.45 0.2 290 / 0.3) 0%, transparent 50%)`
        }} />
        
        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-white font-semibold text-lg">Touchland Intelligence</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl font-bold text-white leading-tight"
            >
              Brand intelligence,{' '}
              <span className="text-white/70">reimagined</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-white/70 text-lg leading-relaxed max-w-md"
            >
              Monitor reviews, track sentiment, analyze competitors, and discover influencers — all powered by AI.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="space-y-3"
          >
            {[
              { icon: '✨', text: 'Real-time sentiment analysis across all platforms' },
              { icon: '🎯', text: 'AI-powered competitor intelligence and SWOT analysis' },
              { icon: '📊', text: 'Executive reports generated in seconds, not days' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-white/10 flex items-center justify-center text-sm flex-shrink-0">
                  {item.icon}
                </div>
                <span className="text-white/80 text-sm">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {['JM', 'SC', 'ER', 'DK'].map((initials, i) => (
                <div key={i} className="size-8 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-white text-xs font-medium backdrop-blur-sm">
                  {initials}
                </div>
              ))}
            </div>
            <p className="text-white/70 text-sm">Join 2,400+ beauty brands already using Touchland Intelligence</p>
          </div>
        </motion.div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="size-10 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">T</span>
            </div>
            <span className="font-semibold text-lg text-foreground">Touchland Intelligence</span>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
