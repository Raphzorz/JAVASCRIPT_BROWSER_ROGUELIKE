    <?php

    include ('common.php');

    outputHead("This is the main page for the game Chrono-Spark","Chrono-Spark");

    outputNavbar('Chrono-Spark');

    ?>

    <!-- Header & Landing page -->
    <header class="landing">
        <div class="container d-flex h-100 align-items-center"> <!-- Start container 2-->
            <div class="mx-auto text-center">
                <h1 class="mx-auto my-0 text-uppercase blink_me">Chrono-Spark</h1>
                <?php
                countdown();
                ?>
                <div class="button button-anim">
                    <div class ="translate"></div>
                    <!-- Clicking this button will take the user to the sign-up page -->
                    <a href="sign-up.php">Sign Up</a>
                </div>
            </div>
        </div> <!-- End container 2 -->
    </header>

    <!-- First, most important information About the game -->
    <main>
        <section class="about-section text-center">
            <div class="container"> <!-- Start container 3-->
                <div class="row">
                    <div class="col-lg-8 mx-auto">
                        <h2 class="text-white mb-4">Experience Limitless Progression</h2>
                        <blockquote class="blockquote">
                            <p class="text-center">In an all new approach to gaming get ready for infinite levelling. That's right, only you decide when to stop.</p>
                        </blockquote>
                    </div>
                </div>
                <figure>
                    <img src="assets/img/index/lazer.png" class="img-fluid" alt="An image of a lazer beam enhancing the look and feel of the website">
                </figure>
            </div> <! -- End container 3 -->
        </section>

        <section class="tri-info-section">
            <div class="container"> <!-- Start container 4-->
                <div class="tris row">
                    <?php
                    populateImageRow();
                    ?>
                </div>
            </div><!-- End container 4-->';}
            <div class="container"> <!-- Start container 5-->
                <!-- Only one image is displayed per row along with text next to the image -->
                <div class="row justify-content-center no-gutters">
                    <div class="col-lg-6" >
                        <figure>
                            <img class="img-fluid custom-img-shadow" src="assets/img/index/twitch.jpg" alt="An image enhancing the look and feel of the website">
                        </figure>
                    </div>
                    <div class="col-lg-6 order-lg-first">
                        <div class="bg-faded text-center h-100 project">
                            <div class="d-flex h-100">
                                <div class="project-text w-100 my-auto text-center text-lg-right">
                                    <h4 class="text-white">Integrated Live-Streaming</h4>
                                    <p class="mb-0 ">Let your friends experience your game with integrated support for live streaming applications</p>
                                    <hr class="d-none d-lg-block mb-0 mr-0">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Only one image is displayed per row along with text next to the image -->
                <div class="row justify-content-center no-gutters">
                    <div class="col-lg-6">
                        <figure>
                            <img class="img-fluid" src="assets/img/index/character.png" alt="An image of a character dressed in armor">
                        </figure>
                    </div>
                    <div class="col-lg-6 order-lg-first">
                        <div class="bg-faded text-center h-100 project">
                            <div class="d-flex h-100">
                                <div class="project-text w-100 my-auto text-center text-lg-right">
                                    <h4 class="text-white">Cool character outfits to unlock</h4>
                                    <p class="mb-0 ">Achievement based outfits can be unlocked. Show your friends who is in charge!</p>
                                    <hr class="d-none d-lg-block mb-0 mr-0">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div> <!--End container 5-->

        </section>
        <!-- Signup Section -->
        <section class="signup-section">
            <div class="container"> <!-- Start Container 6 -->
                <div class="row">
                    <div class="col-md-10 col-lg-8 mx-auto text-center">
                        <h2 class="text-white mb-5">Sign up now to start playing!</h2>
                        <div class="button button-anim">
                            <div class="translate"></div>
                            <!-- Clicking this button will take the user to the sign-up page -->
                            <a href="sign-up.php">Sign Up</a>
                        </div>
                    </div>
                </div>
            </div> <!-- End container 6-->
        </section>
    </main>

    <?php
    outputFooter('Chrono-Spark');
    ?>