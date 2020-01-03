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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.780831571529246, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.721830985915493, 500, 1500, "http://blazedemo.com/purchase.php-0"], "isController": false}, {"data": [0.9859154929577465, 500, 1500, "http://blazedemo.com/purchase.php-3"], "isController": false}, {"data": [0.9859154929577465, 500, 1500, "http://blazedemo.com/purchase.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "http://blazedemo.com/purchase.php-1"], "isController": false}, {"data": [0.9929577464788732, 500, 1500, "http://blazedemo.com/purchase.php-2"], "isController": false}, {"data": [0.9894366197183099, 500, 1500, "http://blazedemo.com/purchase.php-5"], "isController": false}, {"data": [0.4857142857142857, 500, 1500, "http://blazedemo.com/confirmation.php"], "isController": false}, {"data": [0.986013986013986, 500, 1500, "http://blazedemo.com/reserve.php-5"], "isController": false}, {"data": [0.9825174825174825, 500, 1500, "http://blazedemo.com/reserve.php-4"], "isController": false}, {"data": [0.9965034965034965, 500, 1500, "http://blazedemo.com/reserve.php-1"], "isController": false}, {"data": [0.0, 500, 1500, "FlightBooking_Test_UI"], "isController": true}, {"data": [0.7027972027972028, 500, 1500, "http://blazedemo.com/reserve.php-0"], "isController": false}, {"data": [0.9965034965034965, 500, 1500, "http://blazedemo.com/reserve.php-3"], "isController": false}, {"data": [0.986013986013986, 500, 1500, "http://blazedemo.com/reserve.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "http://blazedemo.com/confirmation.php-1"], "isController": false}, {"data": [0.9964285714285714, 500, 1500, "http://blazedemo.com/confirmation.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "http://blazedemo.com/confirmation.php-3"], "isController": false}, {"data": [0.9857142857142858, 500, 1500, "http://blazedemo.com/confirmation.php-4"], "isController": false}, {"data": [0.6821428571428572, 500, 1500, "http://blazedemo.com/confirmation.php-0"], "isController": false}, {"data": [0.4195804195804196, 500, 1500, "http://blazedemo.com/-4"], "isController": false}, {"data": [0.9055944055944056, 500, 1500, "http://blazedemo.com/-5"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "http://blazedemo.com/reserve.php"], "isController": false}, {"data": [0.26573426573426573, 500, 1500, "http://blazedemo.com/"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "http://blazedemo.com/-0"], "isController": false}, {"data": [0.8951048951048951, 500, 1500, "http://blazedemo.com/-1"], "isController": false}, {"data": [0.6538461538461539, 500, 1500, "http://blazedemo.com/-2"], "isController": false}, {"data": [0.5944055944055944, 500, 1500, "http://blazedemo.com/-3"], "isController": false}, {"data": [0.9928571428571429, 500, 1500, "http://blazedemo.com/confirmation.php-5"], "isController": false}, {"data": [0.5, 500, 1500, "http://blazedemo.com/purchase.php"], "isController": false}, {"data": [0.48226950354609927, 500, 1500, "https://bam.nr-data.net/events/1/338cffe5d3?a=6657625&v=1158.afc605b&to=YVxSYxACCxcEVRFfWlgWcVQWCgoKSkYQRFZeWENSTBMNFA%3D%3D&rst=11099&ref=http://blazedemo.com/purchase.php"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 4117, 0, 0.0, 517.7340296332279, 8, 21896, 1065.4000000000005, 1336.7999999999993, 2567.5600000000013, 13.679058779749544, 308.19842471845294, 10.946172451000262], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["http://blazedemo.com/purchase.php-0", 142, 0, 0.0, 519.5492957746483, 338, 947, 622.4000000000001, 739.05, 910.8799999999994, 0.4865246380188169, 6.005086800321038, 0.2598915790979422], "isController": false}, {"data": ["http://blazedemo.com/purchase.php-3", 142, 0, 0.0, 286.82394366197207, 148, 752, 368.5000000000001, 442.7499999999998, 724.9099999999996, 0.4868415639270972, 0.050395708765890924, 0.24199448831923093], "isController": false}, {"data": ["http://blazedemo.com/purchase.php-4", 142, 0, 0.0, 322.7253521126759, 153, 753, 383.0, 444.09999999999997, 725.9099999999996, 0.4868716098992656, 0.05039881899347866, 0.24153396272346378], "isController": false}, {"data": ["http://blazedemo.com/purchase.php-1", 142, 0, 0.0, 40.11267605633805, 14, 310, 80.2000000000001, 119.19999999999993, 296.2399999999998, 0.4873595409210409, 0.05711244620168448, 0.2503428891840503], "isController": false}, {"data": ["http://blazedemo.com/purchase.php-2", 142, 0, 0.0, 298.87323943661954, 147, 672, 390.2000000000001, 447.6999999999999, 626.8499999999992, 0.4871187952385853, 0.05042440653836918, 0.24118088787691674], "isController": false}, {"data": ["http://blazedemo.com/purchase.php-5", 142, 0, 0.0, 324.08450704225345, 148, 749, 410.5000000000001, 455.85, 670.3099999999988, 0.48684323305048427, 0.050395881546241535, 0.2424707508356904], "isController": false}, {"data": ["http://blazedemo.com/confirmation.php", 140, 0, 0.0, 1055.5785714285712, 774, 21896, 1052.1000000000001, 1178.7999999999997, 13603.34000000007, 0.5151983513652757, 6.148588293267461, 1.6104979714064915], "isController": false}, {"data": ["http://blazedemo.com/reserve.php-5", 143, 0, 0.0, 309.5734265734264, 149, 849, 393.6, 460.19999999999993, 774.2000000000004, 0.48365058105713166, 0.050065392179742145, 0.2408806604874386], "isController": false}, {"data": ["http://blazedemo.com/reserve.php-4", 143, 0, 0.0, 300.87412587412575, 150, 867, 404.4, 472.5999999999999, 859.08, 0.4836538526580669, 0.0500657308415577, 0.23993765346708787], "isController": false}, {"data": ["http://blazedemo.com/reserve.php-1", 143, 0, 0.0, 37.95104895104895, 8, 585, 57.599999999999994, 117.59999999999988, 444.2000000000007, 0.4840172756935325, 0.05672077449533583, 0.24862606153788872], "isController": false}, {"data": ["FlightBooking_Test_UI", 140, 0, 0.0, 5670.728571428573, 4395, 26080, 7459.600000000001, 7841.049999999999, 18800.86000000006, 0.47731720455769744, 155.0137497719958, 5.657886942305988], "isController": true}, {"data": ["http://blazedemo.com/reserve.php-0", 143, 0, 0.0, 474.9300699300701, 167, 1720, 592.2, 797.9999999999995, 1439.2800000000016, 0.48149607227155033, 6.242353645607106, 0.23510550403884295], "isController": false}, {"data": ["http://blazedemo.com/reserve.php-3", 143, 0, 0.0, 267.11188811188833, 145, 561, 361.0, 396.4, 518.3200000000002, 0.48361623191934766, 0.05006183650727622, 0.2403912715302226], "isController": false}, {"data": ["http://blazedemo.com/reserve.php-2", 143, 0, 0.0, 285.7062937062937, 147, 848, 387.4, 444.4, 778.9200000000003, 0.48388788689882006, 0.050089957042260665, 0.23958120962666185], "isController": false}, {"data": ["http://blazedemo.com/confirmation.php-1", 140, 0, 0.0, 30.35, 15, 141, 46.80000000000001, 65.94999999999999, 140.59, 0.5168569192374145, 0.060569170223134516, 0.2654948628114063], "isController": false}, {"data": ["http://blazedemo.com/confirmation.php-2", 140, 0, 0.0, 290.82142857142867, 147, 897, 356.0, 397.6999999999997, 714.1400000000015, 0.5162108647638151, 0.0534358902978168, 0.255584871518803], "isController": false}, {"data": ["http://blazedemo.com/confirmation.php-3", 140, 0, 0.0, 263.85, 145, 479, 350.5, 395.34999999999985, 477.36, 0.5162603574734218, 0.053441013566584684, 0.2566176972206755], "isController": false}, {"data": ["http://blazedemo.com/confirmation.php-4", 140, 0, 0.0, 460.46428571428567, 150, 21352, 375.5, 410.74999999999994, 12814.16000000007, 0.516220381855591, 0.053436875465520166, 0.2560937050611721], "isController": false}, {"data": ["http://blazedemo.com/confirmation.php-0", 140, 0, 0.0, 548.1928571428573, 451, 1233, 639.3000000000001, 773.3499999999997, 1204.3000000000002, 0.5158912943344081, 5.882790908567481, 0.32293585905112854], "isController": false}, {"data": ["http://blazedemo.com/-4", 143, 0, 0.0, 1189.3846153846157, 586, 3452, 2323.7999999999997, 2981.6, 3426.04, 0.4852227613586237, 60.024045751543895, 0.17958928374503752], "isController": false}, {"data": ["http://blazedemo.com/-5", 143, 0, 0.0, 422.34265734265733, 150, 1586, 738.9999999999998, 1373.3999999999987, 1585.12, 0.48624901390060116, 1.8875388967332907, 0.1809188225548135], "isController": false}, {"data": ["http://blazedemo.com/reserve.php", 143, 0, 0.0, 828.9650349650351, 329, 2135, 1081.0, 1226.3999999999999, 1948.000000000001, 0.48081772637100295, 6.488993650390033, 1.4368185963820987], "isController": false}, {"data": ["http://blazedemo.com/", 143, 0, 0.0, 1766.6153846153848, 1068, 4187, 3025.999999999999, 3971.9999999999995, 4185.68, 0.48442883130697545, 138.682974068025, 1.0738803194012054], "isController": false}, {"data": ["http://blazedemo.com/-0", 143, 0, 0.0, 563.244755244755, 448, 1652, 638.4, 924.3999999999977, 1648.48, 0.485944976076555, 5.049354981318304, 0.16846725244841507], "isController": false}, {"data": ["http://blazedemo.com/-1", 143, 0, 0.0, 334.7762237762238, 47, 2703, 841.5999999999998, 2420.5999999999995, 2679.2400000000002, 0.48665609409138244, 39.72853143121984, 0.18867428647878792], "isController": false}, {"data": ["http://blazedemo.com/-2", 143, 0, 0.0, 647.5244755244753, 309, 2184, 1239.3999999999996, 1583.9999999999998, 2161.56, 0.48586077200898337, 13.703266558976024, 0.1793509490423786], "isController": false}, {"data": ["http://blazedemo.com/-3", 143, 0, 0.0, 804.0349650349649, 313, 2766, 1646.9999999999989, 2551.7999999999984, 2716.28, 0.4861779275220905, 18.700758016836037, 0.18041759029140078], "isController": false}, {"data": ["http://blazedemo.com/confirmation.php-5", 140, 0, 0.0, 314.39285714285717, 148, 676, 369.70000000000005, 416.34999999999985, 605.8900000000006, 0.5162089613875697, 0.05343569326863514, 0.2570962600660747], "isController": false}, {"data": ["http://blazedemo.com/purchase.php", 142, 0, 0.0, 880.7605633802815, 660, 1320, 1034.9, 1170.35, 1303.6599999999999, 0.48596019917523653, 6.2562863881949315, 1.474490565270957], "isController": false}, {"data": ["https://bam.nr-data.net/events/1/338cffe5d3?a=6657625&v=1158.afc605b&to=YVxSYxACCxcEVRFfWlgWcVQWCgoKSkYQRFZeWENSTBMNFA%3D%3D&rst=11099&ref=http://blazedemo.com/purchase.php", 141, 0, 0.0, 1132.7659574468094, 1009, 1747, 1233.0, 1428.4000000000003, 1718.020000000001, 0.48480264062714895, 0.08474577409400358, 0.2367200393687251], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 4117, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
