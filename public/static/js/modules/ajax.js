/**
 * Класс для отправки сообщений на сервер
 * используется fetch
 */
export const Ajax = {
  /**
   * Функция для отправки пост запросов
  * @param {any} args аргументы для запроса
  * @return {Promise}
  */
  async asyncPostUsingFetch(args = {}) {
    const response = await fetch(args.url, {
      method: AJAX_METHODS.POST,
      mode: 'cors',
      cache: 'no-store',
      credentials: 'include',
      headers: {
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
  async asyncGetUsingFetch(args = {}) {
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
    const parsedBody = await response.json().catch(() => {
      return {};
    }).then((data) => {
      return data;
    });
    console.log(parsedBody);
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
  async asyncPostImageUsingFetch(args = {}) {
    const response = await fetch(args.url, {
      method: AJAX_METHODS.POST,
      mode: 'cors',
      cache: 'no-store',
      credentials: 'include',
      body: args.body,
    });
    const parsedBody = await response.json().catch(() => {
      return {};
    }).then((data) => {
      return data;
    });
    console.log(parsedBody);
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
};
