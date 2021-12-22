import {createProductGrid} from '../templates/productGrid/productGrid';
import {profileInfoBlock} from
  '../templates/profileInfoBlock/profileInfoBlock';
import {emptyGrid} from '../templates/productGrid/emptyGrid';
import {settings} from '../templates/settings/settings';
import BaseView from './baseView';
import {inputNum, profileBtnNum, userInfo} from '../constatns';
import Bus from '../modules/EventBus';
import { card, dialog, message } from '../types';
import { chatTemplateGenerator, chatToogleTemplateGenerator } from '../templates/chat/chat';
import { createAdvBlock } from '../templates/chat/chatInner';
import { createChatMessage } from '../templates/chat/chatMessage';
import { createChatInput } from '../templates/chat/chatInput';
import { createChatTime } from '../templates/chat/chatDateMessage';

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
  constructor(eventBus : Bus) {
    super(eventBus);
    this.render = this.render.bind(this);
    this.renderAds = this.renderAds.bind(this);
    this.renderCart = this.renderCart.bind(this);
    this.renderSettings = this.renderSettings.bind(this);
    this.renderArchive = this.renderArchive.bind(this);
    this.renderFavorite = this.renderFavorite.bind(this);
    this.renderChat = this.renderChat.bind(this);
    this.renderChatMessage = this.renderChatMessage.bind(this);
    this.renderPromotion = this.renderPromotion.bind(this);
    this.eventBus.on('gotAds', this.renderGrid.bind(this));
    this.eventBus.on('gotCart', this.renderCartGrid.bind(this));
    this.eventBus.on('passwordChangeOk', this.passwordChanged.bind(this));
    this.eventBus.on('passwordChangeNotOk', this.passwordNotChanged.bind(this));
    this.eventBus.on('foundDialogs', this.renderChatView.bind(this));
    this.eventBus.on('historyFound', this.chatHistory.bind(this));
    this.eventBus.on('connectionOpened', this.chatHandleSend.bind(this));
    this.eventBus.on('messageReceived', this.chatHandleReceive.bind(this));
  }
  /**
    * функция отрисовки страницы профиля
  */
  render() {
    this.eventBus.emit('checkLog');
    document.querySelector('.root__new-advert-btn-wrapper')?.remove();
    (<HTMLInputElement>document.getElementById('mini-profile__toogle')).checked = false;
    this.root.innerHTML = '';
    const profileContent = profileInfoBlock();
    this.root.appendChild(profileContent);
    const rightBlock = document.createElement('div');
    rightBlock.classList.add('profile-content_right');
    profileContent.appendChild(rightBlock);

    const myAdsBtn = document.querySelector('.profile-content__buttons')?.
        childNodes[profileBtnNum.adBtn];
    myAdsBtn?.addEventListener('click', () => {
      this.eventBus.emit('getAds');
    });

    const favoriteBtn = document.querySelector('.profile-content__buttons')?.
        childNodes[profileBtnNum.favBtn];
    favoriteBtn?.addEventListener('click', () => {
      this.eventBus.emit('renderFavorite');
    });

    const cartBtn = document.querySelector('.profile-content__buttons')?.
        childNodes[profileBtnNum.cartBtn];
    cartBtn?.addEventListener('click', () => {
      this.eventBus.emit('renderCart');
    });

    const paidBtn = document.querySelector('.profile-content__buttons')?.
        childNodes[profileBtnNum.paidBtn];
    paidBtn?.addEventListener('click', () => {
      this.eventBus.emit('renderPaid');
    });

    const settingBtn = document.querySelector('.profile-content__buttons')?.
        childNodes[profileBtnNum.setBtn];
    settingBtn?.addEventListener('click', () => {
      this.eventBus.emit('getSettings');
    });

    const chatBtn = document.querySelector('.profile-content__buttons')?.
        childNodes[profileBtnNum.chatBtn];
    chatBtn?.addEventListener('click', () => {
      this.eventBus.emit('renderChat');
    });
  }
  /**
   * Отрисовывает объявления пользователя
   */
  renderAds() {
    this.render();
    // красим кнопочку
    makeBlue(<HTMLButtonElement>document.querySelector('.profile-content__buttons')?.
        childNodes[profileBtnNum.adBtn]);

    const rightBlock = document.querySelector('.profile-content_right');
    if (rightBlock != null) {
      rightBlock.innerHTML = '';
    }
    const title = document.createElement('h3');
    title.classList.add('profile-content__title');
    title.innerHTML = <string> window.localizer.getLocaleItem('yourAdverts');
    const active = document.createElement('span');
    active.innerHTML =  <string> window.localizer.getLocaleItem('active');
    active.classList.add('profile-content-right__ads-type');
    active.style.color = '#004ad7';
    const archive = document.createElement('span');
    archive.innerHTML =  <string> window.localizer.getLocaleItem('archive');
    archive.classList.add('profile-content-right__ads-type');

    active.addEventListener('click', () => {
      // удаляем предыдущие обявления
      if (document.querySelector('.grid-container') !== null) {
        rightBlock?.removeChild(<HTMLDivElement>document.querySelector('.grid-container'));
      }
      this.eventBus.emit('getGrid');
      active.style.color = '#004ad7';
      archive.style.color = 'black';
    });

    archive.addEventListener('click', () => {
      // удаляем предыдущие обявления
      if (document.querySelector('.grid-container') !== null) {
        rightBlock?.removeChild(<HTMLDivElement>document.querySelector('.grid-container'));
      }
      this.eventBus.emit('goToArchive');
    });
    rightBlock?.appendChild(title);
    rightBlock?.appendChild(active);
    rightBlock?.appendChild(archive);
    this.eventBus.emit('getGrid');
  }

  /**
   * Создание списка объявлений профиля
   * @param {*} adverts массив объявлений
   * @param {bool} archive если объявления в архиве, то не отображаем удаление
   */
  renderGrid(adverts: card[], archive: boolean, favorite: boolean, promotted: boolean) {
    // поправляем ошибки бэка
    if (adverts === null) {
      adverts = [];
    }
    if (archive || favorite) {
      adverts.forEach((elem) => {
        elem.href = `/ad/${elem.id}`;
        elem.image = '/' + elem.images[0];
      });
    } else {
      adverts.forEach((elem) => {
        elem.href = `/ad/${elem.id}`;
        elem.image = '/' + elem.image;
      });
    }

    const rightBlock = document.querySelector('.profile-content_right');
    // смотрим осталось ли у нас уведомление о пустой сетке
    const empty = document.getElementById('empty');
    if (empty !== null) {
      rightBlock?.removeChild(empty);
    }
    const oldAdverts = document.querySelector('.grid-container');
    if (oldAdverts !== null) {
      rightBlock?.removeChild(oldAdverts);
    }

    if (adverts.length !== 0) {
      if (archive) {
        rightBlock?.appendChild(createProductGrid(adverts, false, false));
        const cards = document.querySelectorAll('.card');
        cards.forEach((elem) => {
          elem.classList.add('archived');
        });
        return;
      }
      if (promotted) {
        rightBlock?.appendChild(createProductGrid(adverts, false, false));
        const cards = document.querySelectorAll('.card');
        cards.forEach((elem, key) => {
          elem.addEventListener('click', () =>{
            this.eventBus.emit('goToUpgrade', adverts[key].id);
          });
        });
        return;
      }
      rightBlock?.appendChild(createProductGrid(adverts, true, false));
      const cards = document.querySelectorAll('.card');
      cards.forEach((elem, key) => {
        elem.addEventListener('click', (e) => {
          if ((<HTMLElement>e.target)?.classList.contains('card__delete')) {
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
      emptyGridActive.innerHTML = gridT({text: window.localizer.getLocaleItem('emptyFav')});
    } else if (archive) {
      emptyGridActive.innerHTML = gridT({text: window.localizer.getLocaleItem('emptyArchive')});
    } else {
      emptyGridActive.innerHTML = gridT({text: window.localizer.getLocaleItem('emptyActive')});
    }
    rightBlock?.appendChild(emptyGridActive);
  }

  renderPromotion() {
    this.render();
    // красим кнопочку
    makeBlue(<HTMLButtonElement>document.querySelector('.profile-content__buttons')?.
        childNodes[profileBtnNum.paidBtn]);

    const rightBlock = document.querySelector('.profile-content_right');
    if (rightBlock != null) {
      rightBlock.innerHTML = '';
    }
    const title = document.createElement('h3');
    title.classList.add('profile-content__title');
    title.innerHTML = <string> window.localizer.getLocaleItem('promotion');
    const promotionHint = document.createElement('span');
    promotionHint.innerHTML =  <string> window.localizer.getLocaleItem('promotionHint');
    promotionHint.classList.add('profile-content-right__ads-promote');
    promotionHint.style.color = '#black';
    rightBlock?.appendChild(title);
    rightBlock?.appendChild(promotionHint);
    this.eventBus.emit('getPromotted');
  }

  /**
   * Отрисовка архива если зайдем по ссылке
   */
  renderArchive() {
    this.render();
    // красим кнопочку
    makeBlue(<HTMLButtonElement>document.querySelector('.profile-content__buttons')?.
        childNodes[profileBtnNum.adBtn]);

    const rightBlock = document.querySelector('.profile-content_right');
    if (rightBlock != null) {
      rightBlock.innerHTML = '';
    }
    const title = document.createElement('h3');
    title.classList.add('profile-content__title');
    title.innerHTML = <string> window.localizer.getLocaleItem('yourAdverts');
    const active = document.createElement('span');
    active.innerHTML =  <string> window.localizer.getLocaleItem('active');
    active.classList.add('profile-content-right__ads-type');
    active.style.color = '#004ad7';
    const archive = document.createElement('span');
    archive.innerHTML =  <string> window.localizer.getLocaleItem('archive');
    archive.classList.add('profile-content-right__ads-type');
    active.style.color = 'black';
    archive.style.color = '#004ad7';
    active.addEventListener('click', () => {
      // удаляем предыдущие обявления
      if (document.querySelector('.grid-container') !== null) {
        rightBlock?.removeChild(<HTMLDivElement>document.querySelector('.grid-container'));
      }
      this.eventBus.emit('goToActive');
    });
    rightBlock?.appendChild(title);
    rightBlock?.appendChild(active);
    rightBlock?.appendChild(archive);
    this.eventBus.emit('getArchive');
  }
  /**
   * Отрисовывает настройки
   */
  renderSettings() {
    this.render();
    makeBlue(<HTMLButtonElement>document.querySelector('.profile-content__buttons')?.
        childNodes[profileBtnNum.setBtn]);
    const rightBlock = document.querySelector('.profile-content_right');
    if (rightBlock != null) {
      rightBlock.innerHTML = '';
    }
    const settingsDiv = settings();
    rightBlock?.appendChild(settingsDiv);

    const photoInput = document.getElementById('avatar_loader') as HTMLInputElement;
    photoInput.onchange = () => {
      const file = photoInput.files;
      if (file) {
        (<HTMLImageElement>document.querySelector('.profile-content__avatar__image'))
            .src = URL.createObjectURL(file[0]);
        (<HTMLImageElement>document.querySelector('.mini-profile__avatar'))
            .src = URL.createObjectURL(file[0]);
        userInfo.set('image', URL.createObjectURL(file[0]));
        const formData = new FormData();
        formData.append('avatar', file[0]);
        this.eventBus.emit('uploadPhoto', formData);
      }
    };
    const phoneInput = document.getElementById('settingPhone')?.childNodes[3] as HTMLInputElement;
    phoneInput?.addEventListener('focus', () => {
      if (phoneInput.value.length < 15) {
        phoneInput.value = '+7(';
      }
    });
    let old = 0;
    phoneInput.addEventListener('keydown', (e) => {
      const curLen = phoneInput.value.length;
      // backspace delete
      if (!/\d/.test(e.key) && e.key != 'Backspace' && e.key != 'Delete') {
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
      if (e.key == 'Backspace' || e.key == 'Delete') {
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
    changeInfoBtn?.addEventListener('click',
        () => this.eventBus.emit('validateProfileInfo'));

    const changePasswrdBtn = document.
        getElementById('settings__change-password');
    changePasswrdBtn?.addEventListener('click', () => {
      const passwordDiv = document.getElementById('settingPassword');
      const oldPasswordDiv = document.getElementById('settingOldPassword');
      const password = (<HTMLInputElement>passwordDiv?.childNodes[inputNum]).value.trim();
      const oldPassword = (<HTMLInputElement>oldPasswordDiv?.childNodes[inputNum]).value.trim();
      passwordDiv?.classList.remove('text-input_correct');
      oldPasswordDiv?.classList.remove('text-input_correct');
      this.eventBus.emit('changePassword', oldPassword, password);
    });
  }

  renderChat() {
    this.render();
    makeBlue(<HTMLButtonElement>document.querySelector('.profile-content__buttons')?.
        childNodes[profileBtnNum.chatBtn]);
    const rightBlock = document.querySelector('.profile-content_right');
    if (rightBlock != null) {
      rightBlock.innerHTML = '';
    }
    const title = document.createElement('h3');
    title.classList.add('profile-content__title');
    title.innerHTML = <string>window.localizer.getLocaleItem('chat');
    rightBlock?.appendChild(title);
    this.eventBus.emit('getMessages', false);
  }

  /**
   * Отрисовывает избранное
   */
  renderFavorite() {
    this.render();
    makeBlue(<HTMLButtonElement>document.querySelector('.profile-content__buttons')?.
        childNodes[profileBtnNum.favBtn]);
    const rightBlock = document.querySelector('.profile-content_right');
    if (rightBlock != null) {
      rightBlock.innerHTML = '';
    }
    const title = document.createElement('h3');
    title.classList.add('profile-content__title');
    title.innerHTML = <string>window.localizer.getLocaleItem('favorite');
    rightBlock?.appendChild(title);
    this.eventBus.emit('getFavorite');
  }

  /**
   * Отрисовывает корзину
   */
  renderCart() {
    this.render();
    makeBlue(<HTMLButtonElement>document.querySelector('.profile-content__buttons')?.
        childNodes[profileBtnNum.cartBtn]);
    const rightBlock = document.querySelector('.profile-content_right');
    if (rightBlock != null) {
      rightBlock.innerHTML = '';
    }
    const title = document.createElement('h3');
    title.classList.add('profile-content__title');
    title.innerHTML = <string>window.localizer.getLocaleItem('cart');
    rightBlock?.appendChild(title);
    this.eventBus.emit('getCart');
  }

  /**
   * Отрисовка объявлений в корзине
   * @param {*} adverts
   */
  renderCartGrid(adverts : card[]) {
    const rightBlock = document.querySelector('.profile-content_right');
    const oldAdverts = document.querySelector('.grid-container');
    if (oldAdverts !== null) {
      rightBlock?.removeChild(oldAdverts);
    }
    if (adverts.length === 0) {
      const rightBlock = document.querySelector('.profile-content_right');
      // смотрим осталось ли у нас уведомление о пустой сетке
      const empty = document.getElementById('empty');
      if (empty !== null) {
        rightBlock?.removeChild(empty);
      }
      // добавление уведомления об отсутсвии объявлений
      const emptyGridActive = document.createElement('div');
      emptyGridActive.id = 'empty';
      const gridT = emptyGrid();
      emptyGridActive.innerHTML = gridT({text: window.localizer.getLocaleItem('emptyCart')});
      rightBlock?.appendChild(emptyGridActive);
      return;
    }
    adverts.forEach((elem) => {
      elem.href = `/ad/${elem.id}`;
      elem.image = '/' + elem.images[0];
    });
    rightBlock?.appendChild(createProductGrid(adverts, true, true));
    const cards = document.querySelectorAll('.card');
    cards.forEach((elem, key) => {
      elem.addEventListener('click', (e) => {
        // удаляем
        if ((<HTMLElement>e.target)?.classList.contains('card__delete')) {
          e.preventDefault();
          this.eventBus.emit('deleteFromCart', adverts[key].id, key);
          return;
        }
        // покупаем
        if ((<HTMLElement>e.target)?.classList.contains('card-info__card_buy')) {
          e.preventDefault();
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
    document.getElementById('settingOldPassword')?.
        classList.remove('text-input_wrong');
    document.getElementById('settingOldPassword')?.
        classList.add('text-input_correct');
    passwordDiv?.classList.add('text-input_correct');
    const passwordBtn = document.getElementById('settings__change-password');
    if (passwordBtn != null) {
      passwordBtn.innerHTML = <string>window.localizer.getLocaleItem('passwordChanged');
    }
  }
  /**
    * Старый пароль не совпал с новым
    */
  passwordNotChanged() {
    document.getElementById('settingOldPassword')?.
        classList.add('text-input_wrong');
  }

  /**
   * Рисуем чатик
   */
  renderChatView(dialogs: dialog[], isDetailed: boolean) {
    const rightBlock = document.querySelector('.profile-content_right');
    if (rightBlock != null) {
      const chatInputT = chatToogleTemplateGenerator();
      const chatInput = document.createElement('input');
      chatInput.type = 'checkbox';
      chatInput.classList.add('chat_toogle');
      chatInput.id = 'chat_toogle';
      rightBlock.appendChild(chatInput);

      const chatLabel = document.createElement('label');
      chatLabel.classList.add('chat_icons');
      chatLabel.htmlFor = 'chat_toogle';
      chatLabel.innerHTML = chatInputT();
      rightBlock.appendChild(chatLabel);

      const chatT = chatTemplateGenerator();
      const chatContainer = document.createElement('div');
      chatContainer.id = 'chat';
      chatContainer.classList.add('chat');
      chatContainer.innerHTML = chatT({dialog: dialogs});
      rightBlock.appendChild(chatContainer);
      if (isDetailed) {
        // Ищем активный чатик
        const chats = document.querySelectorAll('.chat_chats_panel');
        (<NodeListOf<HTMLDivElement>>chats).forEach((elem: HTMLDivElement)=>{
          if (elem.getAttribute('advertId') != window.location.pathname.split('/')[4] ||
           elem.getAttribute('dataset') != window.location.pathname.split('/')[3]) {
            elem.classList.remove('chat_chats_panel__active');
          } else {
            elem.classList.add('chat_chats_panel__active');
          }
        });
        const active = document.querySelector('.chat_chats_panel__active');
        document.querySelector('.chat')?.appendChild(createAdvBlock(<string>active?.getAttribute('advertTitle'),
          <string>active?.getAttribute('advertLocation'), 
          <string>active?.getAttribute('advertPrice'), 
          `/${<string>active?.getAttribute('advertImg')}`,
          <string>active?.getAttribute('advertId')
        ));
        const messageBlock = document.createElement('div');
        messageBlock.classList.add('chat_history');
        document.querySelector('.chat')?.appendChild(messageBlock);
        document.querySelector('.chat')?.appendChild(createChatInput());
        // пока вызывает эпилепсию :(
        // window.scrollTo(0,document.body.scrollHeight);
        this.eventBus.emit('connectToDialog');
      }

      const chats = document.querySelectorAll('.chat_chats_panel');
      (<NodeListOf<HTMLDivElement>>chats).forEach((elem: HTMLDivElement)=>{
        elem.addEventListener('click', ()=> {
          this.eventBus.emit('goToDialog', elem.getAttribute('dataset'), elem.getAttribute('advertId'));
        })
      })
    }
  }

  renderChatMessage() {
    this.render();
    makeBlue(<HTMLButtonElement>document.querySelector('.profile-content__buttons')?.
        childNodes[profileBtnNum.chatBtn]);
    const rightBlock = document.querySelector('.profile-content_right');
    if (rightBlock != null) {
      rightBlock.innerHTML = '';
    }
    const title = document.createElement('h3');
    title.classList.add('profile-content__title');
    title.innerHTML = <string>window.localizer.getLocaleItem('chat');
    rightBlock?.appendChild(title);
    this.eventBus.emit('getMessages', true);
  }

  chatHistory(messages: message[]) {
    if (messages == null) {
      return;
    }
    let prevDate = '';
    messages.forEach((elem)=>{
      let message: HTMLDivElement;
      const curDate = elem.created_at.slice(0,10);
      if (prevDate != curDate) {
        message = createChatTime(curDate);
        document.querySelector('.chat_history')?.appendChild(message);
        prevDate = curDate;
      }
      if (elem.info.from.toString() != userInfo.get('id')) {
        message = createChatMessage(elem.message, elem.created_at.slice(11, 16), true);
      } else {
        message = createChatMessage(elem.message, elem.created_at.slice(11, 16), false);
      }
      document.querySelector('.chat_history')?.appendChild(message);
    });
    scrollChat();
  }

  chatHandleSend(websocket: WebSocket) {
    const submitBtn = document.querySelector('.chat_input_button');
    const chatInput = document.querySelector('.chat_input_input') as HTMLInputElement;
    submitBtn?.addEventListener('click', ()=> {
      send();
    });
    chatInput?.addEventListener('keydown', (e): void=>{
      if (e.key === 'Enter') {
        send();
      }
    });

    function send() {
      if (chatInput.value.length > 0) {
        websocket.send(chatInput.value);
        const date = new Date();
        const dates = document.querySelectorAll('.chat_history_element__date');
        if (dates.length == 0 || dates[dates.length - 1].innerHTML.slice(0,2) != date.getDate().toString()) {
          const time = createChatTime(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
          document.querySelector('.chat_history')?.appendChild(time);
        }
        const message = createChatMessage(chatInput.value, `${date.getHours()}:${date.getMinutes()}`, false);
        chatInput.value = '';
        document.querySelector('.chat_history')?.appendChild(message);
        scrollChat();
      }
    }
  }

  chatHandleReceive(receivedMessage: string) {
    const date = new Date();
    const message = createChatMessage(receivedMessage, `${date.getHours()}:${date.getMinutes()}`, true);
    document.querySelector('.chat_history')?.appendChild(message);
    scrollChat();
  }
}

/**
 * Делает кнопку активной
 * @param {HTMLButtonElement} Btn кнопка которую надо покрасить
 */
function makeBlue(Btn : HTMLButtonElement) {
  Btn.classList.add('profile-content__button_active');
  Btn.classList.remove('profile-content__button');
  (<HTMLParagraphElement>Btn.childNodes[1]).classList.add('profile-content__button_icon_active');
  (<HTMLParagraphElement>Btn.childNodes[1]).classList.remove('profile-content__button_icon');
}

function scrollChat(): void {
  const visible = document.querySelector('.chat_history') as HTMLElement;
  visible?.scroll(0, visible?.offsetHeight);
}