/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright 2015 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 */
!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){function b(b){var g=b||window.event,h=i.call(arguments,1),j=0,l=0,m=0,n=0,o=0,p=0;if(b=a.event.fix(g),b.type="mousewheel","detail"in g&&(m=-1*g.detail),"wheelDelta"in g&&(m=g.wheelDelta),"wheelDeltaY"in g&&(m=g.wheelDeltaY),"wheelDeltaX"in g&&(l=-1*g.wheelDeltaX),"axis"in g&&g.axis===g.HORIZONTAL_AXIS&&(l=-1*m,m=0),j=0===m?l:m,"deltaY"in g&&(m=-1*g.deltaY,j=m),"deltaX"in g&&(l=g.deltaX,0===m&&(j=-1*l)),0!==m||0!==l){if(1===g.deltaMode){var q=a.data(this,"mousewheel-line-height");j*=q,m*=q,l*=q}else if(2===g.deltaMode){var r=a.data(this,"mousewheel-page-height");j*=r,m*=r,l*=r}if(n=Math.max(Math.abs(m),Math.abs(l)),(!f||f>n)&&(f=n,d(g,n)&&(f/=40)),d(g,n)&&(j/=40,l/=40,m/=40),j=Math[j>=1?"floor":"ceil"](j/f),l=Math[l>=1?"floor":"ceil"](l/f),m=Math[m>=1?"floor":"ceil"](m/f),k.settings.normalizeOffset&&this.getBoundingClientRect){var s=this.getBoundingClientRect();o=b.clientX-s.left,p=b.clientY-s.top}return b.deltaX=l,b.deltaY=m,b.deltaFactor=f,b.offsetX=o,b.offsetY=p,b.deltaMode=0,h.unshift(b,j,l,m),e&&clearTimeout(e),e=setTimeout(c,200),(a.event.dispatch||a.event.handle).apply(this,h)}}function c(){f=null}function d(a,b){return k.settings.adjustOldDeltas&&"mousewheel"===a.type&&b%120===0}var e,f,g=["wheel","mousewheel","DOMMouseScroll","MozMousePixelScroll"],h="onwheel"in document||document.documentMode>=9?["wheel"]:["mousewheel","DomMouseScroll","MozMousePixelScroll"],i=Array.prototype.slice;if(a.event.fixHooks)for(var j=g.length;j;)a.event.fixHooks[g[--j]]=a.event.mouseHooks;var k=a.event.special.mousewheel={version:"3.1.12",setup:function(){if(this.addEventListener)for(var c=h.length;c;)this.addEventListener(h[--c],b,!1);else this.onmousewheel=b;a.data(this,"mousewheel-line-height",k.getLineHeight(this)),a.data(this,"mousewheel-page-height",k.getPageHeight(this))},teardown:function(){if(this.removeEventListener)for(var c=h.length;c;)this.removeEventListener(h[--c],b,!1);else this.onmousewheel=null;a.removeData(this,"mousewheel-line-height"),a.removeData(this,"mousewheel-page-height")},getLineHeight:function(b){var c=a(b),d=c["offsetParent"in a.fn?"offsetParent":"parent"]();return d.length||(d=a("body")),parseInt(d.css("fontSize"),10)||parseInt(c.css("fontSize"),10)||16},getPageHeight:function(b){return a(b).height()},settings:{adjustOldDeltas:!0,normalizeOffset:!0}};a.fn.extend({mousewheel:function(a){return a?this.bind("mousewheel",a):this.trigger("mousewheel")},unmousewheel:function(a){return this.unbind("mousewheel",a)}})});


/*!
 * scrollDetector
 */

