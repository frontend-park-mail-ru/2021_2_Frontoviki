/**
 * Класс осуществляющий логику работы карусели фотографий
 */
export class SliderLogic {
    slideIndex = 1;

    showSlides(n: number): void {
      const slides : NodeListOf<HTMLElement> = document.querySelectorAll('.mySlides');
      const dots : NodeListOf<HTMLElement> = document.querySelectorAll('.dot');
      if (n > slides.length) {
        this.slideIndex = 1;
      }
      if (n < 1) {
        this.slideIndex = slides.length;
      }
      slides.forEach((elem)=>{
        elem.style.display = 'none';
      })
      dots.forEach((elem)=> {
        elem.className = elem.className.replace('active-hover', '');
      })
      slides[this.slideIndex - 1].style.display = 'block';
      dots[this.slideIndex - 1].classList.add('active-hover');
    }

    /**
     * Следующий слайд
     * @param {*} n
     */
    plusSlides(n : number): void {
      this.showSlides(this.slideIndex += n);
    }

    /**
     * Установка на конкретный
     * @param {*} n
     */
    currentSlide(n: number): void {
      this.showSlides(this.slideIndex = n);
    }
}
