import SalesmanPageModel from '../models/salesmanPage.js';
import EventBus from '../modules/EventBus.js';
import SalesmanPageView from '../views/salesmanPage.js';

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
    this.eventBus.on('noSuchSalesman', this.redirectToMain.bind(this));
  }

  /**
   * Редирект ту мейн
   */
  redirectToMain() {
    this.router.go('/noSuchSalesman');
  }
}
