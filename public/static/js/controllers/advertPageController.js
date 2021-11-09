import EventBus from '../modules/EventBus.js';
import AdvertPageModel from '../models/advertPage.js';
import AdvertPageView from '../views/advertPage.js';
import {Ajax} from '../modules/ajax.js';
import {secureDomainUrl, statusCodes} from '../constatns.js';

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
    this.eventBus.on('addToCart', this.addToCart.bind(this));
    this.eventBus.on('addToFavourite', this.addToFav.bind(this));
    this.eventBus.on('refreshCart', this.cartLogic.bind(this));
    this.eventBus.on('checkCart', this.cartLogic.bind(this));
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

  /**
   * Добавление в корзину
   * @param {*} id
   */
  addToCart(id) {
    if (/ad/.test(window.location.pathname) === false) {
      return;
    }
    const res = Ajax.postUsingFetch({
      url: secureDomainUrl + 'cart/one',
      body: {
        advert_id: Number(id),
        amount: 1,
      },
    });
    res.then(({parsedBody}) => {
      const {code} = parsedBody;
      if (code === statusCodes.NOTEXIST) {
        return;
      }
      this.eventBus.emit('addedToCart');
    });
  }
  /**
 * Добавление в избранное
 */
  addToFav() {
    const adId = window.location.pathname.split('/')[2];
    const res = Ajax.postUsingFetch({
      url: secureDomainUrl + 'adverts/favorite/' + adId,
    });
    res.then(({parsedBody}) => {
      console.log(parsedBody);
      const {code} = parsedBody;
      if (code === statusCodes.NOTEXIST) {
        return;
      }
      this.eventBus.emit('addedToFavorite');
    });
  }

   /**
   * Проверка корзины
   */
  async cartLogic(advert) {
    if (/ad/.test(window.location.pathname) === false) {
      return;
    }
    if (advert === undefined) {
      const adId = window.location.pathname.split('/')[2];
      const res = await Ajax.getUsingFetch({
        url: secureDomainUrl + 'adverts/' + adId,
      });
      advert = res.parsedBody.body.advert;
    }
    const addBtn = document.getElementById('addToCartBtn');
    if (Number(localStorage.getItem('id')) === advert.publisher_id) {
      document.getElementById('chatBtn').style.display = 'none';
      addBtn.style.display = 'none';
      const editBtn = document.getElementById('editBtn');
      editBtn.style.display = 'inline-block';
      editBtn.addEventListener('click', () => {
        this.eventBus.emit('onEditClicked', advert.id);
      });
    }
    const res = Ajax.getUsingFetch({
      url: secureDomainUrl + 'cart',
    });
    res.then(({parsedBody}) => {
      console.log(parsedBody);
      const {cart} = parsedBody.body;
      let canAdd = true;
      cart.forEach((elem) => {
        if (elem.advert_id === advert.id) {
          addBtn.innerHTML = 'В корзине';
          canAdd = false;
          addBtn.onclick = () => this.eventBus.emit('goToCart');
          return;
        }
      });
      if (canAdd) {
        addBtn.onclick = ()=> this.eventBus.emit('addToCart', advert.id);
      }
    });
  }
}
