import { Ajax } from "./ajax.js";
import { createHeader } from "../templates/header/header.js";
import { secureDomainUrl, statusCodes } from "../constatns.js";

/**
 * Функция выхода из авторизации
*/
export function logout(globalEventBus) {
    const res = Ajax.asyncPostUsingFetch({
      url: secureDomainUrl + 'logout',
      body: null,
    });
    res.then(({status})=> {
      if (status != statusCodes.OK) {
        return;
      }
      createHeader(globalEventBus);
    });
}