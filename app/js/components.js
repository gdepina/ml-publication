(function() {
  document.addEventListener('DOMContentLoaded', function(e) {

    var zoom1 = new ch.Zoom(ch('#zoom-default')[0]);
    zoom1.loadImage();
    var carousel = new ch.Carousel(ch('.myCarousel')[0], {
        pagination: true
    });

    var tabs = new ch.Tabs(ch(".tabs")[0]);
  });
})();