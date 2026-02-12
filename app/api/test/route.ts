export async function GET() {
  const hasKey = !!process.env.AI_GATEWAY_API_KEY
  const keyPrefix = process.env.AI_GATEWAY_API_KEY?.slice(0, 8) ?? "not set"

  return Response.json({
    hasKey,
    keyPrefix,
    nodeEnv: process.env.NODE_ENV,
  })
}
