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
      max_participants: 50,
      max_categories: null,
      max_scorekeepers: null,
      highlight_features: [
        'Up to 50 Participants / Tournament',
        '200 MB Media Storage',
        'Access All Features'
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
      price_idr: 49999,
      promo_price_idr: 24999,
      price_usd: 3.00,
      promo_price_usd: 1.50,
      discount_pct: 50,
      is_popular: true,
      max_participants: 200,
      max_categories: null,
      max_scorekeepers: null,
      highlight_features: [
        'Up to 200 Participants / Tournament',
        '3 GB Media Storage',
        'Access All Features'
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
      price_idr: 79999,
      promo_price_idr: 39999,
      price_usd: 7.00,
      promo_price_usd: 3.50,
      discount_pct: 50,
      is_popular: false,
      max_participants: null,
      max_categories: null,
      max_scorekeepers: null,
      highlight_features: [
        'Unlimited Participants',
        '10 GB Media Storage',
        'Access All Features'
      ],
      cta_text: 'Choose Elite',
      cta_link: '/package'
    }
  ],
  comparison_matrix: [
    {
      category: 'Capacity & Limits',
      feature: 'Participant limit per tournament',
      free: '50 Archers',
      standard: '200 Archers',
      elite: 'Unlimited'
    },
    {
      category: 'Capacity & Limits',
      feature: 'Media storage',
      free: '200 MB',
      standard: '3 GB',
      elite: '10 GB'
    },
    {
      category: 'Capacity & Limits',
      feature: 'Competition categories',
      free: 'Unlimited',
      standard: 'Unlimited',
      elite: 'Unlimited'
    },
    {
      category: 'Capacity & Limits',
      feature: 'Scorekeeper accounts',
      free: 'Unlimited',
      standard: 'Unlimited',
      elite: 'Unlimited'
    },
    {
      category: 'Capacity & Limits',
      feature: 'Access period',
      free: 'Lifetime',
      standard: 'Lifetime',
      elite: 'Lifetime'
    },
    {
      category: 'Tournament Setup',
      feature: 'Tournament setup (Categories, fees, lane setup & schedule)',
      free: true,
      standard: true,
      elite: true
    },
    {
      category: 'Registration',
      feature: 'Participant registration (Online, manual entry & payment modes)',
      free: true,
      standard: true,
      elite: true
    },
    {
      category: 'Scoring & Match Play',
      feature: 'Scoring & match play (Live qualification, brackets & scorekeeper)',
      free: true,
      standard: true,
      elite: true
    },
    {
      category: 'Printouts & Certificates',
      feature: 'Printouts & certificates (8 official PDF formats with QR code)',
      free: true,
      standard: true,
      elite: true
    },
    {
      category: 'Data Export',
      feature: 'Data export (Participants, payments & stats in Excel & CSV)',
      free: true,
      standard: true,
      elite: true
    },
    {
      category: 'Support',
      feature: 'Customer support',
      free: '24/7 Support',
      standard: '24/7 Support',
      elite: '24/7 Support'
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
      question: 'How does the tournament quota system work?',
      answer: 'Organizers can purchase tournament quotas individually or in discounted bundles. Each quota allows you to publish and manage one complete tournament with all platform features.'
    },
    {
      question: 'What is the difference between Standard EO and Elite EO?',
      answer: 'Standard EO supports up to 200 participants and 3 GB media storage per tournament. Elite EO offers unlimited participants and 10 GB media storage. All scoring, certificates, live leaderboards, and management features are fully unlocked on both tiers.'
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
