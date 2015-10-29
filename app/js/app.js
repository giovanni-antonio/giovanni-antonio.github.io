// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

(function (){
  // Config
  // ===================================================
  var windowWidth    = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
   windowHeight      = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
   minDeviceWidth    = 1200,
   raf               = 0,
   ctaBtn            = document.getElementById('cta'),
   background        = document.getElementById('background-hero'),
   windowCurrentYpos = 0,
   minWindowHeight   = 0,
   opacity           = 0,
   backgroundHeight  = background.offsetHeight;

  // GSAP animation
  var animateLanding = new TimelineLite();
  // Methods
  // ===================================================
  // set animations
  function setAnimation(){
    animateLanding.
      from('#background-hero', 1.25, {scale: 1.5, ease:Power1.ease}, "hero").
      from("#logo", 0.5, {opacity: 0, y: "+=80", ease:Power1.ease}, "hero+=0.5").
      from(".intro h1", 0.5, {opacity: 0, y: "-=40", ease:Power1.ease}, "hero+=0.75").
      from(".intro .subheading", 0.5, {opacity: 0, y: "+=40", ease:Power1.ease}, "hero+=1").
      fromTo("#cta", 0.5, {opacity: 0},{opacity: 1, ease:Power1.ease , onComplete: cleanInlineStyle}, "hero+=1.25");
  }
  function cleanInlineStyle(){
    background.removeAttribute('style');
    console.log("Animation is done!");
  }
  // render animation
  function render(){
    setAnimation();
  }
  // reset animations
  function reset(){
    console.log("Reseting animation!");
    cancelAnimationFrame(raf);
  }
  // play animations
  function play(){
    // Only render when device width is greater than 1200px
    if (windowWidth > minDeviceWidth) {
      console.log("Animation is playing!");
      render();
    } else {
      // otherwise don't play the animation
      console.log("No Animation is playing, you are in a mobile devie!");
      // reset();
    }
  }
  // when call to action click event triggers scroll to section page
  function getCtaEvent(){
    console.log("Scroll to page!");
    TweenLite.to(window, 1.5,{scrollTo:{y:windowHeight}, ease:Power2.easeOut});
  }

  function fadeOutBackground(){
    windowCurrentYpos = window.scrollY;
    if ( windowCurrentYpos <= minWindowHeight ){
      opacity = 1;
    } else if ( windowCurrentYpos <= windowHeight ){
      opacity = 1 - windowCurrentYpos / windowHeight;
    }
    background.style.opacity = opacity;
    raf = requestAnimationFrame(fadeOutBackground);
  }
  // Handlers
  // ===================================================
  // Play animation
  play();
  // Trigger scroll to page
  ctaBtn.addEventListener('click', getCtaEvent, false);
  // window.addEventListener('scroll', fadeOutElement, false);
  fadeOutBackground();
})();
