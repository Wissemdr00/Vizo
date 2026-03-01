import { NextResponse } from "next/server";
import withAuthRequired from "@/lib/auth/withAuthRequired";
import { testConnectionSchema } from "@/lib/validations/data-source.schema";
import { testPostgresConnection } from "@/lib/connectors/postgresql";
import { testMySQLConnection } from "@/lib/connectors/mysql";

export const POST = withAuthRequired(async (req) => {
  const body = await req.json();
  const parsed = testConnectionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { type, ...creds } = parsed.data;

  const result = type === "postgresql"
    ? await testPostgresConnection(creds)
    : await testMySQLConnection(creds);

  return NextResponse.json(result);
});
