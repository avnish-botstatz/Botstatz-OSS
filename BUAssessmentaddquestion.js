
var app = angular.module("questiongridapp", ["ngRoute", "ui.grid", "ui.grid.grouping", "ui.grid.exporter", "ui.bootstrap", "ui.grid.autoResize"]);


app.controller("questiongridctrl", ['$scope', '$http', '$q', '$window', '$uibModal', function ($scope, $http, $q, $window, $uibModal) {

    var templateid = $window.location.search.substring(5);
    $scope.GlobalPageID = 0;
    $scope.GlobalGroupID = 0;
    $scope.GlobalTemplateName = "";
    $scope.SelectPageDDL = "";
    $scope.SelectGroupDDL = "";
    $scope.EditRights = "";


    $scope.gridOptionQuestion = {};
    $scope.gridOptionMainGroup = {};

    $scope.IsAdd = true;
    $scope.IsUpdate = false;

    $scope.IsGroupAdd = true;
    $scope.IsGroupUpdate = false;

    $scope.gridOptionQuestion = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'QuestionData',
        columnDefs: [
            {
                field: 'bit_isRequired',
                displayName: 'Is Required',
                type: 'boolean',
                cellTemplate: '<input type="checkbox" ng-disabled="true" ng-if="row.entity.bit_isRequired == 1" checked>',
                enableFiltering: false,
                width: 120
            },
            {
                field: 'txt_Question',
                displayName: 'Question',
                cellTemplate: '<div class="task-name project-width dropdown"><span class="dropdown-toggle d-block" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{row.entity.txt_Question}}</span><small class="board-no"></small><div class="dropdown-menu" aria-labelledby="dropdownMenuButton1"  style="width:10%;padding:9px;text-align:center"><a class="dropdown-item mb-2" ng-click="grid.appScope.FillQuestionDetails(row.entity.int_TemplateQID)" style="cursor:pointer; background-color:#0070bb;color:#fff">Edit</a><a class="dropdown-item mb-2" ng-if="row.entity.DeleteRights!=0" ng-click="grid.appScope.open(row.entity.int_TemplateQID)" style="cursor:pointer; background-color:#e2445b;color:#fff">Delete</a></div></div>',
            },
            {
                field: 'txt_MainGroupName',
                displayName: 'Page Name',
            },
            {
                field: 'txt_SubGroupName',
                displayName: 'Group Name',
            },
            {
                field: 'txt_QuestionType',
                displayName: 'Type',
            },

        ],
        enableSelectAll: true,
        exporterMenuAllData: false,        exporterCsvFilename: 'BuAssessmentQuestion.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "BU Assessment Question", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'BuAssessmentQuestion.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            $scope.gridApi.core.handleWindowResize();
        },
    };

    $scope.gridOptionQuestion.excessRows = 5000;
    $scope.QuestionData = {
        "data": []
    };

    $scope.GetBUQuestionData = function () {
        $http({
            method: "POST",
            url: "../../../App/BUAssesment/add-question.aspx/GetTemplateQuestionData",
            data: { templateID: templateid },
            dataType: 'json',
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.EditRights = d[0].EditRights;
                $scope.QuestionData = d;
            }
            else {
                $scope.Message = "Record does not exists";
            }
        })
            .catch(function onError(error) {
            });

    }

    $scope.GetBUQuestionData();


    $scope.FillQuestionDetails = function (quesid) {

        document.getElementById("hdnquestionid").value = quesid;
        document.getElementById("btn_submit").innerText = "Update";

        if ($scope.EditRights == 0) {
            document.getElementById("btn_submit").style.display = "none";
        }
        doPostback();
    }

    $scope.gridOptionMainGroup = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'MainGroupData',
        columnDefs: [
            {
                field: 'txt_MainGroupName',
                displayName: 'Page Name',
                cellTemplate: '<div class="task-name project-width dropdown"><span class="dropdown-toggle d-block" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{row.entity.txt_MainGroupName}}</span><small class="board-no"></small><div class="dropdown-menu" aria-labelledby="dropdownMenuButton1" style="width:10%;padding:9px;text-align:center"><a class="dropdown-item mb-2" ng-click="grid.appScope.GetPageDetails(row.entity.Int_TemplateMainGroupID,row.entity.txt_MainGroupName)" style="cursor:pointer; background-color:#0070bb;color:#fff">Edit</a><a class="dropdown-item mb-2" ng-click="grid.appScope.DeletePageData(row.entity.Int_TemplateMainGroupID)" style="cursor:pointer; background-color:#e2445b;color:#fff">Delete</a></div></div>',
            },
        ],
        enableSelectAll: true,
        exporterMenuAllData: false,        exporterCsvFilename: 'BUATMainGroup.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "BU Assessment Main Group", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'BUATMainGroup.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };
    $scope.gridWidth1 = window.innerWidth * 0.55 + 'px';


    $scope.gridOptionMainGroup.excessRows = 5000;
    $scope.MainGroupData = {
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

    $scope.GetBUATPage = function () {
        $http({
            method: "POST",
            url: "../../../App/BUAssesment/add-question.aspx/GetPageData",
            data: { templateID: templateid },
            dataType: 'json',
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.MainGroupData = d;
                $scope.gridApi.grid.refresh();
            }
            else {
                $scope.Message = "Record does not exists";
            }
        })
            .catch(function onError(error) {
            });

    }

    $scope.GetBUATPage();

    $scope.gridOptionSubGroup = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'SubGroupData',
        columnDefs: [
            {
                field: 'txt_subgroupname',
                displayName: 'Group Name',
                cellTemplate: '<div class="task-name project-width dropdown"><span class="dropdown-toggle d-block" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{row.entity.txt_subgroupname}}</span><small class="board-no"></small><div class="dropdown-menu" aria-labelledby="dropdownMenuButton1" style="width:10%;padding:9px;text-align:center"><a class="dropdown-item mb-2" ng-click="grid.appScope.GetGroupDetails(row.entity.int_templatesubgroupid,row.entity.txt_subgroupname,row.entity.int_templatemaingroupid)" style="cursor:pointer; background-color:#0070bb;color:#fff">Edit</a><a class="dropdown-item mb-2" ng-click="grid.appScope.DeleteGroupData(row.entity.int_templatesubgroupid)" style="cursor:pointer; background-color:#e2445b;color:#fff">Delete</a></div></div>',
            },
            {
                field: 'txt_maingroupname',
                displayName: 'Page Name',
            },
        ],
        enableSelectAll: true,
        exporterMenuAllData: false,        exporterCsvFilename: 'BUATSubGroup.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "BU Assessment Sub Group", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'BUATSubGroup.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };
    $scope.gridWidth1 = window.innerWidth * 0.55 + 'px';


    $scope.gridOptionSubGroup.excessRows = 5000;
    $scope.SubGroupData = {
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

    $scope.GetBUATGroup = function () {
        $http({
            method: "POST",
            url: "../../../App/BUAssesment/add-question.aspx/GetGroupData",
            data: { templateID: templateid },
            dataType: 'json',
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.SubGroupData = d;
            }
            else {
                $scope.SubGroupMessage = "Record does not exists";
            }
        })
            .catch(function onError(error) {
            });

    }

    $scope.GetBUATGroup();

    $scope.open = function (templatequesId) {
        var modalInstance = $uibModal.open({            template: '<div class="modal-body"><h4>Are you sure want to delete it?</h4></div><div class="modal-footer"><button class="btn btn-default" ng-click="ok()">Yes</button><button class="btn btn-default gray" ng-click="cancel()">No</button></div>',            controller: "DeleteModalContentCtrl",            size: '',        });        modalInstance.result.then(function (response) {            $scope.DeleteTemplateQuestion(templatequesId); //Call delete function        });

        $scope.DeleteTemplateQuestion = function () {
            var post = $http({
                method: "POST",
                url: "../../../App/BUAssesment/add-question.aspx/DeleteTemplateQuestion",
                dataType: 'json',
                data: { templateQuesID: templatequesId },
                headers: { "Content-Type": "application/json" }
            }).then(function (response1) {
                var d = response1.data.d;
                if (d.length > 0) {
                    toastr.success('Question deleted successfully.');
                    $scope.GetBUQuestionData();
                }
            })
                .catch(function onError(error) {
                });
        }

    }


    $scope.AddPage = function () {
        var post = $http({
            method: "POST",
            url: "../../../App/BUAssesment/add-question.aspx/AddPageData",
            dataType: 'json',
            data: { pagename: $scope.tbx_PageName, templateId: templateid },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = response1.data.d;
            if (d == "OnSuccess") {
                $scope.GetBUATPage();
                $scope.tbx_PageName = '';
                toastr.success('Page added successfully.');
            }
            else {
                toastr.error('A page with the same name already exist. Please enter a new page name.');
            }
        })
            .catch(function onError(error) {
            });
    };


    $scope.DeletePageData = function (pageid) {
        var a = confirm('Are you sure want to delete?');
        if (a == true) {
            var post = $http({
                method: "POST",
                url: "../../../App/BUAssesment/add-question.aspx/DeletePageData",
                dataType: 'json',
                data: { templatemaingroupID: pageid },
                headers: { "Content-Type": "application/json" }
            }).then(function (response1) {
                var d = response1.data.d;
                if (d == "OnSuccess") {
                    $scope.GetBUATPage();
                    toastr.success('Page deleted successfully.');
                }
                else if (d == "1") {
                    toastr.error('Page cannot be deleted. Page contains sub-group.');
                }
                else {
                    toastr.error('Page cannot be deleted. Page contains questions.');
                }
            })
                .catch(function onError(error) {
                });
        }
    };

    $scope.GetPageDetails = function (pageid, pagename) {
        $scope.GlobalPageID = pageid;
        $scope.tbx_PageName = pagename;
        $scope.IsAdd = false;
        $scope.IsUpdate = true;
    };

    $scope.closePageNav = function () {
        $scope.tbx_PageName = '';
        $scope.IsAdd = true;
        $scope.IsUpdate = false;
        document.getElementById("myNav").style.width = "0";
        doPostback();
    };

    $scope.openGroupNav = function () {
        document.getElementById("myGroupNav").style.width = "60%";
    }

    $scope.UpdatePageData = function () {
        var post = $http({
            method: "POST",
            url: "../../../App/BUAssesment/add-question.aspx/UpdatePageData",
            dataType: 'json',
            data: { pagename: $scope.tbx_PageName, templateId: templateid, pageID: $scope.GlobalPageID },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = response1.data.d;
            if (d == "OnSuccess") {
                $scope.GetBUATPage();
                $scope.tbx_PageName = '';
                $scope.IsAdd = true;
                $scope.IsUpdate = false;
                toastr.success('Page updated successfully.');
            }
            else {
                toastr.error('A page with the same name already exist. Please enter a new page name.');
            }
        })
            .catch(function onError(error) {
            });
    };


    $scope.FillPageDDL = function () {

        var post = $http({
            method: "POST",
            url: "../../../App/BUAssesment/add-question.aspx/FillPageDDL",
            dataType: 'json',
            data: { templateID: templateid },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            if (response1.data.d.length > 0) {
                var d = JSON.parse(response1.data.d);
                $scope.PageDDLData = d;
                $scope.SelectPageDDL = d;

            }
        })
            .catch(function onError(error) {
            });
    }

    $scope.FillPageDDL();

    $scope.FillGroupDDL = function (pageid) {

        var post = $http({
            method: "POST",
            url: "../../../App/BUAssesment/add-question.aspx/FillGroupDDL",
            dataType: 'json',
            data: { pageid: pageid },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            if (response1.data.d.length > 0) {
                var d = JSON.parse(response1.data.d);
                console.log("pageid", d);

                $scope.SelectGroupDDL = d;
            }
        })
            .catch(function onError(error) {
            });
    }

    $scope.AddGroup = function () {
        var post = $http({
            method: "POST",
            url: "../../../App/BUAssesment/add-question.aspx/AddGroupData",
            dataType: 'json',
            data: { groupname: $scope.tbx_groupName, pageid: $scope.selectpage },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = response1.data.d;
            if (d == "OnSuccess") {
                $scope.GetBUATGroup();
                $scope.tbx_groupName = '';
                $scope.selectpage = '';
                toastr.success('Group added successfully.');
            }
            else {
                toastr.error('A group with the same name already exist. Please enter a new group name.');
            }
        })
            .catch(function onError(error) {
            });
    };


    $scope.DeleteGroupData = function (groupid) {
        var a = confirm('Are you sure want to delete?');
        if (a == true) {
            var post = $http({
                method: "POST",
                url: "../../../App/BUAssesment/add-question.aspx/DeleteSubGroupData",
                dataType: 'json',
                data: { templatesubgroupID: groupid },
                headers: { "Content-Type": "application/json" }
            }).then(function (response1) {
                var d = response1.data.d;
                if (d == "OnSuccess") {
                    $scope.GetBUATGroup();
                    toastr.success('Group deleted successfully.');
                }
                else {
                    toastr.error('Group cannot be deleted. Gage contains questions.');
                }
            })
                .catch(function onError(error) {
                });
        }
    };

    $scope.GetGroupDetails = function (groupid, groupname, pageid) {
        $scope.GlobalGroupID = groupid;
        $scope.GlobalPageID = pageid;
        $scope.tbx_groupName = groupname;
        $scope.FillPageDDL();
        $scope.selectpage = pageid.toString();
        $scope.IsGroupAdd = false;
        $scope.IsGroupUpdate = true;
    };

    $scope.closeGroupNav = function () {
        $scope.tbx_groupName = '';
        $scope.selectpage = '';
        $scope.IsGroupAdd = true;
        $scope.IsGroupUpdate = false;
        document.getElementById("myGroupNav").style.width = "0";
    };

    $scope.UpdateGroupData = function () {
        var post = $http({
            method: "POST",
            url: "../../../App/BUAssesment/add-question.aspx/UpdateGroupData",
            dataType: 'json',
            data: { groupname: $scope.tbx_groupName, templateId: templateid, groupID: $scope.GlobalGroupID, pageid: $scope.selectpage },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = response1.data.d;
            if (d == "OnSuccess") {
                $scope.GetBUATGroup();
                $scope.tbx_groupName = '';
                $scope.selectpage = '';

                $scope.IsGroupAdd = true;
                $scope.IsGroupUpdate = false;
                toastr.success('Group updated successfully.');
            }
            else {
                toastr.error('A group with the same name already exist. Please enter a new group name.');
            }
        })
            .catch(function onError(error) {
            });
    };

}]);

app.controller('DeleteModalContentCtrl', function ($scope, $uibModalInstance) {

    $scope.ok = function () {
        $uibModalInstance.close("Yes");
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    }

});



