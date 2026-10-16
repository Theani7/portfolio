import fs from 'fs';
import path from 'path';
import fm from 'front-matter';

const SITE_URL = 'https://anilpaneru.com.np';
const ROOT_DIR = process.cwd();
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const TEMPLATE_PATH = path.join(DIST_DIR, 'index.html');
const PROJECTS_DIR = path.join(ROOT_DIR, 'src/content/projects');

const slugify = (value: string) =>
    String(value || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

interface ProjectAttributes {
    id: number | string;
    title: string;
    description: string;
    image?: string;
    tags?: string[];
    github?: string;
}

interface RouteMeta {
    route: string;
    title: string;
    description: string;
    image?: string;
    jsonLd?: Record<string, unknown>;
}

function buildHtml(template: string, meta: RouteMeta): string {
    const canonical = `${SITE_URL}${meta.route}`;
    const image = meta.image
        ? (meta.image.startsWith('http') ? meta.image : `${SITE_URL}${meta.image.startsWith('/') ? '' : '/'}${meta.image}`)
        : `${SITE_URL}/opengraph-image.png`;

    let html = template;

    // Replace Title
    html = html.replace(/<title>.*?<\/title>/, `<title>${meta.title}</title>`);

    // Replace Meta Description
    html = html.replace(/<meta name="description"[\s\S]*?\/>/, `<meta name="description"\n    content="${meta.description}" />`);

    // Replace Canonical
    html = html.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${canonical}" />`);

    // Replace OG Title / Desc / URL / Image
    html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${meta.title}" />`);
    html = html.replace(/<meta property="og:description"[\s\S]*?\/>/, `<meta property="og:description"\n    content="${meta.description}" />`);
    html = html.replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${canonical}" />`);
    html = html.replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${image}" />`);

    // Replace Twitter Title / Desc / Image
    html = html.replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${meta.title}" />`);
    html = html.replace(/<meta name="twitter:description"[\s\S]*?\/>/, `<meta name="twitter:description"\n    content="${meta.description}" />`);
    html = html.replace(/<meta name="twitter:image" content=".*?" \/>/, `<meta name="twitter:image" content="${image}" />`);

    // Inject Route JSON-LD if provided
    if (meta.jsonLd) {
        const scriptTag = `  <script id="route-jsonld" type="application/ld+json">\n  ${JSON.stringify(meta.jsonLd, null, 2)}\n  </script>\n</head>`;
        html = html.replace('</head>', scriptTag);
    }

    return html;
}

function prerender() {
    if (!fs.existsSync(TEMPLATE_PATH)) {
        console.error('dist/index.html not found. Run vite build first.');
        return;
    }

    const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');

    const routes: RouteMeta[] = [
        {
            route: '/projects',
            title: 'Projects — Anil Paneru',
            description: 'Selected AI and machine learning projects by Anil Paneru, including the IntelliML platform, SafeVision, and Intrusion Detection System.',
            jsonLd: {
                "@context": "https://schema.org",
                "@graph": [
                    {
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://anilpaneru.com.np/" },
                            { "@type": "ListItem", "position": 2, "name": "Projects", "item": "https://anilpaneru.com.np/projects" }
                        ]
                    },
                    {
                        "@type": "CollectionPage",
                        "name": "Machine Learning & AI Projects",
                        "url": "https://anilpaneru.com.np/projects",
                        "description": "Selected AI and machine learning projects by Anil Paneru."
                    }
                ]
            }
        },
        {
            route: '/setup',
            title: 'My Setup | Anil Paneru',
            description: 'A detailed overview of my development environment, terminal configuration, and CLI tools.',
            jsonLd: {
                "@context": "https://schema.org",
                "@graph": [
                    {
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://anilpaneru.com.np/" },
                            { "@type": "ListItem", "position": 2, "name": "Setup", "item": "https://anilpaneru.com.np/setup" }
                        ]
                    },
                    {
                        "@type": "WebPage",
                        "name": "My Setup — Anil Paneru",
                        "url": "https://anilpaneru.com.np/setup",
                        "description": "A detailed overview of my development environment, terminal configuration, and CLI tools."
                    }
                ]
            }
        },
        {
            route: '/resume',
            title: 'Resume — Anil Paneru',
            description: 'Resume of Anil Paneru, AI Engineer and LLM Developer.',
            jsonLd: {
                "@context": "https://schema.org",
                "@graph": [
                    {
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://anilpaneru.com.np/" },
                            { "@type": "ListItem", "position": 2, "name": "Resume", "item": "https://anilpaneru.com.np/resume" }
                        ]
                    }
                ]
            }
        }
    ];

    // Load individual project markdown files
    if (fs.existsSync(PROJECTS_DIR)) {
        const files = fs.readdirSync(PROJECTS_DIR).filter(file => file.endsWith('.md'));

        files.forEach(file => {
            const filePath = path.join(PROJECTS_DIR, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            const parsed = fm<ProjectAttributes>(content);
            const { id, title, description, image, tags, github } = parsed.attributes;

            if (title) {
                const slug = `${id}-${slugify(title)}`;
                const route = `/projects/${slug}`;
                const projectUrl = `${SITE_URL}${route}`;

                routes.push({
                    route,
                    title: `${title} — Anil Paneru`,
                    description: description || `${title}, an AI project by Anil Paneru.`,
                    image,
                    jsonLd: {
                        "@context": "https://schema.org",
                        "@graph": [
                            {
                                "@type": "BreadcrumbList",
                                "itemListElement": [
                                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://anilpaneru.com.np/" },
                                    { "@type": "ListItem", "position": 2, "name": "Projects", "item": "https://anilpaneru.com.np/projects" },
                                    { "@type": "ListItem", "position": 3, "name": title, "item": projectUrl }
                                ]
                            },
                            {
                                "@type": "SoftwareSourceCode",
                                "name": title,
                                "description": description,
                                "url": projectUrl,
                                ...(github ? { "codeRepository": github } : {}),
                                ...(tags?.length ? { "programmingLanguage": tags } : {}),
                                "author": {
                                    "@type": "Person",
                                    "name": "Anil Paneru",
                                    "url": "https://anilpaneru.com.np/"
                                }
                            }
                        ]
                    }
                });
            }
        });
    }

    routes.forEach(meta => {
        const routeDir = path.join(DIST_DIR, meta.route);
        if (!fs.existsSync(routeDir)) {
            fs.mkdirSync(routeDir, { recursive: true });
        }
        const filePath = path.join(routeDir, 'index.html');
        const content = buildHtml(template, meta);
        fs.writeFileSync(filePath, content);
    });

    console.log(`✅ Prerendered ${routes.length} static route HTML files in dist/`);
}

prerender();
