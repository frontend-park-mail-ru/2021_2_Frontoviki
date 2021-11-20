import ErrorPage from '../templates/404Page/404Page.ts';

/**
 * Класс роутера для навигации в спа
 */
export default class Router {
  constructor(root, globalBus) {
    this.routes = [];
    root.addEventListener('click', this.handleMouseClick.bind(this));
    window.addEventListener('popstate', (event) => {
      const currentPath = window.location.pathname;
      this.go(currentPath, false);
    });
  }


  setRoute(route, handler) {
    this.routes.push({
      regExp: new RegExp(route),
      handler: handler,
    });
  }


  /**
   * Switch current route
   * @param {string} URL - URL to go
   * @param {boolean?} pushState - Need to push state or not.
   * No pushState is necessary when user go back in history. Default set to true.
   */
  go(URL, pushState = true) {
    const oldURL = window.history.state?.url;
    if (pushState && URL !== oldURL) {
      window.history.pushState({url: URL}, '', URL);
    }

    let routeNotFound = true;
    for (const route of this.routes) {
      if (route.regExp.test(URL)) {
        const parsedURL = route.regExp.exec(URL);
        window.scrollTo(0, 0);
        route.handler(parsedURL.group);
        routeNotFound = false;
        break;
      }
    }
    if (routeNotFound) {
      const root = document.getElementById('root');
      const error = new ErrorPage(root);
      error.render();
    }
  }

  /**
   * Click handler
   * @param {Object} event - mouse event
   */
  handleMouseClick(event) {
    if (event.target.tagName === 'A') {
      event.preventDefault();
      this.go(event.target.pathname);
    }
  }

  /**
 * Go back in history
 */
  goBack() {
    window.history.back();
  }
}
