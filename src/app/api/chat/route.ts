import { streamText } from "ai";
import { aiModel, systemPrompt } from "@/lib/ai/config";
import { aiTools } from "@/lib/ai/tools";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const session = await auth();

  const userId = (session?.user)?.id;

  const result = streamText({
    model: aiModel,
    system: `${systemPrompt} \n\n Current User Context: \n- User ID: ${userId || "Guest"} \n- Authenticated: ${!!userId}`,
    messages: messages,
    tools: aiTools,
  });

  return result.toTextStreamResponse();
}
