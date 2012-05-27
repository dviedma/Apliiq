
// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  if(this.console) {
    arguments.callee = arguments.callee.caller;
    var newarr = [].slice.call(arguments);
    (typeof console.log === 'object' ? log.apply.call(console.log, console, newarr) : console.log.apply(console, newarr));
  }
};

// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,clear,count,debug,dir,dirxml,error,exception,firebug,group,groupCollapsed,groupEnd,info,log,memoryProfile,memoryProfileEnd,profile,profileEnd,table,time,timeEnd,timeStamp,trace,warn".split(","),a;a=d.pop();){b[a]=b[a]||c}})((function(){try
{console.log();return window.console;}catch(err){return window.console={};}})());


// place any jQuery/helper plugins in here, instead of separate, slower script files.

//Instagram
(function($){
  $.fn.instagram = function(options) {
    var that = this,
        apiEndpoint = "https://api.instagram.com/v1",
        settings = {
            hash: null
          , userId: null
          , locationId: null
          , search: null
          , accessToken: null
          , clientId: null
          , show: null
          , onLoad: null
          , onComplete: null
          , maxId: null
          , minId: null
          , next_url: null
        };

    options && $.extend(settings, options);

    function createPhotoElement(photo) {
      return $('<div>')
        .addClass('instagram-placeholder')
        .attr('id', photo.id)
        .append(
          $('<a>')
            .attr('target', '_blank')
            .attr('href', photo.link)
            .append(
              $('<img>')
                .addClass('instagram-image')
                //.attr('src', photo.images.thumbnail.url)
                  .attr('src', photo.images.low_resolution.url)
            )
              .append(
              $('<div>instagram</div>').
                  addClass('logo')
          )
        );
    }

    function createEmptyElement() {
      return $('<div>')
        .addClass('instagram-placeholder')
        .attr('id', 'empty')
        .append($('<p>').html('No photos for this query'));
    }

    function composeRequestURL() {

      var url = apiEndpoint,
          params = {};

      if (settings.next_url != null) {
        return settings.next_url;
      }

      if(settings.hash != null) {
        url += "/tags/" + settings.hash + "/media/recent";
      }
      else if(settings.search != null) {
        url += "/media/search";
        params.lat = settings.search.lat;
        params.lng = settings.search.lng;
        settings.search.max_timestamp != null && (params.max_timestamp = settings.search.max_timestamp);
        settings.search.min_timestamp != null && (params.min_timestamp = settings.search.min_timestamp);
        settings.search.distance != null && (params.distance = settings.search.distance);
      }
      else if(settings.userId != null) {
        url += "/users/" + settings.userId + "/media/recent";
      }
      else if(settings.locationId != null) {
        url += "/locations/" + settings.locationId + "/media/recent";
      }
      else {
        url += "/media/popular";
      }

      settings.accessToken != null && (params.access_token = settings.accessToken);
      settings.clientId != null && (params.client_id = settings.clientId);
      settings.minId != null && (params.min_id = settings.minId);
      settings.maxId != null && (params.max_id = settings.maxId);

      url += "?" + $.param(params)

      return url;
    }

    settings.onLoad != null && typeof settings.onLoad == 'function' && settings.onLoad();

    $.ajax({
      type: "GET",
      dataType: "jsonp",
      cache: false,
      url: composeRequestURL(),
      success: function(res) {
        var length = typeof res.data != 'undefined' ? res.data.length : 0;
        var limit = settings.show != null && settings.show < length ? settings.show : length;

        if(limit > 0) {
          for(var i = 0; i < limit; i++) {
            that.append(createPhotoElement(res.data[i]));
          }
        }
        else {
          that.append(createEmptyElement());
        }

        settings.onComplete != null && typeof settings.onComplete == 'function' && settings.onComplete(res.data, res);
      }
    });

    return this;
  };
})(jQuery);


