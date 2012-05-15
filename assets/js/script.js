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
                        $this = $(this)
                        $label.text('');
                        $tab.animate({left: $this[0].offsetLeft}, function(){
                            $label.text( $this.text() );
                        });
                    });
                }

            };

            /**
             * Section: Social
             */
            var social = {
                /**
                 * Polls different apis
                 *
                 * @method build
                 * @return undefined
                 * @param undefined
                 */
                build: function(username) {

                    //Twitter
                    var tweetsLimit = 1;
                    $.getJSON("http://api.twitter.com/1/statuses/user_timeline/"+username+".json?include_rts=true&count="+tweetsLimit+"&callback=?", function(data) {
                         $("#tweet").html(data[0].text);
                    });

                    //Youtube
                    var youtubeLimit = 1;
                    $.getJSON("http://gdata.youtube.com/feeds/users/"+username+"/uploads?alt=json-in-script&max-results="+youtubeLimit+"&format=5&callback=?", function(data) {
                        var url = data.feed.entry[0].link[0].href;
                      	var	url_thumbnail = data.feed.entry[0].media$group.media$thumbnail[0].url;
                        $("#youtube").html(url+' '+url_thumbnail);
                    });

                    //Instagram
                    $('.instagram').instagram({
                        hash: 'love',
                        show: 1,
                        clientId: 'b76cb39fa7ff4f83835861df4d6b4eeb'
                    });

                    //Facebook
                    //https://graph.facebook.com/366777262024
                    //https://graph.facebook.com/<USER ID>/feed?limit=1&access_token=<ACCESS TOKEN>
                }

            };

            fabrics.build();
            customizer.build();
            social.build('apliiq');

        }
    });

}(jQuery));