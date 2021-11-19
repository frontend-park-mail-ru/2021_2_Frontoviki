import EventBus from '../modules/EventBus.js';
import MainPageModel from '../models/mainPage.js';
import MainPageView from '../views/mainPage.js';

/**
 * Контроллер главной страницы
 */
export default class MainPageController {
  /**
     * Controller constructor
     * @param {Object} router - for model to redirect on success login
     * @param {Object} globalEventBus - for trigger login global event
     */
  constructor(router, globalEventBus) {
    this.router = router;
    this.globalEventBus = globalEventBus;
    this.eventBus = new EventBus([
      'getAds',
      'getData',
      'clickModal',
      'onCardClicked',
    ]);
    this.view = new MainPageView(this.eventBus);
    this.model = new MainPageModel(this.eventBus);
    this.eventBus.on('onCardClicked', this.goToCardPage.bind(this));
    this.eventBus.on('stopScroll', this.stopScroll.bind(this));
    this.eventBus.on('redirectToMain', this.redirectToMain.bind(this));
    this.eventBus.on('loggedNewAdd', this.loggedNewAdd.bind(this));
    this.eventBus.on('notLoggedNewAdd', this.notLoggedNewAdd.bind(this));
    globalEventBus.on('clickModal', this.callModal.bind(this));
    globalEventBus.on('goToNewAd', this.goToNewAd.bind(this));
    globalEventBus.on('profileLinksClick', this.stopScroll.bind(this));
    globalEventBus.on('onSearchClicked', this.search.bind(this));
    globalEventBus.on('loggedForNewAd', this.checkNewAdButton.bind(this));
    globalEventBus.on('logout', this.disableAdButton.bind(this));
  }

  /**
   * Передаем глобальный эвент в локальный котроллер
   */
  callModal() {
    this.eventBus.emit('clickModal');
  }

  /**
   * Переход на страницу объявления
   * @param {*} id
   */
  goToCardPage(id) {
    this.stopScroll();
    this.eventBus.emit('deleteBtn');
    this.router.go('/ad/' + id);
  }

  /**
   * В случае пустого запроса поиска возвращаемся на главную
   */
  redirectToMain() {
    this.router.go('/');
  }

  /**
   * Переход на страницу нового объявления
   */
  goToNewAd() {
    this.stopScroll();
    this.eventBus.emit('deleteBtn');
    this.router.go('/newAd');
  }
  /**
   * Если закончились объявления остановим ленту
   */
  stopScroll() {
    window.removeEventListener('scroll', this.view.populate);
  }

  /**
   * Поиск
   */
  search() {
    const query = document.querySelector('.search__input').value.trim();
    if (query.length > 0) {
      this.eventBus.emit('deleteBtn');
      this.stopScroll();
      this.router.go(`/search/${query}`);
    }
  }

  /**
   * Переход на страницу нового объявления
   */
  loggedNewAdd() {
    this.globalEventBus.emit('goToNewAd');
  }

  /**
   * Модальное
   */
  notLoggedNewAdd() {
    this.globalEventBus.emit('clickModal');
  }

  /**
   * Меняем поведение кнопки после регистрации или логина
   */
  checkNewAdButton() {
    this.eventBus.emit('loggedForNewAd');
  }

  disableAdButton() {
    this.eventBus.emit('disableAdButton');
  }
}
