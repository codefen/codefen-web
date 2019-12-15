jQuery(document).ready(function($) {


/*
===================================
Init scrollMagic
===================================
*/
  var navScrollController = new ScrollMagic.Controller();



/*
===================================
Nav menu actions
===================================
*/
  var actualPage = $('body').attr('id');

  $('.c-nav a').removeClass('f-active');

  if (actualPage == 'page-home') {
    $('[href="index.html"]').addClass('f-active'); 
  }
  else if (actualPage == 'page-services') {
    $('[href="services.html"]').addClass('f-active'); 
  }
  else if (actualPage == 'page-industries') {
    $('[href="industries.html"]').addClass('f-active'); 
  }
  else if (actualPage == 'page-plans') {
    $('[href="plans.html"]').addClass('f-active'); 
  }
  else if (actualPage == 'page-purchase-user') {
    $('[href="purchase_user.html"]').addClass('f-active');
  }

  new ScrollMagic.Scene({
    triggerElement: "#mainHeaderArea",
    triggerHook: 0,
    offset: 50
  })
  .setClassToggle('.c-nav', 'f-highlight')
  // .addIndicators('nav bar')
  .addTo(navScrollController);   

});
