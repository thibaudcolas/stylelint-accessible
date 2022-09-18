"use strict";

const fs = require("fs");
const path = require("path");

const rules = require('../lib/index');
const pkg = require("../package.json");


const INDEX_PATH = path.join(__dirname, "README.md");
const README_PATH = path.join(__dirname, "..", "README.md");
const GENERATED_MARKER = "<!-- Auto-generated with `npm run build:docs` -->";
const README = fs.readFileSync(README_PATH, "utf-8").split(GENERATED_MARKER)[0];
const INDEX = fs.readFileSync(INDEX_PATH, "utf-8").split(GENERATED_MARKER)[0];

const rulesList = rules.map(r => `- ${r.ruleName}`).join('\n');

const indexContent = `${INDEX}${GENERATED_MARKER}

# Documentation

Rules documentation inside this folder is auto-generated with the \`npm run build:docs\` command.

## Rules

${rulesList}
`;

fs.writeFileSync(INDEX_PATH, indexContent);
