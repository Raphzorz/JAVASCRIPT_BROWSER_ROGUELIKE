<?php

// This will output the document head which is shared across documents

function outputHead($description, $title)
{
    echo '<!DOCTYPE html >
            <html lang = "en" >
            <head >
                <meta charset = "utf-8" >
                <meta name = "viewport" content = "width=device-width, initial-scale=1, shrink-to-fit=no" >
                <meta name = "description" content = "' . $description . '">
                <meta name = "author" content = "Raphael Ellul Falzon" >

                <title>' . $title . '</title>

                <!--Bootstrap core CSS-->
                <link rel = "stylesheet" href = "css/bootstrap.min.css" >
                <!--Favicon -->
                <link rel = "icon" type = "image/png" href = "assets/img/shared/favicon.ico" >
                <!--Custom fonts-->
                <link href = "https://fonts.googleapis.com/css?family=Varela+Round" rel = "stylesheet" >
                <link href = "https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel = "stylesheet" >
                <link href="https://fonts.googleapis.com/css?family=Audiowide|Raleway" rel="stylesheet">
                <!--Custom CSS Sheet-->
                <link href = "css/main.css" rel = "stylesheet" >
                <!-- Custon fonts for game-->
                <link rel="stylesheet" type = "text/css" href = "css/font-loader.css">
                <!-- CSS for flag icons-->
                <link href = "css/flag-icon.min.css" rel = "stylesheet">
                <!--Font Awesome-->
                <link rel = "stylesheet" href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" >

            </head > 
            <body>';}

//This function is responsible for generating the navigation bar which is shared across documents

function outputNavbar($pageName)
{
    echo '<!-- Navigation bar at the top of the page -->
        <nav class="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
            <div class="container"> <!-- Start container 1-->
                <a class="navbar-brand js-scroll-trigger" href="index.php">Chrono-Spark</a>
                <button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">        Menu
                    <i class="fa fa-bars"></i>
                </button>
                <div class="collapse navbar-collapse" id="navbarResponsive">
                    <ul class="navbar-nav ml-auto">';
                    outputNavbarLogic($pageName);
                    echo '
                    </ul> 
                </div>
            </div><!-- End container 1-->
        </nav>';
}

// The code below is responsible for looping through arrays to identify when an "active" class needs to be applied to the navlink
// This function is then called in the outputNavbar function

function outputNavbarLogic($pageName){

    //Declaration of arrays

    $linksNames     = array(
        "Login/Register",
        "Play",
        "Hi-Scores",
        "Play-Guide"
    );
    $linksAddresses = array(
        "sign-up.php",
        "play.php",
        "hi-scores.php",
        "play-guide.php"
    );

    for ($x = 0; $x < count($linksNames); $x++) {
        echo '
            <li class="nav-item">
                <a class="nav-link js-scroll-trigger';
                //If the link in the navbar matches the name of the current page then the "active" class will be added to its HTML.
                if ($linksNames[$x] == $pageName) {
                    echo ' active';}
                echo '" href="' . $linksAddresses[$x] . '">' . $linksNames[$x] . '
                </a>';
                echo '
            </li>';}
}

// The below function is responsible for generating the footer which is shared across documents

function outputFooter($pageName)
{
    echo '<!-- Contact Section -->
        <footer class="footer bg-black small text-center">
            <section class="contact-section bg-black">
                <h3 class="text-white-50 mx-auto mt-2 mb-3 text-capitalize text-center">find us on social media</h3>
                <div class="social d-flex justify-content-center">';

                populateContactList();

                echo '
                </div>
            </section>
            <div class="container"> <!--Start container 7-->
               <p class="text-white-50 mt-4"> Copyright &copy; Chrono Spark 2018 </p>
            </div> <!-- End container 7-->
        </footer>
        <!-- Bootstrap JavaScript -->
        <script src="js/jquery.slim.min.js"></script>
        <script src="js/popper.min.js"></script>
        <script src="js/bootstrap.min.js"></script>
        <!-- Custom scripts -->
        <script src="js/my-common-javascript.js"></script>';
        addGameScripts($pageName);
        echo'
      </body>
    </html>';
}

function addGameScripts($pageName){
    if ($pageName === "Play") {
        echo '        <!--Scripts for game-->
        <script type="text/javascript" src="js/phasermin.js"></script>
        <script type="text/javascript" src="js/boot.js"></script>
        <script type="text/javascript" src="js/preloader.js"></script>
        <script type="text/javascript" src="js/main-menu.js"></script>
        <script type="text/javascript" src="js/shop.js"></script>
        <script type="text/javascript" src="js/game.js"></script>
        <script type="text/javascript" src="js/main.js"></script>
        <script type="text/javascript" src="js/game-page-format.js"></script>';
        }

        if ($pageName === "Hi-Scores") {
            echo'<script src="js/hi-score.js"></script>';
        }
        if ($pageName === "Login/Register"){
            echo'<script src="js/login-handler.js"></script>';
        }
}

//The below function is called in the "play-guide". It is used to populate the grid

function populateGrid()
{

    $DescriptionOne = array(
        "Walk through randomly generated dungeons",
        "Fight a varied number of monsters",
        "Enjoy the thrill of permadeath",
        "Get stronger after every death",
        "Unlock and cast exciting spells",
        "Find equipment to make you stronger",
        "Your best floor is saved online"
    );
    $DescriptionTwo = array(
        "Use the 'WASD' keys to move",
        "Attack using the 'x' key",
        "Upon death you start from Floor 1",
        "Use experience points obtained upon death to get stronger",
        "Cast spells using the 'z' key",
        "Equipment is randomly found throughout dungeons",
        "Visit the Hi-scores page to compare your score with others"
    );

    for ($x = 0; $x < count($DescriptionOne); $x++) {
        echo'<div class="item" tabindex="' . ($x + 1) . '">
                <div class="box">
                    <div class="textboxguide"><span class="a">' . $DescriptionOne[$x] . '.</span><span class="b">' . $DescriptionTwo[$x] . '</span></div>
                </div>
             </div>';}
}

//This function is called in the hi-scores page. The table is populated from the values found in the arrays declared below.


//This method is called in the index. it populates the images and figure captions.

function populateImageRow()
{
    $figCaption = array(
        "Chrono Spark pits you against other players all around the globe. How will you compare? Find out today!",
        "Players get to pick-up powerups and assorted items. The more you play the stronger the boost. How strong will you be?",
        "Chrono Spark allows you to control the pace of the game. Your rules. Your Game."
    );
    $images     = array(
        "assets/img/index/pc-monitor.jpg",
        "assets/img/index/monitor-2.jpg",
        "assets/img/index/mushroom.jpg"
    );
    $subtitles  = array(
        "Online Hi-Score System",
        "In-Game Boosts",
        "Dynamic Gameplay"
    );

    for ($x = 0; $x < count($images); $x++) {
        echo '<div class="col-md-4">
                <figure>
                    <figcaption>
                        <img class="img-fluid mb-3 mb-lg-3 custom-img-shadow"  src="' . $images[$x] . '" alt="An image enhancing the look and feel of the website">
                        <h4 class="text-center text-white">' . $subtitles[$x] . '</h4>
                        <p class=" mb-0">' . $figCaption[$x] . '</p>
                    </figcaption>
                </figure>
              </div>';}
}

// This function is called from the footer function. It populates the "contact-us" section

function populateContactList()
{
    $contacts = array(
        "twitter",
        "facebook-f",
        "reddit",
        "github",
        "instagram"
    );

    for ($x = 0; $x < count($contacts); $x++) {
        echo '<a href="#" class="mx-2">
                <i class="fa fa-' . $contacts[$x] . '"></i>
              </a>';}
}

//The below function sets a timer under the main landing page in the index. Once the game is released the timer
//will switch to the text "Available Now"

function countdown()
{

    //Current date and time is saved as a unix timestamp
    $today = time();

    // Date and time of event is saved
    $launch = mktime(0, 0, 0, 12, 10, 2018);

    //86400 seconds make up one day. The division ensures the answer is in days and not seconds.
    //Round ensures the output is not displayed as 25.2349234923 or similar
    $daysToLaunch = round(($launch - $today) / 86400);

    //Displays the days till release. Once days till release changes to 0 the text will also change.
    if ($daysToLaunch > 0) {
        echo '<h2 class="text-white-50 mx-auto mt-2 mb-5 text-capitalize">' . $daysToLaunch . ' days until release</h2>';
    } else {
        echo '<h2 class="text-white-50 mx-auto mt-2 mb-5 text-capitalize">available now</h2>';
    }

}