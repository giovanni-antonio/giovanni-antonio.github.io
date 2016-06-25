//@prepros-prepend ./jquery.js
//@prepros-prepend ./fontfaceobserver.js
$(document).ready(function() {
   var screenHeight = $(window).height();
   $('.bg-hero').css('height',screenHeight + 60 + 'px');
   console.log(screenHeight);
});

(function( w ){
    if( w.document.documentElement.className.indexOf( "fonts-loaded" ) > -1 ){
        return;
    }

    var font1 = new w.FontFaceObserver( "Josefin Sans", {
        weight: 700
    });
    var font2 = new w.FontFaceObserver( "Open Sans", {
        weight: [300, 700]
        });
    w.Promise
        .all([font1.check(), font2.check()])
        .then(function(){
            w.document.documentElement.className += " fonts-loaded";
        });
    }( this ));
