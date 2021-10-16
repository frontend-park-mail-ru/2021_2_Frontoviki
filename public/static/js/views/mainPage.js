import {createProductGrid} from '../templates/productGrid/productGrid.js';
import {createInfoBlock} from '../templates/infoBlock/infoBlock.js';
import BaseView from './baseView.js';

/**
  * Экспортируемый класс для генерации страницы с сеткой
  * товаров, поиском и меню категорий
*/
export default class MainPageView extends BaseView {
    constructor(eventBus) {
      super(eventBus);

      this.render = this.render.bind(this);
      this.eventBus.on('getAds', this.renderAds.bind(this));
    }
    /**
     * Функция рендера генерерует весь контент страницы
     * @param {string} search текст поиска страницы
     * @param {string} categories основная категория сортировки страницы.
     * Например 'Электротехника'.
     * @param {JSON} jsonElements массив объявлений
    */
    render(data) {
        this.eventBus.emit('getData');
    }

    renderAds(search, categories, jsonElements) {
      this.root.innerHTML = '';
      this.root.appendChild(createInfoBlock(search, categories));
      this.root.appendChild(createProductGrid(jsonElements));
    }

    modal() {
      const modal = document.querySelector('.modal-window');
      const blackout = document.querySelector('.blackout');
      modal.classList.add('active');
      blackout.classList.add('active');
    };
}
