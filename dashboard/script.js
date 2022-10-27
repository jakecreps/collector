$(function () {
    load_results();
    $("#export").click(function () {
        tableToCSV();
    });
    $("#Search").keyup(function(){
        myFunction();
    })
    $('th.sortable').click(function () {
        let table = $(this).parents('table').eq(0)
        let rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
        this.asc = !this.asc
        if (!this.asc) {
            rows = rows.reverse()
        }
        for (let i = 0; i < rows.length; i++) {
            table.append(rows[i])
        }
    })

    $("#clear_data").click(function () {
        chrome.storage.local.set({
            items: []
        }, function() {
            load_results();
        });
        return false;
    });
});
function tableToCSV() {
            // Variable to store the final csv data
            var csv_data = [];
 
            // Get each row data
            var rows = document.getElementsByTagName('tr');
            for (var i = 0; i < rows.length; i++) {
 
                // Get each column data
                var cols = rows[i].querySelectorAll('td,th');
 
                // Stores each csv row data
                var csvrow = [];
                for (var j = 0; j < cols.length; j++) {
 
                    // Get the text data of each cell
                    // of a row and push it to csvrow
                    csvrow.push(cols[j].innerHTML);
                }
 
                // Combine each column value with comma
                csv_data.push(csvrow.join(","));
            }
 
            // Combine each row data with new line character
            csv_data = csv_data.join('\n');
 
            // Call this function to download csv file 
            downloadCSVFile(csv_data);
 
        }
 
        function downloadCSVFile(csv_data) {
 
            // Create CSV file object and feed
            // our csv_data into it
            CSVFile = new Blob([csv_data], {
                type: "text/csv"
            });
 
            // Create to temporary link to initiate
            // download process
            var temp_link = document.createElement('a');
 
            // Download csv file
            temp_link.download = "sync_data.csv";
            var url = window.URL.createObjectURL(CSVFile);
            temp_link.href = url;
 
            // This link should not be displayed
            temp_link.style.display = "none";
            document.body.appendChild(temp_link);
 
            // Automatically click the link to
            // trigger download
            temp_link.click();
            document.body.removeChild(temp_link);
        }

function load_results() {
    // console.log('data is loading')
    $('#table_body').html('');
    chrome.storage.local.get(['items'], function (data) {
        let items = [];
        if (data['items'] && (data['items'] != 'undefined'))
            items = data['items'];
        $("#count").html('('+items.length+')');
        if (items.length) {
            for (let i = 0; i < items.length; i++) {
                let tr_element = '<tr>';
                var Count = i+1;
                    // tr_element += '<td>' + Count+ '</td>';
                for (let j = 0; j < items[i].length; j++) {
                    tr_element += '<td>' + items[i][j] + '</td>';
                }
                tr_element += '</tr>';

                $("#items > tbody").append(tr_element);
            }
        }
    });
}

function myFunction() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("Search");
  filter = input.value.toUpperCase();
  table = document.getElementById("items");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
            td2 = tr[i].getElementsByTagName("td")[2];
    if (td2) {
      txtValue = td2.textContent || td2.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    } 
      }
    }       
  }
}