
var app = angular.module("Bugreportgrid", ["ngRoute", "ui.grid", "ui.grid.grouping", "ui.grid.exporter", "ui.grid.autoResize", "ui.bootstrap"]);
app.controller("BugReportctrl", function ($scope, $http, $q, $window) {

    $scope.gridOptionsBugReport = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'BugReportData',
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
        exporterMenuAllData: false,        exporterCsvFilename: 'BugReport.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "Bug Report", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'BugReport.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };

    $scope.gridOptionsBugReport.excessRows = 5000;
    $scope.BugReportData = {
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

    $scope.GetBugReport = function () {
        $http({
            method: "POST",
            url: "./BugReport.aspx/GetBugReport",
            data: "",
            dataType: 'json',
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.BugReportData = d;
            }
            else {
                $scope.Message = "Record does not exists";
            }
        })
            .catch(function onError(error) {
            });

    }

    $scope.GetBugReport();

    $scope.GetChart = function () {
        $http.post('BugReport.aspx/Get_Chart_Data',
            {
                data:
                    {}
            }).then(function (response) {
                var resultdata = JSON.parse(response.data.d);
                console.log("Tets", resultdata);
                var ProjectName = resultdata.split("^")[0].split(',');
                var Bug = resultdata.split("^")[1].split(',');
                var WorkingBug = resultdata.split("^")[2].split(',');
                var PendingBug = resultdata.split("^")[3].split(',');
                var colour = resultdata.split("^")[4].split(',');
                var Bugs5Days = resultdata.split("^")[5].split(',');
                var Bugs10Days = resultdata.split("^")[6].split(',');
                var Bugs15Days = resultdata.split("^")[7].split(',');
                var Bugs30Days = resultdata.split("^")[8].split(',');
                var Bugs60Days = resultdata.split("^")[9].split(',');
                var keys = '<%=key%>';
                var buid = '<%=buid %>';

                if (Bugs5Days != "") {
                    $("#div_Bugs5Days").html("<a id='href_bug5'>" + Bugs5Days + " </a>");
                    if (Bugs5Days == 0) { $("#href_bug5").attr('style', 'cursor: default;'); $("#href_bug5").attr('href', 'JavaScript:void(0);'); }
                    if (keys == "5") {
                        $("#div_Bugs5Days").css('background', '#F0DF87')
                    }
                }
                else {
                    $("#div_Bugs5Days").text("0");
                }
                if (Bugs10Days != "") {
                    $("#div_Bugs10Days").html("<a id='href_bug10'>" + Bugs10Days + " </a>");
                    if (Bugs10Days == 0) { $("#href_bug10").attr('style', 'cursor: default;'); $("#href_bug10").attr('href', 'JavaScript:void(0);'); }
                    if (keys == "10") {
                        $("#div_Bugs10Days").css('background', '#F0DF87')
                    }
                }
                else {
                    $("#div_Bugs10Days").text("0");
                }
                if (Bugs15Days != "") {
                    $("#div_Bugs15Days").html("<a id='href_bug15'>" + Bugs15Days + " </a>");
                    if (Bugs15Days == 0) { $("#href_bug15").attr('style', 'cursor: default;'); $("#href_bug15").attr('href', 'JavaScript:void(0);'); }
                    if (keys == "15") {
                        $("#div_Bugs15Days").css('background', '#F0DF87')
                    }
                }
                else {
                    $("#div_Bugs15Days").text("0");
                }
                if (Bugs30Days != "") {
                    $("#div_Bugs30Days").html("<a id='href_bug30'>" + Bugs30Days + " </a>");
                    if (Bugs30Days == 0) { $("#href_bug30").attr('style', 'cursor: default;'); $("#href_bug30").attr('href', 'JavaScript:void(0);'); }
                    if (keys == "30") {
                        $("#div_Bugs30Days").css('background', '#F0DF87')
                    }
                }
                else {
                    $("#div_Bugs30Days").text("0");
                }
                if (Bugs60Days != "") {
                    $("#div_Bugs60Days").html("<a id='href_bug60'>" + Bugs60Days + " </a>");
                    if (Bugs60Days == 0) { $("#href_bug60").attr('style', 'cursor: default;'); $("#href_bug60").attr('href', 'JavaScript:void(0);'); }
                    if (keys == "60") {
                        $("#div_Bugs60Days").css('background', '#F0DF87')
                    }
                }
                else {
                    $("#div_Bugs60Days").text("0");
                }

                if (ProjectName == "") {
                    $("#sp_fillBugsChart").text('No Data').show();
                    $("#fillBugsChart").hide();
                    $("#sp_fillBugsChart").css('height', '355px');
                }
                else {
                    $("#sp_fillBugsChart").text("").hide();
                    $("#fillBugsChart").show();
                    $("#sp_fillBugsChart").css('height', '0px');

                    document.getElementById("fillBugsChart").innerHTML = '&nbsp;';
                    document.getElementById("fillBugsChart").innerHTML = '<canvas id="myBugschartCanvas"></canvas>';

                    var OpenBugReport = {
                        type: 'bar',
                        data: {
                            labels: ProjectName,
                            datasets: [
                                {
                                    label: 'Work In Progress',
                                    backgroundColor: "rgb(115, 178, 215)",
                                    borderColor: "rgb(115, 178, 215)",
                                    data: WorkingBug
                                },
                                {
                                    label: 'Not Started',
                                    backgroundColor: "rgb(208, 224, 252)",
                                    borderColor: "rgb(231, 232, 192)",
                                    data: PendingBug
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
                                        labelString: 'No of Bugs',
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

                var mychart = document.getElementById("myBugschartCanvas").getContext('2d');
                new Chart(mychart, OpenBugReport);
            });
    }

    $scope.GetChart();

}).config(function ($httpProvider) {
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.post["Content-Type"] = "application/json; charset=utf-8";
});

