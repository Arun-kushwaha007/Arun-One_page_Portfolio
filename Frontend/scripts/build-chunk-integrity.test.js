/* eslint-env node */
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');
const indexHtmlPath = path.join(distDir, 'index.html');

async function getChunkImports() {
  const indexHtml = await readFile(indexHtmlPath, 'utf8');
  const hrefs = [...indexHtml.matchAll(/href="\/assets\/([^"]+\.js)"/g)].map((match) => match[1]);
  const assetNames = [...new Set(hrefs)];
  const chunks = {};

  for (const assetName of assetNames) {
    const contents = await readFile(path.join(distDir, 'assets', assetName), 'utf8');
    chunks[assetName] = contents;
  }

  return chunks;
}

async function main() {
  const chunks = await getChunkImports();
  const assetNames = Object.keys(chunks).filter((name) => name.startsWith('vendor-'));

  for (const assetName of assetNames) {
    for (const otherAssetName of assetNames) {
      if (assetName === otherAssetName) {
        continue;
      }

      const importsOther = chunks[assetName].includes(`./${otherAssetName}`);
      const otherImportsAsset = chunks[otherAssetName].includes(`./${assetName}`);

      assert.equal(
        importsOther && otherImportsAsset,
        false,
        `Detected circular vendor chunk imports between ${assetName} and ${otherAssetName}`,
      );
    }
  }

  console.log('Build chunk integrity check passed.');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  // eslint-disable-next-line no-undef
  process.exitCode = 1;
});
