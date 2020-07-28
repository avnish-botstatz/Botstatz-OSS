var app = angular.module("BRscrumgrid", ["ngRoute", "ngFileUpload", "ui.grid", "ui.grid.grouping", "ui.grid.exporter", "ui.grid.selection", "ui.bootstrap"]);

app.controller("BRscrumctrl", ['$scope', '$http', '$filter', '$window', '$uibModal', 'uiGridConstants', 'Upload', function ($scope, $http, $filter, $window, $uibModal, uiGridConstants, Upload) {
    $scope.Subject = "";
    $scope.CreatedBy = "";
    $scope.AssignedTo = "";
    $scope.RaisedDate = "";
    $scope.Type = "";
    $scope.Description = "";

    $scope.BUData = {
        "data": []
    };
    $scope.FillBusinessUnit = function () {

        $http.post('../../../App/Reports/DailyScrumReport.aspx/GetBusinessUnit',
            {
                data:
                    {}
            }).then(function (response) {

                if (response.data.d.length > 0) {
                    var d = JSON.parse(response.data.d);
                    $scope.BUData = d;
                }
            }).catch(function onError(error) {
                console.log(error);
            });
        $scope.BUSelect = '0';
    }
    $scope.FillBusinessUnit();
    $scope.gridOptionsBRscrum = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'BRscrumData',
        columnDefs: [
            {
                field: 'txt_ProjectName',
                displayName: 'Project',
                grouping: { groupPriority: 1 },
                width:'20%',
                cellTemplate: '<div ng-if="!(row.groupHeader && col.grouping.groupPriority === row.treeLevel)" class="task-name project-width border-left-dark"><span class="dropdown-toggle d-block text-overflow" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="{{row.entity.txt_ProjectName}}">{{row.entity.txt_ProjectName}}</span><small class="board-no">{{row.entity.txt_ProjectCode}}</small></div>' + '<div class="task-name project-width ui-grid-cell-contents" ng-if="(row.groupHeader && col.grouping.groupPriority === row.treeLevel)"><div > {{grid.appScope.getValue(\'txt_ProjectName\', row.treeNode.children )}} </div></div>'
               
            },
            {
                field: 'txt_Title',
                displayName: 'Blocker/Risk',
                width: '20%',
                cellTemplate: '<div ng-if="!(row.groupHeader && col.grouping.groupPriority === row.treeLevel)" class="task-name project-width"><span ng-if="row.entity.Type!=null" ng-class="(row.entity.Type===\'Blocker\') ? \'block\' : \'risk\'">[{{row.entity.Type}}]</span><span style="cursor: pointer" ng-click="grid.appScope.GetBRIndivisualDetails(row.entity.txt_Title,row.entity.AssignedTo,row.entity.CreatedBy,row.entity.dtSubmittedDate,row.entity.Type,row.entity.txt_Description)">{{row.entity.txt_Title}}</span></div>' + '<div class="task-name project-width ui-grid-cell-contents" ng-if="(row.groupHeader && col.grouping.groupPriority === row.treeLevel)"><div > {{grid.appScope.getValue(\'txt_Title\', row.treeNode.children )}} </div></div>'
            },
            {
                field: 'AssignedTo',
                displayName: 'Assigned To',
                cellTemplate: '<div ng-if="row.entity.AssignedProfile!=null" class="ui-grid-cell-contents"><img src=\"{{row.entity.AssignedProfile}}\" class="setProfileImage" width="45" height="45" "/>&nbsp{{row.entity.AssignedTo}}<div>',
                cellClass: 'fontcentre'
            },
            {
                field: 'CreatedBy',
                displayName: 'Created By',
                cellTemplate: '<div ng-if="row.entity.CreatedProfile!=null"  class="ui-grid-cell-contents"><img src=\"{{row.entity.CreatedProfile}}\" class="setProfileImage" width="45" height="45" "/>&nbsp{{row.entity.CreatedBy}}<div>',
                cellClass: 'fontcentre'
            },
            {
                field: 'dtSubmittedDate', displayName: 'Raised Date', cellClass: 'text-center fontcentre',
                cellFilter: 'date:\'dd-MMM-yyyy\'',
                sortingAlgorithm: function (aDate, bDate) {
                    var a = new Date(aDate);
                    var b = new Date(bDate);
                    if (a < b) {
                        return -1;
                    }
                    else if (a > b) {
                        return 1;
                    }
                    else {
                        return 0;
                    }
                }
            },
            {
                field: 'TotalDays',
                displayName: 'Aging',
                cellTemplate: '<div ng-if="row.entity.TotalDays>=0 && row.entity.TotalDays<=20" style="background: linear-gradient(to right, rgba(214,250,8,1) 0%, rgba(187,199,122,1) 100%); padding: 10px;height:50px;">{{row.entity.TotalDays}}</div><div ng-if="row.entity.TotalDays > 20 && row.entity.TotalDays<80" style="background: linear-gradient(to right, rgba(241,231,103,1) 0%, rgba(254,182,69,1) 100%); padding: 10px;height:50px;">{{row.entity.TotalDays}}</div><div ng-if="row.entity.TotalDays>=80" style="background: linear-gradient(to right, rgba(255,163,102,1) 0%, rgba(255,110,66,1) 100%); padding: 10px;height:50px;">{{row.entity.TotalDays}}</div>',
                cellClass: 'text-center'
            },

        ],
        enableSelectAll: true,
        exporterMenuAllData: false,        exporterCsvFilename: 'BlockerRiskScrum.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "Blocker Risk Scrum", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'BlockerRiskScrum.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };
    $scope.gridOptionsBRscrum.excessRows = 100000;

    $scope.MessageBRscrum = "Please Wait....";
    $scope.BRscrumData = {
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
    $scope.GetBlockerRiskScrumTask = function () {

        $http({
            method: "POST",
            url: "../../../App/Reports/blockerriskdailyscrum.aspx/GetBlockerRiskData",
            dataType: 'json',
            data: { BUID: $scope.BUSelect },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            
            if (response1.data.d.length > 0) {
                var d = JSON.parse(response1.data.d);
                console.log("ad", d);
                if (d.length > 0) {
                    $scope.BRscrumData = d;
                }
                else {
                    $scope.BRscrumData = {
                        "data": []
                    };
                    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                    $scope.MessageBRscrum = "Record does not exists";
                }
            }
            else {
                $scope.BRscrumData = {
                    "data": []
                };
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                $scope.MessageBRscrum = "Record does not exists";
            }
        })
            .catch(function onError(error) {
            });
    }
    $scope.GetBlockerRiskScrumTask();
    $scope.GetBRIndivisualDetails = function (subject, assignedto, cretedby, raiseddate, type, desc) {
        $scope.Subject = subject;
        $scope.CreatedBy = assignedto;
        $scope.AssignedTo = cretedby;
        $scope.RaisedDate = $filter('date')(new Date(raiseddate), "dd-MMM-yyyy");;
        $scope.Type = type;
        $scope.Description = desc;
        document.getElementById("brNav").style.width = "40%";
    }
    $scope.CloseBRNav = function () { document.getElementById("brNav").style.width = "0" }
    $scope.getValue = function (field, treeRowEntity) {
        return treeRowEntity[0].row.entity[field] + ' (' + treeRowEntity.length + ')';
    };
}]);