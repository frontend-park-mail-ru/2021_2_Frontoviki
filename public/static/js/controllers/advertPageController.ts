import EventBus from '../modules/EventBus';
import AdvertPageModel from '../models/advertPage';
import AdvertPageView from '../views/advertPage';
import {Ajax} from '../modules/ajax';
import {idNum, secureDomainUrl, statusCodes, userInfo} from '../constatns';
import Router from '../modules/Router';
import Bus from '../modules/EventBus';
import { advert, card, cart } from '../types';

/**
 * Контроллер страницы объялвения
 */
export default class AdvertPageController {
  router: Router
  globalEventBus: Bus
  eventBus: Bus
  view: AdvertPageView
  model: AdvertPageModel
  
  /**
     * Controller constructor
     * @param {Object} router - for model to redirect on success login
     * @param {Object} globalEventBus - for trigger login global event
     */
  constructor(router: Router, globalEventBus: Bus) {
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
    this.eventBus.on('redirectToAdvertPage', this.redirectToAdvert.bind(this));
    this.eventBus.on('notLogged', this.openModal.bind(this));
    this.eventBus.on('goToCart', this.goToCart.bind(this));
    this.eventBus.on('goToProfile', this.goToProfile.bind(this));
    this.eventBus.on('onSalesmanClicked', this.goToSalesman.bind(this));
    this.eventBus.on('goToFav', this.goToFav.bind(this));
    this.eventBus.on('addToCart', this.addToCart.bind(this));
    this.eventBus.on('addToFavourite', this.addToFav.bind(this));
    /* eslint-disable  @typescript-eslint/no-misused-promises */
    this.eventBus.on('refreshCart',  this.cartLogic.bind(this));
    this.eventBus.on('checkCart',  this.cartLogic.bind(this));
    this.eventBus.on('checkFav',  this.favLogic.bind(this));
    this.eventBus.on('goToChat', this.goToChat.bind(this));
    this.eventBus.on('createDialog', this.createDialog.bind(this));
    this.eventBus.on('back', this.back.bind(this));

    this.globalEventBus.on('loggedForCart', this.refreshCart.bind(this));
    this.globalEventBus.on('loggedForFav',  this.favLogic.bind(this));
  }

  /**
   * Редирект на страницу ошибки
   */
  noAd() {
    this.router.go('/noSuchAdvert');
  }

  back() {
    this.router.goBack();
  }
  /**
   * редирект на страницу редактирования объявления
   * @param {Number} id объявления
   */
  redirectToEdit(id: number) {
    this.router.go(`/ad/${id}/edit`);
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

  redirectToAdvert(advertId: string) {
    this.router.go(`/ad/${advertId}`);
  }
  /**
   * После логина делаем запрос за корзиной
   */
  refreshCart() {
    this.eventBus.emit('refreshCart');
  }
  /**
   * Идем в профиль
   */
  goToProfile() {
    this.router.go('/profile');
  }

  createDialog(salesmanid: number, advertId: number) {
    const res = Ajax.postUsingFetch({
      url: `${secureDomainUrl}chat/createDialog/${<string>userInfo.get('id')}/${salesmanid}/${advertId}`,
      body: null,
    });
    res.then(({parsedBody}) => {
      console.log(parsedBody);
      const {code} = parsedBody;
      if (code !== statusCodes.OK) {
        return;
      }
      this.goToChat(salesmanid, advertId);
    }).catch(()=> console.log('Cannot create dialog'));
  }

  goToChat(salesmanid: number, advertId: number) {
    this.router.go(`/profile/chat/${salesmanid}/${advertId}`);
  }
  /**
   * Переход на страницу продавца
   * @param {*} id айди продавца
   */
  goToSalesman(id: number) {
    this.router.go(`/salesman/${id}`);
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
  addToCart(id: number) {
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
    }).catch(()=> console.log('AddToCartError'));
  }
  /**
 * Добавление в избранное
 */
  addToFav() {
    const adId = window.location.pathname.split('/')[idNum];
    const res = Ajax.postUsingFetch({
      url: secureDomainUrl + 'adverts/favorite/' + adId,
      body: null,
    });
    res.then(({parsedBody}) => {
      console.log(parsedBody);
      const {code} = parsedBody;
      if (code === statusCodes.NOTEXIST) {
        return;
      }
      this.eventBus.emit('addedToFavorite');
    }).catch(()=> console.log('Error adding to favorite'));
  }

  /**
   * Проверка корзины
   * @param {*} advert объявление
   */
  async cartLogic(advert: advert) {
    if (/ad/.test(window.location.pathname) === false) {
      return;
    }
    if (advert === undefined) {
      const adId = window.location.pathname.split('/')[idNum];
      const res = await Ajax.getUsingFetch({
        url: secureDomainUrl + 'adverts/' + adId,
        body: null,
      });
      advert = res.parsedBody.body.advert;
    }
    if (Number(userInfo?.get('id')) === advert.publisher_id) {
      this.eventBus.emit('isOwner', advert.id);
    }
    const res = Ajax.getUsingFetch({
      url: secureDomainUrl + 'cart',
      body: null,
    });
    res.then(({parsedBody}) => {
      console.log(parsedBody);
      const {cart} = parsedBody.body;
      let canAdd = true;
      cart.forEach((elem: cart) => {
        if (elem.advert_id === advert.id) {
          canAdd = false;
          this.eventBus.emit('inCart');
          return;
        }
      });
      if (canAdd) {
        this.eventBus.emit('notInCart', advert.id);
      }
    }).catch(()=> console.log('error in cartLogic'));
  }

  /**
   * Проверка что объявление в избранном
   * @param {*} advert
   */
  async favLogic(advert: advert) {
    if (/ad/.test(window.location.pathname) === false) {
      return;
    }
    if (advert === undefined) {
      const adId = window.location.pathname.split('/')[idNum];
      const res = await Ajax.getUsingFetch({
        url: secureDomainUrl + 'adverts/' + adId,
        body: null,
      });
      advert = res.parsedBody.body.advert;
    }
    if (Number(userInfo?.get('id')) === advert.publisher_id) {
      return;
    }
    const res = Ajax.getUsingFetch({
      url: secureDomainUrl + 'adverts/favorite',
      body: null,
    });
    res.then(({parsedBody}) => {
      console.log(parsedBody);
      const {adverts} = parsedBody.body;
      console.log(adverts, advert.id);
      let canAdd = true;
      adverts.forEach((elem: card) => {
        if (elem.id === advert.id) {
          canAdd = false;
          this.eventBus.emit('inFav');
          return;
        }
      });
      if (canAdd) {
        this.eventBus.emit('notInFav', advert.id);
      }
    }).catch(()=> console.log('error in favLogic'));
  }
}
