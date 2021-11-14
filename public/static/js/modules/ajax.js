import {secureDomainUrl} from '../constatns.js';

let CSRFToken;
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
      const response = await fetch(secureDomainUrl + 'csrf', {
        method: 'GET',
        mode: 'cors',
        cache: 'no-store',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      CSRFToken = response.headers.get('X-Csrf-Token');
    }
  },
  /**
   * Функция для отправки пост запросов
  * @param {any} args аргументы для запроса
  * @return {Promise}
  */
  async postUsingFetch(args = {}) {
    await Ajax.csrf();
    const response = await fetch(args.url, {
      method: AJAX_METHODS.POST,
      mode: 'cors',
      cache: 'no-store',
      credentials: 'include',
      headers: {
        'X-Csrf-Token': CSRFToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(args.body),
    });
    const parsedBody = await response.json().catch(() => {
      return {};
    }).then((data) => {
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
  async getUsingFetch(args = {}) {
    const response = await fetch(args.url, {
      method: AJAX_METHODS.GET,
      mode: 'cors',
      cache: 'no-store',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // ошибка пустого json ловится и не ломает все
    CSRFToken = response.headers.get('X-Csrf-Token');
    const parsedBody = await response.json().catch(() => {
      return {};
    }).then((data) => {
      return data;
    });
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
  async postImageUsingFetch(args = {}) {
    await Ajax.csrf();
    const response = await fetch(args.url, {
      method: AJAX_METHODS.POST,
      mode: 'cors',
      cache: 'no-store',
      credentials: 'include',
      headers: {
        'X-Csrf-Token': CSRFToken,
      },
      body: args.body,
    });
    const parsedBody = await response.json().catch(() => {
      return {};
    }).then((data) => {
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
  async deleteAdUsingFetch(args = {}) {
    await Ajax.csrf();
    const response = await fetch(args.url, {
      method: AJAX_METHODS.DELETE,
      mode: 'cors',
      cache: 'no-store',
      credentials: 'include',
      headers: {
        'X-Csrf-Token': CSRFToken,
        'Content-Type': 'application/json',
      },
    });
    const parsedBody = await response.json().catch(() => {
      return {};
    }).then((data) => {
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
