
var app = angular.module("NetSavingsgrid", ["ngRoute", "ui.grid", "ui.grid.grouping", "ui.grid.exporter", "ui.grid.autoResize", "ui.bootstrap"]);
app.controller("NetSavingsCtrl", function ($scope, $http, $q, $window, uiGridConstants) {
    

    $scope.gridOptionsNetSavings = {
        enableSorting: true,
        showColumnFooter: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'NetSavingsData',
        headerTemplate: 'NetSavingsHeaderHtml.html',
        headerAppends: {
            index: [0, 1],
            height: 35
        },
        columnDefs: [
            {
                field: 'BusinessUnit',
                displayName: 'Business Unit',
                width: 200,
                headers: [
                    { label: 'Business Unit', rowSpan: 2 },
                    { label: '', rowSpan: '#rowSpan' },
                ]

            },
            {
                field: 'Department',
                displayName: 'Department',
                width: 200,
                headers: [
                    { label: 'Department', rowSpan: 2 },
                    { label: '', rowSpan: '#rowSpan' },
                ]
            },
            {
                field: 'ProjectName',
                displayName: 'Project',
                width: 200,
                headers: [
                    { label: 'Project', rowSpan: 2 },
                    { label: '', rowSpan: '#rowSpan' },
                ]
            },
            {
                field: 'FTE',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                displayName: 'FTE',
                width: 70,
                headers: [
                    { label: 'FTE', rowSpan: 2 },
                    { label: '', rowSpan: '#rowSpan' },
                ]
            },
            {
                field: 'GrossSaving1',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                displayName: 'GrossSaving1',
                width: 110,
                headers: [
                    { label: '', colSpan: 3 },
                    { label: 'Gross Saving' },
                ]
            },
            {
                field: 'Cost1',
                displayName: 'Cost',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'Cost' },
                ]
            },
            {
                field: 'NetSaved1',
                displayName: 'Net Saved',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'Net Saved' },
                ]
            },
            {
                field: 'GrossSaving2',
                displayName: 'GrossSaving2',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: 3 },
                    { label: 'Gross Saving' },
                ]
            },
            {
                field: 'Cost2',
                displayName: 'Cost',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'Cost' },
                ]
            },
            {
                field: 'NetSaved2',
                displayName: 'Net Saved',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'Net Saved' },
                ]
            },
            {
                field: 'GrossSaving3',
                displayName: 'Gross Saving3',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: 3 },
                    { label: 'Gross Saving' },
                ]
            },
            {
                field: 'Cost3',
                displayName: 'Cost',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'Cost' },
                ]
            },
            {
                field: 'NetSaved3',
                displayName: 'Net Saved',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'Net Saved' },
                ]
            },
            {
                field: 'GrossSaving4',
                displayName: 'Gross Saving4',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: 3 },
                    { label: 'Gross Saving' },
                ]
            },
            {
                field: 'Cost4',
                displayName: 'Cost',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'Cost' },
                ]
            },
            {
                field: 'NetSaved4',
                displayName: 'Net Saved',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'Net Saved' },
                ]
            },
            {
                field: 'GrossSaving5',
                displayName: 'Gross Saving5',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: 3 },
                    { label: 'Gross Saving' },
                ]
            },
            {
                field: 'Cost5',
                displayName: 'Cost',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'Cost' },
                ]
            },
            {
                field: 'NetSaved5',
                displayName: 'Net Saved',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'Net Saved' },
                ]
            },
            {
                field: 'GrossSaving6',
                displayName: 'Gross Saving6',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: 3 },
                    { label: 'Gross Saving' },
                ]
            },
            {
                field: 'Cost6',
                displayName: 'Cost',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'Cost' },
                ]
            },
            {
                field: 'NetSaved6',
                displayName: 'Net Saved',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'Net Saved' },
                ]
            },
            {
                field: 'GrossSaving7',
                displayName: 'Gross Saving7',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: 3 },
                    { label: 'Gross Saving' },
                ]
            },
            {
                field: 'Cost7',
                displayName: 'Cost',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'Cost' },
                ]
            },
            {
                field: 'NetSaved7',
                displayName: 'Net Saved',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'Net Saved' },
                ]
            },
            {
                field: 'GrossSaving8',
                displayName: 'Gross Saving8',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: 3 },
                    { label: 'Gross Saving' },
                ]
            },
            {
                field: 'Cost8',
                displayName: 'Cost',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'Cost' },
                ]
            },
            {
                field: 'NetSaved8',
                displayName: 'Net Saved',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'Net Saved' },
                ]
            },
            {
                field: 'GrossSaving9',
                displayName: 'Gross Saving9',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: 3 },
                    { label: 'Gross Saving' },
                ]
            },
            {
                field: 'Cost9',
                displayName: 'Cost',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'Cost' },
                ]
            },
            {
                field: 'NetSaved9',
                displayName: 'Net Saved',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'Net Saved' },
                ]
            },
            {
                field: 'GrossSaving10',
                displayName: 'Gross Saving10',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: 3 },
                    { label: 'Gross Saving' },
                ]
            },
            {
                field: 'Cost10',
                displayName: 'Cost',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'Cost' },
                ]
            },
            {
                field: 'NetSaved10',
                displayName: 'Net Saved',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'Net Saved' },
                ]
            },
            {
                field: 'GrossSaving11',
                displayName: 'Gross Saving11',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: 3 },
                    { label: 'Gross Saving' },
                ]
            },
            {
                field: 'Cost11',
                displayName: 'Cost',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'Cost' },
                ]
            },
            {
                field: 'NetSaved11',
                displayName: 'Net Saved',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'Net Saved' },
                ]
            },
            {
                field: 'GrossSaving12',
                displayName: 'Gross Saving12',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: 3 },
                    { label: 'Gross Saving' },
                ]
            },
            {
                field: 'Cost12',
                displayName: 'Cost',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'Cost' },
                ]
            },
            {
                field: 'NetSaved12',
                displayName: 'Net Saved',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'Net Saved' },
                ]
            },
            {
                field: 'GrossSaving13',
                displayName: 'Gross Saving13',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: 'Total', colSpan: 3 },
                    { label: 'Gross Saving' },
                ]
            },
            {
                field: 'Cost13',
                displayName: 'Cost',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'Cost' },
                ]
            },
            {
                field: 'NetSaved13',
                displayName: 'Net Saved',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
                width: 110,
                headers: [
                    { label: '', colSpan: '#colSpan' },
                    { label: 'Net Saved' },
                ]
            },
        ],
        enableSelectAll: true,
        exporterMenuAllData: false,        exporterCsvFilename: 'NetSavingsReport.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "Net Savings Report", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'NetSavingsReport.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };


    $scope.toggleColumnFooter = function () {
        $scope.gridOptionsNetSavings.showColumnFooter = !$scope.gridOptionsNetSavings.showColumnFooter;
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
    };


    $scope.gridOptionsNetSavings.excessRows = 5000;
    $scope.NetSavingsData = {
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

    $scope.GetNetSavingsData = function () {
        var netSavingData = [];
        var month = "";
        $http({
            method: "POST",
            url: "NetSavingsReport.aspx/GetNetSavingsData",
            data: "",
            dataType: 'json',
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            month = d.month;

            var finDate = new Date(parseInt(d.startmonth.split('-')[2]), parseInt(d.startmonth.split('-')[1]) - 1, 1);
            netSavingData = d.Data;
            if (netSavingData.length > 0) {
                $scope.NetSavingsData = netSavingData;
                $scope.gridOptionsNetSavings.columnDefs[4].headers[0].label = GetMonthName(finDate.getMonth() + 1) + '-' + finDate.getFullYear();
                finDate.setMonth(finDate.getMonth() + 1);
                $scope.gridOptionsNetSavings.columnDefs[7].headers[0].label = GetMonthName(finDate.getMonth() + 1) + '-' + finDate.getFullYear();
                finDate.setMonth(finDate.getMonth() + 1);
                $scope.gridOptionsNetSavings.columnDefs[10].headers[0].label = GetMonthName(finDate.getMonth() + 1) + '-' + finDate.getFullYear();
                finDate.setMonth(finDate.getMonth() + 1);
                $scope.gridOptionsNetSavings.columnDefs[13].headers[0].label = GetMonthName(finDate.getMonth() + 1) + '-' + finDate.getFullYear();
                finDate.setMonth(finDate.getMonth() + 1);
                $scope.gridOptionsNetSavings.columnDefs[16].headers[0].label = GetMonthName(finDate.getMonth() + 1) + '-' + finDate.getFullYear();
                finDate.setMonth(finDate.getMonth() + 1);
                $scope.gridOptionsNetSavings.columnDefs[19].headers[0].label = GetMonthName(finDate.getMonth() + 1) + '-' + finDate.getFullYear();
                finDate.setMonth(finDate.getMonth() + 1);
                $scope.gridOptionsNetSavings.columnDefs[22].headers[0].label = GetMonthName(finDate.getMonth() + 1) + '-' + finDate.getFullYear();
                finDate.setMonth(finDate.getMonth() + 1);
                $scope.gridOptionsNetSavings.columnDefs[25].headers[0].label = GetMonthName(finDate.getMonth() + 1) + '-' + finDate.getFullYear();
                finDate.setMonth(finDate.getMonth() + 1);
                $scope.gridOptionsNetSavings.columnDefs[28].headers[0].label = GetMonthName(finDate.getMonth() + 1) + '-' + finDate.getFullYear();
                finDate.setMonth(finDate.getMonth() + 1);
                $scope.gridOptionsNetSavings.columnDefs[31].headers[0].label = GetMonthName(finDate.getMonth() + 1) + '-' + finDate.getFullYear();
                finDate.setMonth(finDate.getMonth() + 1);
                $scope.gridOptionsNetSavings.columnDefs[34].headers[0].label = GetMonthName(finDate.getMonth() + 1) + '-' + finDate.getFullYear();
                finDate.setMonth(finDate.getMonth() + 1);
                $scope.gridOptionsNetSavings.columnDefs[37].headers[0].label = GetMonthName(finDate.getMonth() + 1) + '-' + finDate.getFullYear();

                if (month < 2) {
                    $scope.gridOptionsNetSavings.columnDefs[7].visible = false;
                    $scope.gridOptionsNetSavings.columnDefs[8].visible = false;
                    $scope.gridOptionsNetSavings.columnDefs[9].visible = false;
                }
                if (month < 3) {
                    $scope.gridOptionsNetSavings.columnDefs[10].visible = false;
                    $scope.gridOptionsNetSavings.columnDefs[11].visible = false;
                    $scope.gridOptionsNetSavings.columnDefs[12].visible = false;
                }
                if (month < 4) {
                    $scope.gridOptionsNetSavings.columnDefs[13].visible = false;
                    $scope.gridOptionsNetSavings.columnDefs[14].visible = false;
                    $scope.gridOptionsNetSavings.columnDefs[15].visible = false;
                }
                if (month < 5) {
                    $scope.gridOptionsNetSavings.columnDefs[16].visible = false;
                    $scope.gridOptionsNetSavings.columnDefs[17].visible = false;
                    $scope.gridOptionsNetSavings.columnDefs[18].visible = false;
                }
                if (month < 6) {
                    $scope.gridOptionsNetSavings.columnDefs[19].visible = false;
                    $scope.gridOptionsNetSavings.columnDefs[20].visible = false;
                    $scope.gridOptionsNetSavings.columnDefs[21].visible = false;
                }
                if (month < 7) {
                    $scope.gridOptionsNetSavings.columnDefs[22].visible = false;
                    $scope.gridOptionsNetSavings.columnDefs[23].visible = false;
                    $scope.gridOptionsNetSavings.columnDefs[24].visible = false;
                }
                if (month < 8) {
                    $scope.gridOptionsNetSavings.columnDefs[25].visible = false;
                    $scope.gridOptionsNetSavings.columnDefs[26].visible = false;
                    $scope.gridOptionsNetSavings.columnDefs[27].visible = false;
                }
                if (month < 9) {
                    $scope.gridOptionsNetSavings.columnDefs[28].visible = false;
                    $scope.gridOptionsNetSavings.columnDefs[29].visible = false;
                    $scope.gridOptionsNetSavings.columnDefs[30].visible = false;
                }
                if (month < 10) {
                    $scope.gridOptionsNetSavings.columnDefs[31].visible = false;
                    $scope.gridOptionsNetSavings.columnDefs[32].visible = false;
                    $scope.gridOptionsNetSavings.columnDefs[33].visible = false;
                }
                if (month < 11) {
                    $scope.gridOptionsNetSavings.columnDefs[34].visible = false;
                    $scope.gridOptionsNetSavings.columnDefs[35].visible = false;
                    $scope.gridOptionsNetSavings.columnDefs[36].visible = false;
                }
                if (month < 12) {
                    $scope.gridOptionsNetSavings.columnDefs[37].visible = false;
                    $scope.gridOptionsNetSavings.columnDefs[38].visible = false;
                    $scope.gridOptionsNetSavings.columnDefs[39].visible = false;
                }
            }
            else {
                $scope.Message = "Record does not exists";
            }
        })
            .catch(function onError(error) {
            });

    }

    $scope.GetNetSavingsData();

    function GetMonthName(monthNumber) {
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return months[monthNumber - 1];
    }

}).config(function ($httpProvider) {
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.post["Content-Type"] = "application/json; charset=utf-8";
});

