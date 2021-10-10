import {createProductGrid} from '../templates/productGrid/productGrid.js';
import {createInfoBlock} from '../templates/infoBlock/infoBlock.js';

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
     * @param {string} search текст поиска страницы
     * @param {string} categories основная категория сортировки страницы.
     * Например 'Электротехника'.
     * @param {JSON} jsonElements массив объявлений
    */
    render(search, categories, jsonElements) {
      this.#parent.innerHTML = '';
      this.#parent.appendChild(createInfoBlock(search, categories));
      this.#parent.appendChild(createProductGrid(jsonElements));
    };
}
