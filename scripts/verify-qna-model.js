import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MODEL_DIR = path.join(__dirname, "..", "public", "qna_model");
const MODEL_JSON_PATH = path.join(MODEL_DIR, "model.json");

const fail = (message) => {
  console.error(`QnA model verification failed: ${message}`);
  process.exit(1);
};

if (!fs.existsSync(MODEL_JSON_PATH)) {
  fail("Missing public/qna_model/model.json. Run `npm run download-qna-model`.");
}

let modelJson;
try {
  modelJson = JSON.parse(fs.readFileSync(MODEL_JSON_PATH, "utf8"));
} catch {
  fail("model.json is not valid JSON.");
}

const paths = (modelJson.weightsManifest || [])
  .flatMap((manifest) => manifest.paths || [])
  .map((weightPath) => path.basename(weightPath));

if (!paths.length) {
  fail("No weight shard paths found in model.json.");
}

const missing = paths.filter(
  (weightFile) => !fs.existsSync(path.join(MODEL_DIR, weightFile)),
);

if (missing.length) {
  const preview = missing.slice(0, 5).join(", ");
  fail(
    `Missing ${missing.length} shard file(s): ${preview}${missing.length > 5 ? ", ..." : ""}. Run \`npm run download-qna-model\`.`,
  );
}

console.log(`QnA model verification passed (${paths.length} shard files found).`);
