'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const message = document.createElement('div');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
// console.log(allSections);
const allButtons = document.getElementsByTagName('button');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');

// const s1coords = section1.getBoundingClientRect();

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// console.log(allButtons);
// console.log(document.getElementsByClassName('btn'));

message.classList.add('cookie-message');
// message.textContent = 'we use cookies for improved functionality and analytics';
message.innerHTML =
  'we use cookies for improved functionality and analytics <button class="btn btn--close-cookie">Got it!</button>';
// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true));
// header.before(message);
// header.after(message);
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

message.style.backgroundColor = '#37383d';
message.style.width = '120%';
// console.log(getComputedStyle(message).height);
message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 40 + 'px';

btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

// document.querySelectorAll('.nav__link').forEach(function (i) {
//   i.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//more efficient solution rather than adding event listener to every link element(using the event bubbling property)
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  //guard clause
  if (!clicked) return;

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  //active cls add
  clicked.classList.add('operations__tab--active');
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5);
// })
nav.addEventListener('mouseover', handleHover.bind(0.5));
//we can use the bind() method to create a copy of the function that it is called upon and then call the handler function directly
nav.addEventListener('mouseout', handleHover.bind(1));

//implementing sticky navbar based on the scroll position when we reach the first section\

// const initialCoords = section1.getBoundingClientRect();
// // console.log(initialCoords.top);
// window.addEventListener('scroll', function () {
//   if (this.window.scrollY > initialCoords.top) {
//     nav.classList.add('sticky');
//   } else {
//     nav.classList.remove('sticky');
//   }
// });

// const obsCallback = function (entries, obsesrver) {
//   entries.forEach(entry => {
//     console.log(entries);
//   });
// };
// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };
// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

//using the intersection observer API--
const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
};

const navHeight = nav.getBoundingClientRect().height;
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//revealing sections as we scroll through the page

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//creating lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  //replace src with data-src
  entry.target.src = entry.target.dataset.src;
  // entry.target.classList.remove('lazy-img');
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imageObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0.2,
});
imgTargets.forEach(img => {
  imageObserver.observe(img);
});

//slider component-------------

const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  let currSlide = 0;

  const createDots = function () {
    slides.forEach((s, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDots = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(s => {
      s.classList.remove('dots__dot--active');
    });
    document
      .querySelector(`.dots__dot[data-slide="${slide}"`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (currSlide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - currSlide)}%)`;
    });
    activateDots(currSlide);
  };

  const nextSlide = function () {
    currSlide = (currSlide + 1) % slides.length;
    goToSlide(currSlide);
  };
  const prevSlide = function () {
    currSlide--;
    if (currSlide < 0) {
      currSlide = slides.length - 1;
    }
    goToSlide(currSlide);
  };

  const init = function () {
    createDots();
    goToSlide(0);
  };
  init();

  //event handlers--------------------
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') {
      nextSlide();
    }
    if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      goToSlide(slide);
    }
  });
};
slider();

document.getElementById('newpage').onclick = function () {
  location.href = 'https://iampsr8.github.io/Bankist-App/';
};

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   e.returnValue = '';
// });

//experiment--------------------------------------------------------------------fff

// document.documentElement.style.setProperty('--color-primary', 'orangered');
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// logo.alt = 'beautiful';
// console.log(logo.alt);
// logo.setAttribute('company', 'bankist');
// console.log(logo.company);
// console.log(logo.getAttribute('company'));
// console.log(logo.dataset.versionNumber);

// console.log(s1coords);
// console.log(e.target.getBoundingClientRect());
// console.log('current scroll x/y', window.pageXOffset, window.pageYOffset);
// console.log(
//   document.documentElement.clientHeight,
//   document.documentElement.clientWidth
// );
// window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);
// window.scrollTo({
//   left: s1coords.left + window.pageXOffset,
//   top: s1coords.top + window.pageYOffset,
//   behavior: 'smooth',
// });

// const h1 = document.querySelector('h1');
// const headAlert = function (e) {
//   alert('You are inside the heading');
// h1.removeEventListener('mouseenter', headAlert);
// };
// h1.addEventListener('mouseenter', headAlert);
// h1.onmouseenter = function (e) {
//   alert('You are inside the heading');
// };
// setTimeout(() => {
//   h1.removeEventListener('mouseenter', headAlert);
// }, 5000);

// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// console.log(randomColor);

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   // console.log('link');
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);
//   e.stopPropagation();
// });
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   // console.log('link');
//   this.style.backgroundColor = randomColor();
//   console.log('links', e.target, e.currentTarget);
// });
// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log('Nav', e.target, e.currentTarget);
// });

// const h1 = document.querySelector('h1');
// console.log(h1.querySelectorAll('span'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'red';

// console.log(h1.parentNode);
// console.log(h1.parentElement);
// // h1.closest('.header').style.background = 'var(--gradient-secondary)';
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);
// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(i => {
//   i.style.transform = 'scale(0.5)';
// });
