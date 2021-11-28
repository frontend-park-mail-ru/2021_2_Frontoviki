/// <reference path="../ymaps.d.ts" />
import {advertPageTemplate} from '../templates/advertPage/advertPageT';
import BaseView from './baseView';
import {SliderLogic} from '../templates/advertPage/sliderLogic';
import {inputNum, userInfo} from '../constatns';
import {properDate} from '../modules/utilsFunctions';
import Bus from '../modules/EventBus';
import { advert, rating, salesman } from '../types';

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
    this.eventBus.on('addedToCart', this.successAdd.bind(this));
    this.eventBus.on('addedToFavorite', this.successFav.bind(this));
    this.eventBus.on('inFav', this.successFav.bind(this));
    this.eventBus.on('notInFav', this.notInFav.bind(this));
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
  renderAd(advert: advert, salesman: salesman, rating: rating) {
    const date = properDate(salesman.created_at.slice(0, 10));
    const advertDate = properDate(advert.published_at.slice(0,10));
    const advertTemplate = advertPageTemplate();
    this.root.innerHTML = advertTemplate({
      name: advert.name,
      price: advert.price,
      location: advert.location,
      publishedAt: advertDate,
      description: advert.description,
      href: `/ad/${advert.id}`,
      category: advert.category,
      images: advert.images,
      new: advert.is_new,
      views: advert.views,
      salesmanName: salesman.name,
      salesmanSurname: salesman.surname,
      salesmanAvatar: '/' + salesman.image,
      salesmanHref: '/salesman/' + salesman.id,
      salesmanRating: rating.avg.toFixed(1),
      salesmanCreatedAt: date,
    });
    this.eventBus.emit('adDrawn', advert);
    const label = document.querySelector('.advertisment-detail__add-info__location__name-block__maps-label')
    label?.addEventListener('click', ()=>{
      const toogle = document.getElementById('toogle_maps') as HTMLInputElement;
      if (!toogle.checked) {
        label.classList.remove('advertisment-detail__add-info__location__name-block__maps-label_close');
        label.innerHTML = 'Скрыть карту';
        label.classList.add('advertisment-detail__add-info__location__name-block__maps-label_open');
      } else {
        label.classList.add('advertisment-detail__add-info__location__name-block__maps-label_close');
        label.innerHTML = 'Раскрыть карту';
        label.classList.remove('advertisment-detail__add-info__location__name-block__maps-label_open');
      }
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
        this.eventBus.emit('goToChat', advert.publisher_id, advert.id);
      }
    })

    if (!userInfo.has('id')) {
      return;
    }
    this.eventBus.emit('checkCart', advert);
    this.eventBus.emit('checkFav', advert);
  }

  /**
   * Товар в корзине
   */
  inCart() {
    const addBtn = document.getElementById('addToCartBtn');
    if (addBtn != null) {
      addBtn.innerHTML = 'В корзине';
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
      const btnText = addToFav.childNodes[inputNum] as HTMLElement
      if (btnText != null) {
        btnText.innerHTML = 'Ваше объявление';
      }
    }
  }

  /**
   * Успешное добавленое в корзину
   */
  successAdd() {
    const addBtn = document.getElementById('addToCartBtn');
    if (addBtn != null) {
      addBtn.innerHTML = 'В корзине';
      addBtn.onclick = () => this.eventBus.emit('goToCart');
    }
  }
  /**
    * Добавили в избранное
    */
  successFav() {
    const addToFav = document.getElementById('favBtn');
    if (addToFav != null) {
      addToFav.style.color = '#8897f9';
      const favText = addToFav.childNodes[inputNum] as HTMLElement;
      const favImg = addToFav.childNodes[1] as SVGElement
      favImg.style.fill = '#8897f9';
      favText.innerHTML = 'В избранном';
      addToFav.onclick = () => this.eventBus.emit('goToFav');
    }
  }

  /**
   * Можем добавить в избранное
   */
  notInFav() {
    const addToFav = document.getElementById('favBtn');
    if (addToFav != null) {
      addToFav.addEventListener('mouseover', ()=>{
        addToFav.style.color = '#8897f9';
      });
      addToFav.addEventListener('mouseout', ()=>{
        addToFav.style.color = '#333';
      });
      addToFav.onclick = () => this.eventBus.emit('addToFavourite');
    }
  }
}