import {Ajax} from '../modules/ajax.js';
import {secureDomainUrl, statusCodes} from '../constatns.js';
import {SliderLogic} from '../templates/advertPage/sliderLogic.js';
import {createDeleteModal} from '../templates/deleteModal/deleteModal.js';

/**
 * Класс главной страницы с последними объявлениями
 */
export default class AdvertPageModel {
  /**
     * @description Constructor
     * @param {Object} eventBus to call and subscribe for signals
     */
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.eventBus.on('GetAdData', this.getAdData.bind(this));
    this.eventBus.on('adDrawn', this.adLogic.bind(this));
  }

  /**
   * Получение информации об объявлении
   */
  getAdData() {
    console.log(window.location.pathname);
    const adId = window.location.pathname.split('/')[2];
    const res = Ajax.asyncGetUsingFetch({
      url: secureDomainUrl + 'adverts/' + adId,
    });
    res.then(({parsedBody}) => {
      const {code} = parsedBody;
      if (code === statusCodes.NOTEXIST) {
        this.eventBus.emit('NoAd');
        return;
      }
      console.log(parsedBody);
      const {advert, salesman} = parsedBody.body;
      advert.images.forEach((elem, key) => {
        advert.images[key] = '/' + elem;
      });
      this.eventBus.emit('gotAd', advert, salesman);
    });
  }

  /**
   * Логика и интерактивные объекты
   * @param {*} advert объявление
   */
  adLogic(advert) {
    const carousel = new SliderLogic();
    document.querySelector('.prev').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      carousel.plusSlides(-1);
    });
    document.querySelector('.next').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      carousel.plusSlides(1);
    });
    document.querySelectorAll('.dot').forEach((elem, key) =>{
      elem.addEventListener('click', (e)=>{
        carousel.currentSlide(key + 1);
      });
    });
    carousel.showSlides(1);
    ymaps.ready(() => {
      const myMap = new ymaps.Map('YMapsIDNewAd', {
        center: [advert.latitude, advert.longitude],
        zoom: 14,
      });
      const myGeoObject = new ymaps.GeoObject({
        geometry: {
          type: 'Point', // тип геометрии - точка
          coordinates: [advert.latitude, advert.longitude], // координаты точки
        },
      });
      myMap.geoObjects.add(myGeoObject);
    });
    const addBtn = document.getElementById('addToCartBtn');
    if (Number(localStorage.getItem('id')) === advert.publisher_id) {
      document.getElementById('chatBtn').style.display = 'none';
      addBtn.style.display = 'none';
      const editBtn = document.getElementById('editBtn');
      editBtn.style.display = 'inline-block';
      editBtn.addEventListener('click', () => this.eventBus.emit('onEditClicked', advert.id));
    }


    addBtn.addEventListener('click', ()=> {
      if (localStorage.getItem('id') === null) {
        this.eventBus.emit('notLogged');
        return;
      }
    });

    if (localStorage.getItem('id') === null) {
      return;
    }

    const res = Ajax.asyncGetUsingFetch({
      url: secureDomainUrl + 'cart',
    });
    res.then(({parsedBody}) => {
      console.log(parsedBody);
      const {cart} = parsedBody.body;
      let canAdd = true;
      cart.forEach((elem) => {
        if (elem.advert_id === advert.id) {
          addBtn.innerHTML = 'В корзине';
          console.log('cant add');
          addBtn.removeEventListener('click', ()=> addToCart(this));
          canAdd = false;
          addBtn.addEventListener('click', () => this.eventBus.emit('goToCart'));
          return;
        }
      });
      if (canAdd) {
        console.log('can add');
        addBtn.addEventListener('click', ()=> addToCart(this));
      }
    });

    /**
     * обработчик добавления в корзину
    */
     function addToCart(advertPage) {
      console.log(advertPage);
      const res = Ajax.asyncPostUsingFetch({
        url: secureDomainUrl + 'cart/one',
        body: {
          advert_id: Number(advert.id),
          amount: 1,
        },
      });
      res.then(({parsedBody}) => {
        const {code} = parsedBody;
        if (code === statusCodes.NOTEXIST) {
          return;
        }
        console.log(parsedBody);
        addBtn.innerHTML = 'В корзине';
        addBtn.removeEventListener('click', ()=> addToCart(advertPage));
        addBtn.addEventListener('click', () => {
          advertPage.eventBus.emit('goToCart');
        });
      });
    }
  }
}
