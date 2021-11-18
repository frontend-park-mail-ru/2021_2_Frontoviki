import { createProductGrid } from '../templates/productGrid/productGrid.js';
import { profileInfoBlock } from
  '../templates/profileInfoBlock/profileInfoBlock.js';
import { emptyGrid } from '../templates/productGrid/emptyGrid.js';
import { settings } from '../templates/settings/settings.js';
import BaseView from './baseView.js';
import { inputNum, profileBtnNum } from '../constatns.js';

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
    this.renderCart = this.renderCart.bind(this);
    this.renderSettings = this.renderSettings.bind(this);
    this.renderArchive = this.renderArchive.bind(this);
    this.renderFavorite = this.renderFavorite.bind(this);
    eventBus.on('gotAds', this.renderGrid.bind(this));
    eventBus.on('gotCart', this.renderCartGrid.bind(this));
    this.eventBus.on('passwordChangeOk', this.passwordChanged.bind(this));
    this.eventBus.on('passwordChangeNotOk', this.passwordNotChanged.bind(this));
  }
  /**
    * функция отрисовки страницы профиля
  */
  render() {
    this.eventBus.emit('checkLog');
    document.querySelector('.root__new-advert-btn-wrapper')?.remove();
    document.getElementById('mini-profile__toogle').checked = false;
    this.root.innerHTML = '';
    const profileContent = profileInfoBlock();
    this.root.appendChild(profileContent);
    const rightBlock = document.createElement('div');
    rightBlock.classList.add('profile-content_right');
    profileContent.appendChild(rightBlock);

    const myAdsBtn = document.querySelector('.profile-content__buttons').
        childNodes[profileBtnNum.adBtn];
    myAdsBtn.addEventListener('click', (e) => {
      this.eventBus.emit('getAds');
    });

    const favoriteBtn = document.querySelector('.profile-content__buttons').
        childNodes[profileBtnNum.favBtn];
    favoriteBtn.addEventListener('click', (e) => {
      this.eventBus.emit('renderFavorite');
    });

    const cartBtn = document.querySelector('.profile-content__buttons').
        childNodes[profileBtnNum.cartBtn];
    cartBtn.addEventListener('click', (e) => {
      this.eventBus.emit('renderCart');
    });

    const settingBtn = document.querySelector('.profile-content__buttons').
        childNodes[profileBtnNum.setBtn];
    settingBtn.addEventListener('click', (e) => {
      this.eventBus.emit('getSettings');
    });
  }
  /**
   * Отрисовывает объявления пользователя
   */
  renderAds() {
    this.render();
    // красим кнопочку
    makeBlue(document.querySelector('.profile-content__buttons').
        childNodes[profileBtnNum.adBtn]);

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
    archive.innerHTML = 'Архив';
    archive.classList.add('profile-content-right__ads-type');

    active.addEventListener('click', () => {
      // удаляем предыдущие обявления
      if (document.querySelector('.root__product-grid') !== null) {
        rightBlock.removeChild(document.querySelector('.root__product-grid'));
      }
      this.eventBus.emit('getGrid');
      active.style.color = '#004ad7';
      archive.style.color = 'black';
    });

    archive.addEventListener('click', () => {
      // удаляем предыдущие обявления
      if (document.querySelector('.root__product-grid') !== null) {
        rightBlock.removeChild(document.querySelector('.root__product-grid'));
      }
      this.eventBus.emit('goToArchive');
    });
    rightBlock.appendChild(title);
    rightBlock.appendChild(active);
    rightBlock.appendChild(archive);
    this.eventBus.emit('getGrid');
  }

  /**
   * Создание списка объявлений профиля
   * @param {*} adverts массив объявлений
   * @param {bool} archive если объявления в архиве, то не отображаем удаление
   */
  renderGrid(adverts, archive, favorite) {
    console.log(adverts);
    // поправляем ошибки бэка
    if (adverts === null) {
      adverts = [];
    }
    if (archive || favorite) {
      adverts.forEach((elem) => {
        elem.href = '/ad/' + elem.id;
        elem.image = '/' + elem.images[0];
      });
    } else {
      adverts.forEach((elem) => {
        elem.href = '/ad/' + elem.id;
        elem.image = '/' + elem.image;
      });
    }

    const rightBlock = document.querySelector('.profile-content_right');
    // смотрим осталось ли у нас уведомление о пустой сетке
    const empty = document.getElementById('empty');
    if (empty !== null) {
      rightBlock.removeChild(empty);
    }
    const oldAdverts = document.querySelector('.root__product-grid');
    if (oldAdverts !== null) {
      rightBlock.removeChild(oldAdverts);
    }

    if (adverts.length !== 0) {
      if (archive) {
        rightBlock.appendChild(createProductGrid(adverts, false, false));
        const cards = document.querySelectorAll('.card');
        cards.forEach((elem) => {
          elem.addEventListener('click', (e) => e.preventDefault());
        });
        return;
      }
      rightBlock.appendChild(createProductGrid(adverts, true, false));
      const cards = document.querySelectorAll('.card');
      cards.forEach((elem, key) => {
        elem.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.target.classList.contains('card__delete')) {
            console.log('delete', adverts[key].id);
            if (favorite) {
              this.eventBus.emit('deleteFromFav', adverts[key].id, key);
            } else {
              this.eventBus.emit('onDeleteClick', adverts[key].id, key);
            }
            return;
          }
          this.eventBus.emit('onCardClicked', adverts[key].id);
        });
      });
      return;
    }
    // добавление уведомления об отсутсвии объявлений
    const emptyGridActive = document.createElement('div');
    emptyGridActive.id = 'empty';
    const gridT = emptyGrid();
    if (favorite) {
      emptyGridActive.innerHTML = gridT({text: `В избранном ничего нет`});
    } else if (archive) {
      emptyGridActive.innerHTML = gridT({
        text: `Архивные объявления будут
        отображаться на этой странице`});
    } else {
      emptyGridActive.innerHTML = gridT({text: 'Активных объявлений нет'});
    }
    rightBlock.appendChild(emptyGridActive);
  }

  /**
   * Отрисовка архива если зайдем по ссылке
   */
  renderArchive() {
    this.render();
    // красим кнопочку
    makeBlue(document.querySelector('.profile-content__buttons').
        childNodes[profileBtnNum.adBtn]);

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
    archive.innerHTML = 'Архив';
    archive.classList.add('profile-content-right__ads-type');
    active.style.color = 'black';
    archive.style.color = '#004ad7';
    active.addEventListener('click', () => {
      // удаляем предыдущие обявления
      if (document.querySelector('.root__product-grid') !== null) {
        rightBlock.removeChild(document.querySelector('.root__product-grid'));
      }
      this.eventBus.emit('goToActive');
    });
    rightBlock.appendChild(title);
    rightBlock.appendChild(active);
    rightBlock.appendChild(archive);
    this.eventBus.emit('getArchive');
  }
  /**
   * Отрисовывает настройки
   */
  renderSettings() {
    this.render();
    makeBlue(document.querySelector('.profile-content__buttons').
        childNodes[profileBtnNum.setBtn]);
    const rightBlock = document.querySelector('.profile-content_right');
    rightBlock.innerHTML = '';
    const settingsDiv = settings();
    rightBlock.appendChild(settingsDiv);

    const photoInput = document.getElementById('avatar_loader');
    photoInput.onchange = () => {
      const [file] = photoInput.files;
      if (file) {
        document.querySelector('.profile-content__avatar__image').src =
          URL.createObjectURL(file);
        document.querySelector('.mini-profile__avatar').src =
          URL.createObjectURL(file);
        localStorage.setItem('image', URL.createObjectURL(file));
        const formData = new FormData();
        formData.append('avatar', file);
        this.eventBus.emit('uploadPhoto', formData);
      }
    };
    const phoneInput = document.getElementById('settingPhone').childNodes[3];
    phoneInput.addEventListener('focus', () => {
      if (phoneInput.value < 15) {
        phoneInput.value = '+7(';
      }
    });
    let old = 0;
    phoneInput.addEventListener('keydown', (e) => {
      const curLen = phoneInput.value.length;
      // backspace delete
      if (!/\d/.test(e.key) && e.keyCode != 8 && e.keyCode != 46) {
        e.preventDefault();
        return;
      }
      if (curLen == 16 && /\d/.test(e.key)) {
        e.preventDefault();
        return;
      }
      if (curLen < old) {
        old = curLen;
        return;
      }
      if (e.keyCode == 8 || e.keyCode == 46) {
        return;
      }
      if (curLen == 6) {
        phoneInput.value = phoneInput.value + ')';
      }
      if (curLen == 10) {
        phoneInput.value = phoneInput.value + '-';
      }
      if (curLen == 13) {
        phoneInput.value = phoneInput.value + '-';
      }
      old++;
    });
    const changeInfoBtn = document.getElementById('settings__change-info');
    changeInfoBtn.addEventListener('click',
        () => this.eventBus.emit('validateProfileInfo'));

    const changePasswrdBtn = document.
        getElementById('settings__change-password');
    changePasswrdBtn.addEventListener('click', (e) => {
      const passwordDiv = document.getElementById('settingPassword');
      const oldPasswordDiv = document.getElementById('settingOldPassword');
      const password = passwordDiv.childNodes[inputNum].value.trim();
      const oldPassword = oldPasswordDiv.childNodes[inputNum].value.trim();
      passwordDiv.classList.remove('text-input_correct');
      oldPasswordDiv.classList.remove('text-input_correct');
      this.eventBus.emit('changePassword', oldPassword, password);
    });
  }

  /**
   * Отрисовывает избранное
   */
  renderFavorite() {
    this.render();
    makeBlue(document.querySelector('.profile-content__buttons').
        childNodes[profileBtnNum.favBtn]);
    const rightBlock = document.querySelector('.profile-content_right');
    rightBlock.innerHTML = '';
    const title = document.createElement('h3');
    title.classList.add('profile-content__title');
    title.innerHTML = ' Избранное ';
    rightBlock.appendChild(title);
    this.eventBus.emit('getFavorite');
  }

  /**
   * Отрисовывает корзину
   */
  renderCart() {
    this.render();
    makeBlue(document.querySelector('.profile-content__buttons').
        childNodes[profileBtnNum.cartBtn]);
    const rightBlock = document.querySelector('.profile-content_right');
    rightBlock.innerHTML = '';
    const title = document.createElement('h3');
    title.classList.add('profile-content__title');
    title.innerHTML = ' Корзина ';
    rightBlock.appendChild(title);
    this.eventBus.emit('getCart');
  }

  /**
   * Отрисовка объявлений в корзине
   * @param {*} adverts
   */
  renderCartGrid(adverts) {
    const rightBlock = document.querySelector('.profile-content_right');
    const oldAdverts = document.querySelector('.root__product-grid');
    if (oldAdverts !== null) {
      rightBlock.removeChild(oldAdverts);
    }
    if (adverts.length === 0) {
      const rightBlock = document.querySelector('.profile-content_right');
      // смотрим осталось ли у нас уведомление о пустой сетке
      const empty = document.getElementById('empty');
      if (empty !== null) {
        rightBlock.removeChild(empty);
      }
      // добавление уведомления об отсутсвии объявлений
      const emptyGridActive = document.createElement('div');
      emptyGridActive.id = 'empty';
      const gridT = emptyGrid();
      emptyGridActive.innerHTML = gridT({text: 'Корзина пуста'});
      rightBlock.appendChild(emptyGridActive);
      return;
    }
    adverts.forEach((elem) => {
      elem.href = '/ad/' + elem.id;
      elem.image = '/' + elem.images[0];
    });
    rightBlock.appendChild(createProductGrid(adverts, true, true));
    const cards = document.querySelectorAll('.card');
    cards.forEach((elem, key) => {
      elem.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // удаляем
        if (e.target.classList.contains('card__delete')) {
          e.preventDefault();
          this.eventBus.emit('deleteFromCart', adverts[key].id, key);
          return;
        }
        // покупаем
        if (e.target.classList.contains('card-info__card_buy')) {
          e.preventDefault();
          console.log('buy');
          this.eventBus.emit('buyFromCart', adverts[key], key);
          return;
        }
        // просто переходим на страницу
        this.eventBus.emit('onCardClicked', adverts[key].id);
      });
    });
  }

  /**
   * Показываем, что пароль успешно изменен
   */
  passwordChanged() {
    const passwordDiv = document.getElementById('settingPassword');
    document.getElementById('settingOldPassword').
        classList.remove('text-input_wrong');
    document.getElementById('settingOldPassword').
        classList.add('text-input_correct');
    passwordDiv.classList.add('text-input_correct');
    document.getElementById('settings__change-password').innerHTML=
      'Пароль изменен';
  }
  /**
    * Старый пароль не совпал с новым
    */
  passwordNotChanged() {
    document.getElementById('settingOldPassword').
        classList.add('text-input_wrong');
  }
};

/**
 * Делает кнопку активной
 * @param {HTMLButtonElement} Btn кнопка которую надо покрасить
 */
function makeBlue(Btn) {
  Btn.classList.add('profile-content__button_active');
  Btn.classList.remove('profile-content__button');
  Btn.childNodes[1].classList.add('profile-content__button_icon_active');
  Btn.childNodes[1].classList.remove('profile-content__button_icon');
}
