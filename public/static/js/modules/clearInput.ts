
/**
 * небольшая вспомогательная функция для очисти инпута
 * @param {HTMLDivElement} input
 */
export function clearInput(input: HTMLDivElement): void {
  input.classList.remove('text-input_correct');
  input.classList.remove('text-input_wrong');
  const child = input.children[1] as HTMLInputElement;
  child.value = '';
}
