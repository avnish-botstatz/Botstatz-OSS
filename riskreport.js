
var app = angular.module("RiskReportgrid", ["ngRoute", "ui.grid", "ui.grid.grouping", "ui.grid.exporter", "ui.grid.autoResize", "ui.bootstrap"]);
app.controller("RiskReportctrl", function ($scope, $http, $q, $window) {

    $scope.gridOptionsRiskReport = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'RiskReportData',
        columnDefs: [
            {
                field: 'txt_ProjectName',
                displayName: 'Process',
                cellTemplate: '<div class="task-name project-width border-left-dark"><div id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><div class= "text-overflow" title="{{row.entity.txt_ProjectName}}" > {{ row.entity.txt_ProjectName }}</div><small class="board-no">{{ row.entity.txt_ProjectCode }}</small></div>',
                width: 300
            },
            {
                field: 'txt_Title',
                displayName: 'Title',
            },
            {
                field: 'dtSubmittedDate', displayName: 'Created Date', cellClass: 'text-center fontcentre',
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
                cellTemplate: '<div ng-if="!(row.groupHeader && col.grouping.groupPriority === row.treeLevel)" ng-class="(row.entity.datedifference <= 5 ) ? \'task-field project-width text-center blocker\' : \'task-field project-width text-center over-due\'"> {{row.entity.datedifference}}<div>' +
                    '<div class="task-name project-width ui-grid-cell-contents"><div ng-if="(row.groupHeader && col.grouping.groupPriority === row.treeLevel)"> {{ grid.appScope.getValue(\'datedifference\', row.treeNode.children )}} </div></div>'
            },
            {
                field: 'CreatedBy',
                displayName: 'Created By',
            },
            {
                field: 'AssingTo',
                displayName: 'Assign To',
            },
            {
                field: 'Status',
                displayName: 'Status',
            },
        ],
        enableSelectAll: true,
        exporterMenuAllData: false,        exporterCsvFilename: 'RiskReport.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "Risk Report", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'RiskReport.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };

    $scope.gridOptionsRiskReport.excessRows = 5000;
    $scope.RiskReportData = {
        "data": []
    };

    $scope.expandAll = function () {
        $scope.gridApi.treeBase.expandAllRows();

    };

    $scope.toggleRow = function (rowNum) {
        $scope.gridApi.treeBase.toggleRowTreeState($scope.gridApi.grid.renderContainers.body.visibleRowCache[rowNum]);
    };


    $scope.getValue = function (field, treeRowEntity) {
        return treeRowEntity[0].row.entity[field] + ' (' + treeRowEntity.length + ')';
    };


    $scope.changeGrouping = function () {
        $scope.gridApi.grouping.clearGrouping();
    };

    $scope.GetRiskReport = function () {
        $http({
            method: "POST",
            url: "./RiskReport.aspx/GetRiskReport",
            data: "",
            dataType: 'json',
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.RiskReportData = d;
            }
            else {
                $scope.Message = "Record does not exists";
            }
        })
            .catch(function onError(error) {
            });

    }

    $scope.GetRiskReport();

    $scope.GetChart = function () {
        $http.post('RiskReport.aspx/Get_Chart_Data',
            {
                data:
                    {}
            }).then(function (response) {
                var resultdata = JSON.parse(response.data.d);
                var ProjectName = resultdata.split("^")[0].split(',');
                var Risk = resultdata.split("^")[1].split(',');
                var WorkingRisk = resultdata.split("^")[2].split(',');
                var PendingRisk = resultdata.split("^")[3].split(',');
                var colour = resultdata.split("^")[4].split(',');
                var Risk5Days = resultdata.split("^")[5].split(',');
                var Risk10Days = resultdata.split("^")[6].split(',');
                var Risk15Days = resultdata.split("^")[7].split(',');
                var Risk30Days = resultdata.split("^")[8].split(',');
                var Risk60Days = resultdata.split("^")[9].split(',');
                var keys = '<%=key%>';
                var buid = '<%=buid %>';
                if (Risk5Days != "") {
                    $("#div_Risk5Days").html("<a id='href_risk5'>" + Risk5Days + " </a>");
                    if (Risk5Days == 0) { $("#href_risk5").attr('style', 'cursor: default;'); $("#href_risk5").attr('href', 'JavaScript:void(0);'); }
                    if (keys == "5") {
                        $("#div_Risk5Days").css('background', '#F0DF87')
                    }
                }
                else {
                    $("#div_Risk5Days").text("0");
                }
                if (Risk10Days != "") {
                    $("#div_Risk10Days").html("<a id='href_risk10'>" + Risk10Days + " </a>");
                    if (Risk10Days == 0) { $("#href_risk10").attr('style', 'cursor: default;'); $("#href_risk10").attr('href', 'JavaScript:void(0);'); }
                    if (keys == "10") {
                        $("#div_Risk10Days").css('background', '#F0DF87')
                    }
                }
                else {
                    $("#div_Risk10Days").text("0");
                }
                if (Risk15Days != "") {
                    $("#div_Risk15Days").html("<a id='href_risk15'>" + Risk15Days + " </a>");
                    if (Risk10Days == 0) { $("#href_risk15").attr('style', 'cursor: default;'); $("#href_risk15").attr('href', 'JavaScript:void(0);'); }
                    if (keys == "15") {
                        $("#div_Risk15Days").css('background', '#F0DF87')
                    }
                }
                else {
                    $("#div_Risk15Days").text("0");
                }
                if (Risk30Days != "") {
                    $("#div_Risk30Days").html("<a id='href_risk30'>" + Risk30Days + " </a>");
                    if (Risk30Days == 0) { $("#href_risk30").attr('style', 'cursor: default;'); $("#href_risk30").attr('href', 'JavaScript:void(0);'); }
                    if (keys == "30") {
                        $("#div_Risk30Days").css('background', '#F0DF87')
                    }
                }
                else {
                    $("#div_Risk30Days").text("0");
                }
                if (Risk60Days != "") {
                    $("#div_Risk60Days").html("<a id='href_risk60'>" + Risk60Days + " </a>");
                    if (Risk60Days == 0) { $("#href_risk60").attr('style', 'cursor: default;'); $("#href_risk60").attr('href', 'JavaScript:void(0);'); }
                    if (keys == "60") {
                        $("#div_Risk60Days").css('background', '#F0DF87')
                    }
                }
                else {
                    $("#div_Risk60Days").text("0");
                }

                if (ProjectName == "") {
                    $("#sp_filllriskchart").text('No Data').show();
                    $("#fillriskchart").hide();
                    $("#sp_filllriskchart").css('height', '355px');
                }
                else {

                    $("#sp_filllriskchart").text("").hide();
                    $("#fillriskchart").show();
                    $("#sp_filllriskchart").css('height', '0px');

                    document.getElementById("fillriskchart").innerHTML = '&nbsp;';
                    document.getElementById("fillriskchart").innerHTML = '<canvas id="myriskchartCanvas"></canvas>';

                    var OpenRisk = {
                        type: 'bar',
                        data: {
                            labels: ProjectName,
                            datasets: [
                                {
                                    label: 'Work In Progress',
                                    backgroundColor: "rgb(115, 178, 215)",
                                    borderColor: "rgb(115, 178, 215)",
                                    data: WorkingRisk
                                },
                                {
                                    label: 'Not Started',
                                    backgroundColor: "rgb(208, 224, 252)",
                                    borderColor: "rgb(231, 232, 192)",
                                    data: PendingRisk
                                }
                            ]
                        },
                        options: {
                            title: {
                                display: true,
                                text: ''
                            },
                            tooltips: {
                                mode: 'index',
                                intersect: false
                            },
                            responsive: true,
                            legend: {
                                position: 'top',
                                labels: {
                                    fontSize: 15
                                }
                            },
                            scales: {
                                xAxes: [{
                                    stacked: true,
                                    ticks: { autoSkip: false },
                                    //barPercentage: 0.4,
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'Projects',
                                        fontSize: 13
                                    },
                                }],
                                yAxes: [{
                                    stacked: true,
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'No of Risk',
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

                var mychart = document.getElementById("myriskchartCanvas").getContext('2d');
                new Chart(mychart, OpenRisk);
            });
    }

    $scope.GetChart();

}).config(function ($httpProvider) {
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.post["Content-Type"] = "application/json; charset=utf-8";
});

