import {createProductGrid} from '../templates/productGrid/productGrid.ts';
import {emptyGrid} from '../templates/productGrid/emptyGrid.ts';
import {createInfoBlock} from '../templates/infoBlock/infoBlock.ts';
import {categoriesBlock} from '../templates/mainPageCategories/categoriesBlock.ts'
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
    this.category = this.category.bind(this);
    this.populate = this.populate.bind(this);
    this.eventBus.on('getAds', this.renderAds.bind(this));
    this.eventBus.on('gotCategories', this.renderCategoryBlock.bind(this));
    this.eventBus.on('clickModal', this.modal.bind(this));
    this.eventBus.on('gotSearchedAds', this.renderSearchedAds.bind(this));
    this.eventBus.on('gotCategoryAds', this.renderCategoryAds.bind(this));
    this.eventBus.on('deleteBtn', this.deleteBtn.bind(this));
    this.eventBus.on('loggedForNewAd', this.newAdBtnCheck.bind(this));
    this.eventBus.on('disableAdButton', this.disableAdButton.bind(this));
  }

  /**
   * Рендер делает запрос на получение информации о товарах
   */
  render() {
    this.root.innerHTML = '';
    this.#page = 1;
    window.addEventListener('scroll', this.populate);
    this.newAdvertBtn();
    this.eventBus.emit('getCategories');
    this.eventBus.emit('getData', this.#page, true);
    this.#page++;
  }

  /**
   * Страница с результатами поиска
   */
  search() {
    this.root.innerHTML = '';
    let query = document.querySelector('.search__input').value.trim();
    if (query.length === 0) {
      query = window.location.pathname.split('/')[2];
    }
    if (query.length == 0) {
      this.eventBus.emit('redirectToMain');
    }
    this.root.innerHTML = '';
    this.eventBus.emit('getSearchedAds');
  }

  /**
   * Рендер страницы категории
   */
  category() {
    this.root.innerHTML = '';
    const category = window.location.pathname.split('/')[2];
    this.eventBus.emit('getAdsByCategory', category);
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
     * @param {JSON} adverts массив объявлений
     * @param {Boolean} clearPage новое рендер или бесконечная лента
     * @param {int} page номер страницы
    */
  renderAds(adverts, clearPage, page) {
    adverts.forEach((elem) => {
      elem.href = '/ad/' + elem.id;
      elem.image = '/' + elem.images[0];
    });
    if (clearPage) {
      document.querySelectorAll('.root__product-grid').forEach((elem)=>{
        elem.remove();
      });
      const categoryBlock = document.querySelector('.root__category');
      if (categoryBlock == null) {
        this.root.innerHTML = '';
      } else {
        this.root.childNodes.forEach((elem) => {
          if (elem !== categoryBlock) {
            this.root.removeChild(elem);
          }
        });
      };
    }
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
   * Результат поиска
   * @param {*} adverts массив объявлений
   */
  renderSearchedAds(adverts) {
    const query = window.location.pathname.split('/')[2];
    const decoded = decodeURI(query);
    this.root.appendChild(createInfoBlock(decoded));
    document.getElementById('navigation-back').addEventListener('click', ()=>{
      this.eventBus.emit('redirectToMain');
    });
    if (adverts.length == 0) {
      // добавление уведомления об отсутсвии объявлений
      const emptyGridActive = document.createElement('div');
      emptyGridActive.id = 'empty';
      const gridT = emptyGrid();
      emptyGridActive.innerHTML = gridT({text: `Ничего не найдено`});
      this.root.appendChild(emptyGridActive);
      return;
    }
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
   * Рендер страницы конкретной категории
   * @param {*} adverts
   */
  renderCategoryAds(adverts, category) {
    this.root.appendChild(createInfoBlock(undefined, category));
    document.getElementById('navigation-back').addEventListener('click', ()=>{
      this.eventBus.emit('redirectToMain');
    });
    if (adverts.length == 0) {
      // добавление уведомления об отсутсвии объявлений
      const emptyGridActive = document.createElement('div');
      emptyGridActive.id = 'empty';
      const gridT = emptyGrid();
      emptyGridActive.innerHTML = gridT({
        text: `Объявлений в данной категории нет`,
      });
      this.root.appendChild(emptyGridActive);
      return;
    }
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
   * Отрисовка блока категорий
   * @param {*} categories
   */
  renderCategoryBlock(categories) {
    const category = categoriesBlock(categories);
    this.root.prepend(category);
    const categoryHref = document.querySelector('.root__category__content-categories');
    categoryHref.addEventListener('click', (e)=>{
      if (e.target instanceof HTMLAnchorElement) {
        e.preventDefault();
        e.stopPropagation();
        console.log('emitted');
        this.eventBus.emit('onCategoryClicked', e.target.innerHTML);
      }
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
    if (document.querySelector('.root__new-advert-btn-wrapper') != null) {
      return;
    }
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
    document.querySelector('.root__new-advert-btn-wrapper')?.remove();
  }

  /**
   * Перерисуем кнопку
   */
  newAdBtnCheck() {
    const btn = document.querySelector('.root__new-advert-btn');
    if (btn != null) {
      btn.onclick = ()=> this.eventBus.emit('loggedNewAdd');
    }
  }

  /**
   * При логауте выключаем кнопку
   */
  disableAdButton() {
    const btn = document.querySelector('.root__new-advert-btn');
    if (btn != null) {
      btn.onclick = ()=> this.eventBus.emit('notLoggedNewAdd');
    }
  }
}
