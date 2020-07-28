
var app = angular.module("buassessmentapp", ["ngRoute", "ui.grid", "ui.grid.grouping", "ui.grid.exporter", "ui.grid.autoResize", "ui.bootstrap"]);


app.controller("buassessmentctrl", ['$scope', '$http', '$q', '$window', '$uibModal', function ($scope, $http, $q, $window, $uibModal) {

    $scope.GlobalTemplateID = 0;
    $scope.GlobalTemplateName = "";
    $scope.loading = false;
    $scope.gridOptionBUAssessment = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'BUAssessmentData',
        columnDefs: [
            {
                field: 'bit_isPublished',
                displayName: 'Published',
                type: 'boolean',
                cellTemplate: '<input type="checkbox" ng-disabled="true" ng-if="row.entity.bit_isPublished == 1" checked>',
                enableFiltering: false,
                width: 120
            },
            {
                field: 'txt_TemplateName',
                displayName: 'Template Name',
                cellTemplate: '<div class="task-name project-width dropdown"><span class="dropdown-toggle d-block" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{row.entity.txt_TemplateName}}</span><small class="board-no"></small><div class="dropdown-menu" aria-labelledby="dropdownMenuButton1" style="width:10%;padding:9px;text-align:center"><a class="dropdown-item mb-2" ng-click="grid.appScope.Redirect(row.entity.int_TemplateID,\'Questions\')" style="cursor:pointer; background-color:#789eb7;color:#fff" >Question</a><a class="dropdown-item mb-2" ng-if = row.entity.EditRights!=0 ng-click="grid.appScope.Redirect(row.entity.int_TemplateID,\'Edit\')" style="cursor:pointer; background-color:#0070bb;color:#fff">Edit</a><a class="dropdown-item mb-2" ng-if = row.entity.AddRights!=0 ng-click="grid.appScope.Clone(row.entity.int_TemplateID,row.entity.txt_TemplateName)" style="cursor:pointer; background-color:#e2445b;color:#fff">Clone</a><a class= "dropdown-item" style="cursor:pointer;background-color:#3c3939;color:#fff;width:100%;text-align:center;" ng-click="grid.appScope.open(row.entity.int_TemplateID,row.entity.bit_isPublished)">Publish</a></div></div>',
            },
            {
                field: 'UnitName',
                displayName: 'Business Unit',
            },
            {
                field: 'dt_LastUpdated',
                displayName: 'Last Updated Date',
                cellFilter: 'date:\'dd-MMM-yyyy | HH:mm\'',
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
        exporterMenuAllData: false,        exporterCsvFilename: 'BUAssessmentTemplate.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "BU Assessment Template", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'BUAssessmentTemplate.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };

    $scope.gridOptionBUAssessment.excessRows = 5000;
    $scope.BUAssessmentData = {
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

    $scope.GetBUAssessmentData = function () {
        $http({
            method: "POST",
            url: "../../../App/BUAssesment/default.aspx/GetBusinessRequisitionTemplate",
            data: {},
            dataType: 'json',
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.BUAssessmentData = d;
            }
            else {
                $scope.Message = "Record does not exists";
            }
        })
            .catch(function onError(error) {
            });

    }

    $scope.GetBUAssessmentData();

    $scope.Clone = function (templateID, templateName) {
        $scope.GlobalTemplateID = templateID;
        $scope.GlobalTemplateName = templateName;
        document.getElementById("myNav").style.width = "40%";
        $scope.FillBusinessUnit();
        $scope.Fill_CloneData();
    }

    $scope.CloseClone = function () {
        document.getElementById("myNav").style.width = "0%";
        $scope.GetBUAssessmentData();
    }

    $scope.Redirect = function (templateID,type) {
        $http({
            method: "POST",
            url: "../../../App/BUAssesment/default.aspx/RedirectToQuestion",
            data: { templateID: templateID, type: type },
            dataType: 'json',
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            $window.location.href = response1.data.d;
        })
            .catch(function onError(error) {
            });
    }

    $scope.FillBusinessUnit = function () {
        $http.post('../../../App/BUAssesment/default.aspx/FillBusinessUnitDDL',
            {
                data:
                    {}
            }).then(function (response) {

                if (response.data.d.length > 0) {
                    var d = JSON.parse(response.data.d);
                    $scope.BusinessUnitData = d;
                }
            });
    }

    $scope.Fill_CloneData = function () {
        var post = $http({
            method: "POST",
            url: "../../../App/BUAssesment/default.aspx/Fill_CloneData",
            dataType: 'json',
            data: { id: $scope.GlobalTemplateID, templateName: $scope.GlobalTemplateName },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            if (response1.data.d.length > 0) {
                $scope.tbx_TemplateName = response1.data.d;
            }
        })
            .catch(function onError(error) {
            });
    }


    $scope.CloneTemplate = function () {
        $scope.loading = true;
        var post = $http({
            method: "POST",
            url: "../../../App/BUAssesment/default.aspx/AddClone",
            dataType: 'json',
            data: { templateName: $scope.tbx_TemplateName, businessunit: $scope.selectBU, templateID: $scope.GlobalTemplateID },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = response1.data.d;
            if (d == "OnSuccess") {
                $scope.loading = false;
                $scope.CloseClone();
                $scope.GetBUAssessmentData();
                toastr.success('Assessment Template cloned successfully.');
            }
            else {
                toastr.success('No data available in this template.');
            }
        })
            .catch(function onError(error) {
            });
    };



    $scope.open = function (templateID, publish) {
        var modalInstance = $uibModal.open({            template: '<div class="modal-body"><h4>Are you sure want to publish it?</h4></div><div class="modal-footer"><button class="btn btn-default" ng-click="ok()">Yes</button><button class="btn btn-default gray" ng-click="cancel()">No</button></div>',            controller: "PublishModalContentCtrl",            size: '',        });        modalInstance.result.then(function (response) {            $scope.PublishTemplate(templateID, publish); //Call delete function        });

        $scope.PublishTemplate = function () {
            console.log("template", templateID);

            var post = $http({
                method: "POST",
                url: "../../../App/BUAssesment/default.aspx/PublishTemplate",
                dataType: 'json',
                data: { publish: publish, templateID: templateID },
                headers: { "Content-Type": "application/json" }
            }).then(function (response1) {
                var d = response1.data.d;
                console.log("d", d);
                if (d == "1") {
                    toastr.error('Template already published.');
                }
                else if (d == "2") {
                    toastr.error('Unable to publish this template. Template must have at-least 1 question to publish.');
                }
                else if (d == "3") {
                    toastr.success('Assessment Template published successfully.');
                }
                else {
                    toastr.error('Oops! Something went wrong. Please contact you’re administrator.');
                }
                $scope.GetBUAssessmentData();
            })
                .catch(function onError(error) {
                });
        }


    }
}]);


app.controller('PublishModalContentCtrl', function ($scope, $uibModalInstance) {

    $scope.ok = function () {
        $uibModalInstance.close("Yes");
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    }

});


