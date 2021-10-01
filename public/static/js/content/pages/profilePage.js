import {createProductGrid} from '../templates/productGrid/productGrid.js';
import {createProfileBlock} from '../templates/profileBlock/profileBlock.js';
import {modalWork} from '../../modules/modalWork.js';
import {main} from '../../main.js';
import {secureDomainUrl} from '../../constatns.js';


/**
  * Экспортируемый класс для генерации страницы профиля с сеткой
  * товаров
  * Пока в тестовом режиме!!!
*/
export class ProfilePage {
    #parent

    /**
     * Конструктор класса
     * @param {HTMLElement} parent - родительский элемент страницы,
     *  в который записывается весь контент, чаще всего root
    */
    constructor(parent) {
      this.#parent = parent;
    }

    /**
     * функция отрисовки страницы профиля
     * @param {string} name имя пользователя
     * @param {int} rating рейтинг
     * @param {string} profilePic ссылка на аватар
     * @param {array<JSON>} ads массив объявлений пользователя
     */
    render(name, rating, profilePic, ads) {
      this.#parent.innerHTML = '';

      const content = document.createElement('div');
      content.classList.add('inner-profile-content');
      const contentBlock = document.createElement('div');
      contentBlock.classList.add('profile-info');
      const blockText = document.createElement('h1');
      blockText.innerHTML = 'Ваши объявления';
      contentBlock.appendChild(blockText);
      if (ads != null) {
        contentBlock.appendChild(createProductGrid(ads));
      }
      content.appendChild(createProfileBlock(name, rating, profilePic));
      content.appendChild(contentBlock);
      this.#parent.appendChild(content);
      this.#addEventsToButtons();
    }

    /**
     * Функция связки кнопок на профиле с действиями
     */
    #addEventsToButtons() {
      const exitBtn = document.querySelector('#exit');
      exitBtn.addEventListener('click', (e)=> {
        e.preventDefault();
        const res = Ajax.asyncPostUsingFetch({
          url: secureDomainUrl + 'logout',
          body: null,
        });
        res.then(()=> {
          modalWork();
          main();
        });
      });
    }
};

