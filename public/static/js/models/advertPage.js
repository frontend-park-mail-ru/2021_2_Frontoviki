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
    this.eventBus.on('refreshCart', this.cartLogic.bind(this));
    this.eventBus.on('checkCart', this.cartLogic.bind(this));
    this.eventBus.on('addedToCart', this.successAdd.bind(this));
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
      editBtn.addEventListener('click', () => this.eventBus.emit('onEditClicked', advert.id));
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
        addBtn.onclick = ()=> this.eventBus.emit('addToCart', this, advert.id);
      }
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
}
