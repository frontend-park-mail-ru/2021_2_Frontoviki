import {createProductGrid} from '../templates/productGrid/productGrid.js';
import {profileInfoBlock} from
  '../templates/profileInfoBlock/profileInfoBlock.js';
import {settings} from '../templates/settings/settings.js';
import BaseView from './baseView.js';

/**
  * Экспортируемый класс для генерации страницы профиля с сеткой
  * товаров
*/
export default class ProfilePageView extends BaseView {
  /**
    * Конструктор класса
    * @param {*} eventBus - родительский элемент страницы,
    *  в который записывается весь контент, чаще всего root
  */
  constructor(eventBus) {
    super(eventBus);
    this.render = this.render.bind(this);
    this.renderAds = this.renderAds.bind(this);
    this.renderSettings = this.renderSettings.bind(this);
    eventBus.on('gotAds', this.renderGrid.bind(this));
    eventBus.on('getSettings', this.renderSettings.bind(this));
  }
  /**
    * функция отрисовки страницы профиля
  */
  render() {
    this.eventBus.emit('checkLog');
    document.getElementById('mini-profile__toogle').checked = false;
    this.root.innerHTML = '';
    const profileContent = profileInfoBlock();
    this.root.appendChild(profileContent);
    const rightBlock = document.createElement('div');
    rightBlock.classList.add('profile-content_right');
    profileContent.appendChild(rightBlock);

    const myAdsBtn =
      document.querySelector('.profile-content__buttons').childNodes[1];
    myAdsBtn.addEventListener('click', (e) => {
      this.eventBus.emit('getAds');
    });

    const settingBtn =
      document.querySelector('.profile-content__buttons').childNodes[13];
    settingBtn.addEventListener('click', (e) => {
      this.eventBus.emit('getSettings');
    });
  }
  /**
   * Отрисовывает объявления пользователя
   */
  renderAds() {
    this.render();
    const rightBlock = document.querySelector('.profile-content_right');
    rightBlock.innerHTML = '';
    const title = document.createElement('h3');
    title.classList.add('profile-content__title');
    title.innerHTML = ' Ваши объявления ';
    const active = document.createElement('span');
    active.innerHTML = 'Активные';
    active.classList.add('profile-content-right__ads-type');
    active.style.color = '#004ad7';
    const archive = document.createElement('span');
    archive.innerHTML='Архив';
    archive.classList.add('profile-content-right__ads-type');

    active.addEventListener('click', ()=>{
      // удаляем предыдущие обявления
      rightBlock.removeChild(document.querySelector('.root__product-grid'));
      this.eventBus.emit('getGrid');
      active.style.color = '#004ad7';
      archive.style.color = 'black';
    });
    rightBlock.appendChild(title);
    rightBlock.appendChild(active);
    rightBlock.appendChild(archive);
    this.eventBus.emit('getGrid');
  }

  /**
   * Создание списка объявлений профиля
   * @param {*} adverts массив объявлений
   */
  renderGrid(adverts) {
    adverts.forEach((elem) => {
      elem.href = '/advert/' + elem.id;
      elem.image = '/' + elem.image;
    });
    const rightBlock = document.querySelector('.profile-content_right');

    if (adverts.length !== 0) {
      rightBlock.appendChild(createProductGrid(adverts, true, false));
      const cards = document.querySelectorAll('.card');

      cards.forEach((elem, key)=>{
        elem.addEventListener('click', (e)=> {
          if (e.target.classList.contains('card__delete')) {
            e.preventDefault();
            console.log('delete', adverts[key].id);
            this.eventBus.emit('onDeleteClick', adverts[key].id);
          }
        });
      });
    }
  }
  /**
   * Отрисовывает настройки
   */
  renderSettings() {
    this.render();
    const rightBlock = document.querySelector('.profile-content_right');
    rightBlock.innerHTML = '';
    const settingsDiv = settings();
    rightBlock.appendChild(settingsDiv);
    this.eventBus.emit('settingsRendered');
  }
};
