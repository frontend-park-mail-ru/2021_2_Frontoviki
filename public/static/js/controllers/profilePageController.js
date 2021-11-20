import EventBus from '../modules/EventBus';
import ProfilePageModel from '../models/profilePage.js';
import ProfilePageView from '../views/profilePage.js';
import {Ajax} from '../modules/ajax.ts';
import {secureDomainUrl, statusCodes} from '../constatns.ts';

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
  goToCardPage(id) {
    this.router.go('/ad/' + id);
  }
  /**
 * Загружает аватарку на сервер
 * @param {*} formData фото пользователя
 */
  uploadPhoto(formData) {
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
  updateProfileInfo(email, name, surname, phone) {
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
        localStorage.setItem('name', name);
        localStorage.setItem('surname', surname);
        localStorage.setItem('phone', phone);
        this.eventBus.emit('profileUpdated', name, surname);
      };
    });
  }

  /**
   * Обновление пароля
   * @param {*} oldPassword
   * @param {*} password
   */
  updatePassword(oldPassword, password) {
    const response = Ajax.postUsingFetch({
      url: secureDomainUrl + 'users/profile/password',
      body: {
        email: localStorage.getItem('email'),
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
      };
      this.eventBus.emit('passwordChangeNotOk');
    });
  }
  /**
 * удаляет из корзины
 * @param {*} id объявления
 * @param {Number} advertPos позиция удаляемой карточки в гриде
 */
  deleteFromCart(id, advertPos) {
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
  deleteFromFavorite(id, advertPos) {
    const res = Ajax.deleteAdUsingFetch({
      url: secureDomainUrl + 'adverts/favorite/' + id,
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
  deleteAd(id) {
    const res = Ajax.deleteAdUsingFetch({
      url: `${secureDomainUrl}adverts/${id}`,
    });
    res.then(({status, parsedBody}) => {
      if (status != statusCodes.OK) {
        return;
      }
      const {code} = parsedBody;
      if (code === statusCodes.OK) {
        this.eventBus.emit('deletedSuccessful');
      };
    });
  }

  /**
   * Архив
   * @param {*} id
   */
  archiveAd(id) {
    const res = Ajax.postUsingFetch({
      url: `${secureDomainUrl}adverts/${id}/close`,
    });
    res.then(({status, parsedBody}) => {
      if (status != statusCodes.OK) {
        return;
      }
      const {code} = parsedBody;
      if (code === statusCodes.OK) {
        this.eventBus.emit('deletedSuccessful');
      };
    });
  }

  /**
   * Оформление покупки
   * @param {*} advert объект объявления
   */
  buyFromCart(advert) {
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
    if (localStorage.getItem('name') === null) {
      this.eventBus.emit('notLogged');
    }
  }
}
