(function($) {
    "use strict"; // Start of use strict

    // Collapse Navbar
    var navbarCollapse = function() {
        if ($("#mainNav").offset().top > 1) { // When the user scrolls down by 1 pixel the navbar background will appear.
            $("#mainNav").addClass("navbar-shrink disappear");
        } else {
            $("#mainNav").removeClass("navbar-shrink disappear");
        }
    };
    // When the document is loaded the page is automatically scrolled to the height of the game
    $(document).ready(function() {
        $(this).scrollTop(320);
    });
    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);

})(jQuery); // Strict mode is ended