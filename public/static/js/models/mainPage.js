import EventBus from '../modules/EventBus.js';
import {Ajax} from '../modules/ajax.js';
import {secureDomainUrl, statusCodes} from '../constatns.js';

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
   */
  getAds() {
    const res = Ajax.asyncGetUsingFetch({
      url: secureDomainUrl + 'adverts', body: null,
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
        this.eventBus.emit('getAds', undefined, undefined, adverts);
      }
    });
  }
}
