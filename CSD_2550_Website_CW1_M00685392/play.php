    <?php

    include ('common.php');

    outputHead("This is the page where you can play the game Chrono-Spark","Play Chrono-Spark");

    outputNavbar('Play');

    ?>
    <!-- The header informs the user of what page they are on-->
    <header class="header">
        <h1>Chrono-Spark</h1>
    </header>

    <div class ="landing-2">
        <main>
            <div class="games-container">
                <div id="game-container">
                </div>
            </div>
        </main>
    </div>

    <?php
    outputFooter('Play');
    ?>
