var app = angular.module("AccessControlgridApp", ["ngRoute", "ui.grid", "ui.grid.grouping", "ui.grid.exporter", "ui.grid.autoResize", "ui.bootstrap"]);
app.controller("AccessControlctrl", function ($scope, $http, $q, $window, $uibModal, $filter, uiGridConstants) {
    $scope.EditAccess = ($("#hdf_EditAccess").val().toString() == "0") ? false : true;
    $scope.DeleteAccess = ($("#hdf_DeleteAccess").val().toString() == "0") ? false : true;
    console.log($scope.DeleteAccess);
    $scope.gridOptionsAccess = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'AccessData',
        columnDefs: [

            {
                field: 'txt_RoleName',
                displayName: 'Role Name',
                width: '30%',
                cellTemplate: '<div class="task-name project-width border-left-dark" style="cursor:pointer;"><div class= "dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><div>{{row.entity.txt_RoleName}}</div></div><div ng-if="grid.appScope.EditAccess==1 || grid.appScope.DeleteAccess==1" class="dropdown-menu" aria-labelledby="dropdownMenuButton1" style="width:10%;padding:9px;text-align:center"><a ng-if="grid.appScope.EditAccess==1" class="dropdown-item mb-2" style="cursor:pointer; background-color:#0070bb;color:#fff" ng-click="grid.appScope.EditAccessRole(row.entity.IDkey)">Edit</a><a ng-show="grid.appScope.DeleteAccess" class="dropdown-item mb-2" style="cursor:pointer; background-color:#e2445b;color:#fff" ng-click="grid.appScope.openmodal(row.entity.int_RoleID)">Delete</a></div></div>'
            },
            {
                field: 'TotalModuleAccess',
                displayName: '',
                cellTemplate: '<div class="row"><div class="col-xl-6"><div class="circle-content ml-2"><span class="content-under">Modules Assigned to </span><span class="float-right numbers-round">{{row.entity.TotalModuleAccess}}</span></div></div><div class="col-xl-6"><div class="circle-content color-purple mr-2"> <span class="content-under">Number of Members </span><span class="float-right numbers-round">{{row.entity.UserTotal}}</span></div></div></div>'
                
            },
            {
                field: 'dt_CreatedDate', displayName: 'Created Date', cellClass: 'text-center fontcentre',
                cellFilter: 'date:\'dd-MMM-yyyy | hh:mm\'', width:200,
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
        ],
        enableSelectAll: true,

        exporterMenuAllData: false,        exporterCsvFilename: 'AccessRights.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "Access Control", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'AccessRights.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };
    $scope.gridOptionsAccess.excessRows = 100000;

    $scope.MessageAccess = "Please Wait....";
    $scope.AccessData = {
        "data": []
    };

    //BU Grid Bind Function
    $scope.getAccessData = function () {

        $http.post('default.aspx/GetAccessControl',
            {
                data:
                    {}
            }).then(function (response) {
                console.log(response);
                if (response.data.d.length > 0) {
                 
                    var d = JSON.parse(response.data.d);
                    $scope.AccessData = d;
                }
                else {
                    $scope.AccessData = {
                        "data": []
                    };
                    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                    $scope.MessageAccess = "Record does not exists";
                }
            }).catch(function onError(error) {
                console.log(error);
            });

    }

    //BU Grid Bind Function End

    $scope.getAccessData(); //Call Bu Binddata
    $scope.EditAccessRole = function (key) {
        $window.location.href = 'manageaccesscontrol?key=' + key;
    }
    $scope.getValue = function (field, treeRowEntity) {
        return treeRowEntity[0].row.entity[field] + ' (' + treeRowEntity.length + ')';
    }
    $scope.openmodal = function (ID) {        var modalInstance = $uibModal.open({            template: '<div class="modal-body"><h4>Are you sure want to delete it?</h4></div><div class="modal-footer"><button class="btn btn-default" ng-click="ok()">Yes</button><button class="btn btn-default gray" ng-click="cancel()">No</button></div>',            controller: "ModalContentCtrl",            size: '',        });        modalInstance.result.then(function (response) {            $scope.DeleteAccess(ID);        });    };
    $scope.DeleteAccess = function (id) {

        $http({
            method: "POST",
            url: "default.aspx/DeleteData",
            dataType: 'json',
            data: { ID: id },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            if (response1.data.d.length > 0) {
                var d = response1.data.d
                if (d =="Success")
                    toastr.success('Role deleted successfully.');
                else
                    toastr.error(d);
                $scope.getAccessData();
            }
        }).catch(function onError(error) {
        });
    }
});

app.controller('ModalContentCtrl', function ($scope, $uibModalInstance) {

    $scope.ok = function () {
        $uibModalInstance.close("Yes");
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    }
});