jQuery(document).ready(function ($) {

/*
===================================
Init scrollMagic
===================================
*/
  var globalController = new ScrollMagic.Controller();


/*
===================================
Header animations
===================================
*/
  setTimeout(function() {
    TweenMax.to('#introArea .images img:first-child', .6, {
      delay: 0,
      opacity: 1,
      top: '13vh',
      rotation: 4,
      ease:  Power4.easeOut
    });
  }, 700);

  setTimeout(function() {
    TweenMax.to('#introArea h1', .6, {
      delay: 0,
      opacity: 1,
      transform: 'translateY(0)',
      yPercent: 0,
      ease:  Power4.easeOut
    });
    TweenMax.to('#introArea h2', .6, {
      delay: .1,
      opacity: 1,
      transform: 'translateY(0)',
      yPercent: 0,
      ease:  Power4.easeOut
    });
    TweenMax.to('#introArea ul', .6, {
      delay: .2,
      opacity: 1,
      transform: 'translateY(0)',
      yPercent: 0,
      ease:  Power4.easeOut
    });
    TweenMax.to('#introArea a', .6, {
      delay: .3,
      opacity: 1,
      transform: 'translateY(0)',
      yPercent: 0,
      ease:  Power4.easeOut
    });
  }, 600);

  TweenMax.to('.c-nav', .6, {
    delay: 1.5,
    transform: 'translateY(0)',
    ease:  Power4.easeOut
  });


/*
===================================
Red lines background
===================================
*/
  var actualPage = $('body').attr('id');

  if (actualPage == 'page-home') {
    var redLines = $('.c-red-lines-bg');
    var startPoint = $('.m-codefen-vs').offset().top
    
    redLines.css({'top': startPoint});

    new ScrollMagic.Scene({
      triggerElement: ".m-intro",
      duration: $('body').height(),
    })
    .setTween(redLines, {y: "-40%", ease: Linear.easeNone})
    // .addIndicators('')
    .addTo(globalController);    
  }






/******************** end jquery */
});
