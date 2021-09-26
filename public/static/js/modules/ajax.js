
(function() {
  const noop = () => {};
  const AJAX_METHODS = {
    POST: 'POST',
    GET: 'GET',
  };

  /**
   * Класс для отправки сообщений на сервер
   * используется xmlhttpRequest. Нужно переписать на fetch
   */
  class Ajax {
    /**
     * Функция для отправки пост запросов
     * @param {any} args аргументы для запроса
     * @return {Promise}
     */
    async asyncPostUsingFetch(args={}) {
      const response = await fetch(args.url, {
        method: AJAX_METHODS.POST,
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
          'Content-type': 'application/json;charset=utf-8',
          'mode': 'cors',
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
    }

    /**
     * Функция для отправки get запросов на промисах
     * @param {any} args args параметры для генерации запроса
     * @return {Promise}
     */
    async asyncGetUsingFetch(args = {}) {
      const response = await fetch(args.url, {
        method: AJAX_METHODS.GET,
        mode: 'cors',
      });
      // ошибка пустого json ловится и не ломает все
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
    };
  }

  window.Ajax = new Ajax();
})();


