import { tool } from "ai";
import { z } from "zod/v4";

export const myTool = tool({
  description: "Test tool",
  inputSchema: z.object({
    query: z.string(),
  }),
  execute: async ({ query }) => {
    const res = [{ id: 1, date: new Date() }];
    return JSON.parse(JSON.stringify(res));
  },
});