var scrollDetector = (function ($) {
  return {
    scrollings: [],
    prevTime: new Date().getTime(),
    lastScrollTime: new Date().getTime(),
    xDown: null,
    yDown: null,
    options: {
      scrollableClass: "scrolling-block",
      allowScrollables: false
    },
    innerScrollable: null,
    scrollingInInnerScrollable: false,
    lastScrollInInnerScrollable: new Date().getTime(),

    getAverage: function (elements, number) {
      var sum = 0;
      var lastElements = elements.slice(Math.max(elements.length - number, 1));
      for (var i = 0; i < lastElements.length; i++) {
        sum = sum + lastElements[i];
      }
      return Math.ceil(sum / number);
    },

    reset: function () {
      this.scrollings = [];
    },

    detectWheel: function (e, onScrollDown, onScrollUp) {
      var curTime = new Date().getTime();
      // cross-browser wheel delta
      var value = -e.originalEvent.wheelDelta || e.originalEvent.deltaY || e.originalEvent.detail;
      // console.log(value);
      var delta = Math.max(-1, Math.min(1, value));

      var horizontalDetection = typeof e.originalEvent.wheelDeltaX !== 'undefined' || typeof e.originalEvent.deltaX !== 'undefined';
      var isScrollingVertically = (Math.abs(e.originalEvent.wheelDeltaX) < Math.abs(e.originalEvent.wheelDelta)) || (Math.abs(e.originalEvent.deltaX) < Math.abs(e.originalEvent.deltaY) || !horizontalDetection);

      //Limiting the array to 150 (lets not waste memory!)
      if (this.scrollings.length > 149) {
        this.scrollings.shift();
      }

      //keeping record of the previous scrollings
      this.scrollings.push(Math.abs(value));

      //time difference between the last scroll and the current one
      var timeDiff = curTime - this.prevTime;
      this.prevTime = curTime;

      //haven't they scrolled in a while?
      //(enough to be consider a different scrolling action to scroll another section)
      if (timeDiff > 700) {
        //emptying the array, we dont care about old scrollings for our averages
        this.scrollings = [];
      }

      var averageEnd = this.getAverage(this.scrollings, 10);
      var averageMiddle = this.getAverage(this.scrollings, 70);
      var isAccelerating = averageEnd >= averageMiddle;

      //console.log(isScrollingVertically);
      // console.log("isAccelerating:" +  isAccelerating + " averageEnd:" + averageEnd + " avergateMiddle:"+ averageMiddle);

      var isScrollable = this.isScrollable(e, delta, false);
      var isOnTop = $(window).scrollTop() <= 0;
      //console.log("isOnTop", isOnTop);
      //to avoid double swipes...
      if (isAccelerating && isScrollingVertically && isScrollable && isOnTop) {
        var timeDiffBetweenScrolls = curTime - this.lastScrollTime;
        // console.log("timeDiffBetweenScrolls" + timeDiffBetweenScrolls);
        //scrolling down?
        if (timeDiffBetweenScrolls > 1000) {
          this.lastScrollTime = curTime;
          if (delta < 0) {
            onScrollUp();

            //scrolling up?
          } else {
            onScrollDown();
          }
        }
      }
    },

    isScrollable: function (event, direction, isTouch) {
      if (!this.options.allowScrollables) return true;
      var scrollable = true;
      if (this.scrollingInInnerScrollable) {
        var curTime = new Date().getTime();
        var timeDiffBetweenScrolls = curTime - this.lastScrollInInnerScrollable;
        if (timeDiffBetweenScrolls < 500 && this.getScrollingParent(event.target) == this.innerScrollable) {
          scrollable = false;
        } else {
          this.scrollingInInnerScrollable = false;
        }
      }

      var _this = this;

      //var scrollables = $('.' + this.options.scrollableClass + ":hover");
      var scrollables = this.getScrollableElementsUnderCursor(event, isTouch);
      //console.log("Scrollables found in the cursor: " + scrollables.length);

      //$.each(scrollables, function(){
      scrollables.forEach(function (scrollableItem) {
        if ((direction > 0) && ($(scrollableItem).scrollTop() + $(scrollableItem).innerHeight() >= scrollableItem.scrollHeight || $(scrollableItem).innerHeight() === scrollableItem.scrollHeight)) {
          // You can swipe to next or prev slide
        } else if ((direction < 0) && $(scrollableItem).scrollTop() <= 0) {
          // You can swipe to next or prev slide
        } else {
          // You cannot swipe, you are scrolling in an inner element
          // scrollable = false;
          _this.innerScrollable = scrollableItem;
          _this.lastScrollInInnerScrollable = new Date().getTime();
          _this.scrollingInInnerScrollable = true;
        }
      });
      //});
      return scrollable;
    },

    getScrollableElementsUnderCursor: function (event, isTouch) {
      var elements = [];
      var x, y;
      if (!isTouch) {
        x = event.originalEvent.clientX;
        y = event.originalEvent.clientY;
      } else {
        x = event.clientX;
        y = event.clientY;
      }
      var element = document.elementFromPoint(x, y);
      var closestScrollingParent = this.getScrollingParent(element);
      //console.log(closestScrollingParent);
      if (closestScrollingParent) elements.push(closestScrollingParent);
      return elements;
    },

    getScrollingParent: function (node) {
      if (node == null) {
        return null;
      }
      if (node.scrollHeight > node.clientHeight && $(node).hasClass(this.options.scrollableClass)) {
        return node;
      } else {
        return this.getScrollingParent(node.parentNode);
      }
    },

    bind: function (onSwipeUp, onSwipeDown) {
      var _this = this;

      if(window.navigator.userAgent.indexOf("Edge") > -1) {
        $('body').css('touch-action', 'none');

        var lastPositionY = 0,
            accumulators = {up: 0, down: 0},
            accumulatorLimit = 3,
            mouseMoveOk  = true,
            mouseTimer   = setInterval(function () {
                mouseMoveOk = true;
            }, 35);

            $(window).on('pointermove', function (event) {
              if (mouseMoveOk && event.originalEvent.pointerType == 'touch') {
                  mouseMoveOk = false;
                  var deltaY = lastPositionY - event.pageY;

                  if(deltaY > 0){
                    accumulators.up++;
                    if(accumulators.up > accumulatorLimit){
                      onSwipeUp();
                      accumulators = {up: 0, down: 0};
                    }
                  }else{
                    accumulators.down++;
                    if(accumulators.down > accumulatorLimit){
                      onSwipeDown();
                      accumulators = {up: 0, down: 0};
                    }
                  }

                  lastPositionY = event.pageY;
              }
          });
      }

      $(document).on('wheel mousewheel DOMMouseScroll', function (event) {
        var detect = _.debounce(_this.detectWheel.bind(_this), 25, true);
        console.log(event,"wheel");
        detect(event, onSwipeUp, onSwipeDown);
      });
      $(document).on('keydown', function (event) {
        console.log("keydown");
        var handleKeyDown = _this.handleKeyDown.bind(_this);
        handleKeyDown(event, onSwipeUp, onSwipeDown);
      });
      /*
      $(document).on("pointerdown", function(event) {
          var touchStart = _this.handleTouchStart.bind(_this);
          touchStart(event);
          // console.log("POINTER DOWN");
          // console.log(event);
      });
      $(document).on("pointerup", function(event) {
          var touchMove = _this.handleTouchMove.bind(_this);
          touchMove(event, onSwipeUp, onSwipeDown);
          // console.log("POINTER MOVE");
          // console.log(event);
      });
      */
      // $('.cat-logo-button-cont').click(function() {
      //     onSwipeUp();
      // });
    },

    handleTouchStart: function (evt) {
      this.xDown = evt.clientX;
      this.yDown = evt.clientY;
    },

    handleTouchMove: function (evt, onSwipeUp, onSwipeDown) {
      if (!this.xDown || !this.yDown) {
        return;
      }

      var xUp = evt.clientX;
      var yUp = evt.clientY;

      var xDiff = this.xDown - xUp;
      var yDiff = this.yDown - yUp;

      var isOnTop = $(window).scrollTop() <= 0;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        /*most significant*/
        if (xDiff > 0) {
          /* left swipe */
        } else {
          /* right swipe */
        }
      } else {
        var isScrollable = this.isScrollable(evt, yDiff, true);
        if (!isScrollable) {
          // console.log($(evt.target));
        }
        if (yDiff > 0) {
          if (isScrollable && isOnTop) {
            onSwipeUp();
          }
        } else {
          if (isScrollable && isOnTop) {
            onSwipeDown();
          }
        }
      }

      /* reset values */
      this.xDown = null;
      this.yDown = null;
    },

    handleKeyDown: function (event, onSwipeUp, onSwipeDown) {
      //Key Press Events
      // if (anims.isAnimating()) return false;

      var keyDownEvent = event || window.event,
        keycode = (keyDownEvent.which) ? keyDownEvent.which : keyDownEvent.keyCode;


      if ( $(document).scrollTop() < 1){ /** disable keyUp on closing section */
        if (keycode < 37 || keycode > 40) return false;

        var prev = true;
        if (keycode === 39 || keycode === 40) prev = false

        if (!prev) {
          onSwipeUp();
        } else if (prev) {
          onSwipeDown();
        }
      }


    }

  }

})(jQuery);
