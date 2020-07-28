var app = angular.module('OverdueTaskUserReportApp', ['ngTouch', 'ui.grid', 'ui.grid.expandable', 'ui.grid.selection', 'ui.grid.pinning', 'ui.grid.grouping', 'ui.grid.exporter', 'ui.grid.autoResize'])
app.controller('OverdueTaskUserReportController', function ($scope, $http, $window) {
    $scope.gridOptions = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'OverdueTaskUserReportData',
        columnDefs: [
            {
                field: 'UserID',
                displayName: '',
                cellClass: 'text-center fontcentre',
                visible: false
            },
            {
                field: 'UserName',
                width: '20%',
                displayName: 'User Name',
                cellClass: 'text-center fontcentre',

            },
            {
                field: 'NoofProjects',
                displayName: 'No. of Project',
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'NoofTask',
                width: '20%',
                displayName: 'No. of Task',
                cellClass: 'text-center fontcentre',
                name: "Processcol",


            },
        ],
        enableSelectAll: true,
        exporterMenuAllData: false,        exporterCsvFilename: 'OverdueTaskUserReportData.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "Overdue Task by User Report", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'OverdueTaskUserReportData.xlsx',
        exporterExcelSheetName: 'Sheet1',

        expandableRowTemplate: '<div ui-grid="row.entity.subGridOptions" style="height:140px;" ></div>',

        expandableRowHeight: 150,
        onRegisterApi: function (gridApi) {
            //$scope.gridApi = gridApi;
            gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
                if (row.isExpanded) {
                    row.entity.subGridOptions = {
                        columnDefs: [
                            { name: 'SR No.', field: 'SRNo' },
                            { name: 'Project Name', field: 'ProjectName' },
                            { name: 'Task Name', field: 'TaskName' },
                            { name: 'Stage', field: 'Activity' },
                            { name: 'Status', field: 'TaskStatus' },
                            { name: 'Start Date', field: 'StartDate' },
                            { name: 'End Date', field: 'EndDate' },
                            { name: 'Aging', field: 'Aging' }
                        ]
                    };
                    $http({
                        method: 'POST',
                        url: "OverDueTaskByUser.aspx/GetProjectTask",
                        dataType: 'json',
                        data: { UserID: row.entity.UserID },
                        headers: { "Content-Type": "application/json" },
                        async: false
                    }).then(function (response) {
                        var d = [];
                        if (response.data.d != null) {
                            if (response.data.d.length > 0) {
                                d = JSON.parse(response.data.d);
                                console.log("UserTask", d);
                                row.entity.subGridOptions.data = d.TaskByUsers;

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
            });
        },






    };
    $scope.gridOptions.excessRows = 100000;
    $scope.OverdueTaskUserReportData = {
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
    var totalpassARR = [];
    var MonthARR = [];
    var totalFailedARR = [];
    $scope.ProjectData = function () {
        $http({
            method: 'POST',
            url: "OverDueTaskByUser.aspx/GetOverDueTaskByUser",
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" },
            async: false
        }).then(function (response) {
            var d = [];
            if (response.data.d != null) {
                if (response.data.d.length > 0) {
                    d = JSON.parse(response.data.d);
                    console.log("ProjectOverdue", d);
                    $scope.OverdueTaskUserReportData = d.OverdueTaskByuser;

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



