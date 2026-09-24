import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputDir = path.resolve(__dirname, '../docs-diagrams');
const outputDir = path.resolve(__dirname, '../public/docs');
const configFile = path.resolve(inputDir, 'mermaid.json');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.mmd'));

console.log(`Found ${files.length} diagram files in ${inputDir}...`);

for (const file of files) {
  const baseName = path.basename(file, '.mmd');
  const inputFile = path.join(inputDir, file);
  const outputFile = path.join(outputDir, `diagram-${baseName}.svg`);

  console.log(`Generating: ${file} -> diagram-${baseName}.svg`);
  try {
    const configParam = fs.existsSync(configFile) ? `-c "${configFile}"` : '';
    const cmd = `mmdc -i "${inputFile}" -o "${outputFile}" ${configParam} -b transparent`;
    execSync(cmd, { stdio: 'inherit' });
    console.log(`✓ Successfully created ${outputFile}`);
  } catch (err) {
    console.error(`✗ Error generating ${file}:`, err.message);
  }
}

console.log('All diagrams generated successfully!');
