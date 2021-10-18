import inputT from 'input.handlebars';

export function createInput(title, description) {
  const input = document.createElement('div');
  input.innerHTML = inputT({inputName: title, inputDesc: description});
  input.classList.add('text-input');
  return input;
}
