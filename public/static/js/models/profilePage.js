import {Ajax} from '../modules/ajax.js';
import {secureDomainUrl, statusCodes} from '../constatns.js';
import {createDeleteModal} from '../templates/deleteModal/deleteModal.js';


/**
 * Класс модели пользователя
 */
export default class ProfilePageModel {
  /**
  * @description Constructor
  * @param {Object} eventBus to call and subscribe for signals
  */
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.eventBus.on('getGrid', this.getAds.bind(this));
    this.eventBus.on('checkLog', this.checkForLogging.bind(this));
    this.eventBus.on('uploadPhoto', this.uploadPhoto.bind(this));
    this.eventBus.on('settingsRendered', this.handleSettings.bind(this));
    this.eventBus.on('changePassword', this.changePassword.bind(this));
    this.eventBus.on('onDeleteClick', this.handleDelete.bind(this));
  }
  /**
 * Получить все объявления пользователя
 */
  getAds() {
    const res = Ajax.asyncGetUsingFetch({
      url: secureDomainUrl + 'adverts/salesman/' + localStorage.getItem('id'),
      body: null,
    });
    res.then(({parsedBody}) => {
      const {code} = parsedBody;
      if (code === statusCodes.NOTEXIST) {
        return;
      }
      const {adverts} = parsedBody.body;
      this.eventBus.emit('gotAds', adverts);
    });
  }
  /**
 * Проверяет авторизован ли пользователь
 */
  checkForLogging() {
    if (localStorage.getItem('name') === null) {
      this.eventBus.emit('notLogged');
    }
  }

  /**
   * Загружает аватарку на сервер
   * @param {*} formData фото пользователя
   */
  uploadPhoto(formData) {
    const res = Ajax.asyncPostImageUsingFetch({
      url: secureDomainUrl + 'users/profile/upload',
      body: formData,
    });
    res.then(()=>{
      this.eventBus.emit('fileUploaded');
    });
  }
  /**
   * Логика работы настроек
   */
  handleSettings() {
    const photoInput = document.getElementById('file');
    const img = document.getElementById('avatar');
    photoInput.onchange = () => {
      const [file] = photoInput.files;
      if (file) {
        img.src = URL.createObjectURL(file);
      }
    };
    const uploadPhotoBtn =
      document.getElementById('settings__change-uploadPhoto');
    uploadPhotoBtn.addEventListener('click', ()=>{
      const [file] = photoInput.files;
      if (file) {
        const formData = new FormData();
        formData.append('avatar', file);
        this.eventBus.emit('uploadPhoto', formData);
      }
    });
    const email =
    document.getElementById('settingEmail').childNodes[3].placeholder;

    const changeInfoBtn = document.getElementById('settings__change-info');
    changeInfoBtn.addEventListener('click', (e)=>{
      const nameInput = document.getElementById('settingName').childNodes[3];
      let name = nameInput.value.trim();
      const surnInpt = document.getElementById('settingSurname').childNodes[3];
      let surname = surnInpt.value.trim();
      if (name == '') {
        name = nameInput.placeholder;
      }
      if (surname == '') {
        surname = surnInpt.placeholder;
      }
      if (name.length < 2) {
        document.getElementById('settingName').classList.add('text-input_wrong');
        return;
      }
      if (surname.length < 2) {
        document.getElementById('settingName').classList.remove('text-input_wrong');
        document.getElementById('settingSurname').classList.add('text-input_wrong');
        return;
      }
      const response = Ajax.asyncPostUsingFetch({
        url: secureDomainUrl + 'users/profile',
        body: {email, name, surname},
      });
      response.then(({status, parsedBody}) => {
        if (status != statusCodes.OK) {
          return;
        }
        const {code} = parsedBody;
        console.log(parsedBody);
        if (code === statusCodes.OK) {
          window.location.reload();
        };
      });
    });

    const changePasswrdBtn = document.getElementById('settings__change-password');
    changePasswrdBtn.addEventListener('click', (e)=> {
      const password =
      document.getElementById('settingPassword').childNodes[3].value.trim();
      const oldPassword = document.getElementById('settingOldPassword').childNodes[3].value.trim();
      this.eventBus.emit('changePassword', email, oldPassword, password);
    });
  }

  /**
   * Смена пароля
   * @param {*} email
   * @param {*} oldPassword
   * @param {*} password
   * @return
   */
  changePassword(email, oldPassword, password) {
    if (password.length < 5) {
      document.getElementById('settingPassword').classList.add('text-input_wrong');
      return;
    }
    document.getElementById('settingPassword').classList.remove('text-input_wrong');
    const response = Ajax.asyncPostUsingFetch({
      url: secureDomainUrl + 'users/profile/password',
      body: {email: email,
        password: oldPassword,
        new_password: password},
    });
    response.then(({status, parsedBody}) => {
      if (status != statusCodes.OK) {
        return;
      }
      const {code} = parsedBody;
      console.log(parsedBody);
      if (code === statusCodes.OK) {
        document.getElementById('settingOldPassword').classList.remove('text-input_wrong');
        return;
      };
      document.getElementById('settingOldPassword').classList.add('text-input_wrong');
    });
  }

  /**
   * Обработка удаления
   * @param {number} id айдишник объявления
   */
  handleDelete(id) {
    const modalT = createDeleteModal();
    const modal = document.createElement('div');
    modal.innerHTML = modalT();
    document.getElementsByTagName('body')[0].appendChild(modal);
    const modal1 = document.getElementById('modal-1');
    modal1.classList.add('modal_active');
    const closeButton = modal1.getElementsByClassName('modal__close-button')[0];

    closeButton.onclick = function(e) {
      e.preventDefault();
      modal1.classList.remove('modal_active');
      document.getElementsByTagName('body')[0].removeChild(modal);
    };

    modal1.onmousedown = function(e) {
      const modalContent = modal1.getElementsByClassName('modal__content')[0];
      if (e.target.closest('.' + modalContent.className) === null) {
        this.classList.remove('modal_active');
        document.getElementsByTagName('body')[0].removeChild(modal);
      }
    };
    const deleteBtn = document.getElementById('modal__button-delete');
    deleteBtn.addEventListener('click', (e)=>{
      const res = Ajax.asyncDeleteAdUsingFetch({
        url: secureDomainUrl + 'adverts/' + id,
      });
      // обновить страницу если успешно удалил
      res.then(({status, parsedBody}) => {
        if (status != statusCodes.OK) {
          return;
        }
        const {code} = parsedBody;
        if (code === statusCodes.OK) {
          window.location.reload();
        };
      });
    });
  }
}
