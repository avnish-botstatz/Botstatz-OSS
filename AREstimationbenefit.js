var app = angular.module('BenefitApp', ["ngRoute", "ui.grid", "ui.grid.grouping", "ui.grid.exporter", "ui.grid.autoResize", "ui.bootstrap"])
app.controller('BenefitController', function ($scope, $http, $window, $location) {
    $scope.Addbutton = true;
    $scope.BenefitGrid = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'BenefitData',
        columnDefs: [
            {
                field: 'TaskID',
                displayName: 'ID',
                cellClass: 'text-center fontcentre',
                visible: false
            },
            {
                field: 'txt_RoleName',
                width: '20%',
                displayName: 'Role',
                cellClass: 'text-center fontcentre',
                name: "Role",
                cellTemplate: '<div class="task-name project-width dropdown"><span class="dropdown-toggle d-block" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{row.entity.txt_RoleName}}</span><small class="board-no"></small><div ng-if= "grid.appScope.ARDocEditSession==1" class="dropdown-menu" style="width: auto !important;" aria-labelledby="dropdownMenuButton"><a class="dropdown-item" ng-click="grid.appScope.openBenefit(row.entity.TaskID)">Edit</a></div></div>'
            },
            {
                field: 'txt_UserName',
                width: '20%',
                displayName: 'Employee Name',
                cellClass: 'text-center fontcentre',
                name: "EmpName",
            },
            {
                field: 'Per_MonthCost',
                displayName: 'Per Month Cost',
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'Per_Saved',
                displayName: 'Percentage Saved',
                cellClass: 'text-center fontcentre',
                //cellTemplate: '<div ng-if="(row.entity.comment)"><a href="#" onclick="Comments()" class="View" name="View"><i class="la la-comment" ></i></a></div>'
            },
            {
                field: 'Per_AnnualCost',
                displayName: 'Annual Cost',
                cellClass: 'text-center fontcentre',
                //cellTemplate: '<div ng-if="(row.entity.Checklistid)"><a visible="(row.entity.Checklistid)?true:false" href="#" onclick="CheckList()" class="View" name="Checklist"><i class="la la-check-square"></i></a></div>'
            },
            {
                field: 'Per_AnnualBenefit',
                displayName: 'Annual benefit',
                cellClass: 'text-center fontcentre',
                //cellTemplate: '<div ng-if="(row.entity.Checklistid)"><a visible="(row.entity.Checklistid)?true:false" href="#" onclick="CheckList()" class="View" name="Checklist"><i class="la la-check-square"></i></a></div>'
            },
        ],

        enableSelectAll: true,
        exporterMenuAllData: false,        exporterCsvFilename: 'BenefitData.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "Estimation Benefit", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'BenefitData.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };
    $scope.BenefitGrid.excessRows = 100000;
    $scope.BenefitData = {
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

    $scope.GetTransaction = function () {
        $http({
            method: 'POST',
            url: 'Estimationbenefit.aspx/GetEstimationBenefit_Details',
            dataType: 'json',
            data: {},
            headers: { "Content-Type": "application/json" },
        }).then(function (response) {
            var d = [];
            if (response.data.d.length > 0) {
                d = JSON.parse(response.data.d);
                $scope.BenefitData = d.Benefit;
                $scope.ARDocEditSession = ($("#hd_true").val().toString() == "0") ? false : true;
                $scope.Addbutton = ARDocEditSession;
                console.log("hdvalue", $("#hd_true").val().toString());
                //if (d.Benefit[0].AddButton == false) {
                    
                //} else {
                //    $scope.Addbutton = true;
                //}
                //if (d.AddEditdata[0].EditButton == true) {
                //    $('#divEditValue').css('display', 'block');
                //} else {
                //    $('#divEditValue').css('display', 'none');
                //}
                console.log(d.Benefit);
                var totalval=0;
                for (var j = 0; j < d.Benefit.length; j++) {
                    totalval += d.Benefit[j].Per_AnnualBenefit;
                }
                $("#totalben").html(totalval);
            } else {
                $scope.Addbutton = ($("#hd_true").val().toString() == "0") ? false : true;
                $scope.Messageoproom = "Record does not exists";
            }

        }).catch(function (data, status) {
            console.log(data);
        });
    }


    $scope.GetTransaction();
    $scope.openBenefit = function (TaskID = 0) {
        if (TaskID != 0) {
            var AllData = $scope.BenefitData;
            adddata(AllData, TaskID);
            
            $scope.AddEdit = "Edit";
            $scope.AButton = "Update";
        }
        else {
            $scope.AddEdit = "Add";
            $scope.AButton = "Submit";
        }

        
        document.getElementById("div_AddBenefit").style.width = "50%";
    }
    $scope.CloseCommentrBox = function () {
        //$scope.CommentText = '';
        document.getElementById("div_AddBenefit").style.width = "0";
    }
});  