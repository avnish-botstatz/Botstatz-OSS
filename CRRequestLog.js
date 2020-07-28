var app = angular.module('CRAuditApp', ["ngRoute", "ui.grid", "ui.grid.grouping", "ui.grid.exporter", "ui.grid.autoResize", "ui.bootstrap"])
app.controller('CRAuditController', function ($scope, $http, $window, $location) {

    $scope.AuditTrailGrid = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'AuditTrailData',
        columnDefs: [
            {
                field: 'ActivityLogID',
                displayName: 'ID',
                cellClass: 'text-center fontcentre',
                visible: false
            },
            {
                field: 'Name',
                
                displayName: 'User Name',
                cellClass: 'text-center fontcentre',
                name: "UserName",
                cellTemplate: '<div class="task-name project-width dropdown"><span class="dropdown-toggle d-block" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{row.entity.Name}}</span><small class="board-no"></small><div class="dropdown-menu" style="width: auto !important;" aria-labelledby="dropdownMenuButton"><div ng-if="(row.entity.comment)"><a class="dropdown-item" ng-click="grid.appScope.openComment(row.entity.comment)">View Comment</a></div></div></div>'
            },
            {
                field: 'Action',
                
                displayName: 'Action',
                cellClass: 'text-center fontcentre',
                name: "Action",
            },
            {
                field: 'AccessTime',
                displayName: 'Access Time',
                cellClass: 'text-center fontcentre'
            },
            
        ],

        enableSelectAll: true,
        exporterMenuAllData: false,        exporterCsvFilename: 'ARAuditTrail.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "Operation Room", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'ARAuditTrail.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };
    $scope.AuditTrailGrid.excessRows = 100000;
    $scope.AuditTrailData = {
        "data": []
    };
    $scope.Messageoproom = "Please Wait....";
    $scope.expandAll = function () {
        $scope.gridApi.treeBase.expandAllRows();

    };

    $scope.toggleRow = function (rowNum) {
        $scope.gridApi.treeBase.toggleRowTreeState($scope.gridApi.grid.renderContainers.body.visibleRowCache[rowNum]);
    };

    $scope.changeGrouping = function () {
        $scope.gridApi.grouping.clearGrouping();
    };
    var queryString = new Array();
    if ($window.location.search.split('?').length > 1) {
        var params = $window.location.search.split('?')[1].split('&');
        for (var i = 0; i < params.length; i++) {
            var key = params[i].split('=')[0];
            var value = decodeURIComponent(params[i].split('=')[1]);
            queryString[key] = value;
        }
    }
    $scope.openComment = function (comment) {
        console.log("comment:", comment);
        $scope.CommentText = comment;
        document.getElementById("div_Comment").style.width = "50%";
    }
    $scope.CloseCommentrBox = function () {
        $scope.CommentText = '';
        document.getElementById("div_Comment").style.width = "0";
    }
    
    
    $scope.ARkey = null;
    if (queryString["key"] != null) {
        $scope.ARkey = queryString["key"];
        //$scope.url = $location.protocol() + '://' + location.host + '/app/Dashboard/AutomationRequest/WebServices/AuditTrailServices.asmx/GetAuditTrailData'
        //console.log("url", $location.protocol());
        $scope.GetTransaction = function () {
            $http({
                method: 'POST',
                url: 'Requestlog.aspx/binddata',
                dataType: 'json',
                data: { ARID: $scope.ARkey },
                headers: { "Content-Type": "application/json" },
                async: false
            }).then(function (response) {
                var d = [];
                if (response.data.d.length > 0) {
                    d = JSON.parse(response.data.d);
                    console.log("processDetails", d);
                    $scope.AuditTrailData = d.RequestLog;
                } else {
                    $scope.Messageoproom = "Record does not exists";
                }

            }).catch(function (data, status) {
                console.log(data);
            });
        }
    } else
        $scope.Messageoproom = "Record does not exists";

    $scope.GetTransaction();
});  