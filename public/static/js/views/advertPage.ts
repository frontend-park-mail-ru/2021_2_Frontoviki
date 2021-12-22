import {advertPageTemplate} from '../templates/advertPage/advertPageT';
import BaseView from './baseView';
import {SliderLogic} from '../templates/advertPage/sliderLogic';
import {basePromotionPrice, engCategories, inputNum, promotionCoefficient, userInfo} from '../constatns';
import {properDate} from '../modules/utilsFunctions';
import Bus from '../modules/EventBus';
import { advert, card, priceHistoryStamp, rating, salesman } from '../types';
import { drawGraphs } from '../templates/priceGraphs/priceGraphs';
import { createPayment, createPromotionContainer } from '../templates/payment/paymentForm';
import { createProductGrid } from '../templates/productGrid/productGrid';

/**
  *Класс для генерации страницы объявления
*/
export default class AdvertPageView extends BaseView {
  #ownerCount: number
  /**
    * конструктор
    * @param {*} eventBus eventBus модели
    */
  constructor(eventBus: Bus) {
    super(eventBus);
    this.render = this.render.bind(this);
    this.eventBus.on('gotAd', this.renderAd.bind(this));
    this.eventBus.on('adDrawn', this.adLogic.bind(this));
    this.eventBus.on('inCart', this.inCart.bind(this));
    this.eventBus.on('notInCart', this.notInCart.bind(this));
    this.eventBus.on('isOwner', this.isOwner.bind(this));
    this.eventBus.on('addedToCart', this.inCart.bind(this));
    this.eventBus.on('addedToFavorite', this.successFav.bind(this));
    this.eventBus.on('inFav', this.successFav.bind(this));
    this.eventBus.on('notInFav', this.notInFav.bind(this));
    this.eventBus.on('gotPriceHistory', this.renderPriceHistory.bind(this));
    this.eventBus.on('gotRecommendations', this.renderRec.bind(this));
  }

  /**
   * Запрашиваем информацию об объявлении
   */
  render() {
    document.querySelector('.root__new-advert-btn-wrapper')?.remove();
    this.#ownerCount = 0;
    this.eventBus.emit('GetAdData');
  }

  /**
   * Функция отрисовки страницы объявления
   * @param {JSON} advert информация об объявлении
   * @param {JSON} salesman информация о продавце
   */
  renderAd(advert: advert, salesman: salesman, rating: rating, favorite_count: number) {
    const stars = [true, true, true, true, true];
    const date = properDate(salesman.created_at.slice(0, 10));
    const advertDate = properDate(advert.published_at.slice(0,10));
    if (window.localizer.userLang == 'en') {  
      engCategories.forEach(elem => {
        if (elem.analog == advert.category) {
          advert.category = elem.name;
          advert.categoryHref = elem.analog;
        }
      });
    } else {
      advert.categoryHref = advert.category;
    }
    console.log(advert.categoryHref)
    if (advert.price == '0') {
      advert.price = <string>window.localizer.getLocaleItem('zeroPrice');
    } else {
      advert.price += ' ₽';
    }
    const advertTemplate = advertPageTemplate();
    this.root.innerHTML = advertTemplate({
      main: window.localizer.getLocaleItem('main'),
      addToFav: window.localizer.getLocaleItem('addToFav'),
      priceLabel: window.localizer.getLocaleItem('priceLabel'),
      chatBtn: window.localizer.getLocaleItem('chatBtn'),
      addToCart: window.localizer.getLocaleItem('addToCart'),
      edit: window.localizer.getLocaleItem('edit'),
      conditionNew: window.localizer.getLocaleItem('conditionNew'),
      conditionUsed: window.localizer.getLocaleItem('conditionUsed'),
      descriptionLabel: window.localizer.getLocaleItem('descriptionLabel'),
      publishDateLabel: window.localizer.getLocaleItem('publishDateLabel'),
      viewsLabel: window.localizer.getLocaleItem('viewsLabel'),
      salesmanLabel: window.localizer.getLocaleItem('salesmanLabel'),
      onSiteFrom: window.localizer.getLocaleItem('onSiteFrom'),
      showMap: window.localizer.getLocaleItem('showMap'),
      inFavoriteLabel: window.localizer.getLocaleItem('inFavoriteLabel'),
      inFavorite: favorite_count,
      star: stars.slice(0, Math.round(rating.avg)),
      emptyStar: stars.slice(Math.round(rating.avg), 6),
      name: advert.name,
      price: advert.price,
      location: advert.location,
      publishedAt: advertDate,
      description: advert.description,
      href: `/ad/${advert.id}`,
      categoryHref: advert.categoryHref,
      category: advert.category,
      images: advert.imagesContainer,
      new: advert.is_new,
      views: advert.views,
      salesmanName: salesman.name,
      salesmanSurname: salesman.surname,
      salesmanAvatar: '/' + salesman.image,
      salesmanFormat: '.' + salesman.image.split('__')[1],
      salesmanHref: '/salesman/' + salesman.id,
      salesmanRating: rating.avg.toFixed(1),
      salesmanCreatedAt: date,
    });
    this.eventBus.emit('adDrawn', advert);
    this.eventBus.emit('getRecommends', advert.id);
    const label = document.querySelector('.advertisment-detail__add-info__location__name-block__maps-label')
    label?.addEventListener('click', ()=>{
      const toogle = document.getElementById('toogle_maps') as HTMLInputElement;
      if (!toogle.checked) {
        label.classList.remove('advertisment-detail__add-info__location__name-block__maps-label_close');
        label.innerHTML = <string>window.localizer.getLocaleItem('hideMap');
        label.classList.add('advertisment-detail__add-info__location__name-block__maps-label_open');
      } else {
        label.classList.add('advertisment-detail__add-info__location__name-block__maps-label_close');
        label.innerHTML = <string>window.localizer.getLocaleItem('showMap');
        label.classList.remove('advertisment-detail__add-info__location__name-block__maps-label_open');
      }
    });
  }

