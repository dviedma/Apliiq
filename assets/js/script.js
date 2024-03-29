jQuery(document).ready(function() {
    $.apliiq();
});


(function($){
    var variable;

    $.extend({
        apliiq: function (ops) {

            var defaults = {

            };

            var options = $.extend({}, defaults, ops);


            /**
             * Header
             */
            var header = {
                /**
                 * Binds the rollover event to the fabric boxes to show the fabric detail
                 *
                 * @method build
                 * @return undefined
                 * @param undefined
                 */
                build: function() {

                    $('.roll').hover(
                        function(){
                            $(this).stop().animate({top: -45});
                        },
                        function(){
                            $(this).stop().animate({top: 0});
                        }
                    ).click(function(){
                            jQuery.scrollTo({top:'0', left:'+=0px'}, { duration:1000});
                    });
                }
            };

            /**
             * Section: Fresh Fabrics
             */
            var sliderhero = {
                /**
                 * Binds the rollover event to the fabric boxes to show the fabric detail
                 *
                 * @method build
                 * @return undefined
                 * @param undefined
                 */
                build: function() {

                    $('#slider-hero').funCarousel({
                        'securityMargin' : 1,
                        'speed' : 1500,
                        'parallax': true,
                        'controlNav' : true,
                        'blur' : false
                    });
                }
            };

            /**
             * Section: Fresh Fabrics
             */
            var fabrics = {
                /**
                 * Binds the rollover event to the fabric boxes to show the fabric detail
                 *
                 * @method build
                 * @return undefined
                 * @param undefined
                 */
                build: function() {
                    var $catalogue = $('#f-catalogue');
                    var $fabricdetail = $('#fabric-detail');

                    //preload images
                    var $img;
                    var preload = [
                        'assets/imgs/slider-hero/background1.jpg',
                        'assets/imgs/slider-hero/background2.jpg',
                        'assets/imgs/slider-hero/background3.jpg',
                        'assets/imgs/slider-hero/background4.jpg',

                        'assets/imgs/fresh-fabrics/fabric1-det.jpg',
                        'assets/imgs/fresh-fabrics/fabric2-det.jpg',
                        'assets/imgs/fresh-fabrics/fabric3-det.jpg',
                        'assets/imgs/fresh-fabrics/fabric4-det.jpg',
                        'assets/imgs/fresh-fabrics/fabric5-det.jpg',
                        'assets/imgs/fresh-fabrics/fabric6-det.jpg'
                    ];
                    for(var i=0; i< preload.length; i++){
                        $img = $('<img/>').addClass('preload');
                        $img[0].src = preload[i];
                        $('body').prepend($img);
                    }


                    //rollover effect
                    $('.fabric-box').mouseenter(function () {
                        $catalogue.unbind('mouseleave');

                        $catalogue.css('left', $(this)[0].offsetLeft)
                            .css('top', $(this)[0].offsetTop);
                        $catalogue.show();

                        $fabricdetail.addClass( $(this).attr('data-fabric')).fadeIn('fast', function(){

                            $catalogue.bind('mouseleave', function(){
                                $fabricdetail.attr('class','').hide();
                                $catalogue.hide();
                            });

                        });
                    });

                }
            };

            /**
             * Section: Customizer
             */
            var customizer = {
                /**
                 * Activates animation on the customizer menu
                 *
                 * @method build
                 * @return undefined
                 * @param undefined
                 */
                build: function() {
                    var $catalogue = $('#c-catalogue');
                    var $tab = $('#tab-active');
                    var $label = $('#label');

                    $tab.css({left: $catalogue.find('li').first()[0].offsetLeft});
                    $label.text( $catalogue.find('li').first().text() );

                    $catalogue.find('li').click(function(){
                        var current = $tab.find('span').text();
                        var $this = $(this);
                        $label.text('');
                        $tab.animate({left: $this[0].offsetLeft}, function(){
                            $label.text( $this.text() );

                            $('#slider-customizer-'+current).hide();
                            $('#slider-customizer-'+$this.attr('id')).show();
                        });
                    });

                    $('#slider-customizer-mens').funCarousel({
                        'securityMargin' : 4,
                        'slidesinfo' : false
                    });
                    $('#slider-customizer-womens').funCarousel({
                        'securityMargin' : 4,
                        'slidesinfo' : false
                    }).hide();
                    $('#slider-customizer-kids').funCarousel({
                        'securityMargin' : 4,
                        'slidesinfo' : false
                    }).hide();
                    $('#slider-customizer-accessories').funCarousel({
                        'securityMargin' : 4,
                        'slidesinfo' : false
                    }).hide();
                }

            };

            /**
             * Section: Social
             */
            var social = {
                /**
                 * Polls different APIs
                 *
                 * @method build
                 * @return undefined
                 * @param undefined
                 */
                build: function(username) {


                    //Youtube
                    var youtubeLimit = 1;
                    var videoString;
                    $.getJSON("http://gdata.youtube.com/feeds/users/"+username+"/uploads?alt=json-in-script&max-results="+youtubeLimit+"&format=5&callback=?", function(data) {
                        var url = data.feed.entry[0].link[0].href;
                      	var	url_thumbnail = data.feed.entry[0].media$group.media$thumbnail[0].url;
                        videoString = '<a href="'+url+'" target="_blank"><img src="'+url_thumbnail+'" alt=""><div class="logo">youtube</div><div class="play">play</div></a>';
                        $(".youtube").html(videoString);
                    });

                    //Twitter
                    var tweetsLimit = 1;
                    var linkRegexp=/(http:\/\/+[\S]*)/g;
                    var handlerRegexp = /(@+[\S]*)/g;
                    var hashtagRegexp = /(#+[\S]*)/g;
                    var doubleHash = /(%23#)/g;
                    var tweetString;
                    $.getJSON("http://api.twitter.com/1/statuses/user_timeline/"+username+".json?include_rts=true&count="+tweetsLimit+"&callback=?", function(data) {
                        tweetString = data[0].text.replace(linkRegexp, "<a href='$1' target='_blank'>$1</a>");
                        tweetString = tweetString.replace(handlerRegexp, "<a href='http://twitter.com/$1' target='_blank'>$1</a>");
                        //TODO link to hashtag
                        tweetString = tweetString.replace(hashtagRegexp, "<a href='http://twitter.com/#!/search/%23$1' target='_blank'>$1</a>");
                        tweetString = tweetString.replace(doubleHash, "%23");
                        $("#tweet").html(tweetString);
                    });

                    //Instagram
                    $('.instagram').instagram({
                        hash: 'apliiqhomepage',
                        show: 1,
                        clientId: 'b76cb39fa7ff4f83835861df4d6b4eeb'
                    });

                    //Facebook
                    var results;
                    var lastPhotoPost;
                    var lastVideoPost;
                    var lastStatusPost;
                    var picture;
                    var postString;
                    $.ajax({
                        url: "https://graph.facebook.com/theapliiqpage/feed?access_token=384410611610742|Zggo90jouEkyEqDts_LS6AfcLFE",
                        dataType: 'json',
                        data: results,
                        success: function (results){
                            for(var i=0; i<results.data.length; i++) {
                                if(results.data[i].from.name == "apliiq") {
                                    if(results.data[i].type == 'photo') {
                                        lastPhotoPost = results.data[i];
                                        picture = lastPhotoPost.picture.replace('_s.jpg','_n.jpg');
                                        postString = '<a href="'+lastPhotoPost.link+'" target="_blank"><img src="'+picture+'" alt=""><div class="logo">facebook</div></a>';
                                        $('.facebook').addClass('photo');
                                        break;
                                    }else if (results.data[i].type == 'video') {
                                        lastVideoPost = results.data[i];
                                        picture = lastVideoPost.picture.replace('_t.jpg','_n.jpg');
                                        postString = '<a href="'+lastVideoPost.link+'" target="_blank"><img height="220px" src="'+picture+'" alt=""><div class="logo">facebook</div><div class="play">play</div></a>';
                                        $('.facebook').addClass('photo');

                                        break;
                                    } else if (results.data[i].type == 'status' && results.data[i].message != undefined) {
                                        lastStatusPost = results.data[i];
                                        $('abbr.timeago').attr('title', lastStatusPost.created_time);
                                        jQuery("abbr.timeago").timeago();

                                        var msg = lastStatusPost.message;
                                        if(msg.length > 190) {
                                            msg = msg.substr(0, 190) + "...";
                                        }
                                        msg = msg.replace(linkRegexp, "<a href='$1' target='_blank'>$1</a>");

                                        postString = '<span class="status-msg">'+msg+'</<span><a target="_blank" href="https://www.facebook.com/theapliiqpage">'+
                                            '<div class="logo">facebook</div></a>';
                                        $('.facebook').addClass('status');
                                        break;
                                    }
                                }
                            }
                            $('.facebook').prepend(postString);
                        }
                    });
                }
            };

            /**
             * General functionality for forms
             */
            var forms = {
                /**
                 * Clear text input on click
                 *
                 * @method build
                 * @return undefined
                 * @param undefined
                 */
                build: function() {

                    $('input[type="text"]').click(function(){
                        $(this).attr('value', '');
                    })
                    $('#submit-newsletter').click(function(e){
                        e.preventDefault();
                        $('#newsletter-popup').toggleClass('hide');
                        $('#overlay').toggleClass('hide');
                        $('#close-overlay').toggleClass('hide');
                    })
                    $('#close-overlay').click(function(){
                        $('#newsletter-popup').toggleClass('hide');
                        $('#overlay').toggleClass('hide');
                        $('#close-overlay').toggleClass('hide');
                    });

                }
            };

            header.build();
            sliderhero.build();
            fabrics.build();
            customizer.build();
            social.build('apliiq');
            forms.build();


        }
    });

}(jQuery));
