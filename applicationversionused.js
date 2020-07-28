
var app = angular.module("appversiongrid", ["ngRoute", "ui.grid", "ui.grid.grouping", "ui.grid.exporter", "ui.grid.autoResize", "ui.bootstrap"]);
app.controller("appversiongridctrl", function ($scope, $http, $q, $window, $uibModal) {

    var arworkformid = $window.location.search.substring(5);
    $scope.AREditSession = ($("#hdf_AREditsession").val().toString() == "0") ? false : true;
    console.log("test", $scope.AREditSession);
    if ($scope.AREditSession == "1") {
        $scope.IsEditable = true;
    }
    else {
        $scope.IsEditable = false;
    }
    $scope.tbx_productionversion = "";
    $scope.tbx_applicationname = "";
    $scope.tbx_UATVersion = "";
    $scope.tbx_UATVersion = "";
    $scope.tbx_comments = "";

    $scope.IsVisibleUpdate = false;
    $scope.IsVisibleAdd = true;

    $scope.globalappversionID = 0;
    $scope.gridOptionsApplication = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'AppversionData',
        columnDefs: [
            {
                field: 'txt_ApplicationName',
                displayName: 'Application Name',
                cellTemplate: '<div class="task-name project-width border-left-dark" style="cursor:pointer;"><div class="dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><div class="text-overflow" title="{{row.entity.txt_ApplicationName}}">{{row.entity.txt_ApplicationName}}</div></div><div class="dropdown-menu" ng-if="grid.appScope.AREditSession == 1" aria-labelledby="dropdownMenuButton1" style="width:10%;padding:9px;text-align:center"><a class="dropdown-item mb-2" ng-if="grid.appScope.AREditSession == 1" ng-click ="grid.appScope.getApplicationVersionDetails(row.entity.int_ARApplicationVersionID)" style="cursor:pointer;background-color:#0070bb;color:#fff">Edit</a><a class="dropdown-item mb-2" style="cursor:pointer; background-color:#e2445b;color:#fff" ng-if="grid.appScope.AREditSession == 1" ng-click="grid.appScope.open(row.entity.int_ARApplicationVersionID)">Delete</a></div></div>'
            },
            {
                field: 'txt_UATVersion',
                displayName: 'UAT Version',
            },
            {
                field: 'txt_ProductionVersion',
                displayName: 'Production Version',
            },
            {
                field: 'txt_Comments',
                displayName: 'Comments',
            },

        ],
        enableSelectAll: true,
        exporterMenuAllData: false,        exporterCsvFilename: 'Application&VersionUsed.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "Application and Version Used", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'Application&VersionUsed.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };

    $scope.gridOptionsApplication.excessRows = 5000;
    $scope.AppversionData = {
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


    $scope.getValue = function (field, treeRowEntity) {
        return treeRowEntity[0].row.entity[field] + ' (' + treeRowEntity.length + ')';
    };

    $scope.openAddNav = function () {
        document.getElementById("appNav").style.width = "50%";
        $scope.isvalidprodtbx = false;
        $scope.isvaliduattbx = false;
        $scope.isvalidapptbx = false;
        $scope.isvalidappselect = false;
        $scope.isvaliduatselect = false;
        $scope.isvalidprodselect = false;
        $scope.GetApplication();
    }

    $scope.CloseAddNav = function () {
        document.getElementById("appNav").style.width = "0%";
        $scope.ResetData();
        $scope.GetAppVersionData();
    }

    $scope.getApplicationDetails = function () {
        document.getElementById("appNav").style.width = "50%";
    }

    $scope.GetAppVersionData = function () {
        $http({
            method: "POST",
            url: "../../../App/Dashboard/AutomationRequest/ApplicationVersionUsed.aspx/GetApplicationVersionData",
            dataType: 'json',
            data: { arworkformid: arworkformid },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.AppversionData = d;
            }
            else {
                $scope.Message = "Record does not exists";
            }
        })
            .catch(function onError(error) {
            });

    }

    $scope.GetAppVersionData();


    //ApplicationBind
    $scope.ApplicationData = {
        "data": []
    };

    $scope.GetApplication = function () {
        $http.post('../../../App/Dashboard/AutomationRequest/ApplicationVersionUsed.aspx/GetApplication',
            {
                data:
                    {}
            }).then(function (response) {

                if (response.data.d.length > 0) {
                    var d = JSON.parse(response.data.d);
                    $scope.ApplicationData = d;
                }
            });
    }

    //Bind UAT Version
    $scope.GetUATVersion = function (applicationselect) {
        if (applicationselect != "-1" || applicationselect == undefined) {
            $scope.myValue = false;
        }
        else {
            $scope.myValue = true;
        }
        $scope.isvalidappselect = false;

        var post = $http({
            method: "POST",
            url: "../../../App/Dashboard/AutomationRequest/ApplicationVersionUsed.aspx/GetUATVersion",
            dataType: 'json',
            data: { appid: $scope.applicationselect },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.UATData = d;
            }
            else {
                $scope.UATData = "";
            }

        })
            .catch(function onError(error) {
            });
    }

    //Bind ProductionVersion
    $scope.GetProductionVersion = function (selectUAT) {
        if (selectUAT != "-1" || selectUAT == undefined) {
            $scope.myUAT = false;
        }
        else {
            $scope.myUAT = true;
        }
        $scope.isvaliduatselect = false;

        var post = $http({
            method: "POST",
            url: "../../../App/Dashboard/AutomationRequest/ApplicationVersionUsed.aspx/GetProductionVersion",
            dataType: 'json',
            data: { uat: $scope.applicationselect },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.ProductionData = d;
            }
            else {
                $scope.ProductionData = "";
            }
        })
            .catch(function onError(error) {
            });
    }

    //show production textbox
    $scope.ShowProductionTextbox = function (selectprod) {
        if (selectprod != "-1") {
            $scope.myprod = false;
        }
        else {
            $scope.myprod = true;
        }
        $scope.isvalidprodselect = false;
    }

    $scope.AddData = function () {
        var valid = false;
        if (($scope.applicationselect == -1 && $scope.tbx_applicationname == "") || $scope.applicationselect == undefined || $scope.applicationselect == "") {
            if ($scope.applicationselect == undefined || $scope.applicationselect == "") {
                $scope.isvalidappselect = true;
            }
            else {
                $scope.isvalidappselect = false;
            }
            if ($scope.tbx_applicationname == "") {
                $scope.isvalidapptbx = true;
            }
            else {
                $scope.isvalidapptbx = false;
            }
            valid=true;
        }

        if (($scope.selectUAT == -1 && $scope.tbx_UATVersion == "") || $scope.selectUAT == undefined || $scope.selectUAT == "") {
            if ($scope.selectUAT == undefined || $scope.selectUAT == "") {
                $scope.isvaliduatselect = true;
            }
            else {
                $scope.isvaliduatselect = false;
            }
            if ($scope.tbx_UATVersion == "") {
                $scope.isvaliduattbx = true;
            }
            else {
                $scope.isvaliduattbx = false;
            }
            valid = true;

        }

        if (($scope.selectprod == -1 && $scope.tbx_productionversion == "") || $scope.selectprod == undefined || $scope.selectprod == "") {
            if ($scope.selectprod == undefined || $scope.selectprod == "") {
                $scope.isvalidprodselect = true;
            }
            else {
                $scope.isvalidprodselect = false;
            }
            if ($scope.tbx_productionversion == "") {
                $scope.isvalidprodtbx = true;
            }
            else {
                $scope.isvalidprodtbx = false;
            }
            valid = true;

        }

        if (valid == true) {
            return false;
        }
        var post = $http({
            method: "POST",
            url: "../../../App/Dashboard/AutomationRequest/ApplicationVersionUsed.aspx/AddData",
            dataType: 'json',
            data: { appName: $scope.applicationselect, uatversion: $scope.selectUAT, prodversion: $scope.selectprod, comments: $scope.tbx_comments, arworkformid: arworkformid, appNameText: $scope.tbx_applicationname, uatversionText: $scope.tbx_UATVersion, prodversionText: $scope.tbx_productionversion },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = response1.data.d;
            if (d == "OnSuccess") {

                $scope.GetAppVersionData();
                $scope.CloseAddNav();
                $scope.ResetData();
                toastr.success('Application version added successfully.');
            }
        })
            .catch(function onError(error) {
            });
    };

    $scope.ResetData = function () {
        $scope.applicationselect = '';
        $scope.tbx_applicationname = '';
        $scope.selectUAT = '';
        $scope.tbx_UATVersion = '';
        $scope.selectprod = '';
        $scope.tbx_productionversion = '';
        $scope.tbx_comments = '';
        $scope.myprod = false;
        $scope.myUAT = false;
        $scope.myValue = false;
        $scope.IsVisibleUpdate = false;
        $scope.IsVisibleAdd = true;
        $scope.isvalidprodtbx = false;
        $scope.isvaliduattbx = false;
        $scope.isvalidapptbx = false;
        $scope.isvalidappselect = false;
        $scope.isvaliduatselect = false;
        $scope.isvalidprodselect = false;
    }

    $scope.getApplicationVersionDetails = function (applicationversionID) {
        $scope.globalappversionID = applicationversionID;
        var post = $http({
            method: "POST",
            url: "../../../App/Dashboard/AutomationRequest/ApplicationVersionUsed.aspx/GetApplicationVersionDetails",
            dataType: 'json',
            data: { applicationversionID: applicationversionID },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.IsVisibleUpdate = true;
                $scope.IsVisibleAdd = false;
                $scope.GetApplication();
                $scope.applicationselect = d[0].txt_ApplicationName;
                $scope.GetUATVersion();
                $scope.selectUAT = d[0].txt_UATVersion;
                $scope.GetProductionVersion();
                $scope.selectprod = d[0].txt_ProductionVersion;
                $scope.tbx_comments = d[0].txt_Comments;
                document.getElementById("appNav").style.width = "50%";
            }
        })
    }

    $scope.UpdateData = function () {

        var valid = false;
        if (($scope.applicationselect == -1 && $scope.tbx_applicationname == "") || $scope.applicationselect == undefined || $scope.applicationselect == "") {
            if ($scope.applicationselect == undefined || $scope.applicationselect == "") {
                $scope.isvalidappselect = true;
            }
            else {
                $scope.isvalidappselect = false;
            }
            if ($scope.tbx_applicationname == "") {
                $scope.isvalidapptbx = true;
            }
            else {
                $scope.isvalidapptbx = false;
            }
            valid = true;
        }

        if (($scope.selectUAT == -1 && $scope.tbx_UATVersion == "") || $scope.selectUAT == undefined || $scope.selectUAT == "") {
            if ($scope.selectUAT == undefined || $scope.selectUAT == "") {
                $scope.isvaliduatselect = true;
            }
            else {
                $scope.isvaliduatselect = false;
            }
            if ($scope.tbx_UATVersion == "") {
                $scope.isvaliduattbx = true;
            }
            else {
                $scope.isvaliduattbx = false;
            }
            valid = true;

        }

        if (($scope.selectprod == -1 && $scope.tbx_productionversion == "") || $scope.selectprod == undefined || $scope.selectprod == "") {
            if ($scope.selectprod == undefined || $scope.selectprod == "") {
                $scope.isvalidprodselect = true;
            }
            else {
                $scope.isvalidprodselect = false;
            }
            if ($scope.tbx_productionversion == "") {
                $scope.isvalidprodtbx = true;
            }
            else {
                $scope.isvalidprodtbx = false;
            }
            valid = true;

        }

        if (valid == true) {
            return false;
        }

        var post = $http({
            method: "POST",
            url: "../../../App/Dashboard/AutomationRequest/ApplicationVersionUsed.aspx/UpdateData",
            dataType: 'json',
            data: { appName: $scope.applicationselect, uatversion: $scope.selectUAT, prodversion: $scope.selectprod, comments: $scope.tbx_comments, arworkformid: arworkformid, appNameText: $scope.tbx_applicationname, uatversionText: $scope.tbx_UATVersion, prodversionText: $scope.tbx_productionversion, appversionID: $scope.globalappversionID },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = response1.data.d;
            if (d == "OnSuccess") {

                $scope.GetAppVersionData();
                $scope.CloseAddNav();
                $scope.ResetData();
                $scope.IsVisibleUpdate = false;
                $scope.IsVisibleAdd = true;
                toastr.success('Application version updated successfully.');
            }
        })
            .catch(function onError(error) {
            });
    }

    

    $scope.ApplicationTextBoxChange = function (tbx_applicationname) {
        if (tbx_applicationname != "") {
            $scope.isvalidapptbx = false;
        }
        else {
            $scope.isvalidapptbx = true;
        }
    }

    $scope.UATTextBoxChange = function (tbx_UATVersion) {
        if (tbx_UATVersion != "") {
            $scope.isvaliduattbx = false;
        }
        else {
            $scope.isvaliduattbx = true;
        }
    }

    $scope.ProductionTextBoxChange = function (tbx_productionversion) {
        if (tbx_productionversion != "") {
            $scope.isvalidprodtbx = false;
        }
        else {
            $scope.isvalidprodtbx = true;
        }
    }

    $scope.Next = function () {
        console.log("alert");
        $window.location.href = 'EstimationCost?key=' + Request.QueryString["key"] + "&Key3=" + Request.QueryString["key3"];
    }

    $scope.open = function (applicationid) {
        var modalInstance = $uibModal.open({            template: '<div class="modal-body"><h4>Are you sure want to delete it?</h4></div><div class="modal-footer"><button class="btn btn-default" ng-click="ok()">Yes</button><button class="btn btn-default gray" ng-click="cancel()">No</button></div>',            controller: "DeleteModalContentCtrl",            size: '',        });        modalInstance.result.then(function (response) {            $scope.DeleteAppData(applicationid); //Call delete function        });

        $scope.DeleteAppData = function (applicationid) {
            var post = $http({
                method: "POST",
                url: "../../../App/Dashboard/AutomationRequest/ApplicationVersionUsed.aspx/DeleteData",
                dataType: 'json',
                data: { applicationid: applicationid },
                headers: { "Content-Type": "application/json" }
            }).then(function (response1) {
                var d = response1.data.d;
                if (d == "OnSuccess") {
                    $scope.GetAppVersionData();
                    $scope.CloseAddNav();
                    $scope.ResetData();
                    $scope.IsVisibleUpdate = false;
                    $scope.IsVisibleAdd = true;
                    toastr.success('Application version deleted successfully.');
                }
            })
                .catch(function onError(error) {
                });
        }


       
    }

}).config(function ($httpProvider) {
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.post["Content-Type"] = "application/json; charset=utf-8";
});


app.controller('DeleteModalContentCtrl', function ($scope, $uibModalInstance) {

    $scope.ok = function () {
        $uibModalInstance.close("Yes");
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    }

});