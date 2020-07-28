
var app = angular.module("Enhancementreportgrid", ["ngRoute", "ui.grid", "ui.grid.grouping", "ui.grid.exporter", "ui.grid.autoResize", "ui.bootstrap"]);
app.controller("EnhancementReportctrl", function ($scope, $http, $q, $window) {

    $scope.gridOptionsEnhancementReport = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'EnhancementReportData',
        columnDefs: [
            {
                field: 'txt_ProjectName',
                displayName: 'Process',
                cellTemplate: '<div class="task-name project-width border-left-dark"><div id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><div class= "text-overflow" title="{{row.entity.txt_ProjectName}}" > {{ row.entity.txt_ProjectName }}</div><small class="board-no">{{ row.entity.txt_ProjectCode }}</small></div>',
                width: 300
            },
            {
                field: 'txt_Subject',
                displayName: 'Title',
            },
            {
                field: 'dt_SubmittedDate', displayName: 'Created Date', cellClass: 'text-center fontcentre',
                cellFilter: 'date:\'dd-MMM-yyyy | hh:mm \'',
                width: 200,
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
                field: 'UserName',
                displayName: 'Assign To',
            },
            {
                field: 'Status',
                displayName: 'Status',
            },
        ],
        enableSelectAll: true,
        exporterMenuAllData: false,        exporterCsvFilename: 'EnhancementReport.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "Enhancement Report", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'EnhancementReport.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };

    $scope.gridOptionsEnhancementReport.excessRows = 5000;
    $scope.EnhancementReportData = {
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

    $scope.GetEnhancementReport = function () {
        $http({
            method: "POST",
            url: "./EnhancementReport.aspx/GetEnhancementReport",
            data: "",
            dataType: 'json',
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            console.log("d", d);
            if (d.length > 0) {
                $scope.EnhancementReportData = d;
            }
            else {
                $scope.Message = "Record does not exists";
            }
        })
            .catch(function onError(error) {
            });
    }

    $scope.GetEnhancementReport();

    $scope.GetChart = function () {
        $http.post('EnhancementReport.aspx/Get_Chart_Data',
            {
                data:
                    {}
            }).then(function (response) {
                var resultdata = JSON.parse(response.data.d);
                var ProjectName = resultdata.split("^")[0].split(',');
                var Enhancement = resultdata.split("^")[1].split(',');
                var WorkingEnhancement = resultdata.split("^")[2].split(',');
                var PendingEnhancement = resultdata.split("^")[3].split(',');
                var colour = resultdata.split("^")[4].split(',');
                var Enhance5Days = resultdata.split("^")[5].split(',');
                var Enhance10Days = resultdata.split("^")[6].split(',');
                var Enhance15Days = resultdata.split("^")[7].split(',');
                var Enhance30Days = resultdata.split("^")[8].split(',');
                var Enhance60Days = resultdata.split("^")[9].split(',');
                var keys = '<%=key%>';
                var buid = '<%=buid %>';

                if (Enhance5Days != "") {
                    $("#div_Enhance5Days").html("<a id='href_Enhancement5'>" + Enhance5Days + " </a>");
                    if (Enhance5Days == 0) { $("#href_Enhancement5").attr('style', 'cursor: default;'); $("#href_Enhancement5").attr('href', 'JavaScript:void(0);'); }
                    if (keys == "5") {
                        $("#div_Enhance5Days").css('background', '#F0DF87')
                    }
                }
                else {
                    $("#div_Enhance5Days").text("0");
                }
                if (Enhance10Days != "") {
                    $("#div_Enhance10Days").html("<a id='href_Enhancement10'>" + Enhance10Days + " </a>");
                    if (Enhance10Days == 0) { $("#href_Enhancement10").attr('style', 'cursor: default;'); $("#href_Enhancement10").attr('href', 'JavaScript:void(0);'); }
                    if (keys == "10") {
                        $("#div_Enhance10Days").css('background', '#F0DF87')
                    }
                }
                else {
                    $("#div_Enhance10Days").text("0");
                }
                if (Enhance15Days != "") {
                    $("#div_Enhance15Days").html("<a id='href_Enhancement15'>" + Enhance15Days + " </a>");
                    if (Enhance15Days == 0) { $("#href_Enhancement15").attr('style', 'cursor: default;'); $("#href_Enhancement15").attr('href', 'JavaScript:void(0);'); }
                    if (keys == "15") {
                        $("#div_Enhance15Days").css('background', '#F0DF87')
                    }
                }
                else {
                    $("#div_Enhance15Days").text("0");
                }
                if (Enhance30Days != "") {
                    $("#div_Enhance30Days").html("<a id='href_Enhancement30'>" + Enhance30Days + " </a>");
                    if (Enhance30Days == 0) { $("#href_Enhancement30").attr('style', 'cursor: default;'); $("#href_Enhancement30").attr('href', 'JavaScript:void(0);'); }
                    if (keys == "30") {
                        $("#div_Enhance30Days").css('background', '#F0DF87')
                    }
                }
                else {
                    $("#div_Enhance30Days").text("0");
                }
                if (Enhance60Days != "") {
                    $("#div_Enhance60Days").html("<a id='href_Enhancement60'>" + Enhance60Days + " </a>");
                    if (Enhance60Days == 0) { $("#href_Enhancement60").attr('style', 'cursor: default;'); $("#href_Enhancement60").attr('href', 'JavaScript:void(0);'); }
                    if (keys == "60") {
                        $("#div_Enhance60Days").css('background', '#F0DF87')
                    }
                }
                else {
                    $("#div_Enhance60Days").text("0");
                }

                if (ProjectName == "") {
                    $("#sp_fillenhancementchart").text('No Data').show();
                    $("#fillenhancementchart").hide();
                    $("#sp_fillenhancementchart").css('height', '355px');
                }
                else {
                    $("#sp_fillenhancementchart").text("").hide();
                    $("#fillenhancementchart").show();
                    $("#sp_fillenhancementchart").css('height', '0px');

                    document.getElementById("fillenhancementchart").innerHTML = '&nbsp;';
                    document.getElementById("fillenhancementchart").innerHTML = '<canvas id="myenhancementchartCanvas"></canvas>';

                    var OpenEnhancement = {
                        type: 'bar',
                        data: {
                            labels: ProjectName,
                            datasets: [
                                {
                                    label: 'Work In Progress',
                                    backgroundColor: "rgb(115, 178, 215)",
                                    borderColor: "rgb(115, 178, 215)",
                                    data: WorkingEnhancement
                                },
                                {
                                    label: 'Not Started',
                                    backgroundColor: "rgb(208, 224, 252)",
                                    borderColor: "rgb(231, 232, 192)",
                                    data: PendingEnhancement
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
                                    barPercentage: 0.4,
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
                                        labelString: 'No of Enhancement',
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

                var mychart = document.getElementById("myenhancementchartCanvas").getContext('2d');
                new Chart(mychart, OpenEnhancement);
            });
    }

    $scope.GetChart();

}).config(function ($httpProvider) {
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.post["Content-Type"] = "application/json; charset=utf-8";
});

