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

            fabrics.build();
            customizer.build();

        }
    });

}(jQuery));