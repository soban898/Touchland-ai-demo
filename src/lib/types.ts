export interface Review {
  id: string
  customerName: string
  customerAvatar: string
  initials: string
  product: string
  platform: 'Amazon' | 'Google' | 'Sephora' | 'Target' | 'App Store' | 'Ulta'
  country: string
  rating: number
  date: string
  text: string
  aiSummary: string
  emotion: 'Happy' | 'Satisfied' | 'Neutral' | 'Frustrated' | 'Angry' | 'Excited'
  sentiment: 'Positive' | 'Neutral' | 'Negative'
  suggestedResponse: string
  helpfulCount: number
  verified: boolean
  tags: string[]
}

export interface Product {
  id: string
  name: string
  tagline: string
  price: number
  revenue: number
  revenueChange: number
  sentiment: number
  mentions: number
  mentionsChange: number
  reviews: number
  rating: number
  inventory: number
  trend: number[]
  aiRecommendation: string
  color: string
  image: string
  category: string
  sku: string
}

export interface Influencer {
  id: string
  name: string
  handle: string
  avatar: string
  initials: string
  platform: 'Instagram' | 'TikTok' | 'YouTube' | 'Twitter' | 'Pinterest'
  followers: number
  engagement: number
  audienceMatch: number
  category: string
  location: string
  campaignROI: number
  compatibilityScore: number
  suggestedPartnership: string
  recentPost: string
  avgViews: number
  price: number
  tags: string[]
}

export interface Competitor {
  id: string
  name: string
  logo: string
  marketShare: number
  marketShareChange: number
  sentiment: number
  avgRating: number
  totalReviews: number
  priceRange: string
  strengths: string[]
  weaknesses: string[]
  recentActivity: string
}

export interface SocialPost {
  id: string
  platform: 'Instagram' | 'TikTok' | 'Facebook' | 'LinkedIn' | 'Twitter' | 'Reddit' | 'YouTube'
  author: string
  authorHandle: string
  avatar: string
  initials: string
  content: string
  hashtags: string[]
  likes: number
  comments: number
  shares: number
  reach: number
  sentiment: 'Positive' | 'Neutral' | 'Negative'
  date: string
  url: string
  mediaType: 'image' | 'video' | 'text' | 'reel'
}

export interface Notification {
  id: string
  type: 'mention' | 'report' | 'alert' | 'insight' | 'campaign'
  title: string
  description: string
  time: string
  read: boolean
  priority: 'high' | 'medium' | 'low'
  icon: string
}

export interface AIRecommendation {
  id: string
  category: 'Marketing' | 'Pricing' | 'Product' | 'Sales' | 'Content'
  title: string
  description: string
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  difficulty: 'Easy' | 'Medium' | 'Hard'
  impact: number
  roi: string
  confidence: number
  timeline: string
  actionSteps: string[]
  expectedOutcome: string
}
