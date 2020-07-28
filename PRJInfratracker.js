
var app = angular.module("infratrackerapp", ["ngRoute", "ngFileUpload", "ui.grid", "ui.grid.grouping", "ui.grid.exporter", "ui.grid.autoResize", "ui.bootstrap", "ui.grid.resizeColumns"]);


app.controller("infratrackergridctrl", ['$scope', '$http', '$q', '$window', '$uibModal', 'Upload', function ($scope, $http, $q, $window, $uibModal, Upload) {

    var ProjectID = $window.location.search.substring(5);
    //$scope.SessionUserID = $("#hdf_SessionuserID").val().toString();
    $scope.loading = false;
    $scope.IsVisibleUpdate = false;
    $scope.IsVisibleAdd = true;
    $scope.IsVisibleAddHardware = true;
    $scope.IsVisibleUpdateHardware = false;
    $scope.IsApplicationGrid = true;
    $scope.IsHardwareGrid = false;
    $scope.IsAddAccess = false;
    $scope.tbx_productionversion = "";
    $scope.tbx_applicationname = "";
    $scope.tbx_UATVersion = "";
    $scope.tbx_UATVersion = "";
    $scope.tbx_comments = "";

    $scope.globalappversionID = 0;

    $scope.gridOptionsApplication = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        enableColumnResizing: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'ApplicationData',
        columnDefs: [
            {
                field: 'txt_ApplicationName',
                displayName: 'Application Name',
                cellTemplate: '<div class="task-name project-width border-left-dark" style="cursor:pointer;"><div class="dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><div class="text-overflow" title="{{row.entity.txt_ApplicationName}}">{{row.entity.txt_ApplicationName}}</div></div><div class="dropdown-menu" aria-labelledby="dropdownMenuButton1" ng-if="row.entity.InfratrackerEdit!=0" style="width:10%;padding:9px;text-align:center"><a class="dropdown-item mb-2" ng-if="row.entity.InfratrackerEdit!=0"  ng-click ="grid.appScope.getApplicationDetails(row.entity.int_ProjectApplicationVersionID,\'Application\')" style="cursor:pointer;background-color:#0070bb;color:#fff">Edit</a><a class="dropdown-item mb-2" style="cursor:pointer; background-color:#e2445b;color:#fff" ng-if="row.entity.InfratrackerEdit!=0" ng-click="grid.appScope.open(row.entity.int_ProjectApplicationVersionID,\'Application\')">Delete</a></div></div>'
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
        exporterMenuAllData: false,        exporterCsvFilename: 'ApplicationDependancy.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "Application Dependancy", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'ApplicationDependancy.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };

    $scope.gridOptionsApplication.excessRows = 5000;
    $scope.ApplicationData = {
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

    $scope.GetApplicationDependecyData = function () {
        $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/Infratracker.aspx/GetApplicationData",
            data: { projectID: ProjectID },
            dataType: 'json',
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                if (d[0].InfratrackerAdd != 0) $scope.IsAddAccess = true;
                $scope.ApplicationData = d;
            }
            else {
                $scope.IsAddAccess = true;
                $scope.Message = "Record does not exists";
            }
        })
            .catch(function onError(error) {
            });

    }

    $scope.GetApplicationDependecyData();


    $scope.gridOptionsHardware = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        enableColumnResizing: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'HardwareData',
        columnDefs: [
            {
                field: 'txt_OSVersion',
                displayName: 'OS Version',
                cellTemplate: '<div class="task-name project-width border-left-dark" style="cursor:pointer;"><div class="dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true"><div class="text-overflow" title="{{row.entity.txt_OSVersion}}">{{row.entity.txt_OSVersion}}</div></div><div class="dropdown-menu" aria-labelledby="dropdownMenuButton1" ng-if="row.entity.InfratrackerEdit!=0" style="width:10%;padding:9px;text-align:center"><a class="dropdown-item mb-2"  ng-click ="grid.appScope.getApplicationDetails(row.entity.int_ProjectHardwareVersionID,\'Hardware\')"  style="cursor:pointer;background-color:#0070bb;color:#fff">Edit</a><a class="dropdown-item mb-2" style="cursor:pointer; background-color:#e2445b;color:#fff" ng-click="grid.appScope.open(row.entity.int_ProjectHardwareVersionID,\'Hardware\')">Delete</a></div></div>'
            },
            {
                field: 'int_NoOfSystems',
                displayName: 'No.of Systems',
            },
            {
                field: 'BotRunnerStatus',
                displayName: 'Bot Runner',
            },
            {
                field: 'txt_Comments',
                displayName: 'Comments',
            },
        ],
        enableSelectAll: true,
        exporterMenuAllData: false,        exporterCsvFilename: 'HardwareData.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "Hardware Dependancy", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'HardwareData.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };

    $scope.gridOptionsHardware.excessRows = 5000;
    $scope.HardwareData = {
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

    $scope.GetHardwareDependencyData = function () {
        $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/Infratracker.aspx/GetHardwareDependecyData",
            data: { projectID: ProjectID },
            dataType: 'json',
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                if (d[0].InfratrackerAdd != 0) $scope.IsAddAccess = true;
                $scope.HardwareData = d;
            }
            else {
                $scope.IsAddAccess = true;
                $scope.Message = "Record does not exists";
            }
        })
            .catch(function onError(error) {
            });

    }

    $scope.GetHardwareDependencyData();

    $scope.ShowTab = function (type) {
        console.log("type", type);
        if (type == "Application") {
            $scope.IsApplicationGrid = true;
            $scope.IsHardwareGrid = false;
            $scope.GetApplicationDependecyData();
        }
        else {
            $scope.IsApplicationGrid = false;
            $scope.IsHardwareGrid = true;
            $scope.GetHardwareDependencyData();
        }
    }
    $scope.AddHardwareData = function () {
        var post = $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/InfraTracker.aspx/AddHardwareData",
            dataType: 'json',
            data: { osversion: $scope.txt_OSVersion, noofsystem: $scope.txt_NoOfSystem, botrunner: $scope.chkselect, comments: $scope.tbx_Hardcomments, projectid: ProjectID },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = response1.data.d;
            if (d == "OnSuccess") {
                $scope.GetHardwareDependencyData();
                $scope.CloseNav('Hardware');
                $scope.ResetHardwareData();
                toastr.success('Hardware dependency added successfully.');
            }
        })
            .catch(function onError(error) {
            });
    };

    $scope.UpdateHardwareData = function () {
        var post = $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/InfraTracker.aspx/UpdateHardwareData",
            dataType: 'json',
            data: { hardwareversionid: $scope.globalappversionID, osversion: $scope.txt_OSVersion, noofsystem: $scope.txt_NoOfSystem, botrunner: $scope.chkselect, comments: $scope.tbx_Hardcomments, projectid: ProjectID },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = response1.data.d;
            if (d == "OnSuccess") {
                $scope.GetHardwareDependencyData();
                $scope.CloseNav('Hardware');
                $scope.ResetHardwareData();

                toastr.success('Hardware dependency updated successfully.');
            }
        })
            .catch(function onError(error) {
            });
    };

    $scope.GetHardwareDetails = function () {
        var post = $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/InfraTracker.aspx/GetHardwareVersionDetails",
            dataType: 'json',
            data: { hardwareversinId: applicationversionID },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            console.log("d", d);
            if (d.length > 0) {
                $scope.IsVisibleUpdateHardware = true;
                $scope.IsVisibleAddHardware = false;
                $scope.txt_OSVersion = '';
                $scope.txt_NoOfSystem = '';
                $scope.chkselect = '';
                $scope.tbx_Hardcomments = '';
                $scope.txt_OSVersion = d[0].txt_OSVersion;
                $scope.txt_NoOfSystem = d[0].int_NoOfSystems;
                $scope.chkselect = d[0].bit_IsBotRunner;
                $scope.tbx_Hardcomments = d[0].txt_Comments;
                document.getElementById("hardwareNav").style.width = "50%";
            }
        })
    }

    $scope.openNav = function (type) {
        if (type == "Application") {
            document.getElementById("appNav").style.width = "50%";
            $scope.isvalidprodtbx = false;
            $scope.isvaliduattbx = false;
            $scope.isvalidapptbx = false;
            $scope.isvalidappselect = false;
            $scope.isvaliduatselect = false;
            $scope.isvalidprodselect = false;
            $scope.GetApplication();
        }
        else {
            document.getElementById("hardwareNav").style.width = "50%";
            ResetHardwareData();
        }
    }


    $scope.CloseNav = function (type) {
        if (type == "Application") {
            document.getElementById("appNav").style.width = "0%";
        }
        else {
            document.getElementById("hardwareNav").style.width = "0%";
        }
    }

    $scope.GetApplication = function () {
        $http.post('../../../App/Dashboard/AutomationRequest/ApplicationVersionUsed.aspx/GetApplication',
            {
                data:
                    {}
            }).then(function (response) {

                if (response.data.d.length > 0) {
                    var d = JSON.parse(response.data.d);
                    $scope.ApplicationDropdownData = d;
                    console.log("drop", $scope.ApplicationDropdownData);

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
            url: "../../../App/Dashboard/ProjectANG/InfraTracker.aspx/AddData",
            dataType: 'json',
            data: { appName: $scope.applicationselect, uatversion: $scope.selectUAT, prodversion: $scope.selectprod, comments: $scope.tbx_comments, projectid: ProjectID, appNameText: $scope.tbx_applicationname, uatversionText: $scope.tbx_UATVersion, prodversionText: $scope.tbx_productionversion },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = response1.data.d;
            if (d == "OnSuccess") {

                $scope.GetApplicationDependecyData();
                $scope.CloseNav('Application');
                $scope.ResetAppData();
                toastr.success('Application dependency added successfully.');
            }
        })
            .catch(function onError(error) {
            });
    };

    $scope.ResetAppData = function () {
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

    $scope.ResetHardwareData = function () {
        $scope.txt_OSVersion = '';
        $scope.txt_NoOfSystem = '';
        $scope.chkselect = '';
        $scope.tbx_Hardcomments = '';
    }

    $scope.getApplicationDetails = function (applicationversionID, type) {
        $scope.globalappversionID = applicationversionID;
        if (type == "Application") {
            var post = $http({
                method: "POST",
                url: "../../../App/Dashboard/ProjectANG/InfraTracker.aspx/GetApplicationVersionDetails",
                dataType: 'json',
                data: { applicationversionID: applicationversionID },
                headers: { "Content-Type": "application/json" }
            }).then(function (response1) {

                var d = JSON.parse(response1.data.d);
                console.log("d", d);
                if (d.length > 0) {
                    $scope.IsVisibleUpdate = true;
                    $scope.IsVisibleAdd = false;
                    $scope.GetApplication();
                    $scope.applicationselect = d[0].txt_ApplicationName;
                    $scope.GetUATVersion();
                    $scope.selectUAT = d[0].txt_UATVersion.toString();
                    $scope.GetProductionVersion();
                    $scope.selectprod = d[0].txt_ProductionVersion.toString();
                    $scope.tbx_comments = d[0].txt_Comments;
                    document.getElementById("appNav").style.width = "50%";
                }
            })
        }
        else {
            var post = $http({
                method: "POST",
                url: "../../../App/Dashboard/ProjectANG/InfraTracker.aspx/GetHardwareVersionDetails",
                dataType: 'json',
                data: { hardwareversinId: applicationversionID },
                headers: { "Content-Type": "application/json" }
            }).then(function (response1) {

                var d = JSON.parse(response1.data.d);
                console.log("d", d);
                if (d.length > 0) {
                    $scope.IsVisibleUpdateHardware = true;
                    $scope.IsVisibleAddHardware = false;
                    $scope.txt_OSVersion = '';
                    $scope.txt_NoOfSystem = '';
                    $scope.chkselect = '';
                    $scope.tbx_Hardcomments = '';
                    $scope.txt_OSVersion = d[0].txt_OSVersion;
                    $scope.txt_NoOfSystem = d[0].int_NoOfSystems;
                    $scope.chkselect = d[0].bit_IsBotRunner;
                    $scope.tbx_Hardcomments = d[0].txt_Comments;
                    document.getElementById("hardwareNav").style.width = "50%";
                }
            })
        }

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
            url: "../../../App/Dashboard/ProjectANG/InfraTracker.aspx/UpdateData",
            dataType: 'json',
            data: { appName: $scope.applicationselect, uatversion: $scope.selectUAT, prodversion: $scope.selectprod, comments: $scope.tbx_comments, projectid: ProjectID, appNameText: $scope.tbx_applicationname, uatversionText: $scope.tbx_UATVersion, prodversionText: $scope.tbx_productionversion, appversionID: $scope.globalappversionID },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = response1.data.d;
            if (d == "OnSuccess") {

                $scope.GetApplicationDependecyData();
                $scope.CloseNav('Application');
                $scope.ResetAppData();
                $scope.IsVisibleUpdate = false;
                $scope.IsVisibleAdd = true;
                toastr.success('Application dependency updated successfully.');
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

    $scope.open = function (applicationid, type) {
        var modalInstance = $uibModal.open({            template: '<div class="modal-body"><h4>Are you sure want to delete it?</h4></div><div class="modal-footer"><button class="btn btn-default" ng-click="ok()">Yes</button><button class="btn btn-default gray" ng-click="cancel()">No</button></div>',            controller: "DeleteModalContentCtrl",            size: '',        });        modalInstance.result.then(function (response) {            if (type == "Application") {
                $scope.DeleteAppData(applicationid); //Call delete function            }            else {                $scope.DeleteHardwareData(applicationid); //Call delete function            }        });

        $scope.DeleteAppData = function (applicationid) {
            var post = $http({
                method: "POST",
                url: "../../../App/Dashboard/ProjectANG/InfraTracker.aspx/DeleteData",
                dataType: 'json',
                data: { applicationid: applicationid },
                headers: { "Content-Type": "application/json" }
            }).then(function (response1) {
                var d = response1.data.d;
                if (d == "OnSuccess") {
                    $scope.GetApplicationDependecyData();
                    $scope.CloseNav('Application');
                    $scope.ResetAppData();
                    $scope.IsVisibleUpdate = false;
                    $scope.IsVisibleAdd = true;
                    toastr.success('Application dependency deleted successfully.');
                }
            })
                .catch(function onError(error) {
                });
        }

        $scope.DeleteHardwareData = function (applicationid) {
            var post = $http({
                method: "POST",
                url: "../../../App/Dashboard/ProjectANG/InfraTracker.aspx/DeleteHardwareData",
                dataType: 'json',
                data: { hardwareid: applicationid },
                headers: { "Content-Type": "application/json" }
            }).then(function (response1) {
                var d = response1.data.d;
                if (d == "OnSuccess") {
                    $scope.GetHardwareDependencyData();
                    $scope.CloseNav('Application');
                    $scope.ResetAppData();
                    $scope.IsVisibleUpdate = false;
                    $scope.IsVisibleAdd = true;
                    toastr.success('Hardware dependency deleted successfully.');
                }
            })
                .catch(function onError(error) {
                });
        }
    }
}]);

app.controller('DeleteModalContentCtrl', function ($scope, $uibModalInstance) {

    $scope.ok = function () {
        $uibModalInstance.close("Yes");
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    }

});




