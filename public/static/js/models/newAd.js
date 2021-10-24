import {Ajax} from '../modules/ajax.js';
import {secureDomainUrl, statusCodes, categories} from '../constatns.js';

/**
 * Класс модели нового объявления
 */
export default class NewAdPageModel {
  #coords
  /**
    * @description Constructor
    * @param {Object} eventBus to call and subscribe for signals
    */
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.eventBus.on('renderDone', this.initMap.bind(this));
    this.eventBus.on('checkLog', this.checkForLogging.bind(this));
    this.eventBus.on('sendAd', this.sendAd.bind(this));
    this.eventBus.on('successSend', this.sendPhoto.bind(this));
  }

  /**
   * Функция иниализация яндекс карт
   */
  initMap() {
    ymaps.ready(() => {
      const myMap = new ymaps.Map('YMapsID', {
        center: [55.766062, 37.684488],
        zoom: 13,
      });
      myMap.events.add('click', async (e) => {
        const coords = e.get('coords');
        const myGeoObject = new ymaps.GeoObject({
          geometry: {
            type: 'Point', // тип геометрии - точка
            coordinates: coords, // координаты точки
          },
        });
        this.#coords = coords;
        console.log(coords);
        myMap.geoObjects.removeAll();
        myMap.geoObjects.add(myGeoObject);
        const response =
          await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=&format=json&geocode=${coords[1].toFixed(6)},${coords[0].toFixed(6)}`);
        const json = await response.json();
        let data = json.response.GeoObjectCollection.featureMember[0].GeoObject.metaDataProperty.GeocoderMetaData.Address.formatted;
        console.log(data);
        data = data.split(' ');
        data = data.slice(1);
        data = data.join(' ');
        document.querySelector('.new-advert__location').childNodes[3].value = data;
      });
    });
  }

  /**
   * Проверка на то, зарегистрирован ли пользователь
   */
  checkForLogging() {
    if (localStorage.getItem('name') === null) {
      this.eventBus.emit('notLogged');
    }
  }

  /**
   * отправка объявления на сервер
   */
  sendAd() {
    const nameDiv = document.querySelector('.new-advert__name');
    const title = nameDiv.childNodes[3].value.trim();
    if (!validate(nameDiv)) {
      return;
    }
    const category = document.getElementById('selCategory').value;
    const descriptionDiv = document.querySelector('.new-advert__description');
    const description = descriptionDiv.childNodes[3].value.trim();
    if (!validate(descriptionDiv)) {
      return;
    }
    const condition = document.getElementById('radio-new').checked;
    const priceDiv = document.querySelector('.new-advert__price');
    const price = priceDiv.childNodes[3].value.trim();
    if (price.length === 0) {
      priceDiv.classList.add('text-input_wrong');
      return;
    }
    priceDiv.classList.remove('text-input_wrong');
    const coords = this.#coords;
    console.log(coords);
    if (coords === undefined) {
      document.querySelector('.new-advert__location').classList.add('text-input_wrong');
      return;
    }
    document.querySelector('.new-advert__location').classList.remove('text-input_wrong');
    const address = document.querySelector('.new-advert__location').childNodes[3].value.trim();
    console.log('name:',
        title,
        'category:', category,
        'description:', description,
        'condition-new:', condition,
        'price:', price,
        'coords:', coords);

    const response = Ajax.asyncPostUsingFetch({
      url: secureDomainUrl + 'adverts',
      body: {
        name: title,
        description: description,
        category: category,
        is_new: condition,
        price: Number(price),
        location: address,
        latitude: coords[0],
        longitude: coords[1],
        amount: 1,
      },
    });
    response.then(({status, parsedBody}) => {
      if (status != statusCodes.OK) {
        return;
      }
      const {code} = parsedBody;
      console.log(code, parsedBody);
      if (code == statusCodes.REGDONE) {
        const id = parsedBody.body.advert.id;
        this.eventBus.emit('successSend', id);
      }
    });
  }

  /**
   * Отправляет фото
   * @param {number} id id объявления
   */
  sendPhoto(id) {
    const [file] = document.querySelector('.new-advert__images').files;
    const formData = new FormData();
    formData.append('images', file);
    const res = Ajax.asyncPostImageUsingFetch({
      url: secureDomainUrl + 'adverts/' + id + '/upload',
      body: formData,
    });
    res.then(({status, parsedBody})=>{
      if (status != statusCodes.OK) {
        return;
      }
      const {code} = parsedBody;
      console.log(code, parsedBody);
      console.log('hooray!');
      this.eventBus.emit('photosSend');
    });
  }
}

/**
 * проверка валидности формы инпута
 * @param {HTMLDivElement} div див с формой
 * @return {Boolean} тру если валидна
 */
function validate(div) {
  const text = div.childNodes[3].value.trim();
  if (text.length < 2) {
    div.classList.add('text-input_wrong');
    return false;
  }
  div.classList.remove('text-input_wrong');
  return true;
}
