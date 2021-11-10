
/**
 * небольшая вспомогательная функция для очисти инпута
 * @param {HTMLDivElement} input
 */
export function clearInput(input) {
  input.classList.remove('text-input_correct');
  input.classList.remove('text-input_wrong');
  input.childNodes[3].value = '';
}
