import { useEffect } from "react";

const SITE_URL = "https://anilpaneru.com.np";

const upsertMeta = (attr, key, content) => {
    let el = document.head.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
    }
    el.setAttribute("content", content);
};

const upsertLink = (rel, href) => {
    let el = document.head.querySelector(`link[rel="${rel}"]`);
    if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
    }
    el.setAttribute("href", href);
};

// Updates the existing index.html head tags in place per route (no duplicates).
const Seo = ({ title, description, path = "/", image = "/og-image.png" }) => {
    useEffect(() => {
        const url = `${SITE_URL}${path}`;
        const img = image.startsWith("http") ? image : `${SITE_URL}${image}`;

        document.title = title;
        upsertMeta("name", "description", description);
        upsertLink("canonical", url);

        upsertMeta("property", "og:title", title);
        upsertMeta("property", "og:description", description);
        upsertMeta("property", "og:url", url);
        upsertMeta("property", "og:image", img);

        upsertMeta("name", "twitter:title", title);
        upsertMeta("name", "twitter:description", description);
        upsertMeta("name", "twitter:image", img);
    }, [title, description, path, image]);

    return null;
};

export default Seo;
