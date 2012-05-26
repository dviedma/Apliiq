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
                        'securityMargin' : 4
                    });
                    $('#slider-customizer-womens').funCarousel({
                        'securityMargin' : 4
                    }).hide();
                    $('#slider-customizer-kids').funCarousel({
                        'securityMargin' : 4
                    }).hide();
                    $('#slider-customizer-items').funCarousel({
                        'securityMargin' : 4
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
                    var tweetString;
                    $.getJSON("http://api.twitter.com/1/statuses/user_timeline/"+username+".json?include_rts=true&count="+tweetsLimit+"&callback=?", function(data) {
                        tweetString = data[0].text.replace(linkRegexp, "<a href='$1' target='_blank'>$1</a>");
                        tweetString = tweetString.replace(handlerRegexp, "<a href='http://twitter.com/$1' target='_blank'>$1</a>");
                        //TODO link to hashtag
                        tweetString = tweetString.replace(hashtagRegexp, "<a href='http://twitter.com/#!/search/%23$1' target='_blank'>$1</a>");
                        $("#tweet").html(tweetString);
                    });

                    //Instagram
                    $('.instagram').instagram({
                        hash: 'love',
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
                                        break;
                                    }else if (results.data[i].type == 'video') {
                                        lastVideoPost = results.data[i];
                                        break;
                                    } else if (results.data[i].type == 'status') {
                                        lastStatusPost = results.data[i];
                                        postString = '<span class="status-msg">'+lastStatusPost.message+'</<span><a target="_blank" href="https://www.facebook.com/theapliiqpage"><div class="logo">facebook</div></a>';
                                        break;
                                    }
                                }
                            }
                            $('.facebook').html(postString);
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

                    $('input').click(function(){
                        $(this).attr('value', '');
                    })
                }
            };

            sliderhero.build();
            fabrics.build();
            customizer.build();
            social.build('apliiq');
            forms.build();

        }
    });

}(jQuery));