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
    this.router = router;
    this.globalEventBus = globalEventBus;
    this.eventBus = new EventBus([
      'getAds',
      'getData',
      'clickModal',
      'onCardClicked',
    ]);
    this.view = new MainPageView(this.eventBus);
    this.model = new MainPageModel(this.eventBus);
    globalEventBus.on('clickModal', this.callModal.bind(this));
    this.eventBus.on('onCardClicked', this.goToCardPage.bind(this));
    this.eventBus.on('stopScroll', this.stopScroll.bind(this));
    globalEventBus.on('profileLinksClick', this.stopScroll.bind(this));
  }

  /**
   * Передаем глобальный эвент в локальный котроллер
   */
  callModal() {
    this.eventBus.emit('clickModal');
  }

  /**
   * Переход на страницу объявления
   * @param {*} id
   */
  goToCardPage(id) {
    this.stopScroll();
    this.router.go('/ad/' + id);
  }
  /**
   * Если закончились объявления остановим ленту
   */
  stopScroll() {
    window.removeEventListener('scroll', this.view.populate);
  }
}
