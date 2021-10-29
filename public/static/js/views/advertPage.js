import {advertPageTemplate} from '../templates/advertPage/advertPageT';
import BaseView from './baseView.js';

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
  }

  /**
   * Запрашиваем информацию об объявлении
   */
  render() {
    console.log('Кря');
    this.eventBus.emit('GetAdData');
  }

  /**
   * Функция отрисовки страницы объявления
   * @param {JSON} advert информация об объявлении
   * @param {JSON} salesman информация о продавце
   */
  renderAd(advert, salesman) {
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
      salesmanRating: salesman.rating,
      salesmanCreatedAt: salesman.created_at.slice(0, 10),
    });
    this.eventBus.emit('adDrawn', advert);
  }
}
