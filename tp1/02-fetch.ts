// TP 1.2 — Le même appel avec fetch, sans SDK : tout ce qu'un SDK fait pour vous.
import { config, requireKey } from "../src/config.js";

const question = process.argv.slice(2).join(" ") || "Pourquoi je suis la meilleur dev?";

const t0 = performance.now();
const res: Response = await fetch(`${config.baseURL}/chat/completions`, {
  method: "POST",
  headers: { Authorization: `Bearer ${requireKey()}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    model: config.model,
    temperature: 0.2,
    max_tokens: 200,
    messages: [
      { role: "system", content: "Tu réponds en français dans un style chipie en mode pote et complimenter de fou la personne" },
      { role: "user", content: question },
    ],
  }),
});

if (!res.ok) {
  console.error(`Erreur HTTP ${res.status} : ${await res.text()}`);
  process.exit(1);
}

const data = (await res.json()) as {
  model: string;
  choices: { message: { content: string }; finish_reason: string }[];
  usage: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
};
const ms = Math.round(performance.now() - t0);

console.log(data.choices[0].message.content);
console.log(`\nModèle exact : ${data.model}`);
console.log(`Raison d'arrêt : ${data.choices[0].finish_reason}`);
console.log(`Tokens : ${data.usage.prompt_tokens} entrée + ${data.usage.completion_tokens} sortie = ${data.usage.total_tokens}`);
console.log(`Latence : ${ms} ms`);
console.log(`Requêtes restantes : ${res.headers.get("x-ratelimit-remaining-requests") ?? "n/a"}`);
