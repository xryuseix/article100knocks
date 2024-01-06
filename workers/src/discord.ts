// from https://github.com/lacolaco/discord-rotom-bot/blob/main/src/discord/interactions.ts

import { MiddlewareHandler } from "hono";
import { HonoAppContext } from "./bindings";
import { verifyKey } from "discord-interactions";
import {
  APIInteraction,
  APIInteractionResponse,
  InteractionType,
  InteractionResponseType,
} from "discord-api-types/v10";

export const verifyKeyMiddleware =
  (): MiddlewareHandler<HonoAppContext> => async (c, next) => {
    const signature = c.req.header("X-Signature-Ed25519");
    const timestamp = c.req.header("X-Signature-Timestamp");
    const body = await c.req.raw.clone().text();
    const isValidRequest =
      signature &&
      timestamp &&
      verifyKey(body, signature, timestamp, c.env.DISCORD_PUBLIC_KEY);
    if (!isValidRequest) {
      console.log("Invalid request signature");
      return c.text("Bad request signature", 401);
    }
    return await next();
  };

export async function handleInteractionRequest(
  interaction: APIInteraction
): Promise<APIInteractionResponse | null> {
  console.log(
    `handleInteractionRequest: ${interaction.type} ${interaction.id}`
  );
  switch (interaction.type) {
    case InteractionType.Ping:
      return { type: InteractionResponseType.Pong };
  }
  throw new Error("Unknown interaction");
}