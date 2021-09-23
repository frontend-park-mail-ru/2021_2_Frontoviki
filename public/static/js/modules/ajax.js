
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
     * функция для отправки get запросов
     * @param {any} args параметры для генерации запроса
     * @return {function}
     */
    ajaxGet(args) {
      return this.#ajax({method: AJAX_METHODS.GET, ...args});
    }
    /**
     * функция для отправки post запросов
     * @param {any} args параметры для генерации запроса
     * @return {function}
    */
    ajaxPost(args) {
      return this.#ajax({method: AJAX_METHODS.POST, ...args});
    }

    /**
     * основная реализация отправки запросов
     */
    #ajax({method = AJAX_METHODS.GET, url = '/',
      body = null, callback = noop}) {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.withCredentials = true;

      xhr.addEventListener('readystatechange', function() {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;

        callback(xhr.status, xhr.responseText);
      });

      if (body) {
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf8');
        xhr.send(JSON.stringify(body));
        return;
      }

      xhr.send();
    }

    /**
     * Функция для отправки get запросов на промисах
     * @param {any} args args параметры для генерации запроса
     * @return {Promise}
     */
    async asyncGetUsingFetch(args = {}) {
      const response = await fetch(args.url, {
        method: AJAX_METHODS.GET,
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


