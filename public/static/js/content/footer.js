// создает футер
export function createFooter() {
    const wrapper = document.querySelector('.wrapper');
    const footer = document.createElement('footer');
    footer.innerHTML = '<p>© 2021. Volchock team</p>';
    wrapper.appendChild(footer);
}