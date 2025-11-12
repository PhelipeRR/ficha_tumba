export type Rule = (value: unknown, data: Record<string, unknown>) => string | null
export type ValidationRules = Record<string, Rule[]>

export type ValidationResult = {
  valid: boolean
  errors: Record<string, string[]>
}

export const required = (message = "Campo obrigatório"): Rule => (value) => {
  if (value === null || value === undefined) return message
  if (typeof value === "string" && value.trim().length === 0) return message
  return null
}

export const email = (message = "E-mail inválido"): Rule => (value) => {
  if (typeof value !== "string") return message
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(value) ? null : message
}

export const minLength = (len: number, message?: string): Rule => (value) => {
  if (typeof value !== "string") return message || `Mínimo de ${len} caracteres`
  return value.trim().length >= len ? null : (message || `Mínimo de ${len} caracteres`)
}

export const equalsField = (field: string, message = "Campos não coincidem"): Rule => (value, data) => {
  return value === data[field] ? null : message
}

export function validate(rules: ValidationRules, data: Record<string, unknown>): ValidationResult {
  const errors: Record<string, string[]> = {}
  for (const [key, keyRules] of Object.entries(rules)) {
    const value = data[key]
    for (const rule of keyRules) {
      const err = rule(value, data)
      if (err) {
        if (!errors[key]) errors[key] = []
        errors[key].push(err)
      }
    }
  }
  return { valid: Object.keys(errors).length === 0, errors }
}