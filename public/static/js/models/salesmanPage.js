import {Ajax} from '../modules/ajax.js';
import {secureDomainUrl, statusCodes} from '../constatns.js';


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
    this.eventBus.on('rated', this.rate.bind(this));
  }

  /**
   * Достаем продавца по id из url
   */
  getSalesman() {
    const salesmanID = window.location.pathname.split('/')[2];
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

  /**
   * Оценка продавца
   * @param {*} pos
   */
  rate(pos) {
    console.log(pos);
    const salesmanId = window.location.pathname.split('/')[2];
    const rating = Math.round(pos/2 + 0.5);
    console.log(Number(localStorage.getItem('id')), Number(salesmanId), rating);
    const res = Ajax.postUsingFetch({
      url: secureDomainUrl + 'users/profile/rating',
      body: {
        from: Number(localStorage.getItem('id')),
        to: Number(salesmanId),
        rating: rating,
      },
    });
    res.then(({parsedBody}) => {
      const {code} = parsedBody;
      console.log(parsedBody);
      if (code === statusCodes.BADREQUEST) {
        return;
      }
      this.eventBus.emit('ratedFinish');
    });
  }
}
