import {Ajax} from '../modules/ajax.js';
import {idNum, secureDomainUrl, statusCodes} from '../constatns.js';


/**
 * Класс модели продавца
 */
export default class SalesmanPageModel {
  /**
  * @description Constructor
  * @param {Object} eventBus to call and subscribe for signals
  */
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.eventBus.on('getSalesman', this.getSalesman.bind(this));
  }

  /**
   * Достаем продавца по id из url
   */
  getSalesman() {
    const salesmanID = window.location.pathname.split('/')[idNum];
    const res = Ajax.getUsingFetch({
      url: secureDomainUrl + 'adverts/salesman/' + salesmanID,
      body: null,
    });
    res.then(({parsedBody}) => {
      const {code} = parsedBody;
      if (code === statusCodes.NOTEXIST) {
        this.eventBus.emit('noSuchSalesman');
        return;
      }
      const {salesman, adverts, rating} = parsedBody.body;
      const {name, image} = salesman;
      this.eventBus.emit('gotAds', name, image, rating, adverts);
    });
  }
}
