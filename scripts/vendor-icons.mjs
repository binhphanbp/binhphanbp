import { mkdir, writeFile } from 'node:fs/promises';
const out = new URL('../assets/icons/', import.meta.url);
await mkdir(out, { recursive: true });
const revision = '54cfe13ac10eaa1ef817a343ab0a9437eb3c2e08'; // Devicon v2.17.0
const icons = ['typescript','javascript','react','nextjs','tailwindcss','nodejs','nestjs','express','prisma','postman','postgresql','supabase','mongodb','mysql','firebase','docker','git','githubactions','jest','figma'];
const results = await Promise.allSettled(icons.map(async name => {
  const variant = name === 'jest' ? 'plain' : 'original';
  const url = `https://raw.githubusercontent.com/devicons/devicon/${revision}/icons/${name}/${name}-${variant}.svg`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
  const svg = await response.text();
  if (!svg.includes('<svg')) throw new Error(`${name}: invalid SVG`);
  await writeFile(new URL(`${name}.svg`, out), svg);
  return name;
}));
for (const result of results) {
  if (result.status === 'rejected') { console.error(result.reason); process.exitCode = 1; }
}
const license = await fetch(`https://raw.githubusercontent.com/devicons/devicon/${revision}/LICENSE`);
if (!license.ok) throw new Error('Cannot fetch Devicon license');
await writeFile(new URL('LICENSE', out), await license.text());
console.log(`Vendored ${results.filter(r=>r.status==='fulfilled').length} Devicon logos.`);
