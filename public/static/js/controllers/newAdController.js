import EventBus from '../modules/EventBus.js';
import NewAdPageModel from '../models/newAd.js';
import NewAdPageView from '../views/newAdPage.js';
import {Ajax} from '../modules/ajax.js';
import {secureDomainUrl, statusCodes} from '../constatns.js';

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
      'getCategory',
      'checkLog',
      'photosSend',
      'redirectToAd',
      'notOwner',
    ]);
    this.view = new NewAdPageView(this.eventBus);
    this.model = new NewAdPageModel(this.eventBus);
    this.eventBus.on('notLogged', this.redirectToMain.bind(this));
    this.eventBus.on('notOwner', this.redirectToMain.bind(this));
    this.eventBus.on('photosSend', this.redirectToProfile.bind(this));
    this.eventBus.on('redirectToAd', this.redirectToAd.bind(this));
    this.eventBus.on('validateSuccessful', this.sendAd.bind(this));
    this.eventBus.on('photoDataPacked', this.sendPhotos.bind(this));
  }

  /**
   * Редирект ту мейн
   */
  redirectToMain() {
    this.router.go('/');
  }

  /**
   * возвращение в профиль после того как опубликовали объявление
   */
  redirectToProfile() {
    this.router.go('/profile');
  }

  /**
   * @param {Number} id айди объявления для перехода
   */
  redirectToAd(id) {
    this.router.go(`/ad/${id}`);
  }

  /**
   * Отправка на сервер нового объявления
   * @param {*} endpointUrl
   * @param {*} title
   * @param {*} description
   * @param {*} category
   * @param {*} condition
   * @param {*} price
   * @param {*} address
   * @param {*} coords
   * @param {*} isNew
   */
  sendAd(endpointUrl, title, description, category, condition,
      price, address, coords, isNew) {
    const response = Ajax.postUsingFetch({
      url: endpointUrl,
      body: {
        name: title,
        description: description,
        category: category,
        is_new: condition,
        price: Number(price),
        location: address,
        latitude: coords[0],
        longitude: coords[1],
        amount: 100,
        publisher_id: Number(localStorage.getItem('id')),
      },
    });
    response.then(({status, parsedBody}) => {
      if (status != statusCodes.OK) {
        return;
      }
      const {code} = parsedBody;
      console.log(code, parsedBody);
      if (code == statusCodes.REGDONE) {
        const id = parsedBody.body.advert.id;
        this.eventBus.emit('successSend', id, isNew);
      }
    });
  }

  /**
   * Функция отправки подготовленных фотографий
   * @param {*} formData
   * @param {*} id
   * @param {*} isNew
   */
  sendPhotos(formData, id, isNew) {
    const res = Ajax.postImageUsingFetch({
      url: `${secureDomainUrl}adverts/${id}/upload`,
      body: formData,
    });
    res.then(({status})=>{
      if (status != statusCodes.OK) {
        return;
      }
      // Переход на страницу профиля при новом
      // или на странцу объявления при редактировании
      if (isNew) {
        this.eventBus.emit('photosSend');
        return;
      } else {
        this.eventBus.emit('redirectToAd', id);
      }
    });
  }
}
