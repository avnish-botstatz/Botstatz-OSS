var app = angular.module("ROIReviewgrid", ["ngRoute", "ui.grid", "ui.grid.grouping", "ui.grid.exporter", "ui.grid.autoResize", "ui.bootstrap"]);
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
app.controller("ROIReviewctrl", function ($scope, $http, $q, $window, $uibModal, $filter, uiGridConstants) {
    $scope.ShowGrid = false;
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
    $scope.gridOptionsROIReview = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'ROIReviewData',
        columnDefs: [

            {
                field: 'Component',
                displayName: 'Component',
                cellTemplate: '<div class="task-name project-width border-left-dark" style="cursor:pointer;"><div class= "dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><div>{{row.entity.Component}}</div></div><div class="dropdown-menu" aria-labelledby="dropdownMenuButton1" style="width:10%;padding:9px;text-align:center"><a class="dropdown-item mb-2" style="cursor:pointer; background-color:#0070bb;color:#fff" ng-click="grid.appScope.OpenBuildCost(row.entity.Component)" >Edit Cost</a><a class="dropdown-item mb-2" style="cursor:pointer; background-color:#e2445b;color:#fff" ng-click="grid.appScope.OpenBuildCost(row.entity.LogType)">View Cost</a></div></div>'
            },
            {
                field: 'Cost',
                displayName: 'Cost/Year',
                cellClass: 'text-center fontcentre'
            },

        ],
        enableSelectAll: true,
        exporterMenuAllData: false,        exporterCsvFilename: 'ROIReviewBoard.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "ROI Review Board", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'ROIReviewBoard.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };
    $scope.gridOptionsROIReview.excessRows = 100000;

    $scope.MessageROIReview = "Please Wait....";
    $scope.ROIReviewData = {
        "data": []
    };

    //Cost Grid Bind Function
    $scope.GetCostData = function () {
        $scope.TotalCost = 0;
        $http({
            method: "POST",
            url: "../../../App/Project/ROIReviewBoard.aspx/Get_CostData",
            dataType: 'json',
            data: { ProjectID: $scope.ProjectSelect },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            $scope.ShowGrid = true;
            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.ROIReviewData = d;
                for (var i = 0; i < $scope.ROIReviewData.length; i++) {
                    var item = $scope.ROIReviewData[i];
                    $scope.TotalCost += parseInt(item.Cost);
                }
                $scope.TotalCost = $scope.ROIReviewData[0].currency + ' ' + $scope.TotalCost;
            }
            else {
                $scope.MessageROIReview = "Record does not exists";
            }
        })
            .catch(function onError(error) {
            });
    }

    //Bind BU
    $scope.BUData = {
        "data": []
    };
    $scope.FillBUData = function () {

        $http.post('../../../App/Project/ROIReviewBoard.aspx/Get_BusinessUnit',
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
        $scope.BUSelect = "0";
        $scope.DeptSelect = "0";
        $scope.ProjectSelect = "0";
    }
    $scope.FillBUData();
    $scope.DeptData = {
        "data": []
    };
    $scope.GetDepartment = function () {
        $http({
            method: "POST",
            url: "../../../App/Project/ROIReviewBoard.aspx/Get_Department",
            dataType: 'json',
            data: { buid: $scope.BUSelect },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            if (response1.data.d.length > 0) {
                var d = JSON.parse(response1.data.d);
                $scope.DeptData = d;
            }
        })
            .catch(function onError(error) {
                console.log(error);
            });
        $scope.DeptSelect = "0";
        $scope.ProjectSelect = "0";
    }
    $scope.ProjectData = {
        "data": []
    };
    $scope.GetProject = function () {
        $http({
            method: "POST",
            url: "../../../App/Project/ROIReviewBoard.aspx/Get_Project",
            dataType: 'json',
            data: { departmentID: $scope.DeptSelect },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            if (response1.data.d.length > 0) {

                var d = JSON.parse(response1.data.d);
                $scope.ProjectData = d;
            }
        })
            .catch(function onError(error) {
                console.log(error);
            });
        $scope.ProjectSelect = "0";
    }
    //Bind BU END
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
                cellTemplate: '<div class="task-name project-width border-left-dark" style="cursor:pointer;"><div class= "dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria - haspopup="true" aria-expanded="false"><div class="text-overflow" title="{{row.entity.txt_License}}">{{row.entity.txt_License}}</div></div><div ng-if="grid.appScope.CheckEditAccess==1" class="dropdown-menu" aria-labelledby="dropdownMenuButton1" style="width:10%;padding:9px;text-align:center"><a class="dropdown-item mb-2" style="cursor:pointer; background-color:#0070bb;color:#fff" ng-click="grid.appScope.getLicenseEditData(row.entity.int_LicenseCostID)">Edit</a></div></div>'
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
            url: "../../../App/Project/ROIReviewBoard.aspx/Get_LicenseCostData",
            dataType: 'json',
            data: { ProjectID: $scope.ProjectSelect },
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
            url: "../../../App/Project/ROIReviewBoard.aspx/GetLicenseCostEditData",
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
    //License Log
    var colorRowTemplate =
        //same as normal template, but extra ng-class for old people:  'old-people':(row.entity.Age>25&&!row.isSelected), 'old-people-selected':(row.entity.Age>25&&row.isSelected)
        "<div ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.uid\" ui-grid-one-bind-id-grid=\"rowRenderIndex + '-' + col.uid + '-cell'\" class=\"ui-grid-cell\" ng-class=\"{'deletedrow':(row.entity.bit_IsDelete==true), 'ui-grid-row-header-cell': col.isRowHeader }\" role=\"{{col.isRowHeader ? 'rowheader' : 'gridcell'}}\" ui-grid-cell></div>";
    $scope.gridOptionsLicenselog = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'LicenselogData',
        rowTemplate: colorRowTemplate,
        columnDefs: [
            {
                field: 'txt_License',
                displayName: 'License',
                width: '20%',
                cellTemplate: '<div class="task-name project-width border-left-dark" style="cursor:pointer;"><div class= "dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria - haspopup="true" aria-expanded="false"><div class="text-overflow" title="{{row.entity.txt_License}}">{{row.entity.txt_License}}</div></div><div ng-if="row.entity.bit_IsDelete==false && grid.appScope.CheckDeleteAccess==1" class="dropdown-menu" aria-labelledby="dropdownMenuButton1" style="width:10%;padding:9px;text-align:center"><a class="dropdown-item mb-2" style="cursor:pointer; background-color:#e2445b;color:#fff"  ng-click="grid.appScope.openmodal(row.entity.int_LicenseCostID,\'License\')">Delete</a></div></div>',
                
            },
            {
                field: 'dt_EffectiveDate', displayName: 'Effective From', cellClass: 'text-center fontcentre',
                cellFilter: 'date:\'dd-MMM-yyyy\'', width: '20%',
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
                field: 'txt_Subscription',
                displayName: 'Subscription',
                cellClass: 'text-center fontcentre',

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
    $scope.gridOptionsLicenselog.excessRows = 100000;
    $scope.MessageLicenselog = "Please Wait....";
    $scope.LicenselogData = {
        "data": []
    };
    $scope.getLicenseLogCost = function () {
        $http({
            method: "POST",
            url: "../../../App/Project/ROIReviewBoard.aspx/Get_LicenseLogCostData",
            dataType: 'json',
            data: { ProjectID: $scope.ProjectSelect },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.LicenselogData = d;

            }
            else {
                $scope.LicenselogData = {
                    "data": []
                };
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                $scope.MessageLicenselog = "Record does not exists";
            }


        })
            .catch(function onError(error) {
            });
    }

    //License Log End
    //License Cost End
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
                cellTemplate: '<div class="task-name project-width border-left-dark" style="cursor:pointer;"><div class= "dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria - haspopup="true" aria-expanded="false"><div class="text-center text-overflow" title="{{row.entity.txt_Infrastructure}}">{{row.entity.txt_Infrastructure}}</div></div><div ng-if="grid.appScope.CheckEditAccess==1" class="dropdown-menu" aria-labelledby="dropdownMenuButton1" style="width:10%;padding:9px;text-align:center"><a class="dropdown-item mb-2" style="cursor:pointer; background-color:#0070bb;color:#fff" ng-click="grid.appScope.getInfraEditData(row.entity.int_InfrastructureCostId)">Edit</a></div></div>'
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
            url: "../../../App/Project/ROIReviewBoard.aspx/Get_InfraCostData",
            dataType: 'json',
            data: { ProjectID: $scope.ProjectSelect },
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
            url: "../../../App/Project/ROIReviewBoard.aspx/GetInfraCostEditData",
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
    //Infra Log
    $scope.gridOptionsInfralog = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'InfralogData',
        rowTemplate: colorRowTemplate,
        columnDefs: [
            {
                field: 'txt_Infrastructure',
                displayName: 'Infrastructure',
                cellTemplate: '<div class="task-name project-width border-left-dark" style="cursor:pointer;"><div class= "dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria - haspopup="true" aria-expanded="false"><div class="text-center text-overflow" title="{{row.entity.txt_Infrastructure}}">{{row.entity.txt_Infrastructure}}</div></div><div ng-if="row.entity.bit_IsDelete==false && grid.appScope.CheckDeleteAccess==1" class="dropdown-menu" aria-labelledby="dropdownMenuButton1" style="width:10%;padding:9px;text-align:center"><a class="dropdown-item mb-2" style="cursor:pointer; background-color:#e2445b;color:#fff"  ng-click="grid.appScope.openmodal(row.entity.int_InfrastructureCostId,\'Infrastructure\')">Delete</a></div></div>'
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
        exporterMenuAllData: false,        exporterCsvFilename: 'InfrastructureLogCost.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "Infrastructure Cost Review History", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'InfrastructureLog.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };
    $scope.gridOptionsInfralog.excessRows = 100000;
    $scope.MessageInfralog = "Please Wait....";
    $scope.InfralogData = {
        "data": []
    };
    $scope.getInfraCostLogData = function () {
        $http({
            method: "POST",
            url: "../../../App/Project/ROIReviewBoard.aspx/Get_InfraLogCostData",
            dataType: 'json',
            data: { ProjectID: $scope.ProjectSelect },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.InfralogData = d;
            }
            else {
                $scope.InfralogData = {
                    "data": []
                };
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                $scope.MessageInfralog = "Record does not exists";
            }


        })
            .catch(function onError(error) {
            });
    }
    //Infra Log End
    //InfrastructureCost End
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
            url: "../../../App/Project/ROIReviewBoard.aspx/Fill_MaintenanceUsers",
            dataType: 'json',
            data: { roleId: $scope.mainroleSelect, ProjectID: $scope.ProjectSelect },
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
                cellTemplate: '<div class="task-name project-width border-left-dark" style="cursor:pointer;"><div class= "dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria - haspopup="true" aria-expanded="false"><div class="text-center text-overflow" title="{{row.entity.txt_stage}}">{{row.entity.txt_stage}}</div></div><div ng-if="grid.appScope.CheckEditAccess==1" class="dropdown-menu" aria-labelledby="dropdownMenuButton1" style="width:10%;padding:9px;text-align:center"><a class="dropdown-item mb-2" style="cursor:pointer; background-color:#0070bb;color:#fff" ng-click="grid.appScope.getMaintenanceCostEditData(row.entity.int_MaintenanceID)">Edit</a></div></div>'
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
            url: "../../../App/Project/ROIReviewBoard.aspx/Get_MaintenanceCostData",
            dataType: 'json',
            data: { ProjectID: $scope.ProjectSelect },
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
            url: "../../../App/Project/ROIReviewBoard.aspx/GetMaintenanceCostEditData",
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
    //Maintenace Log
    $scope.gridOptionsMaintenancelog = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'MaintenancelogData',
        rowTemplate: colorRowTemplate,
        columnDefs: [
            {
                field: 'txt_stage',
                displayName: 'Stage',
                cellTemplate: '<div class="task-name project-width border-left-dark" style="cursor:pointer;"><div class= "dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria - haspopup="true" aria-expanded="false"><div class="text-center text-overflow" title="{{row.entity.txt_stage}}">{{row.entity.txt_stage}}</div></div><div ng-if="row.entity.bit_IsDelete==false && grid.appScope.CheckDeleteAccess==1" class="dropdown-menu" aria-labelledby="dropdownMenuButton1" style="width:10%;padding:9px;text-align:center"><a class="dropdown-item mb-2" style="cursor:pointer; background-color:#e2445b;color:#fff" ng-click="grid.appScope.openmodal(row.entity.int_MaintenanceID,\'Maintenance\')">Delete</a></div></div>'
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
        exporterMenuAllData: false,        exporterCsvFilename: 'MaintenanceLog.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "Maintenance Cost Review History", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'MaintenanceLog.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };
    $scope.gridOptionsMaintenancelog.excessRows = 100000;
    $scope.MessageMaintenancelog = "Please Wait....";
    $scope.MaintenancelogData = {
        "data": []
    };
    $scope.getMaintenanceLogCost = function () {
        $http({
            method: "POST",
            url: "../../../App/Project/ROIReviewBoard.aspx/Get_MaintenanceLogCostData",
            dataType: 'json',
            data: { ProjectID: $scope.ProjectSelect },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.MaintenancelogData = d;
            }
            else {
                $scope.MaintenancelogData = {
                    "data": []
                };
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                $scope.MessageMaintenancelog = "Record does not exists";
            }
        })
            .catch(function onError(error) {
            });
    }
    //Maintenace Log End
    //Add Maintenance
    $scope.AddUpdateMaintenance = function (functiontype) {
        var descri = ($scope.maindescription != undefined) ? $scope.maindescription : "";
        $http({
            method: "POST",
            url: "../../../App/Project/ROIReviewBoard.aspx/AddUpdateMaintenanceCost",
            dataType: 'json',
            data: { ProjectID: $scope.ProjectSelect, featuretype: functiontype, stage: $scope.mainstageSelect, role: $scope.mainroleSelect, user: $scope.mainuserSelect, task: $scope.maintask, startdate: $scope.mainstartdatevalue, enddate: $scope.mainenddatevalue, totaldays: $scope.maintotaldays, cost: $scope.maincost, totalcost: $scope.maintotalcost, description: descri, previousStoreddate: $scope.PreviousStoredDate, costid: $scope.PMCostID },
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
    //Maintenance End
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
            url: "../../../App/Project/ROIReviewBoard.aspx/AddUpdateLicenseInfraCost",
            dataType: 'json',
            data: { WhichCost: whichcost, ProjectID: $scope.ProjectSelect, featuretype: functiontype, licenseinfra: licenseinfra, subscription: subscription, qauntity: quantity, cost: cost, utilization: utilization, totalcost: totalcost, effectivedate: effectivedate, previousStoreddate: $scope.PreviousStoredDate, licenseinfraid: $scope.LicenseInfraID },
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
    //Delete Cost
    $scope.DeleteCost = function (id, costtype) {

        $http({
            method: "POST",
            url: "../../../App/Project/ROIReviewBoard.aspx/DeleteCost",
            dataType: 'json',
            data: { ID: id, costtype: costtype },
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
                $scope.getLicenseLogCost();
            else if (costtype == "Infrastructure")
                $scope.getInfraCostLogData();
            else
                $scope.getMaintenanceLogCost();

            $scope.GetCostData();

        })
            .catch(function onError(error) {
            });

    }
    //Delete Cost End 

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
        else if (ComponentType == "License Log") {
            document.getElementById("LicenseLogNav").style.width = "80%";
            $scope.getLicenseLogCost();
        }
        else if (ComponentType == "Infrastructure Log") {
            document.getElementById("InfraLogNav").style.width = "80%";
            $scope.getInfraCostLogData();
        }
        else if (ComponentType == "Maintenance Log") {
            document.getElementById("MaintenanceLogNav").style.width = "80%";
            $scope.getMaintenanceLogCost();
        }

    }
    $scope.CloseBuildCost = function (ComponentType) {
        if (ComponentType == "License Cost")
            document.getElementById("LicenseNav").style.width = "0";
        else if (ComponentType == "Infrastructure Cost")
            document.getElementById("InfraNav").style.width = "0";
        else if (ComponentType == "Maintenance Cost")
            document.getElementById("MaintenanceNav").style.width = "0";
        else if (ComponentType == "License Log")
            document.getElementById("LicenseLogNav").style.width = "0";
        else if (ComponentType == "Infrastructure Log")
            document.getElementById("InfraLogNav").style.width = "0";
        else if (ComponentType == "Maintenance Log")
            document.getElementById("MaintenanceLogNav").style.width = "0";

        $scope.ResetData(ComponentType);
    }

    $scope.openmodal = function (ID,costtype) {        var modalInstance = $uibModal.open({            template: '<div class="modal-body"><h4>Are you sure want to delete it?</h4></div><div class="modal-footer"><button class="btn btn-default" ng-click="ok()">Yes</button><button class="btn btn-default gray" ng-click="cancel()">No</button></div>',            controller: "ModalContentCtrl",            size: '',        });        modalInstance.result.then(function (response) {            $scope.DeleteCost(ID, costtype);        });    };
});
function bgColor(grid, row, col, rowRenderIndex, colRenderIndex) {
    if (row.entity.bit_IsDelete === true) {
        return 'yellow';
    }
}
app.controller('ModalContentCtrl', function ($scope, $uibModalInstance) {

    $scope.ok = function () {
        $uibModalInstance.close("Yes");
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    }

});