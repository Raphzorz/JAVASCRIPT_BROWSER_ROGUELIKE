(function($) {
    "use strict"; // Start of use strict

    // Collapse Navbar
    var navbarCollapse = function() {
        if ($("#mainNav").offset().top > 1) { // When the user scrolls down by 1 pixel the navbar background will appear.
            $("#mainNav").addClass("navbar-shrink");
        } else {
            $("#mainNav").removeClass("navbar-shrink");
        }
    };

    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);

})(jQuery); // Strict mode is ended

// Register validation below here

