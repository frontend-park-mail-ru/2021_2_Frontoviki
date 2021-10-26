import EventBus from '../modules/EventBus.js';
import AdvertPageModel from '../models/advertPage.js';
import AdvertPageView from '../views/advertPage.js';

/**
 * Контроллер страницы объялвения
 */
export default class AdvertPageController {
  /**
     * Controller constructor
     * @param {Object} router - for model to redirect on success login
     * @param {Object} globalEventBus - for trigger login global event
     */
  constructor(router, globalEventBus) {
    this.router = router;
    this.globalEventBus = globalEventBus;
    this.eventBus = new EventBus([
      'GetAdData',
      'NoAd',
      'gotAd',
      'adDrawn',
      'onEditClicked',
    ]);
    this.view = new AdvertPageView(this.eventBus);
    this.model = new AdvertPageModel(this.eventBus);
    this.eventBus.on('NoAd', this.noAd.bind(this));
    this.eventBus.on('onEditClicked', this.redirectToEdit.bind(this));
  }

  /**
   * Редирект на страницу ошибки
   */
  noAd() {
    this.router.go('/noSuchAdvert');
  }

  /**
   * редирект на страницу редактирования объявления
   * @param {Number} id объявления
   */
  redirectToEdit(id) {
    this.router.go('/ad/' + id + '/edit');
  }
}
