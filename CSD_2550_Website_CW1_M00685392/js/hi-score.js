
window.onload = function() {
    populateTable();
};

function populateTable() {
    let highScoreList,table,cell1,cell2,cell3;
    highScoreList = JSON.parse(localStorage.getItem("HighScoreList") || "[]");
    table = document.getElementById("hi-scores-table");

    for (let i = 0; i < highScoreList.length; ++i) {
        // Creating an empty row and adding it to the table
        const row = table.insertRow(1);
        cell1 = row.insertCell(0);
        cell2 = row.insertCell(1);
        cell3 = row.insertCell(2);

        // Adding text to the new cells:
        cell1.innerHTML = highScoreList[i].username;
        cell2.innerHTML = highScoreList[i].MaxFloor;
        cell3.innerHTML = highScoreList[i].Date;
    }
    sortTable();
}

function sortTable(){

    let table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("hi-scores-table");
    switching = true;
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {   // Loop runs for the number of rows present -1 (because the first row does not change)
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[1];
            y = rows[i + 1].getElementsByTagName("TD")[1];
            if (Number(x.innerHTML) < Number(y.innerHTML)) {
                shouldSwitch = true;
                break;
            }
        }
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
        }
    }
}