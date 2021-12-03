import { russian, english } from "../constatns";

declare global {
    interface Window {
      localizer: Localizer;
    }
  }

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

    get userLang() {
        return this.#userLang;
    }

    set userLang(lang: string) {
        this.#userLang = lang;
        this.#fillDictionary();
    }

    #fillDictionary() {
        switch (this.#userLang) {
            case 'ru': {
                this.#setLocale(russian);
                break;
            }
            case 'en': {
                this.#setLocale(english);
                break;
            }
        }
    }

    getLocaleItem(key: string): string | undefined {
        return this.#dictionary.get(key);
    }

    #setLocale(localeObj : typeof russian) {
        Object.entries(localeObj).forEach(
            ([key, value]) => this.#dictionary.set(key, value));
    }
}