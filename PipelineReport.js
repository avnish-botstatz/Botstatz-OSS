var app = angular.module('PipelineReportApp', ['ui.grid', 'ngTouch', 'ui.grid.selection', 'ui.grid.grouping', 'ui.grid.exporter', 'ui.grid.autoResize'])
app.controller('PipelineController', function ($scope, $http, $window) {
    $scope.gridOptions = {
        enableSorting: true,
        enableFiltering: false,
        enableGridMenu: true,
        enablePinning: false,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'PipelineReportData',
        headerTemplate: 'PipelineHeader-template.html',
        headerAppends: {
            index: [0, 1],
            height: 35
        },
         columnDefs: [
            {
                 name: 'buname', width: 120, field: 'BusinessunitName',
                headers: [
                    { label: 'Business Unit', rowSpan: 2 },
                    { label: '', rowSpan: '#rowSpan' }

                ]
            },
            {
                name: 'deptname', width: 120, field: 'Department',
                headers: [
                    { label: 'Department', rowSpan: 2 },
                    { label: '', rowSpan: '#rowSpan' }

                ]
            },
            {
                name: 'TProcess', width: 120, field: 'TotalProcess',
                headers: [
                    { label: 'Total Process', rowSpan: 2 },
                    { label: '', rowSpan: '#rowSpan' }
                ]
            },
            {
                name: 'TAFTE', width: 120, field: 'TotalAFTE',
                headers: [
                    { label: 'Total AFTE', rowSpan: 2 },
                    { label: '', rowSpan: '#rowSpan' }
                ]
            },
            {
                name: 'DCount', width: 120, field: 'DiscoveryCount',
                headers: [
                    { label: 'Discovery', colSpan: 3 },
                    { label: 'No. of Process' },
                ]
            },
            {
                name: 'DAFTE', width: 70, field: 'DiscoveryAFTE',
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'AFTE' },

                ]
            }, {
                name: 'DBenefit', width: 140, field: 'DiscoveryBenefit',
                headers: [

                    { label: '', colSpan: '#colSpan' },
                    { label: 'Benefit Created' }
                ]
            },
            {
                name: 'QCount', width: 120, field: 'QualificationCount',
                headers: [
                    { label: 'Qualification', colSpan: 3 },
                    { label: 'No. of Process' },
                ]
            },
            {
                name: 'QAFTE', width: 70, field: 'QualificationAFTE',
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'AFTE' },

                ]
            }, {
                name: 'QBenefit', width: 140, field: 'QualificationBenefit',
                headers: [

                    { label: '', colSpan: '#colSpan' },
                    { label: 'Benefit Created' }
                ]
            },
            {
                name: 'PBCount', width: 120, field: 'ProjectBlogCount',
                headers: [
                    { label: 'Project Back Log', colSpan: 3 },
                    { label: 'No. of Process' },
                ]
            },
            {
                name: 'PBAFTE', width: 70, field: 'ProjectBlogAFTE',
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'AFTE' },

                ]
            }, {
                name: 'PBBenefit', width: 140, field: 'ProjectBlogBenefit',
                headers: [

                    { label: '', colSpan: '#colSpan' },
                    { label: 'Benefit Created' }
                ]
            },
            {
                name: 'BBLCount', width: 120, field: 'BuildBLogCount',
                headers: [
                    { label: 'Build Back Log', colSpan: 3 },
                    { label: 'No. of Process' },
                ]
            },
            {
                name: 'BBLAFTE', width: 70, field: 'BuildBLogAFTE',
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'AFTE' },

                ]
            }, {
                name: 'BBLBenefit', width: 140, field: 'BuildBLogBenefit',
                headers: [

                    { label: '', colSpan: '#colSpan' },
                    { label: 'Benefit Created' }
                ]
            },
            {
                name: 'BUCount', width: 120, field: 'BuildCount',
                headers: [
                    { label: 'Build', colSpan: 3 },
                    { label: 'No. of Process' },
                ]
            },
            {
                name: 'BUAFTE', width: 70, field: 'BuildAFTE',
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'AFTE' },

                ]
            }, {
                name: 'BUBenefit', width: 140, field: 'BuildBenefit',
                headers: [

                    { label: '', colSpan: '#colSpan' },
                    { label: 'Benefit Created' }
                ]
            },
            {
                name: 'UATCount', width: 120, field: 'UATCount',
                headers: [
                    { label: 'UAT', colSpan: 3 },
                    { label: 'No. of Process' },
                ]
            },
            {
                name: 'UATAFTE', width: 70, field: 'UATAFTE',
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'AFTE' },

                ]
            }, {
                name: 'UATBenefit', width: 140, field: 'UATBenefit',
                headers: [

                    { label: '', colSpan: '#colSpan' },
                    { label: 'Benefit Created' }
                ]
            },
            {
                name: 'GoLiveCount', width: 120, field: 'GoLiveCount',
                headers: [
                    { label: 'GoLive', colSpan: 3 },
                    { label: 'No. of Process' },
                ]
            },
            {
                name: 'GoLiveAFTE', width: 70, field: 'GoLiveAFTE',
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'AFTE' },

                ]
            }, {
                name: 'GoLiveBenefit', width: 140, field: 'GoLiveBenefit',
                headers: [

                    { label: '', colSpan: '#colSpan' },
                    { label: 'Benefit Created' }
                ]
            },

        ],
        enableSelectAll: true,
        exporterMenuAllData: false,        exporterCsvFilename: 'PipelineReportData.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "Pipeline Report", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'PipelineReportData.xlsx',
        exporterExcelSheetName: 'Sheet1',

    };
    $scope.gridOptions.excessRows = 100000;
    $scope.PerformanceMetricsReportData = {
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
    $scope.ProjectData = function () {
        $http({
            method: 'POST',
            url: "PipelineReport.aspx/BindPipelineReport",
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" },
            async: false
        }).then(function (response) {
            var d = [];
            if (response.data.d != null) {
                if (response.data.d.length > 0) {
                    d = JSON.parse(response.data.d);
                    console.log("metrics", d);
                    $scope.PipelineReportData = d.Metrics;
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
    $scope.ProjectData();
});



