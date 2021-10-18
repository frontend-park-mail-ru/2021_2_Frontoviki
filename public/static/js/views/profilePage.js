import {createProductGrid} from '../templates/productGrid/productGrid.js';
import {profileInfoBlock} from '../templates/profileInfoBlock/profileInfoBlock.js';
import { settings } from '../templates/settings/settings.js';
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
    eventBus.on('gotAds', this.renderAds.bind(this));
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
    this.eventBus.emit('getAds');
  }

  /**
   * Отрисовывает объявления пользователя
   * @param {jsonArray} ads массив объявлений
   */
  renderAds(ads) {
    const rightBlock = document.querySelector('.profile-content_right');
    rightBlock.innerHTML = '';
    const title = document.createElement('h3');
    title.classList.add('profile-content__title');
    title.innerHTML = ' Ваши объявления ';
    rightBlock.appendChild(title);
    if (ads!= null) {
      rightBlock.appendChild(createProductGrid({jsonElements: ads}, true, false));
    }
  }
  /**
   * Отрисовывает настройки
   * @param {json} profileInfo полная информация о профиле
   */
  renderSettings(profileInfo) {
    const rightBlock = document.querySelector('.profile-content_right');
    rightBlock.innerHTML = '';
    const settingsDiv = settings();
    rightBlock.appendChild(settingsDiv);
  }
};

