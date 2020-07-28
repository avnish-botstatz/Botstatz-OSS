
var app = angular.module("certifiedresgrid", ["ngRoute", "ui.grid", "ui.grid.grouping", "ui.grid.exporter", "ui.grid.autoResize", "ui.bootstrap"]);
app.controller("certifiedresctrl", function ($scope, $http, $q, $window, uiGridConstants) {

    $scope.gridOptionsCertifiedRes = {
        enableSorting: true,
        showColumnFooter: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'CertifiedResourceData',
        columnDefs: [
            {
                field: 'BusinessUnit',
                displayName: 'Business Unit',
                width: 200
            },
            {
                field: 'txt_CertificateName',
                displayName: 'Certificate Name',
            },
            {
                field: 'Employee',
                displayName: 'Employee',
                //headerCellClass: 'text-center',
                //cellClass: 'text-center fontcentre',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true
            },
            {
                field: 'Contractor',
                displayName: 'Contractor',
                //headerCellClass: 'text-center',
                //cellClass: 'text-center fontcentre',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true
            },
            {
                field: 'Total',
                displayName: 'Total',
                //headerCellClass: 'text-center',
                //cellClass: 'text-center fontcentre',
                aggregationType: uiGridConstants.aggregationTypes.sum,
                aggregationHideLabel: true,
            },
        ],
        enableSelectAll: true,
        exporterMenuAllData: false,        exporterCsvFilename: 'CertifiedResources.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "Certified Resources", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'CertifiedResources.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };


    $scope.toggleColumnFooter = function () {
        $scope.gridOptionsCertifiedRes.showColumnFooter = !$scope.gridOptionsCertifiedRes.showColumnFooter;
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
    };


    $scope.gridOptionsCertifiedRes.excessRows = 5000;
    $scope.CertifiedResourceData = {
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

    $scope.GetCertifiedData = function () {
        $http({
            method: "POST",
            url: "./CertifiedResources.aspx/GetCertifiedData",
            data: "",
            dataType: 'json',
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.CertifiedResourceData = d;
            }
            else {
                $scope.Message = "Record does not exists";
            }
        })
            .catch(function onError(error) {
            });

    }

    $scope.GetCertifiedData();

}).config(function ($httpProvider) {
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.post["Content-Type"] = "application/json; charset=utf-8";
});

