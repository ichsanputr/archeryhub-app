import { ref, reactive } from 'vue'

export const useFormValidation = () => {
    const errors = reactive({})

    const validate = (field, value, rules = []) => {
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

    const validateForm = (form, ruleMap) => {
        let isValid = true
        Object.keys(ruleMap).forEach(field => {
            const fieldValid = validate(field, form[field], ruleMap[field])
            if (!fieldValid) isValid = false
        })
        return isValid
    }

    const clearErrors = () => {
        Object.keys(errors).forEach(key => {
            errors[key] = null
        })
    }

    // Common Rules
    const required = (msg = 'Wajib diisi') => (v) => !!v || msg
    const email = (msg = 'Email tidak valid') => (v) => !v || /.+@.+\..+/.test(v) || msg
    const minLength = (len, msg) => (v) => !v || v.length >= len || (msg || `Minimal ${len} karakter`)
    const sameAs = (otherValue, msg) => (v) => v === otherValue || msg

    return {
        errors,
        validate,
        validateForm,
        clearErrors,
        rules: {
            required,
            email,
            minLength,
            sameAs
        }
    }
}
