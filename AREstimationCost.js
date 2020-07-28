var app = angular.module("costEstimationgrid", ["ngRoute", "ui.grid", "ui.grid.grouping", "ui.grid.exporter", "ui.grid.autoResize", "ui.bootstrap"]);

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
app.controller("costEstimationctrl", function ($scope, $http, $q, $window, $uibModal, $filter, uiGridConstants) {
    var ArWorkFormID = $window.location.search.substring(5); //GetQueryString
    $scope.AREditSession = ($("#hdf_AREditsession").val().toString() == "0") ? false : true;
    $scope.CostType = "";
    $scope.IsVisibleLCUpdate = false;
    $scope.IsVisibleLCAdd = true;
    $scope.LicenseInfraBUID = "0";
    $scope.LicenseInfraBUTemID = "0";
    $scope.LicenseInfraID = "0";
    $scope.MachineRequired = "0";

    $scope.IsVisibleICUpdate = false;
    $scope.IsVisibleICAdd = true;
    $scope.IsVisiblePCUpdate = false;
    $scope.IsVisiblePCAdd = true;
    $scope.IsVisibleMCUpdate = false;
    $scope.IsVisibleMCAdd = true;

    $scope.PMCostID = "0";
    $scope.PMBUID = "0";
    $scope.PMTempID = "0";
    $scope.gridOptionsCost = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'CostEstimationData',
        columnDefs: [

            {
                field: 'Component',
                displayName: 'Component',
                cellTemplate: '<div class="task-name project-width border-left-dark" style="cursor:pointer;"><div class= "dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria - haspopup="true" aria - expanded="false"><div>{{row.entity.Component}}</div></div><div class="dropdown-menu" aria-labelledby="dropdownMenuButton1" style="width:10%;padding:9px;text-align:center"><a class="dropdown-item mb-2" style="cursor:pointer; background-color:#0070bb;color:#fff" ng-click="grid.appScope.OpenBuildCost(row.entity.Component,\'Build\')">Build Cost</a><a class="dropdown-item mb-2" style="cursor:pointer; background-color:#e2445b;color:#fff" ng-click="grid.appScope.OpenBuildCost(row.entity.Component,\'Run\')">Run Cost</a></div></div>'
            },
            {
                field: 'BuildCost',
                displayName: 'Build Cost/Year',
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'RunCost',
                displayName: 'Run Cost/Year',
                cellClass: 'text-center fontcentre'
            },

        ],
        enableSelectAll: true,
        exporterMenuAllData: false,        exporterCsvFilename: 'EstimatedCost.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "Estimated Cost", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'EstimatedCost.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };
    $scope.gridOptionsCost.excessRows = 100000;

    $scope.MessageCost = "Please Wait....";
    $scope.CostEstimationData = {
        "data": []
    };

    //Cost Grid Bind Function
    $scope.getCostData = function () {
        $scope.BuildCost = 0;
        $scope.RunCost = 0;
        $scope.TotalCost = 0;
        $http({
            method: "POST",
            url: "../../../App/Dashboard/AutomationRequest/EstimationCost.aspx/GetCostData",
            dataType: 'json',
            data: { ARworkformID: ArWorkFormID },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.CostEstimationData = d;
                for (var i = 0; i < $scope.CostEstimationData.length; i++) {
                    var item = $scope.CostEstimationData[i];
                    $scope.BuildCost += parseInt(item.BuildCost);
                    $scope.RunCost += parseInt(item.RunCost);
                }
                $scope.TotalCost = $scope.CostEstimationData[0].currency + ' ' + (parseInt($scope.BuildCost) + parseInt($scope.RunCost));
                $scope.BuildCost = $scope.CostEstimationData[0].currency + ' ' + $scope.BuildCost;
                $scope.RunCost = $scope.CostEstimationData[0].currency + ' ' + $scope.RunCost;
            }
            else {
                $scope.MessageCost = "Record does not exists";
            }
        })
            .catch(function onError(error) {
            });
    }
    //Cost Grid Bind Function End

    $scope.getCostData(); //Call CostBind

    $scope.IsMachineRequired = false;
    $scope.MachineRequired = function () {
        $http({
            method: "POST",
            url: "../../../App/Dashboard/AutomationRequest/EstimationCost.aspx/fill_totalMachineReuqired",
            dataType: 'json',
            data: { ARworkformID: ArWorkFormID },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = response1.data.d;
            if (d != "" && d != 0) {
                $scope.IsMachineRequired = true;
                $scope.MachineRequireddata = d;

            }

        }).catch(function onError(error) {
        });
    }
    $scope.MachineRequired();
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
                //width:200,
                cellTemplate: '<div class="task-name project-width border-left-dark" style="cursor:pointer;"><div class= "dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria - haspopup="true" aria-expanded="false"><div class="text-overflow" title="{{row.entity.txt_License}}">{{row.entity.txt_License}}</div></div><div ng-if="grid.appScope.AREditSession==1" class="dropdown-menu" aria-labelledby="dropdownMenuButton1" style="width:10%;padding:9px;text-align:center"><a class="dropdown-item mb-2" style="cursor:pointer; background-color:#0070bb;color:#fff" ng-click="grid.appScope.getLicenseEditData(row.entity.int_ARLicenseCostID)">Edit</a></div></div>'
            },
            {
                field: 'txt_Subscription',
                displayName: 'Subscription',
                //width:200,
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'int_NoOfLicense',
                displayName: 'No. Of License',
                //width: 100,
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'int_utilizationpercent',
                displayName: 'Utilization (%)',
                //width: 100,
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'dec_LicenseCost',
                displayName: 'License Cost',
                // width: 100,
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'dec_LicenseTotalCost',
                displayName: 'Total Cost',
                // width: 100,
                cellClass: 'text-center fontcentre'
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
            //  $timeout(function () {
            //    $scope.gridApi.core.handleWindowResize();

            //}, 500);
            //$scope.gridApi.core.refresh();
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
            url: "../../../App/Dashboard/AutomationRequest/EstimationCost.aspx/GetLicenseCostData",
            dataType: 'json',
            data: { ARworkformID: ArWorkFormID, type: $scope.CostType },
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
            url: "../../../App/Dashboard/AutomationRequest/EstimationCost.aspx/GetLicenseCostEditData",
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
                $scope.LicenseInfraBUID = d[0].int_BULicenseCostID;
                $scope.LicenseInfraBUTemID = d[0].int_BUEstimationTemplateID;
                $scope.LicenseInfraID = licenseid;
            }

        }).catch(function onError(error) {
        });

    }
    //License Cost End
    //Add Update License Infra 
    $scope.AddUpdateInfraLicense = function (functiontype, whichcost) {
        var licenseinfra = "";
        var subscription = ""
        var cost = "0"; var quantity = "0"; var utilization = "100";
        var totalcost = "";

        if (whichcost == "License") {
            licenseinfra = $scope.license;
            subscription = $scope.licenseSubscriptionSelect;
            quantity = $scope.nooflicense;
            cost = $scope.cost;
            utilization = $scope.utilization;
            totalcost = $scope.totallicensecost;
        }
        else if (whichcost == "Infra") {
            licenseinfra = $scope.infrastructure;
            subscription = $scope.infraSubscriptionSelect;
            quantity = $scope.infraquantity;
            cost = $scope.infrarate;
            utilization = $scope.infrautilization;
            totalcost = $scope.totalinfracost;
        }
        $http({
            method: "POST",
            url: "../../../App/Dashboard/AutomationRequest/EstimationCost.aspx/AddUpdateLicenseInfraCost",
            dataType: 'json',
            data: { WhichCost: whichcost, ARworkformID: ArWorkFormID, costtype: $scope.CostType, featuretype: functiontype, license: licenseinfra, subscription: subscription, nooflicense: quantity, cost: cost, utilization: utilization, totalcost: totalcost, licenseinfraid: $scope.LicenseInfraID, bulicenseinfraid: $scope.LicenseInfraBUID, butemplateid: $scope.LicenseInfraBUTemID },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = response1.data.d;
            if (!d.includes("wrong")) {
                toastr.success(d);
            }
            else {
                toastr.error(d);
            }
            if (whichcost == "License") {
                $scope.getLicenseCostData();
                $scope.getCostData();
                $scope.ResetData("License Cost");
            }
            else {
                $scope.getInfraCostData();
                $scope.getCostData();
                $scope.ResetData("Infrastructure Cost");
            }

        })
            .catch(function onError(error) {
            });

    }
    //Add Update License Infra End
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
                cellTemplate: '<div class="task-name project-width border-left-dark" style="cursor:pointer;"><div class= "dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria - haspopup="true" aria-expanded="false"><div class="text-center text-overflow" title="{{row.entity.txt_Infrastructure}}">{{row.entity.txt_Infrastructure}}</div></div><div ng-if="grid.appScope.AREditSession==1" class="dropdown-menu" aria-labelledby="dropdownMenuButton1" style="width:10%;padding:9px;text-align:center"><a class="dropdown-item mb-2" style="cursor:pointer; background-color:#0070bb;color:#fff" ng-click="grid.appScope.getInfraEditData(row.entity.int_ARInfrastructureCostId)">Edit</a></div></div>'
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
            url: "../../../App/Dashboard/AutomationRequest/EstimationCost.aspx/GetInfrastructureCostData",
            dataType: 'json',
            data: { ARworkformID: ArWorkFormID, type: $scope.CostType },
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
            url: "../../../App/Dashboard/AutomationRequest/EstimationCost.aspx/GetInfraCostEditData",
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
                $scope.LicenseInfraBUID = d[0].int_BUInfrastructureCostID;
                $scope.LicenseInfraBUTemID = d[0].int_BUEstimationTemplateID;
                $scope.LicenseInfraID = infraid;
            }

        }).catch(function onError(error) {
        });

    }
    //InfrastructureCost End
    //People Cost
    $scope.StageData = {
        "data": []
    };
    $scope.FillStage = function () {

        $http.post('../../../App/Dashboard/AutomationRequest/EstimationCost.aspx/Get_Stage',
            {
                data:
                    {}
            }).then(function (response) {

                if (response.data.d.length > 0) {
                    var d = JSON.parse(response.data.d);
                    $scope.StageData = d;
                }
            }).catch(function onError(error) {
                console.log(error);
            });
        $scope.FillRole();
    }
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

    $scope.gridOptionsPeople = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'PeopleData',
        columnDefs: [
            {
                field: 'txt_Activity',
                displayName: 'Stage',
                cellTemplate: '<div class="task-name project-width border-left-dark" style="cursor:pointer;"><div class= "dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria - haspopup="true" aria-expanded="false"><div class="text-center text-overflow" title="{{row.entity.txt_Activity}}">{{row.entity.txt_Activity}}</div></div><div ng-if="grid.appScope.AREditSession==1" class="dropdown-menu" aria-labelledby="dropdownMenuButton1" style="width:10%;padding:9px;text-align:center"><a class="dropdown-item mb-2" style="cursor:pointer; background-color:#0070bb;color:#fff" ng-click="grid.appScope.getPeopleCostEditData(row.entity.int_AREstimationTaskID)">Edit</a></div></div>'
            },
            {
                field: 'txt_EstimatioinTask',
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
                field: 'int_No_of_days',
                displayName: 'Total Days',
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'dec_cost',
                displayName: 'Cost',
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'txt_TotalCost',
                displayName: 'Total Cost',
                cellClass: 'text-center fontcentre'
            },

        ],
        enableSelectAll: true,
        exporterMenuAllData: false,        exporterCsvFilename: 'PeopleCost.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "People Cost", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'PeopleCost.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };
    $scope.gridOptionsPeople.excessRows = 100000;
    $scope.MessagePeople = "Please Wait....";
    $scope.PeopleData = {
        "data": []
    };
    $scope.getPeopleCost = function () {

        $http({
            method: "POST",
            url: "../../../App/Dashboard/AutomationRequest/EstimationCost.aspx/GetPeopleCostData",
            dataType: 'json',
            data: { ARworkformID: ArWorkFormID, type: $scope.CostType },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.PeopleData = d;
            }
            else {
                $scope.PeopleData = {
                    "data": []
                };
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                $scope.MessagePeople = "Record does not exists";
            }
        })
            .catch(function onError(error) {
            });
    }

    $scope.getPeopleCostEditData = function (peopleid) {
        $http({
            method: "POST",
            url: "../../../App/Dashboard/AutomationRequest/EstimationCost.aspx/GetPeopleCostEditData",
            dataType: 'json',
            data: { PeoplecostID: peopleid },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {

                $scope.IsVisiblePCUpdate = true;
                $scope.IsVisiblePCAdd = false;
                $scope.peoplestageSelect = (d[0].int_WorkFlowActivityID).toString();
                $scope.peopleroleSelect = (d[0].int_RoleID).toString();
                $scope.FillUser('people');
                $scope.peopleuserSelect = (d[0].int_UserID).toString();
                $scope.task = d[0].txt_EstimatioinTask;
                $scope.pstartdatevalue = $filter('date')(new Date(d[0].dt_StartDate), "dd-MMM-yyyy");
                $scope.penddatevalue = $filter('date')(new Date(d[0].dt_EndDate), "dd-MMM-yyyy");
                $scope.totaldays = d[0].int_No_of_days;
                $scope.peoplecost = d[0].dec_cost;
                $scope.totalpeoplecost = d[0].txt_TotalCost;
                $scope.description = d[0].txt_EstimationTaskDescription;
                $scope.PMTempID = d[0].int_BUEstimationTemplateID;
                $scope.PMBUID = d[0].int_BUEstimationID;
                $scope.PMCostID = peopleid;
            }

        }).catch(function onError(error) {
        });

    }
    //People Cost End
    //general for people and maintenance
    $scope.FillUser = function (fillusertype) {
        var roleid = "0";
        if (fillusertype == "people")
            roleid = $scope.peopleroleSelect;
        else if (fillusertype == "maintenace")
            roleid = $scope.mainroleSelect;

        var post = $http({
            method: "POST",
            url: "../../../App/Dashboard/AutomationRequest/EstimationCost.aspx/Get_User",
            dataType: 'json',
            data: { RoleID: roleid, ARWorkFormID: ArWorkFormID },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.UserData = d;
                $scope.CalculateCost(fillusertype);
            }
            else {
                $scope.UserData = [];
            }
        })
            .catch(function onError(error) {
            });

    }
    $scope.CalculateDays = function (fillusertype) {
        if (fillusertype == "people") {
            if ($scope.pstartdatevalue != "" && $scope.penddatevalue != "") {
                var StartDate = new Date($scope.pstartdatevalue);
                var EndDate = new Date($scope.penddatevalue);
                var timeDiff = Math.abs(EndDate.getTime() - StartDate.getTime());
                var Difference = Math.ceil(timeDiff / (1000 * 3600 * 24));
                $scope.totaldays = Difference;
                $scope.CalculateCost(fillusertype);
            }
        }
        else if (fillusertype == "maintenace") {
            if ($scope.mainstartdatevalue != "" && $scope.mainenddatevalue != "") {
                var StartDate = new Date($scope.mainstartdatevalue);
                var EndDate = new Date($scope.mainenddatevalue);
                var timeDiff = Math.abs(EndDate.getTime() - StartDate.getTime());
                var Difference = Math.ceil(timeDiff / (1000 * 3600 * 24));
                $scope.maintotaldays = Difference;
                $scope.CalculateCost(fillusertype);
            }
        }

    }
    $scope.GetCost = function (fillusertype) {
        var id = "";
        if (fillusertype == "people") {

            if ($scope.peopleroleSelect != "" && $scope.peopleroleSelect != undefined) {
                id = $scope.peopleroleSelect;
            }
            if ($scope.peopleuserSelect != "" && $scope.peopleuserSelect != undefined) {
                id = $scope.peopleuserSelect;
            }
        }
        else if (fillusertype == "maintenace") {
            if ($scope.mainroleSelect != "" && $scope.mainroleSelect != undefined) {
                id = $scope.mainroleSelect;
            }
            if ($scope.mainuserSelect != "" && $scope.mainuserSelect != undefined) {
                id = $scope.mainuserSelect;
            }
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
                if (fillusertype == "people") {
                    if ($scope.peopleroleSelect != "" && $scope.peopleroleSelect != undefined)
                        $scope.peoplecost = d[0].RoleCost;

                    if ($scope.peopleuserSelect != "" && $scope.peopleroleSelect != undefined)
                        $scope.peoplecost = d[0].UserCost;
                }
                else if (fillusertype == "maintenace") {
                    if ($scope.mainroleSelect != "" && $scope.mainroleSelect != undefined)
                        $scope.maincost = d[0].RoleCost;

                    if ($scope.mainuserSelect != "" && $scope.mainroleSelect != undefined)
                        $scope.maincost = d[0].UserCost;
                }
                $scope.CalculateCost(fillusertype);
            }
        }).catch(function onError(error) {
        });

    }
    $scope.CalculateCost = function (fillusertype) {
        if (fillusertype == "people") {
            if ($scope.totaldays != "" && $scope.peoplecost != "") {
                var totalPeoplecost = (parseInt($scope.totaldays) * parseInt($scope.peoplecost));
                $scope.totalpeoplecost = totalPeoplecost;
            }
            else {
                $scope.totalpeoplecost = "0";
            }

        }

        else if (fillusertype == "maintenace") {

            if ($scope.maintotaldays != "" && $scope.maincost != "") {
                var totalmaincost = (parseInt($scope.maintotaldays) * parseInt($scope.maincost));
                $scope.maintotalcost = totalmaincost;
            }
            else { $scope.maintotalcost = "0"; }
        }
    }
    //general end
    //Maintenacne Cost
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
                cellTemplate: '<div class="task-name project-width border-left-dark" style="cursor:pointer;"><div class= "dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria - haspopup="true" aria-expanded="false"><div class="text-center text-overflow" title="{{row.entity.txt_stage}}">{{row.entity.txt_stage}}</div></div><div ng-if="grid.appScope.AREditSession==1" class="dropdown-menu" aria-labelledby="dropdownMenuButton1" style="width:10%;padding:9px;text-align:center"><a class="dropdown-item mb-2" style="cursor:pointer; background-color:#0070bb;color:#fff" ng-click="grid.appScope.getMaintenanceCostEditData(row.entity.int_ARMaintenanceID)">Edit</a></div></div>'
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
            url: "../../../App/Dashboard/AutomationRequest/EstimationCost.aspx/GetMaintenanceCostData",
            dataType: 'json',
            data: { ARworkformID: ArWorkFormID, type: $scope.CostType },
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
            url: "../../../App/Dashboard/AutomationRequest/EstimationCost.aspx/GetMaintenanceCostEditData",
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
                $scope.FillUser('maintenace');
                $scope.mainuserSelect = (d[0].int_UserID).toString();
                $scope.maintask = d[0].txt_MaintenanceTask;
                $scope.mainstartdatevalue = $filter('date')(new Date(d[0].dt_StartDate), "dd-MMM-yyyy");
                $scope.mainenddatevalue = $filter('date')(new Date(d[0].dt_EndDate), "dd-MMM-yyyy");
                $scope.maintotaldays = d[0].int_NoOfDays;
                $scope.maincost = d[0].dec_cost;
                $scope.maintotalcost = d[0].dec_TotalCost;
                $scope.maindescription = d[0].txt_Description;
                $scope.PMTempID = d[0].int_BUEstimationTemplateID;
                $scope.PMBUID = d[0].int_BUMaintenanceCostID;
                $scope.PMCostID = maintenanceid;
            }

        }).catch(function onError(error) {
        });

    }
    //Maintenacne Cost END

    //Add  People Maintenance
    $scope.AddUpdatePeopleMaintenance = function (functiontype, whichcost) {
        var stage = ""; var descri = "";
        var role = ""; var user = ""; var task = ""; var startdate = ""; var enddate = "";
        var PMtotaldays = "0"; var PMcost = "0"; var PMtotalcost = "100";

        if (whichcost == "People") {
            stage = $scope.peoplestageSelect;
            role = $scope.peopleroleSelect;
            user = $scope.peopleuserSelect;
            task = $scope.task;
            startdate = $scope.pstartdatevalue;
            enddate = $scope.penddatevalue;
            PMtotaldays = $scope.totaldays;
            PMcost = $scope.peoplecost;
            PMtotalcost = $scope.totalpeoplecost;
            descri = ($scope.description != undefined) ? $scope.description : "";
        }
        else if (whichcost == "Maintenance") {
            stage = $scope.mainstageSelect;
            role = $scope.mainroleSelect;
            user = $scope.mainuserSelect;
            task = $scope.maintask;
            startdate = $scope.mainstartdatevalue;
            enddate = $scope.mainenddatevalue;
            PMtotaldays = $scope.maintotaldays;
            PMcost = $scope.maincost;
            PMtotalcost = $scope.maintotalcost;
            descri = ($scope.maindescription != undefined) ? $scope.maindescription : "";
        }
        $http({
            method: "POST",
            url: "../../../App/Dashboard/AutomationRequest/EstimationCost.aspx/AddUpdatePeopleMaintenanceCost",
            dataType: 'json',
            data: { WhichCost: whichcost, ARworkformID: ArWorkFormID, costtype: $scope.CostType, featuretype: functiontype, stage: stage, role: role, user: user, task: task, startdate: startdate, enddate: enddate, totaldays: PMtotaldays, cost: PMcost, totalcost: PMtotalcost, description: descri, costid: $scope.PMCostID, buid: $scope.PMBUID, butemplateid: $scope.PMTempID },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = response1.data.d;
            if (!d.includes("wrong")) {
                toastr.success(d);
            }
            else {
                toastr.error(d);
            }
            if (whichcost == "People") {
                $scope.getPeopleCost();
                $scope.getCostData();
                $scope.ResetData("People Cost");
            }
            else {
                $scope.getMaintenanceCost();
                $scope.getCostData();
                $scope.ResetData("Maintenance Cost");
            }

        })
            .catch(function onError(error) {
            });

    }
    //Add Update People Maintenance End
    $scope.ResetData = function (ComponentType) {
        if (ComponentType == "License Cost") {
            $scope.IsVisibleLCUpdate = false;
            $scope.IsVisibleLCAdd = true;
            $scope.license = "";
            $scope.licenseSubscriptionSelect = "";
            $scope.nooflicense = "";
            $scope.utilization = "100";
            $scope.cost = "";
            $scope.totallicensecost = "";
            $scope.LicenseInfraBUID = "0";
            $scope.LicenseInfraBUTemID = "0";
            $scope.LicenseInfraID = "0";
        }
        else if (ComponentType == "Infrastructure Cost") {
            $scope.IsVisibleICUpdate = false;
            $scope.IsVisibleICAdd = true;
            $scope.infrastructure = "";
            $scope.infraSubscriptionSelect = "";
            $scope.infraquantity = "";
            $scope.infrautilization = "100";
            $scope.infrarate = "";
            $scope.totalinfracost = "";
            $scope.LicenseInfraBUID = "0";
            $scope.LicenseInfraBUTemID = "0";
            $scope.LicenseInfraID = "0";
        }
        else if (ComponentType == "People Cost") {
            $scope.IsVisiblePCUpdate = false;
            $scope.IsVisiblePCAdd = true;
            $scope.peoplestageSelect = "";
            $scope.peopleroleSelect = "";
            $scope.peopleuserSelect = "";
            $scope.task = "";
            $scope.pstartdatevalue = "";
            $scope.penddatevalue = "";
            $scope.totaldays = "";
            $scope.peoplecost = "";
            $scope.totalpeoplecost = "";
            $scope.description = "";
            $scope.PMCostID = "0";
            $scope.PMBUID = "0";
            $scope.PMTempID = "0";
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
            $scope.PMCostID = "0";
            $scope.PMBUID = "0";
            $scope.PMTempID = "0";
        }
    }
    $scope.OpenBuildCost = function (ComponentType, costType) {

        if (costType == "Build")
            $scope.CostType = "Build";
        else
            $scope.CostType = "Run";

        if (ComponentType == "License Cost") {
            document.getElementById("LicenseNav").style.width = "80%";
            $scope.getLicenseCostData();
        }
        else if (ComponentType == "Infrastructure Cost") {
            document.getElementById("InfraNav").style.width = "80%";
            $scope.getInfraCostData();
        }
        else if (ComponentType == "People Cost") {
            document.getElementById("PeopleNav").style.width = "80%";
            $scope.FillStage();
            $scope.getPeopleCost();
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
        else if (ComponentType == "People Cost")
            document.getElementById("PeopleNav").style.width = "0";
        else if (ComponentType == "Maintenance Cost")
            document.getElementById("MaintenanceNav").style.width = "0";

        $scope.ResetData(ComponentType);
    }
});