
var app = angular.module("InitToolreportgrid", ["ngRoute", "ui.grid", "ui.grid.grouping", "ui.grid.exporter", "ui.grid.autoResize", "ui.bootstrap"]);
app.controller("InitToolreportCtrl", function ($scope, $http, $q, $window, uiGridConstants) {
    $scope.IsCurrency = "";
    $scope.Currency = "";
    $scope.gridOptionsInitToolReport = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'InitToolReportData',
        columnDefs: [
            {
                field: 'ProcessName',
                displayName: 'Process',
                cellTemplate: '<div class="task-name project-width border-left-dark"><div id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><div class= "text-overflow" title="{{row.entity.ProcessName}}" > {{ row.entity.ProcessName }}</div><small class="board-no">{{ row.entity.code }}</small></div>',

            },
            {
                field: 'txt_initiativeName',
                displayName: 'Initiative',
            },
            {
                field: 'txt_ToolName',
                displayName: 'Tool',
            },
            {
                field: 'Stage',
                displayName: 'Stage',
            },
            {
                field: 'AFTECostSaved',
                displayName: 'ROI'
            },
        ],
        enableSelectAll: true,
        exporterMenuAllData: false,        exporterCsvFilename: 'InitiativeToolReport.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "Initiative Tool Report", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'InitiativeToolReport.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };




    $scope.gridOptionsInitToolReport.excessRows = 5000;
    $scope.InitToolReportData = {
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

    $scope.GetInitiativeToolData = function () {
        $http({
            method: "POST",
            url: "./InitiativeToolReport.aspx/GetInitiativeToolReport",
            data: "",
            dataType: 'json',
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.InitToolReportData = d;
                $scope.Currency = d[0].Currency;
                $scope.IsCurrency = d[0].ISCurrency;

                if ($scope.IsCurrency == "1") {
                    $scope.gridOptionsInitToolReport.columnDefs[4].displayName = "ROI (" + $scope.Currency + ")";
                }
                else {
                    $scope.gridOptionsInitToolReport.columnDefs[4].displayName = "ROI (Hours)";
                }

                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
            }
            else {
                $scope.Message = "Record does not exists";
            }
        })
            .catch(function onError(error) {
            });

    }


    $scope.GetInitiativeToolData();

    $scope.GetChart = function () {
        $http.post('InitiativeToolReport.aspx/Get_LeaderBoardData2',
            {
                data:
                    {}
            }).then(function (response) {
                var result = response.data.d;
                console.log("test", result);
                $("#div_leadermain").empty();
                $("#leaderboardInitiative").tmpl(result).appendTo("#div_leadermain");
            });

        $http.post('InitiativeToolReport.aspx/Get_LeaderBoardTool',
            {
                data:
                    {}
            }).then(function (response) {
                var result = response.data.d;
                $("#div_leaderboardtool").empty();
                $("#leaderboardtool").tmpl(result).appendTo("#div_leaderboardtool");
            });
    }

    $scope.GetChart();

}).config(function ($httpProvider) {
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.post["Content-Type"] = "application/json; charset=utf-8";
});

