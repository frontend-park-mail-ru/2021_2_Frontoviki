import EventBus from '../modules/EventBus.js';
import MainPageModel from '../models/mainPage.js';
import MainPageView from '../views/mainPage.js';

/**
 * Контроллер главной страницы
 */
export default class MainPageController {
  /**
     * Controller constructor
     * @param {Object} router - for model to redirect on success login
     * @param {Object} globalEventBus - for trigger login global event
     */
  constructor(router, globalEventBus) {
    console.log('Main page created');
    this.eventBus = new EventBus([
      'getAds',
    ]);
    this.view = new MainPageView(this.eventBus);
    this.model = new MainPageModel(this.eventBus);
  }
}
