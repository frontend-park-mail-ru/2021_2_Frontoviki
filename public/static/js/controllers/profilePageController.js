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
      'settingsRendered',
      'changePassword',
      'uploadPhoto',
      'fileUploaded',
      'changeInfo',
      'getGrid',
      'onDeleteClick',
    ]);
    this.view = new ProfilePageView(this.eventBus);
    this.model = new ProfilePageModel(this.eventBus);
    this.eventBus.on('notLogged', this.redirectToMain.bind(this));
    this.eventBus.on('getAds', this.redirectToProfile.bind(this));
    this.eventBus.on('getSettings', this.redirectToSettings.bind(this));
    this.eventBus.on('fileUploaded', this.refreshPage.bind(this));
  }

  /**
   * Редирект ту мейн
   */
  redirectToMain() {
    this.router.go('/');
    window.location.reload();
  }

  /**
   * Редирект на главную страницу пользователя
   * с объявлениями
   */
  redirectToProfile() {
    this.router.go('/profile');
  }

  /**
   * Редирект ту сеттингс
   */
  redirectToSettings() {
    this.router.go('/profile/settings');
  }

  /**
   * функция перезагрузки страницы
   */
  refreshPage() {
    window.location.reload();
  }
}
