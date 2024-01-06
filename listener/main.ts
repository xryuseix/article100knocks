import {
  StandardWebSocketClient,
  WebSocketClient,
} from "https://deno.land/x/websocket@v0.1.4/mod.ts";
import { serve } from "https://deno.land/std@0.178.0/http/server.ts";
import { isValidUrl } from "./utils.ts";

const DISCORD_TOKEN = Deno.env.get("DISCORD_TOKEN");
const CHANNEL_ID = Deno.env.get("CHANNEL_ID");
const WORKER_TOKEN = Deno.env.get("WORKER_TOKEN");
const WORKER_URI = "https://article100knocks.xryuseix.workers.dev"
const endpoint = "wss://gateway.discord.gg/?v=6&encoding=json";

const ws: WebSocketClient = new StandardWebSocketClient(endpoint);
ws.on("open", () => {
  open();
});

ws.on("message", (event: MessageEvent<string>) => {
  message(event.data);
});

ws.on("close", () => {
  console.log("Client disconnected");
});

serve(() => {
  return new Response("It works!");
});

function open() {
  let payload = {
    op: 2,
    d: {
      token: DISCORD_TOKEN,
      properties: {},
    },
  };

  ws.send(JSON.stringify(payload));
}

function message(data: string) {
  let message = JSON.parse(data);
  console.log("message ->", message);

  if (message.t === null && message.op === 10) {
    heartbeat(message.d.heartbeat_interval);
  }

  if (message.t !== "MESSAGE_CREATE") {
    return;
  }

  if (message.d.author.bot) {
    return;
  }

  if (message.d.channel_id !== CHANNEL_ID) {
    return;
  }

  const url = message.d.content;
  if (isValidUrl(url)) {
    fetch(`${WORKER_URI}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: WORKER_TOKEN,
      },
      body: JSON.stringify({ url }),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
      });
  }
}

function heartbeat(interval: number) {
  setInterval(() => {
    const payload = {
      op: 1,
      d: null,
    };
    ws.send(JSON.stringify(payload));
  }, interval);
}

Deno.cron("Wake Up", "*/10 * * * *", () => {
  fetch("https://article100knocks.deno.dev")
});