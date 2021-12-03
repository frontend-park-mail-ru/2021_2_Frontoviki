import {Ajax} from '../modules/ajax';
import {idNum, secureDomainUrl, statusCodes} from '../constatns';
import Bus from '../modules/EventBus';

/**
 * Класс главной страницы с последними объявлениями
 */
export default class AdvertPageModel {
  eventBus: Bus
  /**
     * @description Constructor
     * @param {Object} eventBus to call and subscribe for signals
     */
  constructor(eventBus: Bus) {
    this.eventBus = eventBus;
    this.eventBus.on('GetAdData', this.getAdData.bind(this));
  }

  /**
   * Получение информации об объявлении
   */
  getAdData() {
    const adId = window.location.pathname.split('/')[idNum];
    const res = Ajax.getUsingFetch({
      url: secureDomainUrl + 'adverts/' + adId,
      body: null,
    });
    res.then(({parsedBody}) => {
      const {code} = parsedBody;
      if (code === statusCodes.NOTEXIST) {
        this.eventBus.emit('NoAd');
        return;
      }
      const {advert, salesman, rating} = parsedBody.body;
      advert.images.forEach((elem: string, key: number) => {
        advert.images[key] = '/' + elem;
      });
      this.eventBus.emit('gotAd', advert, salesman, rating);
    });
  }
}
