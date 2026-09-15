import { ref, computed } from 'vue'
import { useApi } from '~/composables/useApi'

export interface PlanItem {
  id: number
  tier_key: 'free' | 'standard' | 'elite'
  name: string
  badge: string
  description: string
  period: string
  price_idr: number
  promo_price_idr: number
  price_usd: number
  promo_price_usd: number
  discount_pct: number
  is_popular: boolean
  max_participants: number | null
  max_categories: number | null
  max_scorekeepers: number | null
  highlight_features: string[]
  cta_text: string
  cta_link: string
}

export interface ComparisonRow {
  category: string
  feature: string
  free: string | boolean
  standard: string | boolean
  elite: string | boolean
}

export interface BundleRule {
  min_qty: number
  discount_pct: number
  label: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface UnifiedPricingResponse {
  plans: PlanItem[]
  comparison_matrix: ComparisonRow[]
  bundle_discounts: BundleRule[]
  faqs: FAQItem[]
}

const defaultPricingData: UnifiedPricingResponse = {
  plans: [
    {
      id: 0,
      tier_key: 'free',
      name: 'Free Starter',
      badge: 'Starter',
      description: 'Try core tournament scoring features with 1 free tournament quota.',
      period: '/tournament',
      price_idr: 0,
      promo_price_idr: 0,
      price_usd: 0,
      promo_price_usd: 0,
      discount_pct: 0,
      is_popular: false,
      max_participants: 10,
      max_categories: 2,
      max_scorekeepers: 1,
      highlight_features: [
        '1 Free Tournament Quota',
        'Up to 10 Participants / Tournament',
        'Up to 2 Competition Categories',
        '1 Mobile Scorekeeper Account',
        'Basic Qualification Leaderboard',
        'Basic Results & Printouts (PDF)'
      ],
      cta_text: 'Get Started Free',
      cta_link: '/auth/register'
    },
    {
      id: 7,
      tier_key: 'standard',
      name: 'Standard EO',
      badge: 'Most Popular',
      description: 'Complete tournament scoring solution for clubs, regional circuits, and open tournaments.',
      period: '/tournament',
      price_idr: 49900,
      promo_price_idr: 24950,
      price_usd: 3.00,
      promo_price_usd: 1.50,
      discount_pct: 50,
      is_popular: true,
      max_participants: 200,
      max_categories: 10,
      max_scorekeepers: 3,
      highlight_features: [
        'Standard Tournament Quota',
        'Up to 200 Participants / Tournament',
        'Up to 10 Competition Categories',
        '3 Scorekeeper Accounts',
        'Live Qualification & Elimination Scoring',
        'Standard Digital Certificates (Automated)',
        'Full 6 Tournament Printouts Download',
        'Automated Payment Gateway (Mayar QRIS & VA)'
      ],
      cta_text: 'Claim Standard Promo',
      cta_link: '/package'
    },
    {
      id: 8,
      tier_key: 'elite',
      name: 'Elite EO',
      badge: 'Professional Tier',
      description: 'Unlimited capabilities for professional championships, multi-field live streaming, and national tournaments.',
      period: '/tournament',
      price_idr: 79900,
      promo_price_idr: 39950,
      price_usd: 7.00,
      promo_price_usd: 3.50,
      discount_pct: 50,
      is_popular: false,
      max_participants: null,
      max_categories: null,
      max_scorekeepers: null,
      highlight_features: [
        'Unlimited Participants & Categories',
        'Unlimited Scorekeeper Accounts',
        'Custom Certificate Design Templates (16:9 & A4)',
        'Live Embed Bracket & Leaderboard Widgets (OBS / Web)',
        'Local & Global Payment Gateway (Mayar & PayPal)',
        'Full Excel Export & Financial Statements',
        'Priority Technical Tournament Support'
      ],
      cta_text: 'Choose Elite',
      cta_link: '/package'
    }
  ],
  comparison_matrix: [
    {
      category: 'Capacity & Limits',
      feature: 'Participant Limit per Tournament',
      free: '10 Participants',
      standard: '200 Participants',
      elite: 'Unlimited'
    },
    {
      category: 'Capacity & Limits',
      feature: 'Competition Categories Limit',
      free: '2 Categories',
      standard: '10 Categories',
      elite: 'Unlimited'
    },
    {
      category: 'Capacity & Limits',
      feature: 'Scorekeeper Accounts',
      free: '1 Scorekeeper',
      standard: '3 Scorekeepers',
      elite: 'Unlimited'
    },
    {
      category: 'Scoring & Match Operations',
      feature: 'Digital Qualification Scoring',
      free: true,
      standard: true,
      elite: true
    },
    {
      category: 'Scoring & Match Operations',
      feature: 'Elimination Brackets & Match Play',
      free: false,
      standard: true,
      elite: true
    },
    {
      category: 'Scoring & Match Operations',
      feature: 'Live Widget Embed (OBS / Web)',
      free: false,
      standard: false,
      elite: true
    },
    {
      category: 'Outputs & Branding',
      feature: 'Digital Certificates for Archers',
      free: false,
      standard: 'Standard Template',
      elite: 'Custom Template (16:9 & A4)'
    },
    {
      category: 'Outputs & Branding',
      feature: 'Scoresheets & Bracket Printouts',
      free: 'Basic Report',
      standard: 'Complete (6 Types)',
      elite: 'Complete (6 Types)'
    },
    {
      category: 'Outputs & Branding',
      feature: 'Data Export & Complete Excel',
      free: 'PDF',
      standard: 'PDF & CSV',
      elite: 'PDF, CSV & Excel'
    },
    {
      category: 'Support & Infrastructure',
      feature: 'Automated Payment Gateway',
      free: false,
      standard: 'Mayar (QRIS, VA)',
      elite: 'Mayar & PayPal (Global)'
    },
    {
      category: 'Support & Infrastructure',
      feature: 'Media Storage',
      free: '250 MB',
      standard: '1 GB',
      elite: '5 GB'
    },
    {
      category: 'Support & Infrastructure',
      feature: 'Technical Customer Support',
      free: 'Standard',
      standard: 'Fast Support',
      elite: 'VIP Priority'
    }
  ],
  bundle_discounts: [
    { min_qty: 1, discount_pct: 0, label: 'Single Package' },
    { min_qty: 3, discount_pct: 7, label: 'Save 7%' },
    { min_qty: 5, discount_pct: 12, label: 'Save 12%' },
    { min_qty: 10, discount_pct: 20, label: 'Save 20%' }
  ],
  faqs: [
    {
      question: 'How does the Standard EO 3-month free promo work?',
      answer: 'During the initial 3-month promotional period, organizers can register and claim Standard EO tournament quota completely free ($0.00 / Rp 0) with no upfront or hidden fees to publish and manage tournaments.'
    },
    {
      question: 'What happens after the 3-month promo period ends?',
      answer: 'All existing tournaments and past tournament data remain permanently active. For publishing new future tournaments after the promo ends, Standard EO quota is available at the normal rate ($3.00 / Rp 49.900 per tournament, or Rp 24.950 with 50% discount).'
    },
    {
      question: 'Do purchased tournament quotas have an expiration date?',
      answer: 'No. All tournament quotas stored in your organizer account never expire. You can keep them and use them whenever your tournament schedule is set.'
    },
    {
      question: 'When is tournament quota deducted from my account balance?',
      answer: 'Tournament quota is only deducted when you publish a tournament (changing status from Draft to Public). While setting up categories, brackets, and rules in Draft mode, no quota is consumed.'
    },
    {
      question: 'Can I purchase custom numbers of tournament slots?',
      answer: "Yes! In your organizer dashboard, you can enter any custom number of tournament slots you require to plan out your organization's yearly calendar with automatic volume bundle discounts."
    }
  ]
}

export function usePricingPlans() {
  const { get } = useApi()
  const pricingData = useState<UnifiedPricingResponse>('unified_pricing_plans', () => defaultPricingData)
  const isLoading = ref(false)
  const error = ref<any>(null)

  const fetchPlans = async () => {
    isLoading.value = true
    try {
      const res = await get('/public/pricing/plans')
      if (res && res.plans) {
        pricingData.value = res
      }
    } catch (err) {
      error.value = err
      console.warn('Using default pricing fallback:', err)
    } finally {
      isLoading.value = false
    }
  }

  const plans = computed(() => pricingData.value.plans || defaultPricingData.plans)
  const freePlan = computed(() => plans.value.find(p => p.tier_key === 'free') || defaultPricingData.plans[0])
  const standardPlan = computed(() => plans.value.find(p => p.tier_key === 'standard') || defaultPricingData.plans[1])
  const elitePlan = computed(() => plans.value.find(p => p.tier_key === 'elite') || defaultPricingData.plans[2])

  const comparisonMatrix = computed(() => pricingData.value.comparison_matrix || defaultPricingData.comparison_matrix)
  const bundleDiscounts = computed(() => pricingData.value.bundle_discounts || defaultPricingData.bundle_discounts)
  const faqs = computed(() => pricingData.value.faqs || defaultPricingData.faqs)

  return {
    pricingData,
    isLoading,
    error,
    fetchPlans,
    plans,
    freePlan,
    standardPlan,
    elitePlan,
    comparisonMatrix,
    bundleDiscounts,
    faqs
  }
}
