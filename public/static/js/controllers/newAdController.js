import EventBus from '../modules/EventBus.js';
import NewAdPageModel from '../models/newAd.js';
import NewAdPageView from '../views/newAd.js';

/**
 * Контроллер главной страницы
 */
export default class NewAdPageController {
  /**
     * Controller constructor
     * @param {Object} router - for model to redirect on success login
     * @param {Object} globalEventBus - for trigger login global event
     */
  constructor(router, globalEventBus) {
    this.globalEventBus = globalEventBus;
    this.router = router;
    this.eventBus = new EventBus([
      'renderDone',
      'sendAd',
      'successSend',
      'notLogged',
      'checkLog',
      'photosSend',
    ]);
    this.view = new NewAdPageView(this.eventBus);
    this.model = new NewAdPageModel(this.eventBus);
    this.eventBus.on('notLogged', this.redirectToMain.bind(this));
    this.eventBus.on('photosSend', this.redirectToProfile.bind(this));
  }

  /**
   * Редирект ту мейн
   */
  redirectToMain() {
    this.router.go('/');
    window.location.reload();
  }

  /**
   * возвращение в профиль после того как опубликовали объявление
   */
  redirectToProfile() {
    this.router.go('/profile');
  }
}
