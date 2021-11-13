import BaseView from './baseView.js';
import {createNewAdForm} from '../templates/newAdForm/newAdFormT.js';

/**
 * Класс вьюхи страницы добавления нового объявления
 */
export default class NewAdPageView extends BaseView {
  /**
    * Конструктор страницы нового объявления
    * @param {*} eventBus локальный событие автобус
    */
  constructor(eventBus) {
    super(eventBus);
    this.render = this.render.bind(this);
    this.edit = this.edit.bind(this);
    this.sendAd = this.sendAd.bind(this);
    this.editAd = this.editAd.bind(this);
    this.eventBus.on('displayPhotos', this.displayPhotos.bind(this));
  }

  /**
    * Рендер страницы
    */
  render() {
    this.eventBus.emit('checkLog');
    document.getElementById('mini-profile__toogle').checked = false;
    const adFormT = createNewAdForm();
    this.root.innerHTML = adFormT();
    this.eventBus.emit('getCategory');
    this.eventBus.emit('renderDone');
    document.getElementById('newAdForm').addEventListener('click', this.sendAd);
    const photoInput = document.querySelector('.new-advert__images');
    photoInput.addEventListener('change', ()=>{
      this.eventBus.emit('photosAdd', photoInput.files);
      this.eventBus.emit('displayPhotos', photoInput.files);
    });
  }

  /**
   * Функция редактирования
   */
  edit() {
    this.render();
    this.eventBus.emit('getExistData');
    const submitButton = document.getElementById('newAdForm');
    submitButton.removeEventListener('click', this.sendAd);
    submitButton.addEventListener('click', this.editAd);
    submitButton.innerHTML = 'Редактировать';
  }

  /**
   * Новое объявление
   */
  sendAd() {
    this.eventBus.emit('sendAd', true);
  }

  /**
   * Редактирование старого
   */
  editAd() {
    this.eventBus.emit('sendAd', false);
  }

  /**
   * Функция отрисовки файлов
   * @param {*} files
   */
  displayPhotos(files) {
  }
}
