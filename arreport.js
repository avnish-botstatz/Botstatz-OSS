
var app = angular.module("arreportgrid", ["ngRoute", "ui.grid", "ui.grid.grouping", "ui.grid.exporter", "ui.grid.autoResize", "ui.bootstrap"]);
app.controller("arReportctrl", function ($scope, uiGridConstants, $http, $q, $window) {

    $scope.gridOptionsARReport = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'ARReportData',
        columnDefs: [
            {
                field: 'txt_ARCode',
                displayName: 'AR ID',
                width: 150
            },
            {
                field: 'txt_UnitName',
                displayName: 'Business Unit',
                width: 150
            },
            {
                field: 'txt_ProcessName',
                displayName: 'Process Name',
                //cellTemplate: '<div class="task-name project-width border-left-dark">{{ row.entity.ProcessName }}<br/><small class="board-no">{{ row.entity.code }}</small></div>'
                width: 150
            },
            {
                field: 'Requester',
                displayName: 'Created By',
                width: 150
            },
            {
                field: 'txt_RequesterName',
                displayName: 'Requester',
                width: 150
            },
            {
                field: 'dt_SubmittedDate',
                displayName: 'Created Date',
                width: 150,
                cellClass: 'text-center fontcentre',
                cellFilter: 'date:\'dd-MMM-yyyy | hh:mm\'', width: 200,
                sortingAlgorithm: function (aDate, bDate) {
                    var a = new Date(aDate);
                    var b = new Date(bDate);
                    if (a < b) {
                        return -1;
                    }
                    else if (a > b) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                }
            },
            {
                field: 'Department',
                displayName: 'Sub Team',
                width: 150

            },
            {
                field: 'BusinessOwner',
                displayName: 'Business Owner',
                width: 150
            },
            {
                field: 'AutomationSpoke',
                displayName: 'Automation SPOC',
                width: 150
            },
            {
                field: 'StartDate',
                displayName: 'Start Date',
                width: 150,
                cellClass: 'text-center fontcentre',
                cellFilter: 'date:\'dd-MMM-yyyy | hh:mm\'', width: 200,
                sortingAlgorithm: function (aDate, bDate) {
                    var a = new Date(aDate);
                    var b = new Date(bDate);
                    if (a < b) {
                        return -1;
                    }
                    else if (a > b) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                }
            },
            {
                field: 'ProjectGoLiveDate',
                displayName: 'Go Live Date',
                width: 150,
                cellClass: 'text-center fontcentre',
                cellFilter: 'date:\'dd-MMM-yyyy | hh:mm\'', width: 200,
                sortingAlgorithm: function (aDate, bDate) {
                    var a = new Date(aDate);
                    var b = new Date(bDate);
                    if (a < b) {
                        return -1;
                    }
                    else if (a > b) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                }
            },
            {
                field: 'datedifference',
                displayName: 'Aging',
                width: 150
            },
            {
                field: 'Approver',
                displayName: 'Current User',
                width: 150
            },
            {
                field: 'Currentstatus',
                displayName: 'Status',
                width: 150
            },
            {
                field: 'txt_ToolName',
                displayName: 'Tool',
                width: 150
            },
            {
                field: 'txt_initiativeName',
                displayName: 'Initiative',
                width: 150
            },
            {
                field: 'TotalScore',
                displayName: 'EOI Score',
                width: 150
            },
            {
                field: 'Total_ImpactScore',
                displayName: 'Impact Score',
                width: 150
            },
            {
                field: 'BusinessPriorities',
                displayName: 'Business Priority',
                width: 150
            },
            {
                field: 'AFTECostSaved',
                displayName: 'Potential ROI',
                width: 150
            },
            {
                field: 'AFTE',
                displayName: 'Benefits(FTE)',
                width: 150
            },
            {
                field: 'txt_ProcessDescription',
                displayName: 'Description',
                width: 150
            },
            {
                field: 'Comment',
                displayName: 'Comments',
                width: 150
            },
        ],
        enableSelectAll: true,
        exporterMenuAllData: false,        exporterCsvFilename: 'ARReport.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "AR Report", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'ARReport.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.handleWindowResize();
        },
    };

    $scope.gridOptionsARReport.excessRows = 5000;
    $scope.ARReportData = {
        "data": []
    };

    $scope.expandAll = function () {
        $scope.gridApi.treeBase.expandAllRows();

    };

    $scope.toggleRow = function (rowNum) {
        $scope.gridApi.treeBase.toggleRowTreeState($scope.gridApi.grid.renderContainers.body.visibleRowCache[rowNum]);
    };

    $scope.changeGrouping = function () {
        $scope.gridApi.grouping.clearGrouping();
    };

    $scope.GetARReport = function () {
        $http({
            method: "POST",
            url: "./ARReport.aspx/GetARReport",
            data: "",
            dataType: 'json',
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.ARReportData = d;
                $scope.GetChart();
            }
            else {
                $scope.Message = "Record does not exists";
            }
        })
            .catch(function onError(error) {
            });

    }

    $scope.GetARReport();

    $scope.GetChart = function () {
        $http.post('ARReport.aspx/Get_Chart_Data',
            {
                data:
                    {}
            }).then(function (response) {
                var resultdata = JSON.parse(response.data.d);
                console.log("test", resultdata);

                var ARCount = resultdata.split("^")[0].split(',');
                var ARBuname = resultdata.split("^")[1].split(',');
                var colour = resultdata.split("^")[2].split(',');
                var AverageROIUSD = resultdata.split("^")[3].split(',');
                var ROIbuname = resultdata.split("^")[4].split(',');
                var Topfiveroi = resultdata.split("^")[5].split(',');
                var ProcessName = resultdata.split("^")[6].split(',');
                var MonthName = resultdata.split("^")[7].split(',');
                var OpenARData = resultdata.split("^")[8].split(',');
                var ClosedARData = resultdata.split("^")[9].split(',');
                var ROIType = resultdata.split("^")[10].split(',');
                var AR5Days = resultdata.split("^")[11].split(',');
                var AR10Days = resultdata.split("^")[12].split(',');
                var AR15Days = resultdata.split("^")[13].split(',');
                var AR30Days = resultdata.split("^")[14].split(',');
                var AR60Days = resultdata.split("^")[15].split(',');


                if (AR5Days != "") {
                    $("#div_AR5Days").text(AR5Days);
                }
                else {
                    $("#div_AR5Days").text("0");
                }
                if (AR10Days != "") {
                    $("#div_AR10Days").text(AR10Days);
                }
                else {
                    $("#div_AR10Days").text("0");
                }
                if (AR15Days != "") {
                    $("#div_AR15Days").text(AR15Days);
                }
                else {
                    $("#div_AR15Days").text("0");
                }
                if (AR30Days != "") {
                    $("#div_AR30Days").text(AR30Days);
                }
                else {
                    $("#div_AR30Days").text("0");
                }
                if (AR60Days != "") {
                    $("#div_AR60Days").text(AR60Days);
                }
                else {
                    $("#div_AR60Days").text("0");
                }


                if (ARBuname == "") {
                    $("#sp_automationchart").text('No Data').show();
                    $("#automationchart").hide();
                    $("#sp_automationchart").css('height', '355px');

                }
                else {
                    $("#sp_automationchart").text("").hide();
                    $("#automationchart").show();
                    $("#sp_automationchart").css('height', '0px');

                    $("#automationchart").empty().append('<canvas id="myarchartcanvas"></canvas>');
                    var automationchart = {
                        type: 'pie',
                        data: {
                            datasets: [{
                                data: ARCount,
                                backgroundColor: colour,
                                label: 'Dataset 1'
                            }],
                            labels: ARBuname
                        },
                        options: {
                            responsive: true,
                            legend: {
                                position: 'top',
                                labels: {
                                    fontSize: 15
                                }

                            },
                        }
                    };
                    var myarchart = document.getElementById("myarchartcanvas").getContext('2d');
                    new Chart(myarchart, automationchart);
                }

                if (ROIbuname == "") {
                    $("#sp_roichart").text('No Data').show();
                    $("#roichart").hide();
                    $("#sp_roichart").css('height', '355px');

                }
                else {
                    $("#sp_roichart").text("").hide();
                    $("#roichart").show();
                    $("#sp_roichart").css('height', '0px');

                    $("#roichart").empty().append('<canvas id="myroichartcanvas"></canvas>');
                    var roichart = {
                        type: 'pie',
                        data: {
                            datasets: [{
                                data: AverageROIUSD,
                                backgroundColor: colour,
                                label: 'Dataset 1'
                            }],
                            labels: ROIbuname
                        },
                        options: {
                            responsive: true,
                            legend: {
                                position: 'top',
                                labels: {
                                    fontSize: 15
                                }

                            },
                        }
                    };
                    var myroichart = document.getElementById("myroichartcanvas").getContext('2d');
                    new Chart(myroichart, roichart);
                }

                if (ProcessName == "") {
                    $("#sp_topfive").text('No Data').show();
                    $("#topfiveroichart").hide();
                    $("#sp_topfive").css('height', '355px');
                }
                else {
                    $("#sp_topfive").text("").hide();
                    $("#topfiveroichart").show();
                    $("#sp_topfive").css('height', '0px');

                    document.getElementById("topfiveroichart").innerHTML = '&nbsp;';
                    document.getElementById("topfiveroichart").innerHTML = '<canvas id="myProfitablechartCanvas"></canvas>';

                    var horizontalBarChartData = {
                        labels: ProcessName,
                        datasets: [{
                            label: 'ROI',
                            backgroundColor: colour,
                            borderColor: window.chartColors.red,
                            borderWidth: 1,
                            data: Topfiveroi
                        }]

                    };

                    var OpenprofitableChart = {
                        type: 'horizontalBar',
                        data: horizontalBarChartData,
                        options: {
                            elements: {
                                rectangle: {
                                    borderWidth: 2,
                                }
                            },
                            responsive: true,
                            legend: {
                                position: 'top',
                                display: false,
                                labels: {
                                    fontSize: 15
                                }
                            },
                            title: {
                                display: true,
                                text: ''
                            },
                            scales: {
                                xAxes: [{
                                    display: true,
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'ROI' + " (" + ROIType + ")",
                                        fontSize: 13
                                    },
                                    ticks: {
                                        beginAtZero: true,
                                        fontSize: 13
                                    }
                                }],
                                yAxes: [{
                                    display: true,
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'Process Name',
                                        fontSize: 13

                                    },
                                    ticks: {
                                        beginAtZero: true,
                                        userCallback: function (label, index, labels) {
                                            if (Math.floor(label) === label) {
                                                return label;
                                            }
                                        },
                                        fontSize: 13
                                    }

                                }]
                            }
                        }
                    };


                }

                if (MonthName == "") {
                    $("#sp_artrend").text('No Data').show();
                    $("#arstatustrendchart").hide();
                    $("#sp_artrend").css('height', '355px');
                }
                else {
                    $("#sp_artrend").text("").hide();
                    $("#arstatustrendchart").show();
                    $("#sp_artrend").css('height', '0px');

                    document.getElementById("arstatustrendchart").innerHTML = '&nbsp;';
                    document.getElementById("arstatustrendchart").innerHTML = '<canvas id="myartrendchartCanvas"></canvas>';

                    var arstatustrendchart = {
                        type: 'line',
                        bezierCurve: false,
                        data: {
                            labels: MonthName,
                            datasets: [{
                                label: 'Open',
                                tension: 0,
                                lineTension: 0,
                                backgroundColor: colour[1],
                                borderColor: colour[1],
                                fill: false,
                                data: OpenARData
                            }, {
                                label: 'Converted to Project',
                                tension: 0,
                                lineTension: 0,
                                backgroundColor: colour[7],
                                borderColor: colour[7],
                                fill: false,
                                data: ClosedARData
                            }]
                        },
                        options: {
                            responsive: true,
                            legend: {
                                position: 'top',
                                labels: {
                                    fontSize: 15
                                }

                            },
                            title: {
                                display: true,
                                text: ''
                            },
                            tooltips: {
                                mode: 'index',
                                intersect: false,
                            },
                            hover: {
                                mode: 'nearest',
                                intersect: true
                            },
                            scales: {
                                xAxes: [{
                                    display: true,
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'Month',
                                        fontSize: 13
                                    }
                                }],
                                yAxes: [{
                                    display: true,
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'No of Process',
                                        fontSize: 13
                                    },
                                    ticks: {
                                        beginAtZero: true,
                                        userCallback: function (label, index, labels) {
                                            if (Math.floor(label) === label) {
                                                return label;
                                            }
                                        },
                                        fontSize: 13
                                    }
                                }]
                            }
                        }
                    };
                    window.myLine = new Chart(document.getElementById('myartrendchartCanvas').getContext('2d'), arstatustrendchart);
                }

                var mychart = document.getElementById("myProfitablechartCanvas").getContext('2d');
                new Chart(mychart, OpenprofitableChart);
            });
    }


}).config(function ($httpProvider) {
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.post["Content-Type"] = "application/json; charset=utf-8";
});