  renderRec(adverts : card[]) {
    const sepContainer = document.createElement('div');
    sepContainer.classList.add('advertisment-detail__recommend-title-container');
    const sep = document.createElement('h2');
    sep.innerHTML = <string> window.localizer.getLocaleItem('recommendText');
    sep.classList.add('advertisment-detail__recommend-title');
    sepContainer.appendChild(sep);
    this.root.appendChild(sepContainer);
    adverts.forEach((elem) => {
      elem.href = `/ad/${elem.id}`;
      elem.image = '/' + elem.images[0];
    });
    this.root.appendChild(createProductGrid(adverts, false, false));
    const cards = document.querySelectorAll('.card');
    cards.forEach((elem, key) => {
      elem.addEventListener('click', () => {
        this.eventBus.emit('onCardClicked', adverts[key].id);
      });
    });
  }

  /**
   * Логика и интерактивные объекты
   * @param {*} advert объявление
   */
  adLogic(advert: advert) {
    const carousel = new SliderLogic();
    if (advert.images.length > 1) {
      document.querySelector('.gallery__prev-button')?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        carousel.plusSlides(-1);
      });
      document.querySelector('.gallery__next-button')?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        carousel.plusSlides(1);
      });
      document.querySelectorAll('.dot').forEach((elem, key) =>{
        elem.addEventListener('click', ()=>{
          carousel.currentSlide(key + 1);
        });
      });
    } else {
      const prev = document.querySelector('.gallery__prev-button') as HTMLElement;
      prev.style.display = 'none';
      const next = document.querySelector('.gallery__next-button') as HTMLElement;
      next.style.display = 'none';
      const dots = document.querySelector(
        '.advertisment-detail__main-info__main__dot-container') as HTMLElement;
      dots.style.display = 'none';
    }
    carousel.showSlides(1);
    ymaps.ready().then(() => {
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
    document.querySelector('.advertisment-detail__main-info__shop__salesman__avatar')?.addEventListener('click', (e)=>{
      e.stopPropagation();
      e.preventDefault();
      this.eventBus.emit('onSalesmanClicked', advert.publisher_id);
    });
    const addBtn = document.getElementById('addToCartBtn');
    if (Number(userInfo?.get('id')) === advert.publisher_id) {
      this.isOwner(advert.id);
    }
    addBtn?.addEventListener('click', ()=> {
      if (!userInfo.has('id')) {
        this.eventBus.emit('notLogged');
        return;
      }
    });
    const addToFav = document.getElementById('favBtn');
    addToFav?.addEventListener('click', ()=> {
      if (!userInfo.has('id')) {
        this.eventBus.emit('notLogged');
        return;
      }
    });
    const chatBtn = document.getElementById('chatBtn');
    chatBtn?.addEventListener('click', ()=>{
      if (!userInfo.has('id')) {
        this.eventBus.emit('notLogged');
      } else {
        this.eventBus.emit('createDialog', advert.publisher_id, advert.id);
      }
    })

    if (!userInfo.has('id')) {
      const addToFav = document.getElementById('favBtn');
      const favLabel = <HTMLLabelElement> document.querySelector('.advertisment-detail__main-info__shop__capture');
      if (addToFav != null && favLabel != null) {
        addToFav.addEventListener('mouseover', ()=>{
          favLabel.style.color = '#54a5f3';
          addToFav.style.color = '#54a5f3';
        });
        favLabel.addEventListener('mouseover', ()=>{
          favLabel.style.color = '#54a5f3';
          addToFav.style.color = '#54a5f3';
        });
        addToFav.addEventListener('mouseout', ()=>{
          favLabel.style.color = '#333';
          addToFav.style.color = '#333';
        });
        favLabel.addEventListener('mouseout', ()=>{
          favLabel.style.color = '#333';
          addToFav.style.color = '#333';
        });
      }
      return;
    }
    this.eventBus.emit('checkCart', advert);
    this.eventBus.emit('checkFav', advert);
  }

  renderPriceHistory(history: priceHistoryStamp[]) {
    const dates = [] as string[];
    const prices = [] as number[];
    history.forEach((elem) => {
      dates.push(elem.change_time);
      prices.push(elem.price);
    });
    const container = drawGraphs(dates, prices);
    if (container != undefined) {
      document.querySelector('.advertisment-detail__add-info')?.appendChild(container);
    }
  }

  upgradeAdvert() {
    const userId = <string> userInfo.get('id');
    if (userId == undefined) {
      this.eventBus.emit('back');
    }
    const paymentTemplate = createPayment();
    const advertId = window.location.pathname.split('/')[2];
    const price = basePromotionPrice;
    const coef = promotionCoefficient;
    this.root.innerHTML = '';
    const promotionContainer = createPromotionContainer();
    this.root.innerHTML = promotionContainer({
      promotion: window.localizer.getLocaleItem('promotion'),
      tariff: window.localizer.getLocaleItem('tariff'),
      base: window.localizer.getLocaleItem('base'),
      upgraded: window.localizer.getLocaleItem('upgraded'),
      pro: window.localizer.getLocaleItem('pro'),
      back: window.localizer.getLocaleItem('backToProfile'),
      lvl1Text: window.localizer.getLocaleItem('lvl1Text'),
      lvl2Text: window.localizer.getLocaleItem('lvl2Text'),
      lvl3Text: window.localizer.getLocaleItem('lvl3Text'),
    });
    const buttonContainers = document.querySelectorAll('.promotion-tariffs-block__button');
    buttonContainers.forEach((elem, id) => {
      elem.innerHTML = paymentTemplate({
        labelInfo: `${userId}__${advertId}__${id + 1}`,
        cost: price + id * coef,
        pay: window.localizer.getLocaleItem('pay'),
      });
    });
    (<HTMLButtonElement>document.querySelector('.button-minor'))?.addEventListener('click', ()=>{
      this.eventBus.emit('back');
    });
  }

  /**
   * Товар в корзине
   */
  inCart() {
    const addBtn = document.getElementById('addToCartBtn');
    if (addBtn != null) {
      addBtn.innerHTML = <string>window.localizer.getLocaleItem('inCart');
      addBtn.onclick = () => this.eventBus.emit('goToCart');
    }
  }

  /**
   * Не в корзине - можем добавить
   * @param {int} id айди объявления
   */
  notInCart(id: number) {
    const addBtn = document.getElementById('addToCartBtn');
    if (addBtn != null) {
      addBtn.onclick = ()=> this.eventBus.emit('addToCart', id);
    }
  }

  /**
   * мы владелец
     @param {int} id айди объявления
   */
  isOwner(id: number) {
    this.#ownerCount++;
    if (this.#ownerCount > 1) {
      return;
    }
    const chatBtn = document.getElementById('chatBtn');
    if (chatBtn != null) {
      chatBtn.style.display = 'none';
    }
    const addBtn = document.getElementById('addToCartBtn');
    if (addBtn != null) {
      addBtn.style.display = 'none';
    }
    const editBtn = document.getElementById('editBtn');
    if (editBtn != null) {
      editBtn.style.display = 'inline-block';
      editBtn.addEventListener('click', () => {
        this.eventBus.emit('onEditClicked', id);
      });
    }
    const addToFav = document.getElementById('favBtn');
    if (addToFav != null) {
      addToFav.onclick = () => this.eventBus.emit('goToProfile');
      const btnText = <HTMLElement> document.querySelector('.advertisment-detail__main-info__shop__capture');
      if (btnText != null) {
        btnText.innerHTML = <string>window.localizer.getLocaleItem('yourAdvert');
      }
    }
  }

  /**
    * Добавили в избранное
    */
  successFav() {
    const addToFav = document.getElementById('favBtn');
    if (addToFav != null) {
      const favText = <HTMLElement> document.querySelector('.advertisment-detail__main-info__shop__capture');
      favText.style.color = '#54a5f3';
      const favImg = addToFav.childNodes[1] as SVGElement
      favImg.style.fill = '#54a5f3';
      favText.innerHTML = <string>window.localizer.getLocaleItem('inFav');
      addToFav.onclick = () => this.eventBus.emit('goToFav');
    }
  }

  /**
   * Можем добавить в избранное
   */
  notInFav() {
    const addToFav = document.getElementById('favBtn');
    const favLabel = <HTMLLabelElement> document.querySelector('.advertisment-detail__main-info__shop__capture');
    if (addToFav != null && favLabel != null) {
      addToFav.addEventListener('mouseover', ()=>{
        favLabel.style.color = '#54a5f3';
        addToFav.style.color = '#54a5f3';
      });
      favLabel.addEventListener('mouseover', ()=>{
        favLabel.style.color = '#54a5f3';
        addToFav.style.color = '#54a5f3';
      });
      addToFav.addEventListener('mouseout', ()=>{
        favLabel.style.color = '#333';
        addToFav.style.color = '#333';
      });
      favLabel.addEventListener('mouseout', ()=>{
        favLabel.style.color = '#333';
        addToFav.style.color = '#333';
      });
      addToFav.onclick = () => this.eventBus.emit('addToFavourite');
    }
  }
}
