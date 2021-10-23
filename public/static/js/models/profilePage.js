import {Ajax} from '../modules/ajax.js';
import {secureDomainUrl, statusCodes} from '../constatns.js';


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
      console.log(adverts);
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

    const changeInfoBtn = document.getElementById('settings__change-info');
    changeInfoBtn.addEventListener('click', (e)=>{
      const nameInput = document.getElementById('settingName').childNodes[3];
      let name = nameInput.value.trim();
      const surnInpt = document.getElementById('settingSurname').childNodes[3];
      let surname = surnInpt.value.trim();
      const email =
        document.getElementById('settingEmail').childNodes[3].placeholder;
      const password =
        document.getElementById('settingPassword').childNodes[3].value.trim();
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
      if (password.length < 5) {
        document.getElementById('settingSurname').classList.remove('text-input_wrong');
        document.getElementById('settingPassword').classList.add('text-input_wrong');
        return;
      }
      document.getElementById('settingPassword').classList.remove('text-input_wrong');
      console.log(password);
      const response = Ajax.asyncPostUsingFetch({
        url: secureDomainUrl + 'users/profile',
        body: {email, password, name, surname},
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
  }
}
