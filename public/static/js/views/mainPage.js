import {createProductGrid} from '../templates/productGrid/productGrid.js';
import {createInfoBlock} from '../templates/infoBlock/infoBlock.js';
import {baseCount} from '../constatns.js';
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
    this.search = this.search.bind(this);
    this.populate = this.populate.bind(this);
    this.eventBus.on('getAds', this.renderAds.bind(this));
    this.eventBus.on('clickModal', this.modal.bind(this));
    this.eventBus.on('gotSearchedAds', this.renderSearchedAds.bind(this));
    this.eventBus.on('deleteBtn', this.deleteBtn.bind(this));
    this.eventBus.on('loggedForNewAd', this.newAdBtnCheck.bind(this));
  }

  /**
   * Рендер делает запрос на получение информации о товарах
   */
  render() {
    this.#page = 1;
    window.addEventListener('scroll', this.populate);
    this.newAdvertBtn();
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
  renderAds(search, categories, adverts, clearPage, page) {
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
      if (baseCount * (page-1) > num) {
        return;
      }
      elem.addEventListener('click', (e)=>{
        e.preventDefault();
        e.stopPropagation();
        this.eventBus.emit('onCardClicked', adverts[num - (baseCount* (page-1))].id);
      });
    });
    window.addEventListener('scroll', this.populate);
  }

  /**
   * Страница с результатами поиска
   */
  search() {
    const query = document.querySelector('.search__input').value.trim();
    if (query.length == 0) {
      this.eventBus.emit('redirectToMain');
    }
    this.root.innerHTML = '';
    this.eventBus.emit('getSearchedAds');
  }

  /**
   * Результат поиска
   * @param {*} adverts массив объявлений
   */
  renderSearchedAds(adverts) {
    const query = document.querySelector('.search__input').value.trim();
    this.root.appendChild(createInfoBlock(query));
    adverts.forEach((elem) => {
      elem.href = '/ad/' + elem.id;
      elem.image = '/' + elem.images[0];
    });
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
      window.removeEventListener('scroll', this.populate);
    }
  };

  /**
   * Добавление кнопки на мобилке
   */
  newAdvertBtn() {
    const btnWrapper = document.createElement('div');
    const btn = document.createElement('button');
    btnWrapper.classList.add('root__new-advert-btn-wrapper');
    btn.classList.add('button');
    btn.classList.add('root__new-advert-btn');
    btn.innerHTML = 'Разместить объявление';
    if (localStorage.getItem('name') != null) {
      btn.onclick = ()=> this.eventBus.emit('loggedNewAdd');
    } else {
      btn.onclick = ()=> this.eventBus.emit('notLoggedNewAdd');
    }
    btnWrapper.appendChild(btn);
    this.root.parentNode.appendChild(btnWrapper);
    window.addEventListener('scroll', (e)=>{
      const y = document.documentElement.getBoundingClientRect().y;
      const width = document.documentElement.clientWidth;
      if (y < -200 || width > 885) {
        btnWrapper.style.display = 'none';
      } else {
        btnWrapper.style.display = 'flex';
      }
    });
  };

  /**
   * Удаляет кнопку
   */
  deleteBtn() {
    document.querySelector('.root__new-advert-btn-wrapper').remove();
  }

  /**
   * Перерисуем кнопку
   */
  newAdBtnCheck() {
    const btn = document.querySelector('.root__new-advert-btn');
    btn.onclick = ()=> this.eventBus.emit('loggedNewAdd');
  }
}
