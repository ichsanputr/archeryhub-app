import { reactive } from 'vue'

type Rule = (value: unknown) => true | string
type RuleMap = Record<string, Rule[]>

export const useFormValidation = () => {
  const errors = reactive<Record<string, string | null>>({})

  const validate = (field: string, value: unknown, rules: Rule[] = []): boolean => {
    errors[field] = null
    for (const rule of rules) {
      const result = rule(value)
      if (result !== true) {
        errors[field] = result
        return false
      }
    }
    return true
  }

  const validateForm = (form: Record<string, unknown>, ruleMap: RuleMap): boolean => {
    let isValid = true
    for (const field of Object.keys(ruleMap)) {
      const fieldValid = validate(field, form[field], ruleMap[field])
      if (!fieldValid) isValid = false
    }
    return isValid
  }

  const clearErrors = () => {
    for (const key of Object.keys(errors)) {
      errors[key] = null
    }
  }

  const required = (msg = 'Wajib diisi'): Rule => (v) => !!v || msg
  const email = (msg = 'Email tidak valid'): Rule => (v) => !v || /.+@.+\..+/.test(String(v)) || msg
  const minLength = (len: number, msg?: string): Rule =>
    (v) => !v || String(v).length >= len || (msg ?? `Minimal ${len} karakter`)
  const sameAs = (otherValue: unknown, msg: string): Rule => (v) => v === otherValue || msg
  const phone = (msg = 'Nomor HP minimal 8 digit'): Rule =>
    (v) => !v || /^\d{8,}$/.test(String(v).replace(/\D/g, '')) || msg

  const pattern = (regex: RegExp, msg: string): Rule => (v) => !v || regex.test(String(v)) || msg

  return {
    errors,
    validate,
    validateForm,
    clearErrors,
    rules: {
      required,
      email,
      minLength,
      sameAs,
      phone,
      pattern
    }
  }
}
