import { useEffect } from "react";

const SITE_URL = "https://anilpaneru.com.np";
const DEFAULT_IMAGE = `${SITE_URL}/opengraph-image.png`;
const DEFAULT_ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

interface SeoProps {
    title: string;
    description: string;
    path?: string;
    image?: string;
    robots?: string;
    jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const upsertMeta = (attr: string, key: string, content: string) => {
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute("content", content);
};

const upsertLink = (rel: string, href: string) => {
    let el = document.head.querySelector(`link[rel="${rel}"]`);
    if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
    }
    el.setAttribute("href", href);
};

const removeLink = (rel: string) => {
    const el = document.head.querySelector(`link[rel="${rel}"]`);
    if (el) el.remove();
};

const Seo = ({
    title,
    description,
    path = "/",
    image,
    robots = DEFAULT_ROBOTS,
    jsonLd,
}: SeoProps) => {
    useEffect(() => {
        const url = `${SITE_URL}${path}`;
        const absoluteImage = image
            ? (image.startsWith("http") ? image : `${SITE_URL}${image.startsWith("/") ? "" : "/"}${image}`)
            : DEFAULT_IMAGE;

        document.title = title;
        upsertMeta("name", "description", description);
        upsertMeta("name", "robots", robots);

        if (robots.includes("noindex")) {
            removeLink("canonical");
        } else {
            upsertLink("canonical", url);
        }

        // Open Graph
        upsertMeta("property", "og:title", title);
        upsertMeta("property", "og:description", description);
        upsertMeta("property", "og:url", url);
        upsertMeta("property", "og:image", absoluteImage);

        // Twitter
        upsertMeta("name", "twitter:title", title);
        upsertMeta("name", "twitter:description", description);
        upsertMeta("name", "twitter:image", absoluteImage);

        // Route-specific JSON-LD
        let scriptEl = document.getElementById("route-jsonld") as HTMLScriptElement | null;
        if (jsonLd) {
            if (!scriptEl) {
                scriptEl = document.createElement("script");
                scriptEl.id = "route-jsonld";
                scriptEl.type = "application/ld+json";
                document.head.appendChild(scriptEl);
            }
            scriptEl.textContent = JSON.stringify(jsonLd);
        } else if (scriptEl) {
            scriptEl.remove();
        }

        return () => {
            const cleanupScript = document.getElementById("route-jsonld");
            if (cleanupScript) cleanupScript.remove();
        };
    }, [title, description, path, image, robots, jsonLd]);

    return null;
};

export default Seo;
