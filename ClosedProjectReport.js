var app = angular.module('ClosedProjectReportApp', ['ui.grid'])
app.controller('ClosedProjectController', function ($scope, $http, $window, uiGridConstants) {
    $scope.ProjectData = function () {
        $http({
            method: 'POST',
            url: "ClosedProjectReport.aspx/GetPorjectReport",
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" },
        }).then(function (response) {
            var d = [];
            if (response.data.d != null) {
                if (response.data.d.length > 0) {
                    d = JSON.parse(response.data.d);
                    console.log("ClosedProject", d);
                    $scope.ClosedProjectReportData = d.ClosedProject;
                    Get_Chart();
                    //$scope.gridOptions.columnDefs[4].displayName = d.Metrics[0].currentmonth;
                    //$scope.gridOptions.columnDefs[6].displayName = d.Metrics[0].currentmonth;
                    //$scope.gridOptions.columnDefs[8].displayName = d.Metrics[0].currentmonth;
                    //$scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
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
        data: 'ClosedProjectReportData',
        columnDefs: [
            {
                field: 'ProjectID',
                displayName: '',
                visible: false,
                width: "0",
                categoryDisplayName: '',
            },
            {
                name: 'PID',
                displayName: 'Project ID',
                field: 'ProjectCode',
                width: "140",
                categoryDisplayName: '',
            },
            {
                name: 'PName',
                field: 'ProjectName',
                displayName: 'Project Name',
                width: "199",
                categoryDisplayName: '',
            },
            {
                name: 'BUname',
                field: 'BusinessUnit',
                displayName: 'Business Unit',
                width: "199",
                categoryDisplayName: '',
            },
            {
                name: 'ARTotalAFTE',
                field: 'ARTotalAFTE',
                displayName: 'AR',
                categoryDisplayName: 'Total AFTE',
                width: "120"
            },
            {
                name: 'PRJTotalAFTE',
                field: 'PRJTotalAFTE',
                displayName: 'Project',
                categoryDisplayName: 'Total AFTE',
                width: "120"
            },

            {
                name: 'ARFTEbenefit',
                field: 'ARFTEbenefit',
                displayName: 'AR',
                categoryDisplayName: 'Total USD Saved',
                width: "120"
            },
            {
                name: 'PRJFTEbenefit',
                field: 'PRJFTEbenefit',
                displayName: 'Project',
                categoryDisplayName: 'Total USD Saved',
                width: "120"
            },
            {
                name: 'strSubmittedDate',
                field: 'StartDate',
                displayName: 'Start Date',
                width: "140"
            },
            {
                name: 'strEndDate',
                field: 'EndDate',
                displayName: 'End Date',
                width: "140"
            },
            {
                name: 'Aging',
                field: 'Aging',
                displayName: 'Duration(Days)',
                width: "120"
            },
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    }

    $scope.gridOptions.excessRows = 100000;
    $scope.ClosedProjectReportData = {
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