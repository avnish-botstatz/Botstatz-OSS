var app = angular.module("PRJcostEstimationgrid", ["ngRoute", "ui.grid", "ui.grid.grouping", "ui.grid.exporter", "ui.grid.autoResize", "ui.bootstrap"]);
app.directive("jqdatepicker", function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function link(scope, element, attrs, controller) {
            var date, otherDate;
            element.datepicker({
                dateFormat: "dd-MM-yy",
                onSelect: function (dt) {
                    scope.$apply(function () {
                        controller.$setViewValue(dt);
                        scope.$apply();
                    });
                },
            });

            scope.$watch(attrs.dateAfter, function (value) {

                otherDate = value;
                validate();
            });
            scope.$watch(attrs.ngModel, function (value) {

                date = value;
                validate();
            });
            function validate() {
                controller.$setValidity('dateAfter', !date || !otherDate || new Date(date) >= new Date(otherDate));
            }
        }
    };
});
app.controller("PRJcostEstimationctrl", function ($scope, $http, $q, $window, $uibModal, $filter, uiGridConstants) {
    var ProjectIDQS = $window.location.search.substring(5); //GetQueryString
    $scope.CheckAddAccess = ($("#hdf_addaccess").val().toString() == "0") ? false : true;
    $scope.CheckEditAccess = $("#hdf_editaccess").val();
    $scope.CheckDeleteAccess = $("#hdf_deleteaccess").val();
    $scope.IsVisibleLCUpdate = false;
    $scope.IsVisibleLCAdd = true;
    $scope.IsVisibleICUpdate = false;
    $scope.IsVisibleICAdd = true;
    $scope.LicenseInfraID = "0";
    $scope.IsVisibleMCUpdate = false;
    $scope.IsVisibleMCAdd = true;

    $scope.PMCostID = "0";

    $scope.PreviousStoredDate = "";
    $scope.gridOptionsPRJCost = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'PRJCostData',
        columnDefs: [

            {
                field: 'Component',
                displayName: 'Component',
                cellTemplate: '<div class="task-name project-width border-left-dark" style="cursor:pointer;"><div class= "dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><div>{{row.entity.Component}}</div></div><div class="dropdown-menu" aria-labelledby="dropdownMenuButton1" style="width:10%;padding:9px;text-align:center"><a class="dropdown-item mb-2" style="cursor:pointer; background-color:#0070bb;color:#fff" ng-click="grid.appScope.OpenBuildCost(row.entity.Component)" >Edit Cost</a></div></div>'
            },
            {
                field: 'Cost',
                displayName: 'Cost/Year',
                cellClass: 'text-center fontcentre'
            },

        ],
        enableSelectAll: true,
        exporterMenuAllData: false,        exporterCsvFilename: 'ProjectCostComponent.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "Project Cost Component", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'ProjectCostComponent.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };
    $scope.gridOptionsPRJCost.excessRows = 100000;

    $scope.MessagePRJCost = "Please Wait....";
    $scope.PRJCostData = {
        "data": []
    };

    //Cost Grid Bind Function
    $scope.GetCostData = function () {
        $scope.TotalCost = 0;
        $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/ProjectEstimation.aspx/GetCostData",
            dataType: 'json',
            data: { ProjectID: ProjectIDQS },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = JSON.parse(response1.data.d);
            console.log("ASd", d);
            if (d.length > 0) {
                $scope.PRJCostData = d;
                for (var i = 0; i < $scope.PRJCostData.length; i++) {
                    var item = $scope.PRJCostData[i];
                    $scope.TotalCost += parseInt(item.Cost);
                }
                $scope.TotalCost = $scope.PRJCostData[0].currency + ' ' + $scope.TotalCost;
            }
            else {
                $scope.MessagePRJCost = "Record does not exists";
            }
        })
            .catch(function onError(error) {
            });
    }
    $scope.GetCostData();
    //License Cost

    $scope.utilization = 100;
    $scope.gridOptionsLicense = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'LicenseData',
        columnDefs: [
            {
                field: 'txt_License',
                displayName: 'License',
                cellTemplate: '<div class="task-name project-width border-left-dark" style="cursor:pointer;"><div class= "dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria - haspopup="true" aria-expanded="false"><div class="text-overflow" title="{{row.entity.txt_License}}">{{row.entity.txt_License}}</div></div><div ng-if="grid.appScope.CheckEditAccess==1 || grid.appScope.CheckDeleteAccess==1" class="dropdown-menu" aria-labelledby="dropdownMenuButton1" style="width:10%;padding:9px;text-align:center"><a ng-if="grid.appScope.CheckEditAccess==1" class="dropdown-item mb-2" style="cursor:pointer; background-color:#0070bb;color:#fff" ng-click="grid.appScope.getLicenseEditData(row.entity.int_ProjectLicenseCostID)">Edit</a><a ng-if="grid.appScope.CheckDeleteAccess==1" class="dropdown-item mb-2" style="cursor:pointer; background-color:#e2445b;color:#fff"  ng-click="grid.appScope.openmodal(row.entity.int_ProjectLicenseCostID,\'License\')">Delete</a></div></div>'
            },
            {
                field: 'txt_Subscription',
                displayName: 'Subscription',
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'int_NoOfLicense',
                displayName: 'No. Of License',
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'int_utilizationpercent',
                displayName: 'Utilization (%)',
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'dec_LicenseCost',
                displayName: 'License Cost',
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'dec_LicenseTotalCost',
                displayName: 'Total Cost',
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'dt_EffectiveDate', displayName: 'Effective From', cellClass: 'text-center fontcentre',
                cellFilter: 'date:\'dd-MMM-yyyy\'', width: 150,
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
        exporterMenuAllData: false,        exporterCsvFilename: 'LicenseCost.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "License Cost", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'LicenseCost.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };
    $scope.gridOptionsLicense.excessRows = 100000;
    $scope.MessageLicense = "Please Wait....";
    $scope.LicenseData = {
        "data": []
    };
    $scope.getLicenseCostData = function () {
        $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/ProjectEstimation.aspx/Get_LicenseCostData",
            dataType: 'json',
            data: { ProjectID: ProjectIDQS},
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.LicenseData = d;

            }
            else {
                $scope.LicenseData = {
                    "data": []
                };
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                $scope.MessageLicense = "Record does not exists";
            }


        })
            .catch(function onError(error) {
            });
    }
    $scope.getlicensecost = function () {
        if ($scope.nooflicense != "" && $scope.cost != "") {
            var total = 0;
            if (parseInt($scope.utilization) == 100) {
                total = parseInt($scope.cost) * parseInt($scope.nooflicense);
            }
            else {
                var totalutilization = (parseInt($scope.cost) * parseInt($scope.utilization)) / 100;
                total = parseInt(totalutilization * parseInt($scope.nooflicense));
            }
            $scope.totallicensecost = total;
        }
    }
    $scope.setLicenseUtilizationRange = function () {
        if ($scope.utilization != "") {

            var utilization = parseInt($scope.utilization);
            if (utilization > 100)
                $scope.utilization = 100;

            $scope.getlicensecost();
        }
    }
    $scope.getLicenseEditData = function (licenseid) {
        $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/ProjectEstimation.aspx/GetLicenseCostEditData",
            dataType: 'json',
            data: { LicenseID: licenseid },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.IsVisibleLCUpdate = true;
                $scope.IsVisibleLCAdd = false;
                $scope.license = d[0].txt_License;
                $scope.licenseSubscriptionSelect = (d[0].txt_Subscription).toString();
                $scope.nooflicense = d[0].int_NoOfLicense;
                $scope.utilization = d[0].int_utilizationpercent;
                $scope.cost = d[0].dec_LicenseCost;
                $scope.totallicensecost = (d[0].dec_LicenseTotalCost);
                $scope.effectivedatevalue = $filter('date')(new Date(d[0].dt_EffectiveDate), "dd-MMM-yyyy");
                $scope.PreviousStoredDate = $filter('date')(new Date(d[0].dt_EffectiveDate), "dd-MMM-yyyy");
                $scope.LicenseInfraID = licenseid;
            }

        }).catch(function onError(error) {
        });

    }
    //LicenseEnd
    //Infrastructure Cost
    $scope.infrautilization = 100;
    $scope.gridOptionsInfra = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'InfraData',
        columnDefs: [
            {
                field: 'txt_Infrastructure',
                displayName: 'Infrastructure',
                cellTemplate: '<div class="task-name project-width border-left-dark" style="cursor:pointer;"><div class= "dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria - haspopup="true" aria-expanded="false"><div class="text-center text-overflow" title="{{row.entity.txt_Infrastructure}}">{{row.entity.txt_Infrastructure}}</div></div><div ng-if="grid.appScope.CheckEditAccess==1 || grid.appScope.CheckDeleteAccess==1" class="dropdown-menu" aria-labelledby="dropdownMenuButton1" style="width:10%;padding:9px;text-align:center"><a ng-if="grid.appScope.CheckEditAccess==1" class="dropdown-item mb-2" style="cursor:pointer; background-color:#0070bb;color:#fff" ng-click="grid.appScope.getInfraEditData(row.entity.int_ProjectInfrastructureCostId)">Edit</a><a ng-if="grid.appScope.CheckDeleteAccess==1" class="dropdown-item mb-2" style="cursor:pointer; background-color:#e2445b;color:#fff"  ng-click="grid.appScope.openmodal(row.entity.int_ProjectInfrastructureCostId,\'Infrastructure\')">Delete</a></div></div>'
            },
            {
                field: 'txt_Subscription',
                displayName: 'Subscription',
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'int_Quantity',
                displayName: 'Quantity',
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'int_utilizationpercent',
                displayName: 'Utilization (%)',
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'dec_Rate',
                displayName: 'Rate',
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'dec_InfraTotalCost',
                displayName: 'Total Cost',
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'dt_EffectiveDate', displayName: 'Effective From', cellClass: 'text-center fontcentre',
                cellFilter: 'date:\'dd-MMM-yyyy\'', width: 150,
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
        exporterMenuAllData: false,        exporterCsvFilename: 'InfrastructureCost.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "Infrastructure Cost", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'Infrastructure.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };
    $scope.gridOptionsInfra.excessRows = 100000;
    $scope.MessageInfra = "Please Wait....";
    $scope.InfraData = {
        "data": []
    };
    $scope.getInfraCostData = function () {
        $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/ProjectEstimation.aspx/Get_InfraCostData",
            dataType: 'json',
            data: { ProjectID: ProjectIDQS },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {

                $scope.InfraData = d;
            }
            else {
                $scope.InfraData = {
                    "data": []
                };
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                $scope.MessageInfra = "Record does not exists";
            }


        })
            .catch(function onError(error) {
            });
    }
    $scope.getinfracost = function () {
        if ($scope.infraquantity != "" && $scope.infrarate != "") {
            var infratotal = 0;
            if (parseInt($scope.infrautilization) == 100) {
                infratotal = parseInt($scope.infrarate) * parseInt($scope.infraquantity);
            }
            else {
                var infratotalutilization = (parseInt($scope.infrarate) * parseInt($scope.infrautilization)) / 100;
                infratotal = parseInt(infratotalutilization * parseInt($scope.infraquantity));
            }
            $scope.totalinfracost = infratotal;
        }
    }
    $scope.setinfraUtilizationRange = function () {
        if ($scope.infrautilization != "") {

            var utilizationinfra = parseInt($scope.infrautilization);
            if (utilizationinfra > 100)
                $scope.infrautilization = 100;

            $scope.getinfracost();
        }
    }
    $scope.getInfraEditData = function (infraid) {
        $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/ProjectEstimation.aspx/GetInfraCostEditData",
            dataType: 'json',
            data: { InfraID: infraid },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {

                $scope.IsVisibleICUpdate = true;
                $scope.IsVisibleICAdd = false;
                $scope.infrastructure = d[0].txt_Infrastructure;
                $scope.infraSubscriptionSelect = (d[0].txt_Subscription).toString();
                $scope.infraquantity = d[0].int_Quantity;
                $scope.infrautilization = d[0].int_utilizationpercent;
                $scope.infrarate = d[0].dec_Rate;
                $scope.totalinfracost = (d[0].dec_InfraTotalCost);
                $scope.infraeffectivedatevalue = $filter('date')(new Date(d[0].dt_EffectiveDate), "dd-MMM-yyyy");
                $scope.PreviousStoredDate = $filter('date')(new Date(d[0].dt_EffectiveDate), "dd-MMM-yyyy");
                $scope.LicenseInfraID = infraid;
            }

        }).catch(function onError(error) {
        });

    }
    //Infra End
    //Maintenance
    $scope.RoleData = {
        "data": []
    };
    $scope.UserData = {
        "data": []
    };
    $scope.FillRole = function () {
        $http.post('../../../App/Dashboard/AutomationRequest/EstimationCost.aspx/Get_Role',
            {
                data:
                    {}
            }).then(function (response) {

                if (response.data.d.length > 0) {
                    var d = JSON.parse(response.data.d);
                    $scope.RoleData = d;
                }
            }).catch(function onError(error) {
                console.log(error);
            });
    }
    $scope.FillUser = function () {
        var post = $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/ProjectEstimation.aspx/Fill_MaintenanceUsers",
            dataType: 'json',
            data: { roleId: $scope.mainroleSelect, ProjectID: ProjectIDQS },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.UserData = d;
                $scope.CalculateCost();
            }
            else {
                $scope.UserData = [];
            }
        })
            .catch(function onError(error) {
            });

    }
    $scope.CalculateDays = function () {
        if ($scope.mainstartdatevalue != "" && $scope.mainenddatevalue != "") {
            var StartDate = new Date($scope.mainstartdatevalue);
            var EndDate = new Date($scope.mainenddatevalue);
            var timeDiff = Math.abs(EndDate.getTime() - StartDate.getTime());
            var Difference = Math.ceil(timeDiff / (1000 * 3600 * 24));
            $scope.maintotaldays = Difference;
            $scope.CalculateCost();
        }

    }
    $scope.GetCost = function () {
        var id = "";
        if ($scope.mainroleSelect != "" && $scope.mainroleSelect != undefined) {
            id = $scope.mainroleSelect;
        }
        if ($scope.mainuserSelect != "" && $scope.mainuserSelect != undefined) {
            id = $scope.mainuserSelect;
        }

        $http({
            method: "POST",
            url: "../../../App/Dashboard/AutomationRequest/EstimationCost.aspx/GetPerDayuserRoleCost",
            dataType: 'json',
            data: { ID: id },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                if ($scope.mainroleSelect != "" && $scope.mainroleSelect != undefined)
                    $scope.maincost = d[0].RoleCost;

                if ($scope.mainuserSelect != "" && $scope.mainroleSelect != undefined)
                    $scope.maincost = d[0].UserCost;

                $scope.CalculateCost();
            }
        }).catch(function onError(error) {
        });

    }
    $scope.CalculateCost = function () {
        if ($scope.maintotaldays != "" && $scope.maincost != "") {
            var totalmaincost = (parseInt($scope.maintotaldays) * parseInt($scope.maincost));
            $scope.maintotalcost = totalmaincost;
        }
        else { $scope.maintotalcost = "0"; }

    }
    $scope.gridOptionsMaintenance = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'Maintenancedata',
        columnDefs: [
            {
                field: 'txt_stage',
                displayName: 'Stage',
                cellTemplate: '<div class="task-name project-width border-left-dark" style="cursor:pointer;"><div class= "dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria - haspopup="true" aria-expanded="false"><div class="text-center text-overflow" title="{{row.entity.txt_stage}}">{{row.entity.txt_stage}}</div></div><div ng-if="grid.appScope.CheckEditAccess==1 || grid.appScope.CheckDeleteAccess==1" class="dropdown-menu" aria-labelledby="dropdownMenuButton1" style="width:10%;padding:9px;text-align:center"><a ng-if="grid.appScope.CheckEditAccess==1" class="dropdown-item mb-2" style="cursor:pointer; background-color:#0070bb;color:#fff" ng-click="grid.appScope.getMaintenanceCostEditData(row.entity.int_ProjectMaintenanceID)">Edit</a><a ng-if="grid.appScope.CheckDeleteAccess==1" class="dropdown-item mb-2" style="cursor:pointer; background-color:#e2445b;color:#fff" ng-click="grid.appScope.openmodal(row.entity.int_ProjectMaintenanceID,\'Maintenance\')">Delete</a></div></div>'
            },
            {
                field: 'txt_MaintenanceTask',
                displayName: 'Task',
                width: "10%",
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'txt_RoleName',
                displayName: 'Role',
                width: "10%",
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'UserName',
                displayName: 'User',
                width: "10%",
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'dt_StartDate', displayName: 'Start Date', cellClass: 'text-center fontcentre',
                cellFilter: 'date:\'dd-MMM-yyyy\'', width: 150,
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
                field: 'dt_EndDate', displayName: 'End Date', cellClass: 'text-center fontcentre',
                cellFilter: 'date:\'dd-MMM-yyyy\'', width: 150,
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
                field: 'int_NoOfDays',
                displayName: 'Total Days',
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'dec_cost',
                displayName: 'Cost',
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'dec_TotalCost',
                displayName: 'Total Cost',
                cellClass: 'text-center fontcentre'
            },

        ],
        enableSelectAll: true,
        exporterMenuAllData: false,        exporterCsvFilename: 'MaintenanceCost.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "Maintenance Cost", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'MaintenanceCost.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };
    $scope.gridOptionsMaintenance.excessRows = 100000;
    $scope.MessageMaintenance = "Please Wait....";
    $scope.Maintenancedata = {
        "data": []
    };
    $scope.getMaintenanceCost = function () {
        $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/ProjectEstimation.aspx/Get_MaintenanceCostData",
            dataType: 'json',
            data: { ProjectID: ProjectIDQS },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.Maintenancedata = d;
            }
            else {
                $scope.Maintenancedata = {
                    "data": []
                };
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                $scope.MessageMaintenance = "Record does not exists";
            }
        })
            .catch(function onError(error) {
            });
    }
    $scope.getMaintenanceCostEditData = function (maintenanceid) {
        $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/ProjectEstimation.aspx/GetMaintenanceCostEditData",
            dataType: 'json',
            data: { MaintenancecostID: maintenanceid },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.IsVisibleMCUpdate = true;
                $scope.IsVisibleMCAdd = false;
                $scope.mainstageSelect = (d[0].txt_stage).toString();
                $scope.mainroleSelect = (d[0].int_RoleID).toString();
                $scope.FillUser();
                $scope.mainuserSelect = (d[0].int_UserID).toString();
                $scope.maintask = d[0].txt_MaintenanceTask;
                $scope.mainstartdatevalue = $filter('date')(new Date(d[0].dt_StartDate), "dd-MMM-yyyy");
                $scope.mainenddatevalue = $filter('date')(new Date(d[0].dt_EndDate), "dd-MMM-yyyy");
                $scope.PreviousStoredDate = $filter('date')(new Date(d[0].dt_StartDate), "dd-MMM-yyyy");
                $scope.maintotaldays = d[0].int_NoOfDays;
                $scope.maincost = d[0].dec_cost;
                $scope.maintotalcost = d[0].dec_TotalCost;
                $scope.maindescription = d[0].txt_Description;
                $scope.PMCostID = maintenanceid;
            }

        }).catch(function onError(error) {
        });

    }
    //Maintenace End
    //Add Maintenance
    $scope.AddUpdateMaintenance = function (functiontype) {
        var descri = ($scope.maindescription != undefined) ? $scope.maindescription : "";
        $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/ProjectEstimation.aspx/AddUpdateMaintenanceCost",
            dataType: 'json',
            data: { ProjectID: ProjectIDQS, featuretype: functiontype, stage: $scope.mainstageSelect, role: $scope.mainroleSelect, user: $scope.mainuserSelect, task: $scope.maintask, startdate: $scope.mainstartdatevalue, enddate: $scope.mainenddatevalue, totaldays: $scope.maintotaldays, cost: $scope.maincost, totalcost: $scope.maintotalcost, description: descri, previousStoreddate: $scope.PreviousStoredDate, costid: $scope.PMCostID },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = response1.data.d;
            if (d.includes("Successfully")) {
                toastr.success(d);
            }
            else {
                toastr.error(d);
            }
            $scope.getMaintenanceCost();
            $scope.GetCostData();
            $scope.ResetData("Maintenance Cost");
        })
            .catch(function onError(error) {
            });

    }
    //Add Update Maintenance End
    //AddUpdate License
    $scope.AddUpdateInfraLicense = function (functiontype, whichcost) {
        var licenseinfra = "";
        var subscription = ""
        var cost = "0"; var quantity = "0"; var utilization = "100";
        var totalcost = "";
        var effectivedate = "";

        if (whichcost == "License") {
            licenseinfra = $scope.license;
            subscription = $scope.licenseSubscriptionSelect;
            quantity = $scope.nooflicense;
            cost = $scope.cost;
            utilization = $scope.utilization;
            totalcost = $scope.totallicensecost;
            effectivedate = $scope.effectivedatevalue;
        }
        else if (whichcost == "Infra") {
            licenseinfra = $scope.infrastructure;
            subscription = $scope.infraSubscriptionSelect;
            quantity = $scope.infraquantity;
            cost = $scope.infrarate;
            utilization = $scope.infrautilization;
            totalcost = $scope.totalinfracost;
            effectivedate = $scope.infraeffectivedatevalue;
        }
        $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/ProjectEstimation.aspx/AddUpdateLicenseInfraCost",
            dataType: 'json',
            data: { WhichCost: whichcost, ProjectID: ProjectIDQS, featuretype: functiontype, licenseinfra: licenseinfra, subscription: subscription, qauntity: quantity, cost: cost, utilization: utilization, totalcost: totalcost, effectivedate: effectivedate, PreviousStoredDate: $scope.PreviousStoredDate, costid: $scope.LicenseInfraID },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = response1.data.d;
            if (d.includes("Successfully")) {
                toastr.success(d);
            }
            else {
                toastr.error(d);
            }

            if (whichcost == "License") {
                $scope.getLicenseCostData();
                $scope.GetCostData();
                $scope.ResetData("License Cost");
            }
            else if (whichcost == "Infra") {
                $scope.getInfraCostData();
                $scope.GetCostData();
                $scope.ResetData("Infrastructure Cost");
            }

        })
            .catch(function onError(error) {
                console.log(error);
            });

    }
    //add update end 
  
    $scope.ResetData = function (ComponentType) {
        console.log("sds", ComponentType);

        if (ComponentType == "Infrastructure Cost") {
            $scope.IsVisibleICUpdate = false;
            $scope.IsVisibleICAdd = true;
            $scope.infrastructure = "";
            $scope.infraSubscriptionSelect = "";
            $scope.infraquantity = "";
            $scope.infrautilization = "100";
            $scope.infrarate = "";
            $scope.totalinfracost = "";
            $scope.infraeffectivedatevalue = "";
            $scope.PreviousStoredDate = "";
            $scope.LicenseInfraID = "0";
        }
        else if (ComponentType == "License Cost") {
            $scope.IsVisibleLCUpdate = false;
            $scope.IsVisibleLCAdd = true;
            $scope.license = "";
            $scope.licenseSubscriptionSelect = "";
            $scope.nooflicense = "";
            $scope.utilization = "100";
            $scope.cost = "";
            $scope.totallicensecost = "";
            $scope.effectivedatevalue = "";
            $scope.PreviousStoredDate = "";
            $scope.LicenseInfraID = "0";

        }

        else if (ComponentType == "Maintenance Cost") {
            $scope.IsVisibleMCUpdate = false;
            $scope.IsVisibleMCAdd = true;
            $scope.mainstageSelect = "";
            $scope.mainroleSelect = "";
            $scope.mainuserSelect = "";
            $scope.maintask = "";
            $scope.mainstartdatevalue = "";
            $scope.mainenddatevalue = "";
            $scope.maintotaldays = "";
            $scope.maincost = "";
            $scope.maintotalcost = "";
            $scope.maindescription = "";
            $scope.PreviousStoredDate = "";
            $scope.PMCostID = "0";
        }
    }
    $scope.OpenBuildCost = function (ComponentType) {
        if (ComponentType == "License Cost") {
            document.getElementById("LicenseNav").style.width = "80%";
            $scope.getLicenseCostData();
        }
        else if (ComponentType == "Infrastructure Cost") {
            document.getElementById("InfraNav").style.width = "80%";
            $scope.getInfraCostData();
        }
        else if (ComponentType == "Maintenance Cost") {
            document.getElementById("MaintenanceNav").style.width = "80%";
            $scope.FillRole();
            $scope.UserData = {
                "data": []
            };
            $scope.getMaintenanceCost();
        }

    }
    $scope.CloseBuildCost = function (ComponentType) {
        if (ComponentType == "License Cost")
            document.getElementById("LicenseNav").style.width = "0";
        else if (ComponentType == "Infrastructure Cost")
            document.getElementById("InfraNav").style.width = "0";
        else if (ComponentType == "Maintenance Cost")
            document.getElementById("MaintenanceNav").style.width = "0";
     

        $scope.ResetData(ComponentType);
    }

    $scope.openmodal = function (ID, costtype) {        var modalInstance = $uibModal.open({            template: '<div class="modal-body"><h4>Are you sure want to delete it?</h4></div><div class="modal-footer"><button class="btn btn-default" ng-click="ok()">Yes</button><button class="btn btn-default gray" ng-click="cancel()">No</button></div>',            controller: "ModalContentCtrl",            size: '',        });        modalInstance.result.then(function (response) {            $scope.DeleteCostData(ID, costtype);        });    };
    //Delete Cost
    $scope.DeleteCostData = function (id, costtype) {
        console.log("sds", ProjectIDQS);
        $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/ProjectEstimation.aspx/DeleteCost",
            dataType: 'json',
            data: { ID: id, costtype: costtype, ProjectID:ProjectIDQS },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = response1.data.d;
            if (d.includes("Successfully")) {
                toastr.success(d);
            }
            else {
                toastr.error(d);
            }
            if (costtype == "License")
                $scope.getLicenseCostData();
            else if (costtype == "Infrastructure")
                $scope.getInfraCostData();
            else
                $scope.getMaintenanceCost();

            $scope.GetCostData();

        })
            .catch(function onError(error) {
            });

    }
    //Delete Cost End 
});
app.controller('ModalContentCtrl', function ($scope, $uibModalInstance) {

    $scope.ok = function () {
        $uibModalInstance.close("Yes");
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    }

});