import EventBus from '../modules/EventBus';
import ProfilePageModel from '../models/profilePage';
import ProfilePageView from '../views/profilePage';
import {Ajax} from '../modules/ajax';
import {secureDomainUrl, statusCodes, userInfo} from '../constatns';
import Router from '../modules/Router';
import Bus from '../modules/EventBus';
import { advert } from '../types';

/**
 * Контроллер главной страницы
 */
export default class ProfilePageController {
  websocket: WebSocket
  router: Router
  globalEventBus: Bus
  eventBus: Bus
  view: ProfilePageView
  model: ProfilePageModel
  /**
     * Controller constructor
     * @param {Object} router - for model to redirect on success login
     * @param {Object} globalEventBus - for trigger login global event
     */
  constructor(router : Router, globalEventBus : Bus) {
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
      'goToActive',
      'goToArchive',
    ]);
    this.view = new ProfilePageView(this.eventBus);
    this.model = new ProfilePageModel(this.eventBus);
    this.eventBus.on('notLogged', this.redirectToMain.bind(this));
    this.eventBus.on('getAds', this.redirectToProfile.bind(this));
    this.eventBus.on('goToActive', this.redirectToProfile.bind(this));
    this.eventBus.on('getSettings', this.redirectToSettings.bind(this));
    this.eventBus.on('renderCart', this.redirectToCart.bind(this));
    this.eventBus.on('renderChat', this.redirectToChat.bind(this));
    this.eventBus.on('onCardClicked', this.goToCardPage.bind(this));
    this.eventBus.on('goToArchive', this.goToArchive.bind(this));
    this.eventBus.on('renderFavorite', this.redirectToFav.bind(this));

    this.eventBus.on('uploadPhoto', this.uploadPhoto.bind(this));
    this.eventBus.on('infoChecked', this.updateProfileInfo.bind(this));
    this.eventBus.on('deleteFromFav', this.deleteFromFavorite.bind(this));
    this.eventBus.on('deleteFromCart', this.deleteFromCart.bind(this));
    this.eventBus.on('passwordChecked', this.updatePassword.bind(this));
    this.eventBus.on('deleted', this.deleteAd.bind(this));
    this.eventBus.on('archived', this.archiveAd.bind(this));
    this.eventBus.on('buyFromCart', this.buyFromCart.bind(this));
    this.eventBus.on('checkLog', this.checkForLogging.bind(this));
    this.eventBus.on('goToDialog', this.goToDialog.bind(this));
    this.eventBus.on('connectToChat', this.connectToChat.bind(this));

    this.globalEventBus.on('disconnectSocket', this.closeConnection.bind(this));
  }

  /**
   * Редирект ту мейн
   */
  redirectToMain() {
    this.router.go('/');
  }

  /**
   * Редирект на страницу архива
   */
  goToArchive() {
    this.router.go('/profile/archive');
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

  redirectToChat() {
    this.router.go('/profile/chat');
  }

  goToDialog(id: string | null, advertId: string | null) {
    if (id != null) {
      this.router.go(`/profile/chat/${id}/${advertId}`);
    }
  }

  connectToChat(idTo: string, advertId: string) {
    if (this.websocket != null && this.websocket.readyState == this.websocket.OPEN) {
      this.websocket.close();
    }
    console.log('preconnect');
    this.websocket = new WebSocket(`wss://volchock.ru/api/wschat/connect/${userInfo.get('id')}/${idTo}/${advertId}`);
    this.websocket.addEventListener('open', (e)=>{
      console.log('open');
      this.eventBus.emit('connectionOpened', this.websocket);
    });
    this.websocket.addEventListener('message', (e)=>{
      this.eventBus.emit('messageReceived', e.data);
    })
    this.websocket.addEventListener('close', (e)=>{
      console.log('closed');
    })
  }

  closeConnection() {
    this.websocket.close();
  }
  /**
   * Меняют урл когда идем в корзину
   */
  redirectToCart() {
    this.router.go('/profile/cart');
  }
  /**
   * Меняют урл когда идем в избранное
   */
  redirectToFav() {
    this.router.go('/profile/favorite');
  }
  /**
   * Переход на страницу объявления
   * @param {*} id
   */
  goToCardPage(id: number) {
    this.router.go('/ad/' + id);
  }
  /**
 * Загружает аватарку на сервер
 * @param {*} formData фото пользователя
 */
  uploadPhoto(formData : FormData) {
    Ajax.postImageUsingFetch({
      url: secureDomainUrl + 'users/profile/upload',
      body: formData,
    });
  }

  /**
   *
   * @param {*} email
   * @param {*} name
   * @param {*} surname
   * @param {*} phone
   */
  updateProfileInfo(email: string, name: string, surname: string, phone: string) {
    const response = Ajax.postUsingFetch({
      url: secureDomainUrl + 'users/profile',
      body: {email, name, surname, phone},
    });
    response.then(({status, parsedBody}) => {
      if (status != statusCodes.OK) {
        return;
      }
      const {code} = parsedBody;
      console.log(parsedBody);
      if (code === statusCodes.OK) {
        userInfo.set('name', name);
        userInfo.set('surname', surname);
        userInfo.set('phone', phone);
        this.eventBus.emit('profileUpdated', name, surname);
      }
    });
  }

  /**
   * Обновление пароля
   * @param {*} oldPassword
   * @param {*} password
   */
  updatePassword(oldPassword : string, password: string) {
    const response = Ajax.postUsingFetch({
      url: secureDomainUrl + 'users/profile/password',
      body: {
        email: userInfo.get('email'),
        password: oldPassword,
        new_password: password,
      },
    });
    response.then(({status, parsedBody}) => {
      if (status != statusCodes.OK) {
        return;
      }
      const {code} = parsedBody;
      console.log(parsedBody);
      if (code === statusCodes.OK) {
        this.eventBus.emit('passwordChangeOk');
        return;
      }
      this.eventBus.emit('passwordChangeNotOk');
    });
  }
  /**
 * удаляет из корзины
 * @param {*} id объявления
 * @param {Number} advertPos позиция удаляемой карточки в гриде
 */
  deleteFromCart(id : number, advertPos : number | null) {
    const res = Ajax.postUsingFetch({
      url: secureDomainUrl + 'cart/one',
      body: {
        advert_id: Number(id),
        amount: 0,
      },
    });
    res.then(({parsedBody}) => {
      const {code} = parsedBody;
      if (code === statusCodes.NOTEXIST) {
        return;
      }
      if (advertPos != null) {
        this.model.getCart();
      }
    });
  }

  /**
   * удаляет из избранного
   * @param {*} id объявления
   * @param {Number} advertPos позиция удаляемой карточки в гриде
   */
  deleteFromFavorite(id : number, advertPos : number | null) {
    const res = Ajax.deleteAdUsingFetch({
      url: secureDomainUrl + 'adverts/favorite/' + id,
      body: null,
    });
    res.then(({parsedBody}) => {
      const {code} = parsedBody;
      if (code === statusCodes.NOTEXIST) {
        return;
      }
      if (advertPos != null) {
        this.model.getFavorite();
      }
    });
  }

  /**
   * Удаление объявления
   * @param {*} id
   */
  deleteAd(id: number) {
    const res = Ajax.deleteAdUsingFetch({
      url: `${secureDomainUrl}adverts/${id}`,
      body: null,
    });
    res.then(({status, parsedBody}) => {
      if (status != statusCodes.OK) {
        return;
      }
      const {code} = parsedBody;
      if (code === statusCodes.OK) {
        this.eventBus.emit('deletedSuccessful');
      }
    });
  }

  /**
   * Архив
   * @param {*} id
   */
  archiveAd(id: number) {
    const res = Ajax.postUsingFetch({
      url: `${secureDomainUrl}adverts/${id}/close`,
      body: null,
    });
    res.then(({status, parsedBody}) => {
      if (status != statusCodes.OK) {
        return;
      }
      const {code} = parsedBody;
      if (code === statusCodes.OK) {
        this.eventBus.emit('deletedSuccessful');
      }
    });
  }

  /**
   * Оформление покупки
   * @param {*} advert объект объявления
   */
  buyFromCart(advert: advert) {
    const res = Ajax.postUsingFetch({
      url: secureDomainUrl + 'cart/' + advert.id + '/checkout',
      body: {
        advert_id: advert.id,
      },
    });
    res.then(({parsedBody}) => {
      const {code} = parsedBody;
      if (code === statusCodes.NOTEXIST) {
        return;
      }
      console.log(parsedBody);
      this.eventBus.emit('buySuccess', parsedBody.body.salesman, advert);
    });
  }

  /**
 * Проверяет авторизован ли пользователь
 */
  checkForLogging() {
    if (!userInfo.get('name')) {
      this.eventBus.emit('notLogged');
    }
  }
}
