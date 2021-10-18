import EventBus from '../modules/EventBus.js';
import ProfilePageModel from '../models/profilePage.js';
import ProfilePageView from '../views/profilePage.js';

/**
 * Контроллер главной страницы
 */
export default class ProfilePageController {
  /**
     * Controller constructor
     * @param {Object} router - for model to redirect on success login
     * @param {Object} globalEventBus - for trigger login global event
     */
  constructor(router, globalEventBus) {
    this.globalEventBus = globalEventBus;
    this.router = router;
    this.eventBus = new EventBus([
      'checkLog',
      'notLogged',
      'getAds',
      'gotAds',
    ]);
    this.view = new ProfilePageView(this.eventBus);
    this.model = new ProfilePageModel(this.eventBus);
    this.eventBus.on('notLogged', this.redirectToMain.bind(this));
    // this.eventBus.on('getSettings', this.redirectToSettings.bind(this));
  }

  /**
   * Редирект ту мейн
   */
  redirectToMain() {
    this.router.go('/');
    window.location.reload();
  }

  triggerSettings() {
      this.eventBus.emit('getSettings');
  }

  /**
   * Редирект ту сеттингс
   */
//   redirectToSettings() {
//     this.router.go('/profile/settings');
//     window.location.reload();
//   }
}
