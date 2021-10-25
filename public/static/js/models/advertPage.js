import {Ajax} from '../modules/ajax.js';
import {secureDomainUrl, statusCodes} from '../constatns.js';
import {SliderLogic} from '../templates/advertPage/sliderLogic.js';

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
   */
  adLogic(advert) {
    const carousel = new SliderLogic();
    document.querySelector('.prev').addEventListener('click', (e) => {
      e.preventDefault();
      carousel.plusSlides(-1);
      e.stopImmediatePropagation();
    });
    document.querySelector('.next').addEventListener('click', (e) => {
      e.preventDefault();
      carousel.plusSlides(1);
      e.stopImmediatePropagation();
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
  }
}
