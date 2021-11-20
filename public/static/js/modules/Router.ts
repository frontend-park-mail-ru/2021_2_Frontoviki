import ErrorPage from '../templates/404Page/404Page';
import {route} from '../types';

/**
 * Класс роутера для навигации в спа
 */
export default class Router {
  routes : route[]

  constructor(root: HTMLDivElement) {
    this.routes = [];
    root.addEventListener('click', this.handleMouseClick.bind(this));
    window.addEventListener('popstate', (event) => {
      const currentPath = window.location.pathname;
      this.go(currentPath, false);
    });
  }


  setRoute(route : RegExp, handler : Function) {
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
  go(URL : string, pushState = true) {
    const oldURL = window.history.state?.url;
    if (pushState && URL !== oldURL) {
      window.history.pushState({url: URL}, '', URL);
    }

    let routeNotFound = true;
    for (const route of this.routes) {
      if (route.regExp.test(URL)) {
        const parsedURL = route.regExp.exec(URL);
        window.scrollTo(0, 0);
        route.handler(parsedURL?.groups);
        routeNotFound = false;
        break;
      }
    }
    if (routeNotFound) {
      const root = document.getElementById('root') as HTMLDivElement;
      const error = new ErrorPage(root);
      error.render();
    }
  }

  /**
   * Click handler
   * @param {Object} event - mouse event
   */
  handleMouseClick(event: MouseEvent) {
    const target = event.target as HTMLElement
    if (target.tagName === 'A') {
      event.preventDefault();
      const anchor = target as HTMLAnchorElement;
      this.go(anchor.pathname);
    }
  }

  /**
 * Go back in history
 */
  goBack() {
    window.history.back();
  }
}
