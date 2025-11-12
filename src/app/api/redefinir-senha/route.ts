import { NextResponse } from "next/server"
import { withValidation } from "../../../lib/withValidation"
import { required, email } from "../../../lib/validation"

const rules = {
  email: [required(), email()],
}

export const POST = withValidation(rules, async (_req, data) => {
  return NextResponse.json({ ok: true, message: "Solicitação de redefinição recebida", email: data.email })
})