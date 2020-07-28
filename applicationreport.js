
var app = angular.module("applicationreportgrid", ["ngRoute", "ui.grid", "ui.grid.grouping", "ui.grid.exporter", "ui.grid.autoResize", "ui.bootstrap"]);
app.controller("appReportctrl", function ($scope, $http, $q, $window) {

    $scope.gridOptionsAppReport = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'AppReportData',
        columnDefs: [
            {
                field: 'ProcessName',
                displayName: 'Process',
                cellTemplate: '<div class="task-name project-width border-left-dark"><div id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><div class= "text-overflow" title="{{row.entity.ProcessName}}" > {{ row.entity.ProcessName }}</div><small class="board-no">{{ row.entity.code }}</small></div>',
            },
            {
                field: 'txt_ApplicationName',
                displayName: 'Application Name',
            },
            {
                field: 'Stage',
                displayName: 'Stage',
            },
            {
                field: 'txt_UnitName',
                displayName: 'Business Unit',
            },
        ],
        enableSelectAll: true,
        exporterMenuAllData: false,        exporterCsvFilename: 'ApplicationReport.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "Application Report", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'ApplicationReport.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };

    $scope.gridOptionsAppReport.excessRows = 5000;
    $scope.AppReportData = {
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

    $scope.GetApplicationReport = function () {
        $http({
            method: "POST",
            url: "./ApplicationReport.aspx/GetApplicationReport",
            data: "",
            dataType: 'json',
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.AppReportData = d;
            }
            else {
                $scope.Message = "Record does not exists";
            }
        })
            .catch(function onError(error) {
            });

    }

    $scope.GetApplicationReport();

    $scope.GetChart = function () {
        $http.post('ApplicationReport.aspx/Get_Chart_Data',
            {
                data:
                    {}
            }).then(function (response) {
                var result = JSON.parse(response.data.d);
                var ProjectApplication = result.split("^")[0].split(',');
                var SignedOffApplication = result.split("^")[1].split(',');
                var SignOff = result.split("^")[2].split(',');
                var Project = result.split("^")[3].split(',');
                var colour = result.split("^")[4].split(',');
                console.log(ProjectApplication, SignedOffApplication, SignOff, Project, colour);
                if (ProjectApplication == "") {
                    $("#sp_projectchart").text('No Data').show();
                    $("#projectchart").hide();
                    $("#sp_projectchart").css('height', '355px');

                }
                else {
                    $("#sp_projectchart").text("").hide();
                    $("#projectchart").show();
                    $("#sp_projectchart").css('height', '0px');

                    $("#projectchart").empty().append('<canvas id="myprojectchartCanvas"></canvas>');
                    var projectchart = {
                        type: 'doughnut',
                        data: {
                            datasets: [{
                                data: Project,
                                backgroundColor: colour,
                                label: 'Dataset 1'
                            }],
                            labels: ProjectApplication
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
                                display: true
                            },
                            animation: {
                                animateScale: true,
                                animateRotate: true
                            },
                            tooltips: {
                                callbacks: {
                                    label: function (tooltipItem, data) {
                                        var dataset = data.datasets[tooltipItem.datasetIndex];
                                        var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                                            return parseInt(previousValue) + parseInt(currentValue);

                                        });
                                        var currentValue = dataset.data[tooltipItem.index];
                                        var percentage = Math.floor(((currentValue / total) * 100) + 0.5);

                                        return currentValue + " (" + percentage + "%)";

                                    }
                                }
                            }
                        }
                    };
                    var myprojectchart = document.getElementById("myprojectchartCanvas").getContext('2d');
                    window.myDoughnut = new Chart(myprojectchart, projectchart);
                }

                if (SignedOffApplication == "") {
                    $("#sp_signoffchart").text('No Data').show();
                    $("#signoffchart").hide();
                    $("#sp_signoffchart").css('height', '355px');
                }
                else {
                    $("#sp_signoffchart").text("").hide();
                    $("#signoffchart").show();
                    $("#sp_signoffchart").css('height', '0px');

                    $("#signoffchart").empty().append('<canvas id="mysignoffchartCanvas"></canvas>');
                    var signoffchart = {
                        type: 'doughnut',
                        data: {
                            datasets: [{
                                data: SignOff,
                                backgroundColor: colour,
                                label: 'Dataset 1'
                            }],
                            labels: SignedOffApplication
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
                            },
                            animation: {
                                animateScale: true,
                                animateRotate: true
                            },
                            tooltips: {
                                callbacks: {
                                    label: function (tooltipItem, data) {
                                        var dataset = data.datasets[tooltipItem.datasetIndex];
                                        var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                                            return parseInt(previousValue) + parseInt(currentValue);

                                        });
                                        var currentValue = dataset.data[tooltipItem.index];
                                        var percentage = Math.floor(((currentValue / total) * 100) + 0.5);

                                        return currentValue + " (" + percentage + "%)";

                                    }
                                }
                            }
                        }
                    };


                    var mysignoffchart = document.getElementById("mysignoffchartCanvas").getContext('2d');
                    window.myDoughnut = new Chart(mysignoffchart, signoffchart);
                }

            });
    }

    $scope.GetChart();

}).config(function ($httpProvider) {
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.post["Content-Type"] = "application/json; charset=utf-8";
});

