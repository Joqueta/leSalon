// TP 1.0 — Quels modèles votre clé peut-elle appeler ?
// La liste dépend du projet et de l'organisation qui portent la clé : ne la supposez jamais.
//   npm run models            → tous les modèles visibles
//   npm run models -- gpt     → seulement ceux dont l'identifiant contient « gpt »
import { config, requireKey } from "../src/config.js";

type Model = { id: string; created: number; owned_by: string };
const filtre = process.argv[2] ?? "";

// TODO : Appeler GET ${config.baseURL}/models avec l'en-tête Authorization, lever une erreur si la réponse n'est pas OK, puis afficher les identifiants (filtrés si un argument est donné), triés par ordre alphabétique.
const key = requireKey();
const res = await fetch(`${config.baseURL}/models`, {
    headers: { Authorization: `Bearer ${key}` },
});

if (!res.ok) {
    throw new Error(`Erreur ${res.status} : ${await res.text()}`);
}

const { data } = (await res.json()) as { data: Model[] };

const ids = data
    .map((m) => m.id)
    .filter((id) => id.includes(filtre))
    .sort((a, b) => a.localeCompare(b));

console.log(ids.join("\n"));
console.log(`\n${ids.length} modèle(s) visible(s)${filtre ? ` pour « ${filtre} »` : ""}`);
console.log(`Modèle configuré dans .env : ${config.model} · temps réel : ${config.realtimeModel}`);
