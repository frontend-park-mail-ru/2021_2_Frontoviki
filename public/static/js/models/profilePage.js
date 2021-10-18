import {Ajax} from '../modules/ajax.js';
import {secureDomainUrl, statusCodes} from '../constatns.js';

/**
 * Класс модели пользователя
 */
export default class ProfilePageModel {
  /**
  * @description Constructor
  * @param {Object} eventBus to call and subscribe for signals
  */
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.eventBus.on('getAds', this.getAds.bind(this));
    this.eventBus.on('checkLog', this.checkForLogging.bind(this));
    this.eventBus.on('uploadPhoto', this.uploadPhoto.bind(this));
  }
  /**
 * Получить все объявления пользователя
 */
  getAds() {
    const res = Ajax.asyncGetUsingFetch({
      url: secureDomainUrl + 'adverts/salesman/' + localStorage.getItem('id'),
      body: null,
    });
    res.then(({status, parsedBody}) => {
      if (status != statusCodes.OK) {
        return;
      }
      const {adverts} = parsedBody;
      this.eventBus.emit('gotAds', adverts);
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

  /**
   * Загружает аватарку на сервер
   * @param {*} file фото пользователя
   */
  uploadPhoto(file) {
    const res = Ajax.asyncPostImageUsingFetch({
      url: secureDomainUrl + 'users/profile/upload',
      body: {file},
    });
    res.then(()=>{
        const {status} = res;
      console.log(status);
      this.eventBus.emit('fileUploded');
    });
  }
}
