import {advertPageTemplate} from '../templates/advertPage/advertPageT';
import BaseView from './baseView.js';
import {SliderLogic} from '../templates/advertPage/sliderLogic.js';

/**
  *Класс для генерации страницы объявления
*/
export default class AdvertPageView extends BaseView {
  /**
    * конструктор
    * @param {*} eventBus eventBus модели
    */
  constructor(eventBus) {
    super(eventBus);
    this.render = this.render.bind(this);
    this.eventBus.on('gotAd', this.renderAd.bind(this));
    this.eventBus.on('adDrawn', this.adLogic.bind(this));
  }

  /**
   * Запрашиваем информацию об объявлении
   */
  render() {
    this.eventBus.emit('GetAdData');
  }

  /**
   * Функция отрисовки страницы объявления
   * @param {JSON} advert информация об объявлении
   * @param {JSON} salesman информация о продавце
   */
  renderAd(advert, salesman, rating) {
    const advertTemplate = advertPageTemplate();
    console.log(advert.images);
    this.root.innerHTML = advertTemplate({
      name: advert.name,
      price: advert.price,
      location: advert.location,
      publishedAt: advert.published_at.slice(0, 10),
      description: advert.description,
      href: '/ad/' + advert.id,
      category: advert.category,
      images: advert.images,
      new: advert.is_new,
      salesmanName: salesman.name,
      salesmanSurname: salesman.surname,
      salesmanAvatar: '/' + salesman.image,
      salesmanHref: '/salesman/' + salesman.id,
      salesmanRating: rating.avg,
      salesmanCreatedAt: salesman.created_at.slice(0, 10),
    });
    this.eventBus.emit('adDrawn', advert);
    const addToFav = document.getElementById('favBtn');
    addToFav.addEventListener('mouseover', ()=>{
      addToFav.style.color = '#8897f9';
    });
    addToFav.addEventListener('mouseout', ()=>{
      addToFav.style.color = '#333';
    });
    addToFav.onclick = () => this.eventBus.emit('addToFavourite');
    const label = document.querySelector('.advertisment-detail__add-info__location__name-block__maps-label')
    label.addEventListener('click', ()=>{
      const toogle = document.getElementById('toogle_maps');
      if (!toogle.checked) {
        label.classList.remove('advertisment-detail__add-info__location__name-block__maps-label_close');
        label.innerHTML = 'Скрыть карту';
        label.classList.add('advertisment-detail__add-info__location__name-block__maps-label_open');
      } else {
        label.classList.add('advertisment-detail__add-info__location__name-block__maps-label_close');
        label.innerHTML = 'Раскрыть карту';
        label.classList.remove('advertisment-detail__add-info__location__name-block__maps-label_open');
      }
    })
  }

  /**
   * Логика и интерактивные объекты
   * @param {*} advert объявление
   */
   adLogic(advert) {
    const carousel = new SliderLogic();
    document.querySelector('.gallery__prev-button').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      carousel.plusSlides(-1);
    });
    document.querySelector('.gallery__next-button').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      carousel.plusSlides(1);
    });
    document.querySelectorAll('.dot').forEach((elem, key) =>{
      elem.addEventListener('click', ()=>{
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
    document.querySelector('.advertisment-detail__main-info__shop__salesman__avatar').addEventListener('click', (e)=>{
      e.stopPropagation();
      e.preventDefault();
      this.eventBus.emit('onSalesmanClicked', advert.publisher_id);
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
    this.eventBus.emit('checkCart', advert);
  }
}
