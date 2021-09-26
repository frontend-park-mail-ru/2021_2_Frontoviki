import {createProductGrid} from './templates/productGrid/productGrid.js';
import {createProductPath} from './templates/productPath/productPath.js';
import {createNavigation} from './templates/navigation/navigation.js';

/**
  * Экспортируемый класс для генерации страницы с сеткой
  * товаров, поиском и меню категорий
*/
export class MainPage {
    #parent
    /**
     * Конструктор класса
     * @param {HTMLElement} parent - родительский элемент страницы,
     *  в который записывается весь контент, чаще всего root
    */
    constructor(parent) {
      this.#parent = parent;
    }
    /**
     * Функция рендера генерерует весь контент страницы
     * @param {string} navigation основная категория сортировки страницы.
     * Например 'Электротехника'.
     * @param {Array<string>} searchCategories массив для выпадающего
     * меню поиска
     * @param {JSON} jsonElements массив объявлений
    */
    render(navigation, searchCategories, jsonElements) {
      this.#parent.innerHTML = '';
      this.#parent.appendChild(createNavigation(searchCategories));
      this.#parent.appendChild(createProductPath(navigation));
      this.#parent.appendChild(createProductGrid(jsonElements));
    };
}
