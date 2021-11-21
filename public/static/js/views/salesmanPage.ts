import BaseView from './baseView';
import {createSalesman} from '../templates/salesmanBlock/salesmanBlock';
import {createProductGrid} from '../templates/productGrid/productGrid';
import {idNum} from '../constatns';
import Bus from '../modules/EventBus.js';
import { card, rating } from '../types';

/**
  * Экспортируемый класс для генерации страницы профиля с сеткой
  * товаров
*/
export default class SalesmanPageView extends BaseView {
  /**
    * Конструктор класса
    * @param {*} eventBus - родительский элемент страницы,
    *  в который записывается весь контент, чаще всего root
  */
  constructor(eventBus : Bus) {
    super(eventBus);
    this.render = this.render.bind(this);
    this.eventBus.on('gotAds', this.renderSalesman.bind(this));
  }
  /**
   * Рендер страницы продавца
   */
  render() {
    this.eventBus.emit('getSalesman');
  }

  /**
   * Рендерит страницу продавца
   * @param {string} name имя продавца
   * @param {string} image путь к аватару
   * @param {int} rating рейтинг
   * @param {JsonArray} adverts массив его объявлений
   */
  renderSalesman(name : string, image : string, rating : rating, adverts : card[]) {
    const stars = [true, true, true, true, true];
    const salesmanT = createSalesman();
    this.root.innerHTML = salesmanT(
        {userName: name,
          userAvatar: '/' + image,
          star: stars.slice(0, Math.round(rating.avg)),
          emptyStar: stars.slice(Math.round(rating.avg), 6),
          isRated: rating.is_rated,
          rate: rating.rate,
        });
    if (adverts.length !== 0) {
      adverts.forEach((elem) => {
        elem.href = '/ad/' + elem.id;
        elem.image = '/' + elem.image;
      });
      document.querySelector('.profile-content_right')?.appendChild(
          createProductGrid(adverts, false, false));
    }
    const cards = document.querySelectorAll('.card');
    cards.forEach((elem, key) => {
      elem.addEventListener('click', (e) => {
        e.preventDefault();
        this.eventBus.emit('onCardClicked', adverts[key].id);
      });
    });
    // ставим рейтинг если мы зашли, еще не ставили
    // и не пытаемся самому себе поставить
    if (rating.is_rated == false && localStorage.getItem('id') &&
          Number(localStorage.getItem('id')) !=
          Number(window.location.pathname.split('/')[idNum])) {
      const stars = document.querySelector('.profile-content__rating');
      stars?.addEventListener('mouseover', (e)=> {
        let target = e.target;
        if (e.target instanceof SVGPathElement) {
          target = e.target.parentElement;
        }
        const pos = Array.from(stars.childNodes).indexOf(<ChildNode>target);
        stars.childNodes.forEach((el, n) => {
          if (n <= pos && el instanceof SVGElement) {
            el.classList.remove('star_unactive');
            el.classList.add('star_active');
          }
          if (n > pos && el instanceof SVGElement && pos != -1) {
            el.classList.remove('star_active');
            el.classList.add('star_unactive');
          }
        });
      });
      stars?.addEventListener('mouseleave', (e)=> {
        stars?.childNodes.forEach((elem) => {
          if (elem instanceof SVGElement) {
            elem.classList.remove('star_active');
            elem.classList.add('star_unactive');
          }
        });
      });
      stars?.addEventListener('click', (e)=>{
        let target = e.target;
        if (e.target instanceof SVGPathElement) {
          target = e.target.parentElement;
        }
        const pos = Array.from(stars?.childNodes).indexOf(<ChildNode>target);
        this.eventBus.emit('rated', pos);
      });
    }
  }
}
