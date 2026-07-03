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