import {Ajax} from '../modules/ajax.js';
import {secureDomainUrl, statusCodes} from '../constatns.js';

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
    this.eventBus.on('addedToCart', this.successAdd.bind(this));
    this.eventBus.on('addedToFavorite', this.successFav.bind(this));
  }

  /**
   * Получение информации об объявлении
   */
  getAdData() {
    const adId = window.location.pathname.split('/')[2];
    const res = Ajax.getUsingFetch({
      url: secureDomainUrl + 'adverts/' + adId,
    });
    res.then(({parsedBody}) => {
      const {code} = parsedBody;
      if (code === statusCodes.NOTEXIST) {
        this.eventBus.emit('NoAd');
        return;
      }
      const {advert, salesman, rating} = parsedBody.body;
      advert.images.forEach((elem, key) => {
        advert.images[key] = '/' + elem;
      });
      this.eventBus.emit('gotAd', advert, salesman, rating);
    });
  }

  /**
   * Успешное добавленое в корзину
   */
  successAdd() {
    const addBtn = document.getElementById('addToCartBtn');
    addBtn.innerHTML = 'В корзине';
    addBtn.onclick = () => this.eventBus.emit('goToCart');
  }

  /**
   * Добавили в избранное
   */
  successFav() {
    const addToFav = document.getElementById('favBtn');
    addToFav.style.color = '#8897f9';
    addToFav.onclick = () => this.eventBus.emit('goToFav');
  }
}
