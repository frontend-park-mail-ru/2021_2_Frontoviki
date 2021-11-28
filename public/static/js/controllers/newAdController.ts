import EventBus from '../modules/EventBus';
import NewAdPageModel from '../models/newAd';
import NewAdPageView from '../views/newAdPage';
import {Ajax} from '../modules/ajax';
import {secureDomainUrl, statusCodes, userInfo} from '../constatns';
import Bus from '../modules/EventBus';
import Router from '../modules/Router';

/**
 * Контроллер главной страницы
 */
export default class NewAdPageController {
  router: Router
  globalEventBus: Bus
  eventBus: Bus
  view: NewAdPageView
  model: NewAdPageModel
  /**
     * Controller constructor
     * @param {Object} router - for model to redirect on success login
     * @param {Object} globalEventBus - for trigger login global event
     */
  constructor(router: Router, globalEventBus: Bus) {
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
    this.eventBus.on('checkLog', this.checkForLogging.bind(this));
    this.eventBus.on('deleteImages', this.deleteImages.bind(this));
    this.eventBus.on('back', this.back.bind(this));
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
  redirectToAd(id: number) {
    this.router.go(`/ad/${id}`);
  }

  back() {
    this.router.goBack();
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
   * @param {Array} fileList массив фотографий
   * @param {Array} imagesToDelete массив фотографий к удалению
   */
  sendAd(endpointUrl:string, title:string, description:string, category:string,
    condition:boolean, price:number, address:string, coords:number[], isNew:boolean,
    fileList:Blob[], imagesToDelete:string[]) {
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
        publisher_id: Number(userInfo.get('id')),
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
        if (imagesToDelete != undefined) {
          if (imagesToDelete.length != 0) {
            this.eventBus.emit('deleteImages', id, imagesToDelete, fileList);
          }
        }
        this.eventBus.emit('successSend', id, isNew, fileList);
      }
    });
  }

  /**
   * Функция отправки подготовленных фотографий
   * @param {*} formData
   * @param {*} id
   * @param {*} isNew
   */
  sendPhotos(formData: FormData, id: number, isNew:boolean) {
    const res = Ajax.postImageUsingFetch({
      url: `${secureDomainUrl}adverts/${id}/images`,
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

  /**
   * Проверка на то, зарегистрирован ли пользователь
   */
  checkForLogging() {
    if (!userInfo.has('name')) {
      this.eventBus.emit('notLogged');
    }
  }

  /**
   * @param {*} id
   * @param {*} images
   * @param {Array} fileList массив фотографий
   */
  deleteImages(id:number, images:string[], fileList:Blob[]) {
    Ajax.deleteAdUsingFetch({
      url: `${secureDomainUrl}adverts/${id}/images`,
      body: {images: images},
    }).then(({status})=>{
      if (status != statusCodes.OK) {
        return;
      }
      const formData = new FormData();
      Array.from(fileList).forEach((elem)=> {
        if (elem != undefined) {
          formData.append('images', elem);
        }
      });
      // надо будет как то порефакторить,
      // сейчас это нужно чтобы не было 2 редиректа
      if (formData.has('images')) {
        return;
      }
      this.eventBus.emit('redirectToAd', id);
    });
  }
}
