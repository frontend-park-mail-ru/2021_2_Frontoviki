import SalesmanPageModel from '../models/salesmanPage.js';
import EventBus from '../modules/EventBus.js';
import SalesmanPageView from '../views/salesmanPage.js';
import {Ajax} from '../modules/ajax.js';
import {idNum, secureDomainUrl, statusCodes} from '../constatns.js';

/**
 * Контроллер главной страницы
 */
export default class SalesmanPageController {
  /**
  * Controller constructor
  * @param {Object} router - for model to redirect on success login
  * @param {Object} globalEventBus - for trigger login global event
  */
  constructor(router, globalEventBus) {
    this.router = router;
    this.globalEventBus = globalEventBus;
    this.eventBus = new EventBus([
      'getSalesman',
      'noSuchSalesman',
      'getAds',
      'sendRating',
      'getRating',
    ]);
    this.view = new SalesmanPageView(this.eventBus);
    this.model = new SalesmanPageModel(this.eventBus);
    this.eventBus.on('noSuchSalesman', this.redirectToError.bind(this));
    this.eventBus.on('ratedFinish', this.view.render);
    this.eventBus.on('rated', this.rate.bind(this));
    this.globalEventBus.on('loggedForSalesman', this.refreshPage.bind(this));
  }

  /**
   * Редирект
   */
  redirectToError() {
    this.router.go('/noSuchSalesman');
  }

  /**
   * Релоад страницы если зашли на странице продавца
   */
  refreshPage() {
    const location = window.location.pathname.split('/');
    if (location[1] === 'salesman') {
      this.router.go(`/salesman/${location[idNum]}`);
    }
  }

  /**
 * Оценка продавца
 * @param {*} pos
 */
  rate(pos) {
    console.log(pos);
    const salesmanId = window.location.pathname.split('/')[idNum];
    const rating = Math.round(pos / 2 + 0.5);
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
