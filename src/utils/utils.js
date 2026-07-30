export function getSiteBase() {
    const env = localStorage.getItem("api-env") || "prod";

    const map = {
        PROD: import.meta.env.VITE_SITE_URL_PROD,
        TEST: import.meta.env.VITE_SITE_URL_TEST,
    };

    return map[env] || import.meta.env.VITE_SITE_URL_PROD;
}

export function getImageUrl(path) {
    if (!path) return null;

    if (path.startsWith("blob:")) return path;
    if (path.startsWith("http")) return path;

    return `${getSiteBase()}${path}`;
}

export function getLocalizedValue(value, locale = "bg", fallback = "bg") {
    if (!value) return "";
    let parsed = value;

    if (typeof value === "string") {
        try {
            parsed = JSON.parse(value);
        } catch {
            return value;
        }
    }

    if (typeof parsed !== "object") {
        return parsed;
    }

    return (
        parsed[locale] ??
        parsed[fallback] ??
        Object.values(parsed)[0] ??
        ""
    );
}