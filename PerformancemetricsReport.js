var app = angular.module('PerformanceMetricsReportApp', ['ui.grid'])
app.controller('PerformanceMetricsController', function ($scope, $http, $window, uiGridConstants) {
    $scope.ProjectData = function () {
        $http({
            method: 'POST',
            url: "PerformancemetricsReport.aspx/BindPerformanceMetrics",
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" },
        }).then(function (response) {
            var d = [];
            if (response.data.d != null) {
                if (response.data.d.length > 0) {
                    d = JSON.parse(response.data.d);
                    console.log("metrics", d);
                    $scope.PerformanceMetricsReportData = d.Metrics;
                    $scope.gridOptions.columnDefs[4].displayName = d.Metrics[0].currentmonth;
                    $scope.gridOptions.columnDefs[6].displayName = d.Metrics[0].currentmonth;
                    $scope.gridOptions.columnDefs[8].displayName = d.Metrics[0].currentmonth;
                    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                } else {
                    $scope.Message = "Record does not exists";
                }
            }
            else {
                $scope.Message = "Record does not exists";
            }
        }).catch(function (data, status) {
            console.log(data);
        });
    }
    
    $scope.gridOptions = {
        data: 'PerformanceMetricsReportData',
        columnDefs: [
            {
                field: 'ProjectID',
                displayName: '',
                visible: false,
                width: "0",
                categoryDisplayName: '',
            },
            {
                name: 'buname',
                displayName: 'Business Unit',
                field: 'BusinessunitName',
                width: "150",
                categoryDisplayName: '',
            },
            {
                name: 'deptname',
                field: 'Departmentname',
                displayName: 'Department',
                width: "150",
                categoryDisplayName: '',
            },
            {
                name: 'PName',
                field: 'ProjectName',
                displayName: 'Project',
                width: "150",
                categoryDisplayName: '',
            },
            {
                name: 'Currentmonth',
                field: 'currentmonthVolume',
                categoryDisplayName: 'Current Volumes',
                width: "167"
            },
            {
                name: 'LastWeek',
                field: 'LastweekVolume',
                displayName: 'Last Week',
                categoryDisplayName: 'Current Volumes',
                width: "167"
            },

            {
                name: 'CurrentmonthA',
                field: 'currentmonthAccuracy',
                categoryDisplayName: 'Sample Accuracy (%)',
                width: "167"
            },
            {
                name: 'LastweekA',
                field: 'LastweekAccuracy',
                displayName: 'Last Week',
                categoryDisplayName: 'Sample Accuracy (%)',
                width: "167"
            },
            {
                name: 'CurrentmonthAvgT',
                field: 'CurrentmonthAvgTime',
                categoryDisplayName: 'Average Handle Time (Minutes)',
                width: "167"
            },
            {
                name: 'LastWeekAvgT',
                field: 'LastweekAvgTime',
                displayName: 'Last Week',
                categoryDisplayName: 'Average Handle Time (Minutes)',
                width: "167"
            },
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    }
     
    $scope.gridOptions.excessRows = 100000;
    $scope.PerformanceMetricsReportData = {
        "data": []
    };
    $scope.Message = "Please Wait....";
    
    $scope.ProjectData();
    
}).directive('categoryHeader', function () {
    function link(scope) {

        console.log("inside");
        console.log(scope.gridOptions.columnDefs);
        scope.headerRowHeight = 30;
        scope.catHeaderRowHeight = scope.headerRowHeight + 'px';
        scope.categories = [];
        var lastDisplayName = "";
        var totalWidth = 0;
        var left = 0;
        cols = scope.gridOptions.columnDefs;
        for (var i = 0; i < cols.length; i++) {



            totalWidth += Number(cols[i].width);


            var displayName = (typeof (cols[i].categoryDisplayName) === "undefined") ?
                "\u00A0" : cols[i].categoryDisplayName;

            if (displayName !== lastDisplayName) {

                scope.categories.push({
                    displayName: lastDisplayName,
                    width: totalWidth - Number(cols[i].width),
                    widthPx: (totalWidth - Number(cols[i].width)) + 'px',
                    left: left,
                    leftPx: left + 'px'
                });

                left += (totalWidth - Number(cols[i].width));
                totalWidth = Number(cols[i].width);
                lastDisplayName = displayName;
            }
        }

        if (totalWidth > 0) {

            scope.categories.push({
                displayName: lastDisplayName,
                width: totalWidth,
                widthPx: totalWidth + 'px',
                left: left,
                leftPx: left + 'px'
            });
        }

    }
    return {


        templateUrl: 'header-template.html',
        link: link

    };
});



