/**
 * Класс осуществляющий логику работы карусели фотографий
 */
export class SliderLogic {
    slideIndex = 1;

    /**
     * показывает фотографию
     * @param {Number} n номер фотографии
     */
    showSlides(n) {
      const slides = document.getElementsByClassName('mySlides');
      const dots = document.getElementsByClassName('dot');
      if (n > slides.length) {
        this.slideIndex = 1;
      }
      if (n < 1) {
        this.slideIndex = slides.length;
      }
      for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = 'none';
      }
      for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace('active-hover', '');
      }
      slides[this.slideIndex - 1].style.display = 'block';
      dots[this.slideIndex - 1].classList.add('active-hover');
    }

    /**
     * Следующий слайд
     * @param {*} n
     */
    plusSlides(n) {
      this.showSlides(this.slideIndex += n);
    }

    /**
     * Установка на конкретный
     * @param {*} n
     */
    currentSlide(n) {
      this.showSlides(this.slideIndex = n);
    }
}
