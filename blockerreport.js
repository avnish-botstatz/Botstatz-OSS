
var app = angular.module("Blockerreportgrid", ["ngRoute", "ui.grid", "ui.grid.grouping", "ui.grid.exporter", "ui.grid.autoResize", "ui.bootstrap"]);
app.controller("BlockerReportctrl", function ($scope, $http, $q, $window) {

    $scope.gridOptionsBlockerReport = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'BlockerReportData',
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
        exporterMenuAllData: false,        exporterCsvFilename: 'BlockerReport.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "Blocker Report", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'BlockerReport.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };

    $scope.gridOptionsBlockerReport.excessRows = 5000;
    $scope.BlockerReportData = {
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

    $scope.GetBlockerReport = function () {
        $http({
            method: "POST",
            url: "./BlockerReport.aspx/GetBlockerReport",
            data: "",
            dataType: 'json',
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.BlockerReportData = d;
            }
            else {
                $scope.Message = "Record does not exists";
            }
        })
            .catch(function onError(error) {
            });

    }

    $scope.GetBlockerReport();

    $scope.GetChart = function () {
        $http.post('BlockerReport.aspx/Get_Chart_Data',
            {
                data:
                    {}
            }).then(function (response) {
                var resultdata = JSON.parse(response.data.d);
                var ProjectName = resultdata.split("^")[0].split(',');
                var Blocker = resultdata.split("^")[1].split(',');
                var Workingblocker = resultdata.split("^")[2].split(',');
                var PendingBlocker = resultdata.split("^")[3].split(',');
                var colour = resultdata.split("^")[4].split(',');
                var Blocker5Days = resultdata.split("^")[5].split(',');
                var Blocker10Days = resultdata.split("^")[6].split(',');
                var Blocker15Days = resultdata.split("^")[7].split(',');
                var Blocker30Days = resultdata.split("^")[8].split(',');
                var Blocker60Days = resultdata.split("^")[9].split(',');
                var keys = '<%=key%>';
                var buid = '<%=buid %>';


                if (Blocker5Days != "") {
                    $("#div_Blocker5Days").html("<a id='href_blocker5'>" + Blocker5Days + " </a>");
                    if (Blocker5Days == 0) { $("#href_blocker5").attr('style', 'cursor: default;'); $("#href_blocker5").attr('href', 'JavaScript:void(0);'); }
                    if (keys == "5") {
                        $("#div_Blocker5Days").css('background', '#F0DF87')
                    }
                }
                else {
                    $("#div_Blocker5Days").text("0");
                }
                if (Blocker10Days != "") {
                    $("#div_Blocker10Days").html("<a id='href_blocker10'>" + Blocker10Days + " </a>");
                    if (Blocker10Days == 0) { $("#href_blocker10").attr('style', 'cursor: default;'); $("#href_blocker10").attr('href', 'JavaScript:void(0);'); }
                    if (keys == "10") {
                        $("#div_Blocker10Days").css('background', '#F0DF87')
                    }
                }
                else {
                    $("#div_Blocker10Days").text("0");
                }
                if (Blocker15Days != "") {
                    $("#div_Blocker15Days").html("<a id='href_blocker15'>" + Blocker15Days + " </a>");
                    if (Blocker15Days == 0) { $("#href_blocker15").attr('style', 'cursor: default;'); $("#href_blocker15").attr('href', 'JavaScript:void(0);'); }
                    if (keys == "15") {
                        $("#div_Blocker15Days").css('background', '#F0DF87')
                    }
                }
                else {
                    $("#div_Blocker15Days").text("0");
                }
                if (Blocker30Days != "") {
                    $("#div_Blocker30Days").html("<a id='href_blocker30'>" + Blocker30Days + " </a>");
                    if (Blocker30Days == 0) { $("#href_blocker30").attr('style', 'cursor: default;'); $("#href_blocker30").attr('href', 'JavaScript:void(0);'); }
                    if (keys == "30") {
                        $("#div_Blocker30Days").css('background', '#F0DF87')
                    }
                }
                else {
                    $("#div_Blocker30Days").text("0");
                }
                if (Blocker60Days != "") {
                    $("#div_Blocker60Days").html("<a id='href_blocker60'>" + Blocker60Days + " </a>");
                    if (Blocker60Days == 0) { $("#href_blocker60").attr('style', 'cursor: default;'); $("#href_blocker60").attr('href', 'JavaScript:void(0);'); }
                    if (keys == "60") {
                        $("#div_Blocker60Days").css('background', '#F0DF87')
                    }
                }
                else {
                    $("#div_Blocker60Days").text("0");
                }

                if (ProjectName == "") {
                    $("#sp_fillChart").text('No Data').show();
                    $("#fillchart").hide();
                    $("#sp_fillChart").css('height', '355px');
                }
                else {
                    $("#sp_fillChart").text("").hide();
                    $("#fillchart").show();
                    $("#sp_fillChart").css('height', '0px');
                    document.getElementById("fillchart").innerHTML = '&nbsp;';
                    document.getElementById("fillchart").innerHTML = '<canvas id="myprojectchartCanvas"></canvas>';
                    var OpenBlockerReport = {
                        type: 'bar',
                        data: {
                            labels: ProjectName,
                            datasets: [
                                {
                                    label: 'Work In Progress',
                                    backgroundColor: "rgb(115, 178, 215)",
                                    borderColor: "rgb(115, 178, 215)",
                                    data: Workingblocker
                                },
                                {
                                    label: 'Not Started',
                                    backgroundColor: "rgb(208, 224, 252)",
                                    borderColor: "rgb(231, 232, 192)",
                                    data: PendingBlocker
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
                                        labelString: 'No of Blockers',
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
                var mychart = document.getElementById("myprojectchartCanvas").getContext('2d');
                new Chart(mychart, OpenBlockerReport);
            });
    }

    $scope.GetChart();

}).config(function ($httpProvider) {
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.post["Content-Type"] = "application/json; charset=utf-8";
});

