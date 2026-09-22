export interface CurrencyOption {
  code: string
  name: string
  symbol: string
  locale: string
  decimals: number
  gateway: 'mayar' | 'paypal'
  country: string
  flag?: string
  icon?: string
}

export interface CountryOption {
  code: string
  name: string
  defaultCurrency: 'IDR' | 'USD'
  flag?: string
  icon: string
}

export const SUPPORTED_CURRENCIES: CurrencyOption[] = [
  {
    code: 'IDR',
    name: 'Indonesian Rupiah (IDR)',
    symbol: 'Rp',
    locale: 'id-ID',
    decimals: 0,
    gateway: 'mayar',
    country: 'Indonesia',
    flag: '🇮🇩',
    icon: 'circle-flags:id'
  },
  {
    code: 'USD',
    name: 'US Dollar (USD)',
    symbol: '$',
    locale: 'en-US',
    decimals: 2,
    gateway: 'paypal',
    country: 'International / Global',
    flag: '🇺🇸',
    icon: 'circle-flags:us'
  }
]

export const SUPPORTED_COUNTRIES: CountryOption[] = [
  { code: 'ID', name: 'Indonesia', defaultCurrency: 'IDR', flag: '🇮🇩', icon: 'circle-flags:id' },
  { code: 'MY', name: 'Malaysia', defaultCurrency: 'USD', flag: '🇲🇾', icon: 'circle-flags:my' },
  { code: 'SG', name: 'Singapore', defaultCurrency: 'USD', flag: '🇸🇬', icon: 'circle-flags:sg' },
  { code: 'TH', name: 'Thailand', defaultCurrency: 'USD', flag: '🇹🇭', icon: 'circle-flags:th' },
  { code: 'PH', name: 'Philippines', defaultCurrency: 'USD', flag: '🇵🇭', icon: 'circle-flags:ph' },
  { code: 'VN', name: 'Vietnam', defaultCurrency: 'USD', flag: '🇻🇳', icon: 'circle-flags:vn' },
  { code: 'MM', name: 'Myanmar', defaultCurrency: 'USD', flag: '🇲🇲', icon: 'circle-flags:mm' },
  { code: 'KH', name: 'Cambodia', defaultCurrency: 'USD', flag: '🇰🇭', icon: 'circle-flags:kh' },
  { code: 'LA', name: 'Laos', defaultCurrency: 'USD', flag: '🇱🇦', icon: 'circle-flags:la' },
  { code: 'BN', name: 'Brunei', defaultCurrency: 'USD', flag: '🇧🇳', icon: 'circle-flags:bn' },
  { code: 'AU', name: 'Australia', defaultCurrency: 'USD', flag: '🇦🇺', icon: 'circle-flags:au' },
  { code: 'NZ', name: 'New Zealand', defaultCurrency: 'USD', flag: '🇳🇿', icon: 'circle-flags:nz' },
  { code: 'JP', name: 'Japan', defaultCurrency: 'USD', flag: '🇯🇵', icon: 'circle-flags:jp' },
  { code: 'KR', name: 'South Korea', defaultCurrency: 'USD', flag: '🇰🇷', icon: 'circle-flags:kr' },
  { code: 'CN', name: 'China', defaultCurrency: 'USD', flag: '🇨🇳', icon: 'circle-flags:cn' },
  { code: 'IN', name: 'India', defaultCurrency: 'USD', flag: '🇮🇳', icon: 'circle-flags:in' },
  { code: 'US', name: 'United States', defaultCurrency: 'USD', flag: '🇺🇸', icon: 'circle-flags:us' },
  { code: 'GB', name: 'United Kingdom', defaultCurrency: 'USD', flag: '🇬🇧', icon: 'circle-flags:gb' },
  { code: 'DE', name: 'Germany / Europe', defaultCurrency: 'USD', flag: '🇩🇪', icon: 'circle-flags:de' },
  { code: 'FR', name: 'France', defaultCurrency: 'USD', flag: '🇫🇷', icon: 'circle-flags:fr' },
  { code: 'GLOBAL', name: 'International / Other', defaultCurrency: 'USD', flag: '🌐', icon: 'circle-flags:un' }
]

export function getCurrencyConfig(currencyCode: string = 'IDR'): CurrencyOption {
  const code = (currencyCode || 'IDR').toUpperCase()
  return SUPPORTED_CURRENCIES.find(c => c.code === code) || {
    code: code || 'USD',
    name: `${code}`,
    symbol: code === 'IDR' ? 'Rp' : (code === 'USD' ? '$' : code),
    locale: code === 'IDR' ? 'id-ID' : 'en-US',
    decimals: code === 'IDR' || code === 'JPY' ? 0 : 2,
    gateway: code === 'IDR' ? 'mayar' : 'paypal',
    country: 'International',
    flag: '🌐'
  }
}

export function formatMoney(amount: number | string | null | undefined, currencyCode: string = 'IDR'): string {
  if (amount === null || amount === undefined || amount === '') return ''
  const num = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]/g, '')) : Number(amount)
  if (isNaN(num)) return ''

  const config = getCurrencyConfig(currencyCode)

  // Use Intl.NumberFormat for precision & currency formatting
  try {
    const formattedNum = new Intl.NumberFormat(config.locale, {
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals
    }).format(num)

    if (config.code === 'IDR') {
      return `Rp ${formattedNum}`
    }
    return `${config.symbol} ${formattedNum}`
  } catch {
    return `${config.symbol} ${num}`
  }
}

export function getCurrencySymbol(currencyCode: string = 'IDR'): string {
  return getCurrencyConfig(currencyCode).symbol
}

export function getPaymentGatewayForCurrency(currencyCode: string = 'IDR'): 'mayar' | 'paypal' {
  return getCurrencyConfig(currencyCode).gateway
}

export default function useCurrency() {
  return {
    currencies: SUPPORTED_CURRENCIES,
    countries: SUPPORTED_COUNTRIES,
    getCurrencyConfig,
    formatMoney,
    getCurrencySymbol,
    getPaymentGatewayForCurrency
  }
}
