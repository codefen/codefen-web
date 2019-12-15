jQuery(document).ready(function ($) {

/*
===================================
Showreel tabs
===================================
*/
  var slider = tns({
    container: '.showreel-container',
    items: 1,
    gutter: 30,
    loop: false,
    mode: 'gallery',
    speed: 500,
    navContainer: '.showreel-tabs',
    controls: false,
    slideBy: 'page'
  });



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
    TweenMax.to('#mainHeaderArea .wrap-image img', .6, {
      delay: 0,
      opacity: 1,
      transform: 'translateX(0)',
      rotation: 0,
      ease:  Power4.easeOut
    });

    TweenMax.to('#mainHeaderArea h1', .6, {
      delay: 0,
      opacity: 1,
      transform: 'translateX(0)',
      ease:  Power4.easeOut
    });

    TweenMax.to('#mainHeaderArea h2', .6, {
      delay: .1,
      opacity: 1,
      transform: 'translateX(0)',
      ease:  Power4.easeOut
    });

    TweenMax.to('#mainHeaderArea ul', .6, {
      delay: .2,
      opacity: 1,
      transform: 'translateX(0)',
      ease:  Power4.easeOut
    });
    
    TweenMax.to('#mainHeaderArea a', .6, {
      delay: .3,
      opacity: 1,
      transform: 'translateX(0)',
      ease:  Power4.easeOut
    });
  }, 300);

  TweenMax.to('.c-nav', .4, {
    delay: .2,
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


/*
===================================
Plans parallax
===================================
*/
  var actualPage = $('body').attr('id');

  if (actualPage == 'page-home') {
    var background = $('.m-plans .c-extra-bg');
    var startPoint = $('.m-plans').offset().top
    
    // background.css({'top': startPoint});

    new ScrollMagic.Scene({
      triggerElement: ".m-plans",
      duration: '100%',
    })
    .setTween(background, {y: "-230%", ease: Linear.easeNone})
    // .addIndicators('')
    .addTo(globalController);    
  }



/******************** end jquery */
});
