import BaseView from './baseView.js';
import {createNewAdForm} from '../templates/newAdForm/newAdFormT.js';
import {categories} from '../constatns.js';

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
  }

  /**
    * Рендер страницы
    */
  render() {
    this.eventBus.emit('checkLog');
    document.getElementById('mini-profile__toogle').checked = false;
    const adFormT = createNewAdForm();
    this.root.innerHTML = adFormT();
    const select = document.getElementById('selCategory');
    categories.forEach((elem) => {
      const el = document.createElement('option');
      el.value = elem;
      el.innerHTML = elem;
      select.appendChild(el);
    });
    this.eventBus.emit('renderDone');
    document.getElementById('newAdForm').addEventListener('click', (e)=>{
      this.eventBus.emit('sendAd');
    });
  }
}
