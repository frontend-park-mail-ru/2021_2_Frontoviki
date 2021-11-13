import {Ajax} from '../modules/ajax.js';
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
        this.eventBus.emit('getAds', undefined, undefined, adverts, clearPage, page);
      }
    });
  }
}
