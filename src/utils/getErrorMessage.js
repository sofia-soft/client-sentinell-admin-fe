import { bg } from "../i18n/bg";
import { en } from "../i18n/en";

const messages = {
    bg,
    en,
};

export function getErrorMessage(code, lang = "bg") {
    return messages[lang]?.[code] || "Нещо се обърка";
}