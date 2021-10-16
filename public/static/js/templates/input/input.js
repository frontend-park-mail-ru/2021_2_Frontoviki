
export function createInput(title, description) {
  const inputTemplate = Handlebars.templates.input;
  const input = document.createElement('div');
  input.innerHTML = inputTemplate({inputName: title, inputDesc: description});
  input.classList.add('text-input');
  return input;
}
