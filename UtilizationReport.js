var app = angular.module('UtilizReportApp', ['ngTouch', 'ui.grid', 'ui.grid.selection', 'ui.grid.grouping', 'ui.grid.exporter', 'ui.grid.autoResize'])
app.controller('UtilizReportController', function ($scope, $http, $window) {
    $scope.gridOptions = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'UtilizReportData',
        columnDefs: [
            {
                field: 'UserID',
                displayName: '',
                cellClass: 'text-center fontcentre',
                visible: false
            },
            {
                field: 'BusinessUnit',
                displayName: 'Business Unit',
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'UserName',
                width: '20%',
                displayName: 'Username',
                cellClass: 'text-center fontcentre',
                name: "Processcol",


            },
            {
                field: 'NoOfProject',
                width: '20%',
                displayName: 'No. of Project',
                cellClass: 'text-center fontcentre',
                name: "botcol",

            },
            {
                field: 'NoOfTask',
                displayName: 'No. of Task',
                cellClass: 'text-center fontcentre'
            },

            {
                field: 'TotalHours',
                displayName: 'Estimated Effort(Hours)',
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'TotalHoursSpend',
                displayName: 'Total Hours Spent',
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'PerCompleted',
                displayName: '% Completed',
                cellClass: 'text-center fontcentre'
            },
            //{
            //    field: '',
            //    displayName: 'View',
            //    cellClass: 'text-center fontcentre',
            //    cellTemplate: '<div onclick="{{grid.appScope.GetGanttChartData(row.entity.UserID)}}"><i class="la la-eye"></i></div>'
            //},
        ],
        enableSelectAll: true,
        exporterMenuAllData: false,        exporterCsvFilename: 'UtilizReportData.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "Utilization Report", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'UtilizReportData.xlsx',
        exporterExcelSheetName: 'Sheet1',

        //expandableRowTemplate: '<div ui-grid="row.entity.subGridOptions" style="height:140px;" ></div>',

        //expandableRowHeight: 150,
        //onRegisterApi: function (gridApi) {
        //    //$scope.gridApi = gridApi;
        //    gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
        //        if (row.isExpanded) {
        //            row.entity.subGridOptions = {
        //                columnDefs: [
        //                    { name: 'SR No.', field: 'SRNo' },
        //                    { name: 'Task Name', field: 'TaskName' },
        //                    { name: 'Stage', field: 'Activity' },
        //                    { name: 'User Name', field: 'UserName' },
        //                    { name: 'Status', field: 'TaskStatus' },
        //                    { name: 'Start Date', field: 'StartDate' },
        //                    { name: 'End Date', field: 'EndDate' },
        //                    { name: 'Aging', field: 'Aging' }
        //                ]
        //            };
        //            $http({
        //                method: 'POST',
        //                url: "ProjectOverDueReport.aspx/GetProjectTask",
        //                dataType: 'json',
        //                data: { ProjectID: row.entity.ProjectID },
        //                headers: { "Content-Type": "application/json" },
        //                async: false
        //            }).then(function (response) {
        //                var d = [];
        //                if (response.data.d != null) {
        //                    if (response.data.d.length > 0) {
        //                        d = JSON.parse(response.data.d);
        //                        console.log("ProjectOverduetask", d);
        //                        row.entity.subGridOptions.data = d.ProjectTask;

        //                    } else {
        //                        $scope.Message = "Record does not exists";
        //                    }
        //                }
        //                else {
        //                    $scope.Message = "Record does not exists";
        //                }
        //            }).catch(function (data, status) {
        //                console.log(data);
        //            });
        //        }
        //    });
        //},






    };
    $scope.gridOptions.excessRows = 100000;
    $scope.UtilizReportData = {
        "data": []
    };
    $scope.Message = "Please Wait....";
    $scope.expandAll = function () {
        $scope.gridApi.treeBase.expandAllRows();

    };

    $scope.toggleRow = function (rowNum) {
        $scope.gridApi.treeBase.toggleRowTreeState($scope.gridApi.grid.renderContainers.body.visibleRowCache[rowNum]);
    };

    $scope.changeGrouping = function () {
        $scope.gridApi.grouping.clearGrouping();
    };
    //$scope.GetGanttChartData = function (userID) {
    //    $http({
    //        method: 'POST',
    //        url: "UtilizationReport.aspx/Fill_Gantt_Chart",
    //        dataType: 'json',
    //        data: { userid: userID },
    //        headers: { "Content-Type": "application/json" },
    //    }).then(function (response) {
    //        console.log(response.data.d);
    //    });
    //}
    var totalpassARR = [];
    var MonthARR = [];
    var totalFailedARR = [];
    $scope.ProjectData = function () {
        $http({
            method: 'POST',
            url: "UtilizationReport.aspx/GetUtilizationReport",
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" },
            async: false
        }).then(function (response) {
            var d = [];
            if (response.data.d != null) {
                if (response.data.d.length > 0) {
                    d = JSON.parse(response.data.d);
                    console.log("utilization", d);
                    $scope.UtilizReportData = d.UtilizReportData;

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
    $scope.ProjectData();

});



