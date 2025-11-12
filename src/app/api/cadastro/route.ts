import { NextResponse } from "next/server"
import { withValidation } from "../../../lib/withValidation"
import { required, email, minLength, equalsField } from "../../../lib/validation"

const rules = {
  name: [required(), minLength(2)],
  email: [required(), email()],
  password: [required(), minLength(6)],
  confirm: [required(), equalsField("password")],
}

export const POST = withValidation(rules, async (_req, data) => {
  return NextResponse.json({ ok: true, message: "Cadastro recebido", email: data.email })
})