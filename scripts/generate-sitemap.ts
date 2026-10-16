import fs from 'fs';
import path from 'path';
import fm from 'front-matter';

const SITE_URL = 'https://anilpaneru.com.np';
const ROOT_DIR = process.cwd();
const PROJECTS_DIR = path.join(ROOT_DIR, 'src/content/projects');
const OUTPUT_SITEMAP = path.join(ROOT_DIR, 'public/sitemap.xml');

const slugify = (value: string) =>
    String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

interface ProjectAttributes {
    id: number | string;
    title: string;
    date?: string;
}

const getTodayDate = () => new Date().toISOString().split('T')[0];

function generateSitemap() {
    const today = getTodayDate();
    const staticPages = [
        { path: '/', priority: '1.0', changefreq: 'weekly' },
        { path: '/projects', priority: '0.9', changefreq: 'weekly' },
        { path: '/setup', priority: '0.7', changefreq: 'monthly' },
        { path: '/resume', priority: '0.6', changefreq: 'monthly' },
    ];

    const projectList: Array<{ id: number; loc: string; lastmod: string; priority: string; changefreq: string }> = [];

    if (fs.existsSync(PROJECTS_DIR)) {
        const files = fs.readdirSync(PROJECTS_DIR).filter(file => file.endsWith('.md'));

        files.forEach((file) => {
            const filePath = path.join(PROJECTS_DIR, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const parsed = fm<ProjectAttributes>(content);
            const { id, title, date } = parsed.attributes;

            if (title) {
                const numId = Number(id) || 0;
                const slug = `${id}-${slugify(title)}`;
                projectList.push({
                    id: numId,
                    loc: `${SITE_URL}/projects/${slug}`,
                    lastmod: date || today,
                    priority: '0.8',
                    changefreq: 'monthly',
                });
            }
        });
    }

    projectList.sort((a, b) => a.id - b.id);

    const xmlLines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...staticPages.map(page => `  <url>
    <loc>${page.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${page.path}`}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`),
        ...projectList.map(project => `  <url>
    <loc>${project.loc}</loc>
    <lastmod>${project.lastmod}</lastmod>
    <changefreq>${project.changefreq}</changefreq>
    <priority>${project.priority}</priority>
  </url>`),
        '</urlset>',
        '',
    ];

    fs.writeFileSync(OUTPUT_SITEMAP, xmlLines.join('\n'));
    console.log(`✅ Generated sitemap with ${staticPages.length + projectList.length} URLs at ${OUTPUT_SITEMAP}`);
}

generateSitemap();
