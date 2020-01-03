/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.797975352112676, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.743421052631579, 500, 1500, "http://blazedemo.com/purchase.php-0"], "isController": false}, {"data": [0.9671052631578947, 500, 1500, "http://blazedemo.com/purchase.php-3"], "isController": false}, {"data": [0.9802631578947368, 500, 1500, "http://blazedemo.com/purchase.php-4"], "isController": false}, {"data": [0.993421052631579, 500, 1500, "http://blazedemo.com/purchase.php-1"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "http://blazedemo.com/purchase.php-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "http://blazedemo.com/purchase.php-5"], "isController": false}, {"data": [0.4866666666666667, 500, 1500, "http://blazedemo.com/confirmation.php"], "isController": false}, {"data": [0.9868421052631579, 500, 1500, "http://blazedemo.com/reserve.php-5"], "isController": false}, {"data": [0.993421052631579, 500, 1500, "http://blazedemo.com/reserve.php-4"], "isController": false}, {"data": [0.993421052631579, 500, 1500, "http://blazedemo.com/reserve.php-1"], "isController": false}, {"data": [0.0, 500, 1500, "FlightBooking_Test_UI"], "isController": true}, {"data": [0.7631578947368421, 500, 1500, "http://blazedemo.com/reserve.php-0"], "isController": false}, {"data": [0.993421052631579, 500, 1500, "http://blazedemo.com/reserve.php-3"], "isController": false}, {"data": [0.993421052631579, 500, 1500, "http://blazedemo.com/reserve.php-2"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "http://blazedemo.com/confirmation.php-1"], "isController": false}, {"data": [0.9866666666666667, 500, 1500, "http://blazedemo.com/confirmation.php-2"], "isController": false}, {"data": [0.9733333333333334, 500, 1500, "http://blazedemo.com/confirmation.php-3"], "isController": false}, {"data": [0.9733333333333334, 500, 1500, "http://blazedemo.com/confirmation.php-4"], "isController": false}, {"data": [0.74, 500, 1500, "http://blazedemo.com/confirmation.php-0"], "isController": false}, {"data": [0.47368421052631576, 500, 1500, "http://blazedemo.com/-4"], "isController": false}, {"data": [0.9802631578947368, 500, 1500, "http://blazedemo.com/-5"], "isController": false}, {"data": [0.5263157894736842, 500, 1500, "http://blazedemo.com/reserve.php"], "isController": false}, {"data": [0.3355263157894737, 500, 1500, "http://blazedemo.com/"], "isController": false}, {"data": [0.8026315789473685, 500, 1500, "http://blazedemo.com/-0"], "isController": false}, {"data": [0.9802631578947368, 500, 1500, "http://blazedemo.com/-1"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "http://blazedemo.com/-2"], "isController": false}, {"data": [0.5855263157894737, 500, 1500, "http://blazedemo.com/-3"], "isController": false}, {"data": [0.9866666666666667, 500, 1500, "http://blazedemo.com/confirmation.php-5"], "isController": false}, {"data": [0.46710526315789475, 500, 1500, "http://blazedemo.com/purchase.php"], "isController": false}, {"data": [0.47368421052631576, 500, 1500, "https://bam.nr-data.net/events/1/338cffe5d3?a=6657625&v=1158.afc605b&to=YVxSYxACCxcEVRFfWlgWcVQWCgoKSkYQRFZeWENSTBMNFA%3D%3D&rst=11099&ref=http://blazedemo.com/purchase.php"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2197, 0, 0.0, 477.0814747382791, 6, 4870, 992.4000000000001, 1213.3999999999996, 1958.2999999999997, 7.300725420281861, 163.91428060065664, 5.843149204214283], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["http://blazedemo.com/purchase.php-0", 76, 0, 0.0, 574.7763157894736, 334, 2357, 617.9999999999999, 1509.5999999999995, 2357.0, 0.25812937716098444, 3.186032419861018, 0.1378874700264243], "isController": false}, {"data": ["http://blazedemo.com/purchase.php-3", 76, 0, 0.0, 283.6973684210527, 148, 1270, 341.6, 540.4999999999989, 1270.0, 0.2582986952517223, 0.026737950875666563, 0.12839261316711587], "isController": false}, {"data": ["http://blazedemo.com/purchase.php-4", 76, 0, 0.0, 334.69736842105266, 164, 1228, 350.9, 406.24999999999835, 1228.0, 0.25826885107742287, 0.026734861537311354, 0.12812556283919027], "isController": false}, {"data": ["http://blazedemo.com/purchase.php-1", 76, 0, 0.0, 56.960526315789465, 13, 1174, 64.79999999999998, 239.84999999999883, 1174.0, 0.2585526494842555, 0.03029913861143619, 0.1328112242467953], "isController": false}, {"data": ["http://blazedemo.com/purchase.php-2", 76, 0, 0.0, 301.5131578947368, 146, 1229, 345.3, 534.8999999999993, 1229.0, 0.25842956434216074, 0.026751497871356483, 0.1279529190639409], "isController": false}, {"data": ["http://blazedemo.com/purchase.php-5", 76, 0, 0.0, 317.1973684210526, 148, 1229, 347.2, 536.1499999999992, 1229.0, 0.2582943059699971, 0.026737496516425478, 0.1286426719186509], "isController": false}, {"data": ["http://blazedemo.com/confirmation.php", 75, 0, 0.0, 910.5600000000002, 773, 3932, 937.4000000000001, 1117.4000000000003, 3932.0, 0.2729366896054791, 3.2574140977258916, 0.8531936947530652], "isController": false}, {"data": ["http://blazedemo.com/reserve.php-5", 76, 0, 0.0, 295.7894736842105, 146, 884, 356.7, 388.7499999999998, 884.0, 0.25935025935025935, 0.02684680419055419, 0.12916858619983618], "isController": false}, {"data": ["http://blazedemo.com/reserve.php-4", 76, 0, 0.0, 291.5526315789474, 149, 881, 359.6, 390.89999999999964, 881.0, 0.25933079007172544, 0.026844788816018452, 0.12865238413714503], "isController": false}, {"data": ["http://blazedemo.com/reserve.php-1", 76, 0, 0.0, 36.61842105263159, 6, 751, 46.3, 86.0, 751.0, 0.25960539979231567, 0.030422507788161992, 0.13335199247144341], "isController": false}, {"data": ["FlightBooking_Test_UI", 75, 0, 0.0, 5365.1466666666665, 4469, 8633, 7142.200000000002, 8073.0, 8633.0, 0.25397728427169475, 82.48199353966447, 3.0105237075096003], "isController": true}, {"data": ["http://blazedemo.com/reserve.php-0", 76, 0, 0.0, 493.2236842105262, 170, 2559, 578.5, 762.6499999999975, 2559.0, 0.2594582784260442, 3.36370601691429, 0.12668861251271687], "isController": false}, {"data": ["http://blazedemo.com/reserve.php-3", 76, 0, 0.0, 275.43421052631567, 150, 881, 347.2, 396.8499999999997, 881.0, 0.2593387544232613, 0.02684561325084541, 0.12890959570453125], "isController": false}, {"data": ["http://blazedemo.com/reserve.php-2", 76, 0, 0.0, 248.57894736842113, 145, 886, 343.0, 360.15, 886.0, 0.2593476042765055, 0.02684652934893514, 0.12840745641424636], "isController": false}, {"data": ["http://blazedemo.com/confirmation.php-1", 75, 0, 0.0, 50.36, 13, 1134, 46.80000000000001, 151.00000000000023, 1134.0, 0.2737396115817405, 0.03207886073223521, 0.14061233954296434], "isController": false}, {"data": ["http://blazedemo.com/confirmation.php-2", 75, 0, 0.0, 288.1066666666667, 149, 799, 347.20000000000005, 403.80000000000007, 799.0, 0.27352796367548643, 0.028314418114845277, 0.135428396077609], "isController": false}, {"data": ["http://blazedemo.com/confirmation.php-3", 75, 0, 0.0, 286.8933333333334, 146, 1958, 355.00000000000006, 423.0000000000003, 1958.0, 0.27341628175730115, 0.028302857291283123, 0.13590711661568972], "isController": false}, {"data": ["http://blazedemo.com/confirmation.php-4", 75, 0, 0.0, 329.18666666666655, 146, 1802, 367.20000000000005, 445.2000000000002, 1802.0, 0.27341229480407275, 0.028302444579327846, 0.135638130625458], "isController": false}, {"data": ["http://blazedemo.com/confirmation.php-0", 75, 0, 0.0, 543.1733333333334, 455, 1973, 567.2, 767.0000000000002, 1973.0, 0.27328178631550565, 3.1163517701372236, 0.17106799319163976], "isController": false}, {"data": ["http://blazedemo.com/-4", 76, 0, 0.0, 994.2500000000002, 609, 4002, 1083.5, 1742.8499999999997, 4002.0, 0.26044076172069097, 32.21759043891122, 0.09639360223841982], "isController": false}, {"data": ["http://blazedemo.com/-5", 76, 0, 0.0, 317.5657894736841, 149, 1002, 395.79999999999995, 490.89999999999975, 1002.0, 0.2610338313584063, 1.0132905074703762, 0.09712293920659455], "isController": false}, {"data": ["http://blazedemo.com/reserve.php", 76, 0, 0.0, 831.5526315789473, 361, 3446, 936.8, 1140.1499999999962, 3446.0, 0.2591645353793691, 3.4975789908354646, 0.7744565217391305], "isController": false}, {"data": ["http://blazedemo.com/", 76, 0, 0.0, 1520.1315789473679, 1140, 4870, 1642.8999999999999, 2289.199999999998, 4870.0, 0.2600246339126865, 74.44041779286985, 0.5764217958806624], "isController": false}, {"data": ["http://blazedemo.com/-0", 76, 0, 0.0, 514.5263157894738, 447, 982, 576.2999999999998, 650.0499999999994, 982.0, 0.26091912193849176, 2.711354144494263, 0.0904553596564107], "isController": false}, {"data": ["http://blazedemo.com/-1", 76, 0, 0.0, 147.74999999999997, 45, 3667, 182.09999999999997, 231.44999999999828, 3667.0, 0.26121057352905797, 21.324119037267188, 0.10127011493265237], "isController": false}, {"data": ["http://blazedemo.com/-2", 76, 0, 0.0, 481.03947368421063, 300, 2451, 566.0, 656.5999999999998, 2451.0, 0.2610427972796593, 7.362477566634609, 0.09636150133956173], "isController": false}, {"data": ["http://blazedemo.com/-3", 76, 0, 0.0, 671.8684210526317, 293, 3407, 743.3, 871.9499999999992, 3407.0, 0.26071415094663253, 10.028329079576134, 0.0967493919528519], "isController": false}, {"data": ["http://blazedemo.com/confirmation.php-5", 75, 0, 0.0, 330.2933333333334, 154, 1802, 355.6, 383.0000000000001, 1802.0, 0.27344818156959255, 0.028306159420289856, 0.1361900123051682], "isController": false}, {"data": ["http://blazedemo.com/purchase.php", 76, 0, 0.0, 936.7368421052631, 659, 3632, 1035.1, 2088.199999999999, 3632.0, 0.2578281371917088, 3.319285481053025, 0.7822968967330461], "isController": false}, {"data": ["https://bam.nr-data.net/events/1/338cffe5d3?a=6657625&v=1158.afc605b&to=YVxSYxACCxcEVRFfWlgWcVQWCgoKSkYQRFZeWENSTBMNFA%3D%3D&rst=11099&ref=http://blazedemo.com/purchase.php", 76, 0, 0.0, 1163.4210526315787, 1001, 4488, 1192.5, 1594.4999999999993, 4488.0, 0.2576157660848844, 0.04503244348554132, 0.12578894828363496], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2197, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
