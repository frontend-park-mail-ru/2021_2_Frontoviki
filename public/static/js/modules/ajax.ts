import {secureDomainUrl} from '../constatns';
import {args, parsedBody} from '../types'

let CSRFToken: string | null;
/**
 * Класс для отправки сообщений на сервер
 * используется fetch
 */
export const Ajax = {
  /**
   * Функция обновления csrf токена
   */
  async csrf() {
    if (CSRFToken === null) {
      const requestHeaders : HeadersInit = new Headers();
      requestHeaders.set('Content-Type', 'application/json');
      const response = await fetch(secureDomainUrl + 'csrf', {
        method: 'GET',
        mode: 'cors',
        cache: 'no-store',
        credentials: 'include',
        headers: requestHeaders,
      });
      CSRFToken = response.headers.get('X-Csrf-Token');
    }
  },
  /**
   * Функция для отправки пост запросов
  * @param {any} args аргументы для запроса
  * @return {Promise}
  */
  async postUsingFetch(args: args) {
    await Ajax.csrf();
    const requestHeaders : HeadersInit = new Headers();
    if (CSRFToken != null) {
      requestHeaders.set('X-Csrf-Token', CSRFToken);
    }
    requestHeaders.set('Content-Type', 'application/json');
    const response = await fetch(args.url, {
      method: AJAX_METHODS.POST,
      mode: 'cors',
      cache: 'no-store',
      credentials: 'include',
      headers: requestHeaders,
      body: JSON.stringify(args.body),
    });
    const parsedBody = <parsedBody> await response.json().catch(() => {
      return {};
    }).then((data: string) => {
      return data;
    });
    const {status} = response;
    return {
      status,
      parsedBody,
    };
  },
  /**
   * Функция для отправки get запросов на промисах
   * @param {any} args args параметры для генерации запроса
   * @return {Promise}
   */
  async getUsingFetch(args: args) {
    const requestHeaders : HeadersInit = new Headers();
    requestHeaders.set('Content-Type', 'application/json');
    const response = await fetch(args.url, {
      method: AJAX_METHODS.GET,
      mode: 'cors',
      cache: 'no-store',
      credentials: 'include',
      headers: requestHeaders,
    });
    // ошибка пустого json ловится и не ломает все
    CSRFToken = response.headers.get('X-Csrf-Token');
    const parsedBody = <parsedBody> await response.json().catch(() => {
      return {};
    })
    const {status: code} = response;
    return {
      status: code,
      parsedBody,
    };
  },

  /**
   * Функция для отправки пост запросов картинки
  * @param {any} args аргументы для запроса
  * @return {Promise}
  */
  async postImageUsingFetch(args: args) {
    await Ajax.csrf();
    const requestHeaders : HeadersInit = new Headers();
    if (CSRFToken != null) {
      requestHeaders.set('X-Csrf-Token', CSRFToken);
    }
    const response = await fetch(args.url, {
      method: AJAX_METHODS.POST,
      mode: 'cors',
      cache: 'no-store',
      credentials: 'include',
      headers: requestHeaders,
      body: <BodyInit> args.body,
    });
    const parsedBody = <parsedBody> await response.json().catch(() => {
      return {};
    }).then((data: string) => {
      return data;
    });
    const {status} = response;
    return {
      status,
      parsedBody,
    };
  },

  /**
   * Функция для удаления объявления
  * @param {any} args аргументы для запроса
  * @return {Promise}
  */
  async deleteAdUsingFetch(args: args) {
    await Ajax.csrf();
    const requestHeaders : HeadersInit = new Headers();
    if (CSRFToken != null) {
      requestHeaders.set('X-Csrf-Token', CSRFToken);
    }
    requestHeaders.set('Content-Type', 'application/json');
    const response = await fetch(args.url, {
      method: AJAX_METHODS.DELETE,
      mode: 'cors',
      cache: 'no-store',
      credentials: 'include',
      headers: requestHeaders,
      body: JSON.stringify(args.body),
    });
    const parsedBody = <parsedBody> await response.json().catch(() => {
      return {};
    }).then((data: string) => {
      return data;
    });
    const {status} = response;
    return {
      status,
      parsedBody,
    };
  },
};

const AJAX_METHODS = {
  POST: 'POST',
  GET: 'GET',
  DELETE: 'DELETE',
};