/*===== FunCarousel
Author: Daniel Viedma
Date: 04-25-2012
============================================================ */
(function($){
    var totalWidth;
    var innerWidth;
    var slidesGutter;
    var shift;
    var numSlides;
    var animating;

    var $controlnav;
    var $firstSlide;

    $.fn.funCarousel = function(ops) {

        var defaults = {
            controlNav: false,
            speed: 'fast',

            securityMargin: 0,
            //adjust this value to avoid empty spaces on sides depending on how many slides you have,
            //size of the shift and how wide is the slide

            numSlidesPerShift: 1,
            parallax: false,
            blur : true
        };

        var options = $.extend({}, defaults, ops);

        //Methods object
        var fc = {

            /**
             * Creates a carousel for all matched elements.
             *
             * @example $('#mycarousel').funCarousel();
             * @before
             *         <div id="slider1" class="slider">
             *              <div class="slides-wrapper">
             *                  <div class="slides">
             *                      <div class="slide"></div>
             *                      <div class="slide"></div>
             *                  </div>
             *               </div>
             *         </div>
             * @result
             *         <div id="slider1" class="slider">
             *              <div class="slides-wrapper">
             *                  <div class="slides" style="width: totalWidth; left: -shift">
             *                      <div class="slide" rel="alpha"></div>
             *                      <div class="slide" rel="0"></div>
             *                      <div class="slide" rel="1"></div>
             *                      <div class="slide" rel="omega"></div>
             *                  </div>
             *               </div>
             *         </div>
             *
             * @method build
             * @return jQuery
             * @param self {HTMLElement} The element to create the carousel for.
             */
            build: function(self) {
                self.find('.slide').css('display','block');
                $firstSlide = self.find('.slide').first();
                $firstSlide.addClass('first active');  //first = active slide
                slidesGutter = parseInt($firstSlide.css('margin-right'));
                innerWidth = self.find('.slides-wrapper').parent().width();
                //self.find('.slides-wrapper').css('width', innerWidth);
                //self.find('.slides-wrapper .slide').css('width', innerWidth);
                shift = $firstSlide.width() + parseInt(slidesGutter);
                numSlides = self.find('.slide').size();
                totalWidth = (numSlides * 3) * (slidesGutter + innerWidth);
                self.find('.slides').css('width',totalWidth);

                if(numSlides > 1){
                    //Add number to slides
                    self.find('.slide').each(function(index){
                        $(this).attr('rel', index);
                    });

                    //Build control nav
                    if(options.controlNav) {
                        $controlnav = $('<div class="control-nav"><div class="wrapper"></div></div>');
                        self.find('.slide').each(function(){
                            $controlnav.children('.wrapper').append('<span class="control"></span>');
                        });
                        $controlnav.insertAfter(self.find('.slides'));

                        var bulletWidth = parseInt($controlnav.find('.control').first().css('width'));
                        var bulletMargin = parseInt($controlnav.find('.control').first().css('margin-right'))*2;
                        var controlWidth = numSlides * (bulletWidth + bulletMargin);

                        $controlnav.find('.wrapper').width(controlWidth);
                        $controlnav.find('.control').first().addClass('active');
                        $controlnav.find('.control').each(function(){
                            $(this).click({self: self, shift: shift, numSlides: numSlides}, fc.navigateTo);
                        });
                    }

                    //Build arrows nav
                    var $arrowLeft = $('<span class="nav-arrow left">left</span>');
                    var $arrowRight = $('<span class="nav-arrow right">right</span>');

                    $arrowLeft.click({self: self, shift: shift, numSlides: numSlides}, fc.navLeft);
                    $arrowRight.click({self: self, shift: shift, numSlides: numSlides}, fc.navRight);

                    self.append($arrowLeft).append($arrowRight);

                    //Build alpha and omega: we clone as many slidesPerScreen as we have and insert them before and after the original slides
                    var numCopies = numSlides;
                    self.find('.slides').css('left',-shift*numCopies);

                    var slideNodes = [];
                    for (var i=0; i<numCopies; i++) {
                        slideNodes[i] = self.find('.slide').eq(i).clone().attr('rel','');
                        if (i==0) {
                            slideNodes[i].removeClass('first active');
                        }
                    }
                    for (var z=0; z<numCopies; z++) {
                        self.find('.slides').append( slideNodes[z].clone().attr('rel','omega') );
                    }
                    for (var j=numCopies-1; j>=0; j--) {
                        self.find('.slides').prepend( slideNodes[j].clone().attr('rel','alpha') );
                    }
                }

                return self;
            },

            /**
             * Fired when the user clicks on the bullets at the bottom to move from slide to slide
             *
             * @method navigateTo
             * @return undefined
             * @param e {Event} User click event
             */
            navigateTo: function(e) {
                var self = e.data.self;
                var shift = e.data.shift;
                var numSlides = e.data.numSlides;

                var $clickedBullet = $(this);

                if(options.blur){
                    if(Math.abs(self.find('.control-nav .active').index()-$clickedBullet.index()) > 1){
                        self.find('.slides').addClass('blur');
                    }
                }


                //place the bullet
                self.find('.control-nav .active').removeClass('active');
                $clickedBullet.addClass('active');

                self.find('.slides').animate({left:-shift* ($clickedBullet.index()+numSlides) },options.speed, function(){
                    self.find('.slides').removeClass('blur');

                    //move .first class
                    self.find('.slide').removeClass('first active');
                    self.find('.slide[rel="'+$clickedBullet.index()+'"]').addClass('first active');
                });
            },

            /**
             * Fired when the user clicks on the left navigation
             * * NOTES: the formulas applied for threshold detection etc. should be tested in different scenarios (number of slides, slides per shift, slides per screen, etc)
             *
             * @method navLeft
             * @return undefined
             * @param e {Event} User click event
             */
            navLeft: function(e) {
                var self = e.data.self;
                var shift = e.data.shift;
                var numSlides = e.data.numSlides;

                if(animating){
                    return undefined;
                }
                animating = true;

                if(options.parallax) {
                    fc.getFirstSlide(self).find('.foreground').animate({left:'+='+shift},800);
                }

                //animate slider
                self.find('.slides').animate({left:'+='+shift*options.numSlidesPerShift},options.speed, function(){
                    animating = false;

                    //move bullet
                    fc.moveBulletLeft(self);

                    var indexFirst = fc.getFirstSlide(self).index();
                    var indexActive = fc.getActiveSlide(self).index();
                    if(indexFirst - 2*options.numSlidesPerShift - options.securityMargin < 0) {     //backCarouselToBeginning
                        fc.getFirstSlide(self).removeClass('first');
                        fc.getActiveSlide(self).removeClass('active');
                        self.find('.slide').eq(indexActive-options.numSlidesPerShift+numSlides).addClass('first active');

                        //move carousel to end
                        self.find('.slides').css('left', -shift*(indexActive-options.numSlidesPerShift+numSlides));
                    }else{                                                                          //keep moving left
                        //shift .first class
                        fc.getFirstSlide(self).removeClass('first active').
                            prev().
                            addClass('first');

                        self.find('.slide').eq(indexFirst-options.numSlidesPerShift).addClass('active');
                    }

                    if(options.parallax) {
                        //TODO: read property
                        $('.foreground').css('left', '550px');
                    }

                });
            },

            /**
             * Moves bullet to the left after animating the carousel on user left navigation
             *
             * @method moveBulletLeft
             * @return undefined
             * @param self {HTMLElement} The element to create the carousel for.
             */
            moveBulletLeft: function(self) {
                if(self.find('.control-nav .active').prev().size() > 0){
                    self.find('.control-nav .active').removeClass('active').
                        prev().
                        addClass('active');
                }
                else {
                    self.find('.control-nav .active').removeClass('active');
                    var bullets = self.find('.control-nav .control');
                    bullets.eq(bullets.size()-1).addClass('active');
                }
            },

            /**
             * Fired when the user clicks on the right navigation
             * NOTES: the formulas applied for threshold detection etc. should be tested in different scenarios (number of slides, slides per shift, slides per screen, etc)
             *
             * @method navRight
             * @return undefined
             * @param e {Event} User click event
             */
            navRight: function (e){
                var self = e.data.self;
                var shift = e.data.shift;
                var numSlides = e.data.numSlides;

                //animate slider
                if(animating){
                    return undefined;
                }
                animating = true;

                if(options.parallax) {
                    fc.getFirstSlide(self).find('.foreground').animate({left:'-='+shift},800);
                }

                self.find('.slides').animate({left:'-='+shift*options.numSlidesPerShift},{
                    duration:options.speed,
                    complete: function(){
                        animating = false;
                        //move bullet
                        fc.moveBulletRight(self);

                        var indexFirst = fc.getFirstSlide(self).index();
                        var indexActive = fc.getActiveSlide(self).index();
                        //if we still have slides on our right, move. otherwise insert the first node (circular navigation)
                        if(indexFirst + (options.numSlidesPerShift-1) + 2*options.numSlidesPerShift + options.securityMargin > self.find('.slide').size()-1) {
                            fc.getFirstSlide(self).removeClass('first');
                            fc.getActiveSlide(self).removeClass('active');
                            self.find('.slide').eq(indexActive+options.numSlidesPerShift-numSlides).addClass('first active');

                            //move carousel to beginning
                            self.find('.slides').css('left',-shift*(indexActive+options.numSlidesPerShift-numSlides));
                        } else {                                                         //keep moving right
                            //shift .first class
                            fc.getFirstSlide(self).removeClass('first active').
                                next().
                                addClass('first');

                            self.find('.slide').eq(indexFirst+options.numSlidesPerShift).addClass('active');
                        }

                        if(options.parallax) {
                            //TODO: read property
                            $('.foreground').css('left', '550px');
                        }

                    }
                });
            },

            /**
             * Moves bullet to the right after animating the carousel on user right navigation
             *
             * @method moveBulletLeft
             * @return undefined
             * @param self {HTMLElement} The element to create the carousel for.
             */
            moveBulletRight: function(self) {
                if(self.find('.control-nav .active').next().size() > 0){
                    self.find('.control-nav .active').removeClass('active').
                        next().
                        addClass('active');
                }
                else {
                    self.find('.control-nav .active').removeClass('active');
                    self.find('.control-nav .control').eq(0).addClass('active');
                }
            },

            /**
             * Auxiliar function to get the .first slide THRESHOLD detection purpose
             *
             * @method getFirstSlide
             * @return first/active/visible slide
             * @param self {HTMLElement} The element to create the carousel for.
             */
            getFirstSlide: function(self) {
                return self.find('.slide.first');
            },

            /**
             * Auxiliar function to get the .active slide (first visible slide)
             *
             * @method getFirstSlide
             * @return first/active/visible slide
             * @param self {HTMLElement} The element to create the carousel for.
             */
            getActiveSlide: function(self) {
                return self.find('.slide.active');
            }

        };


        if(this.length){
            return fc.build(this);
        }

    };
}(jQuery));


