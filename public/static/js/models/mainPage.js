import {Ajax} from '../modules/ajax.ts';
import {secureDomainUrl, statusCodes, baseCount} from '../constatns.js';

/**
 * Класс главной страницы с последними объявлениями
 */
export default class MainPageModel {
  /**
     * @description Constructor
     * @param {Object} eventBus to call and subscribe for signals
     */
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.eventBus.on('getData', this.getAds.bind(this));
    this.eventBus.on('getSearchedAds', this.getSearchedAds.bind(this));
    this.eventBus.on('getCategories', this.getCategories.bind(this));
    this.eventBus.on('getAdsByCategory', this.getCategoryAds.bind(this));
  }

  /**
   * Функция которая будет отправлять запрос на сервер
   * @param {Number} page номер страницы для пагинации
   * @param {Boolean} clearPage новое рендер или бесконечная лента
   */
  getAds(page, clearPage) {
    const res = Ajax.getUsingFetch({
      url: `${secureDomainUrl}adverts?page=${page}&count=${baseCount}`,
      body: null,
    });
    res.then(({status, parsedBody})=> {
      if (status != statusCodes.OK) {
        return;
      }
      console.log(parsedBody);
      const {code} = parsedBody;
      if (code === statusCodes.OK) {
        const {body} = parsedBody;
        const {adverts} = body;
        if (adverts.length == 0) {
          this.eventBus.emit('stopScroll');
          return;
        }
        this.eventBus.emit('getAds', adverts, clearPage, page);
      }
    });
  }

  /**
   * Получение объявлений по запросу в поиске
   */
  getSearchedAds() {
    const query = window.location.pathname.split('/')[2];
    const res = Ajax.getUsingFetch({
      url: `${secureDomainUrl}search?query=${query}`,
      body: null,
    });
    res.then(({status, parsedBody})=> {
      if (status != statusCodes.OK) {
        return;
      }
      console.log(parsedBody);
      const {code} = parsedBody;
      if (code === statusCodes.OK) {
        const {body} = parsedBody;
        const {adverts} = body;
        this.eventBus.emit('gotSearchedAds', adverts);
      }
    });
  }

  /**
   * Получение объявлений по конкретной категории
   * @param {*} category
   */
  getCategoryAds(category) {
    const res = Ajax.getUsingFetch({
      url: `${secureDomainUrl}adverts/category/${category}?count=9999`,
      body: null,
    });
    res.then(({status, parsedBody})=> {
      if (status != statusCodes.OK) {
        return;
      }
      console.log(parsedBody);
      const {code} = parsedBody;
      if (code === statusCodes.OK) {
        const {body} = parsedBody;
        const {adverts} = body;
        const decoded = decodeURI(category);
        this.eventBus.emit('gotCategoryAds', adverts, decoded);
      }
    });
  }

  /**
   * Получение списка категорий
   */
  getCategories() {
    const res = Ajax.getUsingFetch({
      url: `${secureDomainUrl}category`,
    });
    res.then(({status, parsedBody}) => {
      if (status != statusCodes.OK) {
        return;
      }
      const {categories} = parsedBody.body;
      this.eventBus.emit('gotCategories', categories);
    });
  }
}
