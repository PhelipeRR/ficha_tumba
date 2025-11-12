import { NextResponse } from "next/server"
import { withValidation } from "../../../lib/withValidation"
import { required, email, minLength } from "../../../lib/validation"

const rules = {
  email: [required(), email()],
  password: [required(), minLength(6)],
}

export const POST = withValidation(rules, async (_req, data) => {
  return NextResponse.json({ ok: true, message: "Login recebido", email: data.email })
})