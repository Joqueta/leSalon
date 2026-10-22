// TP 1.3 — Le SDK officiel d'OpenAI : même requête, typée, avec retries et timeouts.
import { config, openai } from "../src/config.js";

const client = openai();

const completion = await client.chat.completions.create({
  model: config.model,
  temperature: 0.2,
  max_tokens: 200,
  messages: [
    { role: "system", content: "Tu réponds en français dans un style chipie en mode pote et complimenter de fou la personne" },
    { role: "user", content: "Pourquoi je suis la meilleur dev?" },
  ],
});

console.log(completion.choices[0].message.content);
console.log(`\nModèle : ${completion.model}`);
console.log(`Usage : ${JSON.stringify(completion.usage)}`);

// À observer : changez OPENAI_BASE_URL (faux serveur, autre fournisseur compatible) : le code ne bouge pas.
// C'est ça, un standard de fait.
