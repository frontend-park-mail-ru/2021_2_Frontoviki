import {createProductGrid} from '../templates/productGrid/productGrid.js';
import {createInfoBlock} from '../templates/infoBlock/infoBlock.js';
import BaseView from './baseView.js';

/**
  * Экспортируемый класс для генерации страницы с сеткой
  * товаров, поиском и меню категорий
*/
export default class MainPageView extends BaseView {
  #page
  /**
   * конструктор
   * @param {*} eventBus eventBus модели
   */
  constructor(eventBus) {
    super(eventBus);
    this.#page = 1;
    this.render = this.render.bind(this);
    this.populate = this.populate.bind(this);
    this.eventBus.on('getAds', this.renderAds.bind(this));
    this.eventBus.on('clickModal', this.modal.bind(this));
    window.addEventListener('scroll', this.populate);
  }

  /**
   * Рендер делает запрос на получение информации о товарах
   */
  render() {
    this.eventBus.emit('getData', this.#page, true);
    this.#page++;
  }
  /**
   * Добавляет объявления
   */
  addAds() {
    this.eventBus.emit('getData', this.#page, false);
    this.#page++;
  }
  /**
     * Функция рендера генерерует весь контент страницы
     * @param {string} search текст поиска страницы
     * @param {string} categories основная категория сортировки страницы.
     * Например 'Электротехника'.
     * @param {JSON} adverts массив объявлений
     * @param {Boolean} clearPage новое рендер или бесконечная лента
    */
  renderAds(search, categories, adverts, clearPage) {
    adverts.forEach((elem) => {
      elem.href = '/ad/' + elem.id;
      elem.image = '/' + elem.images[0];
    });
    if (clearPage) {
      this.root.innerHTML = '';
    }
    // this.root.appendChild(createInfoBlock(search, categories));
    this.root.appendChild(createProductGrid(adverts, false, false));
    const cards = document.querySelectorAll('.card');
    cards.forEach((elem, num)=>{
      elem.addEventListener('click', (e)=>{
        e.preventDefault();
        e.stopPropagation();
        this.eventBus.emit('onCardClicked', adverts[num].id);
      });
    });
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

  /**
 * Обработчик события для бесконечной ленты
 * @param {*} callback функция добавления данных
 */
  populate() {
    // нижняя граница документа
    const windowRelativeBottom =
    document.documentElement.getBoundingClientRect().bottom;
      // если пользователь прокрутил достаточно далеко (< 100px до конца)
    if (windowRelativeBottom < document.documentElement.clientHeight + 100) {
      // добавим больше данных
      this.addAds();
    }
  };
}
