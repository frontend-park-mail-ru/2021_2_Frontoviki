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
      'notLogged',
      'goToCart',
      'refreshCart',
      'onSalesmanClicked',
    ]);
    this.view = new AdvertPageView(this.eventBus);
    this.model = new AdvertPageModel(this.eventBus);
    this.eventBus.on('NoAd', this.noAd.bind(this));
    this.eventBus.on('onEditClicked', this.redirectToEdit.bind(this));
    this.eventBus.on('notLogged', this.openModal.bind(this));
    this.eventBus.on('goToCart', this.goToCart.bind(this));
    this.eventBus.on('onSalesmanClicked', this.goToSalesman.bind(this));
    this.eventBus.on('goToFav', this.goToFav.bind(this));
    this.globalEventBus.on('loggedForCart', this.refreshCart.bind(this));
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
  /**
   * Открывает модальное окно, если пользователь пытается
   * добавить в корзину без авторизации
   */
  openModal() {
    this.globalEventBus.emit('clickModal');
  }
  /**
   * Идем в корзину
   */
  goToCart() {
    this.router.go('/profile/cart');
  }
  /**
   * После логина делаем запрос за корзиной
   */
  refreshCart() {
    this.eventBus.emit('refreshCart');
  }
  /**
   * Переход на страницу продавца
   * @param {*} id айди продавца
   */
  goToSalesman(id) {
    this.router.go('/salesman/' + id);
  }
  /**
   * Переход в избранное
   */
  goToFav() {
    this.router.go('/profile/favorite');
  }
}
