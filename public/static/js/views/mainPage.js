import {createProductGrid} from '../templates/productGrid/productGrid.js';
import {createInfoBlock} from '../templates/infoBlock/infoBlock.js';
import BaseView from './baseView.js';

/**
  * Экспортируемый класс для генерации страницы с сеткой
  * товаров, поиском и меню категорий
*/
export default class MainPageView extends BaseView {
  /**
   * конструктор
   * @param {*} eventBus eventBus модели
   */
  constructor(eventBus) {
    super(eventBus);
    this.render = this.render.bind(this);
    this.eventBus.on('getAds', this.renderAds.bind(this));
    this.eventBus.on('clickModal', this.modal.bind(this));
  }

  /**
   * Рендер делает запрос на получение информации о товарах
   */
  render() {
    this.eventBus.emit('getData');
  }
  /**
     * Функция рендера генерерует весь контент страницы
     * @param {string} search текст поиска страницы
     * @param {string} categories основная категория сортировки страницы.
     * Например 'Электротехника'.
     * @param {JSON} jsonElements массив объявлений
    */
  renderAds(search, categories, adverts) {
    adverts.forEach((elem) => {
      elem.href = '/advert/' + elem.id;
      elem.image = '/' + elem.image;
    });
    this.root.innerHTML = '';
    console.log(adverts, 'lel');
    this.root.appendChild(createInfoBlock(search, categories));
    this.root.appendChild(createProductGrid(adverts, false, false));
  }

  /**
   * Показывает модальное окно
   */
  modal() {
    const modal = document.querySelector('.modal-window');
    const blackout = document.querySelector('.blackout');
    modal.classList.add('active');
    blackout.classList.add('active');
  };
}
