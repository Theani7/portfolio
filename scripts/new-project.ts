import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query: string): Promise<string> => new Promise((resolve) => rl.question(query, resolve));

const slugify = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function main() {
    console.log('\n🚀 Welcome to the Project Generator!\n');

    const title = await question('Project Title: ');
    const id = await question(`Project ID [${slugify(title)}]: `) || slugify(title);
    const description = await question('Short Description: ');
    const tagsInput = await question('Tags (comma separated): ');
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const github = await question('GitHub Link (optional): ');
    const demo = await question('Live Demo Link (optional): ');
    const image = await question('Image Path (e.g. /projects/proj1.png): ');

    const date = new Date().toISOString().split('T')[0];

    const markdown = `---
id: "${id}"
title: "${title}"
description: "${description}"
image: "${image}"
tags: [${tags.map(t => `"${t}"`).join(', ')}]
github: "${github}"
demo: "${demo}"
date: "${date}"
---

## Overview

Write a detailed overview of **${title}** here.

## Technical Implementation

Discuss the architecture, models, and tools used.
`;

    const dir = path.join(process.cwd(), 'src/content/projects');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const filePath = path.join(dir, `${id}.md`);
    fs.writeFileSync(filePath, markdown);

    console.log(`\n✅ Success! Created new project at src/content/projects/${id}.md\n`);
    rl.close();
}

main().catch(console.error);
