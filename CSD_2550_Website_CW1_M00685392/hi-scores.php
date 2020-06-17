 <?php

    include ('common.php');

    outputHead("This page displays the top scores for all players","Hi-Scores");

    outputNavbar('Hi-Scores');

    ?>
    <!-- The header informs the user of what page they are on-->
    <header class="header">
        <h1>Leader board</h1>
    </header>
    <div class ="landing-2">
        <div class="container align-items-center">
            <div class="mx-auto text-center">
                <div class="container-fluid">
                    <table id="hi-scores-table" class="table table-hover table-dark table-striped table-responsive-sm"> <!-- The responsive class adds a horizontal scrollbar to the table on smaller screen widths-->
                        <thead class="text-white">
                        <tr>
                            <th>User Name</th>
                            <th>Floor Reached</th>
                            <th>Date</th>
                        </tr>
                        </thead>
                        <tbody class="text-white-50">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <?php
    outputFooter('Hi-Scores');
    ?>
