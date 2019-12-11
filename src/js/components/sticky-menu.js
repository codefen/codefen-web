jQuery(document).ready(function($) {

  // Handling the navigation selection
  if ($('#headerArea').length) {
    $(window).scroll(function(event) {
    stickyManager();
  });

  $('.header a').click(function(event) {

    event.preventDefault();
    if (this.hash !== "") {
      event.preventDefault();
      var menu_height = $('.header').height();
      var hash = this.hash;
      if ($(window).width()>= 768 ) { // desktop
        if (hash == '#introArea') {
         $('html, body').animate({
          scrollTop: $(hash).offset().top - menu_height - (menu_height / 2)
        }, 1000
        );
        } else {
         $('html, body').animate({
          scrollTop: $(hash).offset().top - menu_height
        }, 1000
        );
        }
      }
      else {
        dropDownManager();
        if (hash == '#introArea') {
          $('html, body').animate({
            scrollTop: $(hash).offset().top - 100
          }, 800
          );
        } else {
          $('html, body').animate({
            scrollTop: $(hash).offset().top - 73
          }, 800
          );
        }
      }
    }
  });

  $('.c-intro-menu a').click(function(event) {
    event.preventDefault();
    if (this.hash !== "") {
      event.preventDefault();
      var menu_height = $('.header').height();
      var hash = this.hash;
        if ($(window).width()>= 768 ) { // desktop
         $('html, body').animate({
          scrollTop: $(hash).offset().top - menu_height
        }, 1000
        );
       }
       else {
        $('html, body').animate({
          scrollTop: $(hash).offset().top - 73
        }, 800
        );
      }
    }
  });

  function stickyManager() {
    var viewportTop = $(window).scrollTop();
    var menu_height = $('.header').height();

    if ($(window).width() <= 768 ) { // mobile
      if ( (viewportTop > $('#introArea').offset().top - menu_height - 40)  ) {
        $('.header').addClass('f-slideInDown');
      } else {
        $('.header').removeClass('f-slideInDown');
      }
    }

    if ($(window).width() > 768 ) { // desktop
      if ( (viewportTop > $('#introArea').offset().top + $('#introArea').height() - menu_height) ) {
        $('.header').addClass('f-slideInDown');
      } else {
        $('.header').removeClass('f-slideInDown');
      }
    }

  }
    stickyManager();
  } // end function

  // drop down sticky menu
  $('.c-menu-dropdown').on('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      $('.header').toggleClass('f-open');
  });

  function dropDownManager() {
    $('.header').toggleClass('f-open');
  }

});
