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
      'changeInfo',
      'getGrid',
      'onDeleteClick',
      'getArchive',
      'getCart',
      'gotCart',
      'renderCart',
      'deleteFromCart',
      'buyFromCart',
      'onCardClicked',
    ]);
    this.view = new ProfilePageView(this.eventBus);
    this.model = new ProfilePageModel(this.eventBus);
    this.eventBus.on('notLogged', this.redirectToMain.bind(this));
    this.eventBus.on('getAds', this.redirectToProfile.bind(this));
    this.eventBus.on('getSettings', this.redirectToSettings.bind(this));
    this.eventBus.on('renderCart', this.redirectToCart.bind(this));
    this.eventBus.on('onCardClicked', this.goToCardPage.bind(this));
  }

  /**
   * Редирект ту мейн
   */
  redirectToMain() {
    this.router.go('/');
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
   * Меняют урл когда идем в корзину
   */
  redirectToCart() {
    this.router.go('/profile/cart');
  }
  /**
   * Переход на страницу объявления
   * @param {*} id
   */
  goToCardPage(id) {
    this.router.go('/ad/' + id);
  }
}
