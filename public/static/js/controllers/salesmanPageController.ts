import SalesmanPageModel from '../models/salesmanPage';
import EventBus from '../modules/EventBus';
import SalesmanPageView from '../views/salesmanPage';
import {Ajax} from '../modules/ajax';
import {idNum, secureDomainUrl, statusCodes, userInfo} from '../constatns';
import Router from '../modules/Router';
import Bus from '../modules/EventBus';

/**
 * Контроллер главной страницы
 */
export default class SalesmanPageController {
  router: Router
  globalEventBus: Bus
  eventBus: Bus
  view: SalesmanPageView
  model: SalesmanPageModel
  /**
  * Controller constructor
  * @param {Object} router - for model to redirect on success login
  * @param {Object} globalEventBus - for trigger login global event
  */
  constructor(router : Router, globalEventBus: Bus) {
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
    this.eventBus.on('ratedFinish', this.view.render.bind(this));
    this.eventBus.on('rated', this.rate.bind(this));
    this.globalEventBus.on('loggedForSalesman', this.refreshPage.bind(this));
    this.eventBus.on('onCardClicked', this.goToCardPage.bind(this));
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
    if (location[1] === 'salesman' && location[2] != null) {
      this.router.go(`/salesman/${location[idNum]}`);
    }
  }

  /**
 * Оценка продавца
 * @param {*} pos
 */
  rate(pos : number) {
    const salesmanId = window.location.pathname.split('/')[idNum];
    const rating = Math.round(pos / 2 + 0.5);
    console.log(Number(userInfo.get('id')), Number(salesmanId), rating);
    const res = Ajax.postUsingFetch({
      url: secureDomainUrl + 'users/profile/rating',
      body: {
        from: Number(userInfo.get('id')),
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
    }).catch((err)=>console.log(err));
  }
  /**
   * Переход на страницу объявления
   * @param {*} id
   */
  goToCardPage(id : number) {
    this.router.go(`/ad/${id}`);
  }
}
