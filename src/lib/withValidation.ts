import { NextRequest, NextResponse } from "next/server"
import { validate, ValidationRules } from "./validation"

export function withValidation(
  rules: ValidationRules,
  handler: (req: NextRequest, data: Record<string, unknown>) => Promise<Response> | Response
) {
  return async (req: NextRequest) => {
    let data: Record<string, unknown> = {}
    try {
      data = await req.json()
    } catch {
      return NextResponse.json({ errors: { body: ["JSON inválido"] } }, { status: 400 })
    }

    const result = validate(rules, data)
    if (!result.valid) {
      return NextResponse.json({ errors: result.errors }, { status: 400 })
    }

    return handler(req, data)
  }
}