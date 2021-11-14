import {Ajax} from '../modules/ajax.js';
import {idNum, inputNum, minValidationLen,
  secureDomainUrl, statusCodes} from '../constatns.js';

/**
 * Класс модели нового объявления
 */
export default class NewAdPageModel {
  #coords
  #myMap
  /**
    * @description Constructor
    * @param {Object} eventBus to call and subscribe for signals
    */
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.eventBus.on('renderDone', this.initMap.bind(this));
    this.eventBus.on('sendAd', this.validateAd.bind(this));
    this.eventBus.on('successSend', this.validatePhoto.bind(this));
    this.eventBus.on('getExistData', this.getData.bind(this));
    this.eventBus.on('getCategory', this.getCategories.bind(this));
  }

  /**
   * Функция иниализация яндекс карт
   */
  initMap() {
    this.#coords = null;
    ymaps.ready(() => {
      this.#myMap = new ymaps.Map('YMapsID', {
        center: [55.766062, 37.684488],
        zoom: 13,
      });
      this.#myMap.events.add('click', async (e) => {
        const coords = e.get('coords');
        const myGeoObject = new ymaps.GeoObject({
          geometry: {
            type: 'Point', // тип геометрии - точка
            coordinates: coords, // координаты точки
          },
        });
        this.#coords = coords;
        console.log(coords);
        this.#myMap.geoObjects.removeAll();
        this.#myMap.geoObjects.add(myGeoObject);
        const response =
          await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=a4627984-d4ae-4e59-a89b-7c1c4d5cf56d&format=json&geocode=${coords[1].toFixed(6)},${coords[0].toFixed(6)}`);
        const json = await response.json();
        let data = json.response.GeoObjectCollection.featureMember[0].GeoObject.
            metaDataProperty.GeocoderMetaData.Address.formatted;
        console.log(data);
        data = data.split(' ');
        data = data.slice(1);
        data = data.join(' ');
        document.querySelector('.new-advert__location').
            childNodes[inputNum].value = data;
      });
    });
  }

  /**
   * Получение списка возможных категорий
   */
  getCategories() {
    const res = Ajax.getUsingFetch({
      url: `${secureDomainUrl}category`,
    });
    res.then(({status, parsedBody}) => {
      if (status != statusCodes.OK) {
        return;
      }
      const {categories} = parsedBody.body;
      const select = document.getElementById('selCategory');
      categories.forEach((elem) => {
        const el = document.createElement('option');
        el.value = elem.name;
        el.innerHTML = elem.name;
        select.appendChild(el);
      });
    });
  }

  /**
   * отправка объявления на сервер
   * @param {bool} isNew новое объявление или редактирование старого
   * @param {Array} fileList массив фотографий
   * @param {Array} imagesToDelete фотографии которые удалим
   */
  validateAd(isNew, fileList, imagesToDelete) {
    const nameDiv = document.querySelector('.new-advert__name');
    const title = nameDiv.childNodes[inputNum].value.trim();
    if (!validate(nameDiv)) {
      return;
    }
    const category = document.getElementById('selCategory').value;
    const descriptionDiv = document.querySelector('.new-advert__description');
    let description = descriptionDiv.childNodes[inputNum].value.trim();
    if (!validate(descriptionDiv)) {
      description = 'Нет описания';
    }
    const condition = document.getElementById('radio-new').checked;
    const priceDiv = document.querySelector('.new-advert__price');
    const price = priceDiv.childNodes[3].value.trim();
    const coords = this.#coords;
    if (coords === null) {
      document.querySelector('.new-advert__location').
          classList.add('text-input_wrong');
      return;
    }
    document.querySelector('.new-advert__location').
        classList.remove('text-input_wrong');
    const address = document.querySelector('.new-advert__location').
        childNodes[inputNum].value.trim();
    // отправка на разные endpoint
    let endpointUrl;
    if (isNew) {
      endpointUrl = secureDomainUrl + 'adverts';
    } else {
      const adId = window.location.pathname.split('/')[idNum];
      endpointUrl = `${secureDomainUrl}adverts/${adId}`;
    }
    this.eventBus.emit('validateSuccessful', endpointUrl, title, description,
        category, condition, price, address,
        coords, isNew, fileList, imagesToDelete);
  }

  /**
   * Отправляет фото
   * @param {number} id id объявления
   * @param {boolean} isNew редакт или новое
   * @param {Array} fileList массив фотографий
   */
  validatePhoto(id, isNew, fileList) {
    console.log(fileList);
    if (fileList.length === 0) {
      if (!isNew) {
        this.eventBus.emit('redirectToAd', id);
        return;
      }
      this.eventBus.emit('photosSend');
      return;
    }
    const formData = new FormData();
    Array.from(fileList).forEach((elem)=> {
      console.log(elem);
      if (elem != undefined) {
        formData.append('images', elem);
      }
    });
    if (Array.from(formData).length == 0) {
      return;
    }
    console.log(formData);
    this.eventBus.emit('photoDataPacked', formData, id, isNew);
  }

  /**
   * Функция получения и автозаполнения информации
   */
  getData() {
    const adId = window.location.pathname.split('/')[idNum];
    const res = Ajax.getUsingFetch({
      url: `${secureDomainUrl}adverts/${adId}`,
    });
    res.then(({parsedBody}) => {
      const {code} = parsedBody;
      if (code === statusCodes.NOTEXIST) {
        this.eventBus.emit('NoAd');
        return;
      }
      const {advert} = parsedBody.body;
      if (advert.publisher_id !== Number(localStorage.getItem('id'))) {
        this.eventBus.emit('notOwner');
        return;
      }
      advert.images.forEach((elem, key) => {
        advert.images[key] = `/${elem}`;
      });
      document.querySelector('.new-advert__name').
          childNodes[inputNum].value = advert.name;
      document.querySelector('.new-advert__category').
          childNodes[inputNum].value = advert.category;
      document.querySelector('.new-advert__description').
          childNodes[inputNum].value = advert.description;
      document.getElementById('radio-new').checked = advert.is_new;
      document.querySelector('.new-advert__price').
          childNodes[inputNum].value = advert.price;
      document.querySelector('.new-advert__location').
          childNodes[inputNum].value = advert.location;
      this.eventBus.emit('handleImages', advert.images);

      ymaps.ready(()=> {
        const myGeoObject = new ymaps.GeoObject({
          geometry: {
            type: 'Point', // тип геометрии - точка
            coordinates: [advert.latitude, advert.longitude], // координаты точк
          },
        });
        this.#coords = [advert.latitude, advert.longitude];
        this.#myMap.geoObjects.add(myGeoObject);
        const card = document.getElementById('YMapsID');
        if (card.childNodes.length > 1) {
          card.removeChild(card.childNodes[0]);
        }
      });
    });
  }
}

/**
 * проверка валидности формы инпута
 * @param {HTMLDivElement} div див с формой
 * @return {Boolean} тру если валидна
 */
function validate(div) {
  const text = div.childNodes[inputNum].value.trim();
  if (text.length < minValidationLen) {
    div.classList.add('text-input_wrong');
    return false;
  }
  div.classList.remove('text-input_wrong');
  return true;
}
