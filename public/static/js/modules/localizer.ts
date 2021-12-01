import { russian, english } from "../constatns";

/**
 * Класс для изменения языка
 */
export default class Localizer {
    #userLang: string;
    #dictionary: Map<string, string>;

    constructor() {
        this.#dictionary = new Map();
        this.#userLang = navigator.language.slice(0,2);
        this.#fillDictionary();
    }

    set userLang(lang: string) {
        this.#userLang = lang;
        this.#fillDictionary();
    }

    #fillDictionary() {
        switch (this.#userLang) {
            case 'ru': {
                this.#setRussianLocale();
                break;
            }
            case 'en': {
                this.#setEnglishLocale();
                break;
            }
        }
    }

    getLocaleItem(key: string): string | undefined {
        return this.#dictionary.get(key);
    }

    #setRussianLocale() {
        Object.entries(russian).forEach(
            ([key, value]) => this.#dictionary.set(key, value));
    }

    #setEnglishLocale() {
        Object.entries(english).forEach(
            ([key, value]) => this.#dictionary.set(key, value));
    }
}