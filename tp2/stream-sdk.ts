// TP 2.3 — Le même flux avec le SDK : il fait le parsing SSE pour vous.
import { config, openai } from "../src/config.js";

const client = openai();
const t0 = performance.now();
let first: number | null = null;

const stream = await client.chat.completions.create({
  model: config.model,
  stream: true,
  stream_options: { include_usage: true },
  messages: [{ role: "user", content: "Explique le streaming HTTP en cinq phrases." }],
});

let usage;
for await (const chunk of stream) {
  if (chunk.usage) usage = chunk.usage;
  const texte = chunk.choices[0]?.delta.content;
  if (!texte) continue;
  first ??= performance.now() - t0;
  process.stdout.write(texte);
}
console.log();
if (usage) console.log(`usage ${usage.prompt_tokens} + ${usage.completion_tokens}`);
console.log(`TTFT ${Math.round(first ?? 0)} ms · total ${Math.round(performance.now() - t0)} ms`);
