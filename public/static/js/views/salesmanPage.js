import BaseView from './baseView.js';
import {createSalesman} from '../templates/salesmanBlock/salesmanBlock.js';
import { createProductGrid } from '../templates/productGrid/productGrid.js';

/**
  * Экспортируемый класс для генерации страницы профиля с сеткой
  * товаров
*/
export default class SalesmanPageView extends BaseView {
  /**
    * Конструктор класса
    * @param {*} eventBus - родительский элемент страницы,
    *  в который записывается весь контент, чаще всего root
  */
  constructor(eventBus) {
    super(eventBus);
    this.render = this.render.bind(this);
    this.eventBus.on('gotAds', this.renderSalesman.bind(this));
  }
  /**
   * Рендер страницы продавца
   */
  render() {
    this.eventBus.emit('getSalesman');
  }

  /**
   * Рендерит страницу продавца
   * @param {string} name имя продавца
   * @param {string} image путь к аватару
   * @param {int} rating рейтинг
   * @param {JsonArray} adverts массив его объявлений
   */
  renderSalesman(name, image, rating, adverts) {
    const stars = [];
    // поменять на рейтинг когда будет его обработка
    for (let i = 0; i < 5; i++) {
      stars.push(true);
    }
    const salesmanT = createSalesman();
    this.root.innerHTML = salesmanT(
        {userName: name,
          userAvatar: '/' + image,
          star: stars,
        });
    if (adverts.length !== 0) {
      adverts.forEach((elem) => {
        elem.href = '/advert/' + elem.id;
        elem.image = '/' + elem.image;
      });
      document.querySelector('.profile-content_right').appendChild(
          createProductGrid(adverts, false, false));
    }
  }
}
