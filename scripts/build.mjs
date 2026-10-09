import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = join(root, "dist");
await build();

const html = await readFile(join(output, "index.html"), "utf8");
const entryAssets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((asset) => asset.startsWith("./assets/") && (asset.endsWith(".js") || asset.endsWith(".css")));
if (!entryAssets.some((asset) => asset.endsWith(".js")) || !entryAssets.some((asset) => asset.endsWith(".css"))) {
  throw new Error("The production HTML is missing its JavaScript or CSS entry asset.");
}

const workerPath = join(output, "sw.js");
const worker = await readFile(workerPath, "utf8");
const placeholder = "const PRECACHE_ASSETS = null;";
if (!worker.includes(placeholder)) {
  throw new Error("Could not locate the service-worker asset list placeholder.");
}
await writeFile(workerPath, worker.replace(placeholder, "const PRECACHE_ASSETS = " + JSON.stringify(entryAssets) + ";"));
