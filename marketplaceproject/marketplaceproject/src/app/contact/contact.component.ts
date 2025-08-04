import { Component, OnInit, AfterViewInit } from '@angular/core';

// Import external libraries (if needed, install via npm or include them in assets)
declare const WOW: any;

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css', '../../assets/css/bootstrap.min.css']
})
export class ContactComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit(): void {
    this.initializeCarousels();
  }

  ngAfterViewInit(): void {
    // Initiate WOW.js
    new WOW().init();
    this.handleScrollEvents();
  }

  initializeCarousels(): void {
    // Assuming `OwlCarousel` is globally available
    const owlCarousel = (<any>window).$;

    // Hero Header carousel
    owlCarousel(".header-carousel").owlCarousel({
      animateOut: 'fadeOut',
      items: 1,
      margin: 0,
      stagePadding: 0,
      autoplay: true,
      smartSpeed: 500,
      dots: true,
      loop: true,
      nav: true,
      navText: [
        '<i class="bi bi-arrow-left"></i>',
        '<i class="bi bi-arrow-right"></i>'
      ]
    });

    // Blog carousel
    owlCarousel(".blog-carousel").owlCarousel({
      autoplay: true,
      smartSpeed: 1500,
      center: false,
      dots: false,
      loop: true,
      margin: 25,
      nav: true,
      navText: [
        '<i class="fa fa-angle-right"></i>',
        '<i class="fa fa-angle-left"></i>'
      ],
      responsive: {
        0: { items: 1 },
        576: { items: 1 },
        768: { items: 2 },
        992: { items: 2 },
        1200: { items: 3 }
      }
    });

    // Testimonial carousel
    owlCarousel(".testimonial-carousel").owlCarousel({
      autoplay: true,
      smartSpeed: 1500,
      center: false,
      dots: true,
      loop: true,
      margin: 25,
      nav: true,
      navText: [
        '<i class="fa fa-angle-right"></i>',
        '<i class="fa fa-angle-left"></i>'
      ],
      responsive: {
        0: { items: 1 },
        576: { items: 1 },
        768: { items: 2 },
        992: { items: 2 },
        1200: { items: 3 }
      }
    });
  }

  handleScrollEvents(): void {
    const backToTopButton = document.querySelector('.back-to-top') as HTMLElement;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopButton.style.display = 'block';
      } else {
        backToTopButton.style.display = 'none';
      }
    });

    if (backToTopButton) {
      backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Sticky Navbar logic
    window.addEventListener('scroll', () => {
      const navbar = document.querySelector('.navbar') as HTMLElement;
      if (window.scrollY > 45) {
        navbar.classList.add('sticky-top', 'shadow-sm');
      } else {
        navbar.classList.remove('sticky-top', 'shadow-sm');
      }
    });
  }
}
