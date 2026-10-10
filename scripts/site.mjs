// Builds the static demo for GitHub Pages into ./site: the table's page and the API reference, each put together
// from the family's shared header and footer (scripts/family-template.mjs, which every package shares unchanged)
// and this package's own body, the two stylesheets, and the compiled library.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

import { apiBody } from "./api.mjs";
import { FAMILY_SCRIPT, FAMILY_EMBED_BUILDER_WORDS, familyEmbedBuilder, familyFooter, familyHead, familyHeader, familyUnreviewed } from "./family-template.mjs";

const id = "hitotsu";
const icon = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect x='14' y='6' width='72' height='88' rx='12' fill='%23b5452c' stroke='%23fffdf8' stroke-width='6'/%3E%3Cpath d='M36 54 H64' stroke='%23fffdf8' stroke-width='9' stroke-linecap='round'/%3E%3C/svg%3E`;
const frame = ({ title, description, links, body, scripts }) => `<!doctype html>
<html lang="en">
  <head>
    ${familyHead({ id, title, description, ogTitle: "Hitotsu 一つ: the colour-card game", ogDescription: "Match the colour or the number, and call Hitotsu! with one card left. Play against computers." })}
    <link rel="icon" href="${icon}" />
    <link rel="stylesheet" href="family.css" />
    <link rel="stylesheet" href="hitotsu.css" />
  </head>
  <body>
    <main>
      ${familyHeader({ id, links })}
${body}
      ${familyFooter({ id })}
    </main>
    <script>${FAMILY_SCRIPT}</script>
    ${scripts}
  </body>
</html>
`;

rmSync("site", { recursive: true, force: true });
mkdirSync("site", { recursive: true });
for (const file of ["family.css", "hitotsu.css", "page.js"]) cpSync(`demo/${file}`, `site/${file}`);
cpSync("dist", "site/dist", { recursive: true });

writeFileSync(
  "site/index.html",
  frame({
    title: "Hitotsu · the colour-card game, against computers",
    description: "Play Hitotsu against one to seven computers: match the colour or the number, and call Hitotsu! with one card left. Classic rules or party mode, in English and Japanese. Free and open source.",
    links: [{ href: "api.html", say: "pageApi" }, { href: "builder.html", say: "pageBuilder" }],
    body: readFileSync("demo/body.html", "utf8").replace("__UNREVIEWED__", familyUnreviewed({ id })).trimEnd(),
    scripts: `<script type="module" src="page.js"></script>`,
  }),
);

const api = apiBody();
writeFileSync(
  "site/api.html",
  frame({
    title: "Hitotsu API reference: every export, with its signature",
    description: "The API reference of the Hitotsu package: every export of every entry point, with its signature and its documentation, made from the source.",
    links: [{ href: "./", say: "pageBack" }],
    body: `      ${api.html}\n      ${familyUnreviewed({ id })}`,
    scripts: `<script type="module">
      const words = (pitch, back, name, nameLink, foot) => ({ pitch, pageBack: back, name, nameLink, foot });
      familyLanguage({
        id: "hitotsu",
        words: {
          en: words("Every export of every entry point, with its signature and its doc comment. Made from the source when the site is built, so it cannot fall behind the code.", "The table", "Hitotsu is Japanese for “one”: the call you make with one card left.", "About the name", "Open source under the MIT licence."),
          ja: words("すべてのエントリポイントのすべてのエクスポートを、シグネチャとドキュメントコメントつきで載せています。サイトをビルドするときにソースから作るので、コードとずれません。", "テーブル", "「ヒトツ」は「一つ」。手札が1枚になったときに言う言葉です。", "名前について（英語）", "MITライセンスのオープンソースです。"),
        },
      });
    </script>`,
  }),
);
console.log(`site/ is ready (${api.total} exports in api.html): serve it, or let the Pages workflow publish it.`);

writeFileSync("site/family-embed-builder.js", `export const FAMILY_EMBED_BUILDER_WORDS = ${JSON.stringify(FAMILY_EMBED_BUILDER_WORDS)};\nexport ${familyEmbedBuilder.toString()};\n`);
const builderParts = { builderHead: familyHead({ id, title: "Hitotsu · build a table embed", description: "Choose rules and a seed, preview a colour-card table and copy the embed code." }), builderHeader: familyHeader({ id, links: [{ href: "./", say: "toGallery" }] }), unreviewed: familyUnreviewed({ id }), footer: familyFooter({ id }), script: `<script>${FAMILY_SCRIPT}</script>` };
writeFileSync("site/builder.html", readFileSync("demo/builder.html", "utf8").replace(/<!-- family:([A-Za-z]+) -->/g, (_match, key) => builderParts[key]));
cpSync("demo/embed", "site/embed", { recursive: true });
for (const file of ["builder.js", "builder.css"]) cpSync(`demo/${file}`, `site/${file}`);
