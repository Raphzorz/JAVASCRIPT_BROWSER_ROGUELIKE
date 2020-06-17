    <?php

    include ('common.php');

    outputHead("This is the play guide for the game Chrono-Spark","Chrono-Spark Play-Guide");

    outputNavbar('Play-Guide');

    ?>

    <!-- The header informs the user of what page they are on-->
    <header class="header">
        <h1>Playguide</h1>
        <h2>Mouse over the images to learn more</h2>
    </header>
    <main>
    <div class = "container-play">
        <article class="grid">
            <?php
            populateGrid();
            ?>
        </article>
    </div>
    </main>

    <?php
    outputFooter('Play-Guide');
    ?>