/**
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * @name timeago
 * @version 0.11.3
 * @requires jQuery v1.2.3+
 * @author Ryan McGeary
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Copyright (c) 2008-2012, Ryan McGeary (ryan -[at]- mcgeary [*dot*] org)
 */
(function($) {
  $.timeago = function(timestamp) {
    if (timestamp instanceof Date) {
      return inWords(timestamp);
    } else if (typeof timestamp === "string") {
      return inWords($.timeago.parse(timestamp));
    } else if (typeof timestamp === "number") {
      return inWords(new Date(timestamp));
    } else {
      return inWords($.timeago.datetime(timestamp));
    }
  };
  var $t = $.timeago;

  $.extend($.timeago, {
    settings: {
      refreshMillis: 60000,
      allowFuture: false,
      strings: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: "ago",
        suffixFromNow: "from now",
        seconds: "less than a minute",
        minute: "about a minute",
        minutes: "%d minutes",
        hour: "about an hour",
        hours: "about %d hours",
        day: "a day",
        days: "%d days",
        month: "about a month",
        months: "%d months",
        year: "about a year",
        years: "%d years",
        wordSeparator: " ",
        numbers: []
      }
    },
    inWords: function(distanceMillis) {
      var $l = this.settings.strings;
      var prefix = $l.prefixAgo;
      var suffix = $l.suffixAgo;
      if (this.settings.allowFuture) {
        if (distanceMillis < 0) {
          prefix = $l.prefixFromNow;
          suffix = $l.suffixFromNow;
        }
      }

      var seconds = Math.abs(distanceMillis) / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;
      var days = hours / 24;
      var years = days / 365;

      function substitute(stringOrFunction, number) {
        var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
        var value = ($l.numbers && $l.numbers[number]) || number;
        return string.replace(/%d/i, value);
      }

      var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
        seconds < 90 && substitute($l.minute, 1) ||
        minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
        minutes < 90 && substitute($l.hour, 1) ||
        hours < 24 && substitute($l.hours, Math.round(hours)) ||
        hours < 42 && substitute($l.day, 1) ||
        days < 30 && substitute($l.days, Math.round(days)) ||
        days < 45 && substitute($l.month, 1) ||
        days < 365 && substitute($l.months, Math.round(days / 30)) ||
        years < 1.5 && substitute($l.year, 1) ||
        substitute($l.years, Math.round(years));

      var separator = $l.wordSeparator === undefined ?  " " : $l.wordSeparator;
      return $.trim([prefix, words, suffix].join(separator));
    },
    parse: function(iso8601) {
      var s = $.trim(iso8601);
      s = s.replace(/\.\d\d\d+/,""); // remove milliseconds
      s = s.replace(/-/,"/").replace(/-/,"/");
      s = s.replace(/T/," ").replace(/Z/," UTC");
      s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
      return new Date(s);
    },
    datetime: function(elem) {
      var iso8601 = $t.isTime(elem) ? $(elem).attr("datetime") : $(elem).attr("title");
      return $t.parse(iso8601);
    },
    isTime: function(elem) {
      // jQuery's `is()` doesn't play well with HTML5 in IE
      return $(elem).get(0).tagName.toLowerCase() === "time"; // $(elem).is("time");
    }
  });

  $.fn.timeago = function() {
    var self = this;
    self.each(refresh);

    var $s = $t.settings;
    if ($s.refreshMillis > 0) {
      setInterval(function() { self.each(refresh); }, $s.refreshMillis);
    }
    return self;
  };

  function refresh() {
    var data = prepareData(this);
    if (!isNaN(data.datetime)) {
      $(this).text(inWords(data.datetime));
    }
    return this;
  }

  function prepareData(element) {
    element = $(element);
    if (!element.data("timeago")) {
      element.data("timeago", { datetime: $t.datetime(element) });
      var text = $.trim(element.text());
      if (text.length > 0 && !($t.isTime(element) && element.attr("title"))) {
        element.attr("title", text);
      }
    }
    return element.data("timeago");
  }

  function inWords(date) {
    return $t.inWords(distance(date));
  }

  function distance(date) {
    return (new Date().getTime() - date.getTime());
  }

  // fix for IE6 suckage
  document.createElement("abbr");
  document.createElement("time");
}(jQuery));