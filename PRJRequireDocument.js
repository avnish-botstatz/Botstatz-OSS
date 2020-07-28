var app = angular.module("PRJReqDocgrid", ["ngRoute", "ngFileUpload", "ui.grid", "ui.grid.grouping", "ui.grid.exporter", "ui.grid.selection", "ui.bootstrap"]);
app.config(['$compileProvider', function ($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|blob|):/);
}]);
app.directive("selectNgFiles", function () {
    return {
        require: "ngModel",
        link: postLink
    };
    function postLink(scope, elem, attrs, ngModel) {
        elem.on("change", function (event) {
            ngModel.$setViewValue(elem[0].files);
        });
    }
})
app.controller("prjrequirementdocctrl", ['$scope', '$http', '$filter', '$window', '$uibModal', 'uiGridConstants', 'Upload', function ($scope, $http, $filter, $window, $uibModal, uiGridConstants, Upload) {
    
    var ProjectIDQS = $window.location.search.substring(5); //GetQueryStrings
    if ($window.location.search.indexOf("&") !== -1) {
        var key2 = $window.location.search.indexOf("&");
        ProjectIDQS = $window.location.search.substring(5, key2); //GetQueryStrings
    }
  
    console.log(ProjectIDQS);
    $scope.PRJAcessSession = ($("#hdf_DocSessionPRJAccess").val().toString() == "0") ? false : true;
    $scope.PRJfileUrl = "";
    $scope.PRJIsFile = true;
    $scope.PRJIsLink = false;
    $scope.PRJIsDocLoader = false;
    $scope.PRJFileExtentions = ".doc,.docx,.dot,.dotx,.rtf,.txt,.pdf,.ppt,.pptx,.xla,.xls,.xlsx,.xlt,.xlx,.zip,.rar,.bmp,.gif,.jpeg,.jpg,.png";
    var PRJselectedRowsID = [];
    $scope.PRJGetFileExtention = function () {
        $http.post('../../../App/Dashboard/AutomationRequest/RequirementDocuments.aspx/GetExtention',
            { data: {} }).then(function (response) {

                var d = response.data.d
                if (d != null && d.length > 0)
                    $scope.PRJFileExtentions = d;
            });
    }
    $scope.PRJGetFileExtention();
    $scope.gridOptionsprjdocument = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'PRJDocumentData',
        columnDefs: [
            {
                field: 'txt_FileTitle',
                displayName: 'File Title',
                cellTemplate: '<div class="task-name project-width border-left-dark" style="cursor:pointer;"><div class= "dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><div>{{row.entity.txt_FileTitle}}</div></div><div ng-if="grid.appScope.PRJAcessSession==1" class="dropdown-menu" aria-labelledby="dropdownMenuButton1" style="width:10%;padding:9px;text-align:center"><a class="dropdown-item mb-2" style="cursor:pointer; background-color:#e2445b;color:#fff" ng-click="grid.appScope.openmodal(row.entity.int_FileID)">Delete</a></div></div>'

            },
            {
                field: 'txt_Type',
                displayName: 'Type',
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'Username',
                displayName: 'Created By',
                cellTemplate: '<div><img src=\"{{row.entity.Profilepic}}\" class="setProfileImage"  width="45" height="45" "/>&nbsp{{row.entity.Username}}<div>',
                enableFiltering: false,
                enableSorting: false,
                cellClass: 'text-center fontcentre'

            },
            {
                field: 'txt_FileName',
                displayName: 'File',
                cellTemplate: '<div><a ng-if="(row.entity.txt_Type).indexOf(\'Link\') !== -1"  href="{{row.entity.txt_FileName}}" target="_blank"><i class="la la-link"></i></a><a ng-if="(row.entity.txt_Type).indexOf(\'Link\') === -1" ng-href="{{grid.appScope.PRJfileUrl}}" download="{{row.entity.txt_FileName}}" ng-click="grid.appScope.PRJDownloadFile(row.entity.int_FileID)"><i class="la la-download"></i></a></div>',
                enableFiltering: false,
                enableSorting: false,
                cellClass: 'text-center fontcentre'

            },

        ],
        enableSelectAll: true,
        exporterMenuAllData: false,        exporterCsvFilename: 'RequirementDocuments.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "Requirement Documents", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'RequirementDocuments.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            //start single row
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                if ((row.entity.txt_Type).indexOf('Link') === -1)
                    PRJselectedRowsID.push(row.entity.int_FileID);

            });//end single row

            // Multiple row selections
            gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
                $.each(rows, function (index, value) {
                    if ((value.entity.txt_Type).indexOf('Link') === -1)
                        PRJselectedRowsID.push(value.entity.int_FileID);
                });

            });//end batch selection
        },
    };
    $scope.gridOptionsprjdocument.excessRows = 100000;

    $scope.MessagePRJDocs = "Please Wait....";
    $scope.PRJDocumentData = {
        "data": []
    };

    //Documents Grid Bind Function
    $scope.GetPRJReqDocuments = function () {

        $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/RequirementDocuments.aspx/GetProjectDocuments",
            dataType: 'json',
            data: { ProjectID: ProjectIDQS },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            if (response1.data.d.length > 0) {
                var d = JSON.parse(response1.data.d);
                if (d.length > 0) {
                    $scope.PRJDocumentData = d;
                    $scope.PRJDownloadFile(d[0].int_FileID);
                }
                else {
                    $scope.PRJDocumentData = {
                        "data": []
                    };
                    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                    $scope.MessagePRJDocs = "Record does not exists";
                }
            }
            else {
                $scope.PRJDocumentData = {
                    "data": []
                };
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                $scope.MessagePRJDocs = "Record does not exists";
            }
        })
            .catch(function onError(error) {
            });
    }
    $scope.GetPRJReqDocuments();
    $scope.base64ToArrayBuffer = function (base64) {
        var binaryString = window.atob(base64);
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
        for (var i = 0; i < binaryLen; i++) {
            var ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes;
    }
    $scope.PRJDownloadFile = function (fileid) {
        $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/RequirementDocuments.aspx/GetPRJFiletoDownload",
            dataType: 'json',
            data: { FileID: fileid },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            if (response1.data.d.length > 0) {
                var d = JSON.parse(response1.data.d);
                var data = d[0].blob_Content;
                var byteArray = $scope.base64ToArrayBuffer(data);
                var blob = new Blob([byteArray], { type: d[0].txt_ContentType });
                $scope.PRJfileUrl = window.URL.createObjectURL(blob);
            }
        }).catch(function onError(error) {
        });
    }
    $scope.PRJDownloadSelectedFile = function () {
        if (PRJselectedRowsID != null && PRJselectedRowsID.length > 0) {
            var FileIDS = PRJselectedRowsID.toString();
            window.location.href = "../../../App/Dashboard/ProjectANG/DownloadPRJmultiplefile.aspx?key=" + ProjectIDQS + "&keys=" + FileIDS;
        }
    }

    $scope.CheckType = function () {
        if ($scope.filetype == 'file') {
            $scope.PRJIsFile = true;
            $scope.PRJIsLink = false;
        }
        else if ($scope.filetype == 'link') {
            $scope.PRJIsLink = true;
            $scope.PRJIsFile = false;
        }
    }
    $scope.UploadData = function (file) {
        Upload.upload({
            url: '../../../App/Dashboard/ProjectANG/UploadProjectFileHandler.ashx',
            data: { ProjectID: ProjectIDQS, filetitle: $scope.filetitle },
            file: file
        })
            .then(function (response) {
                if (response.data.length > 0) {
                    var d = response.data;
                    if (d == "Success")
                        toastr.success('File Added successfully.');
                    else
                        toastr.error(d);
                    $scope.PRJResetData();
                    $scope.GetPRJReqDocuments();
                }
            })
    }

    $scope.PRJSubmitData = function () {
        if ($scope.filetype == 'file') {
            console.log("sd", $scope.files);
            $scope.UploadData($scope.files);
        }
        else {
            $http({
                method: "POST",
                url: "../../../App/Dashboard/ProjectANG/RequirementDocuments.aspx/PRJSubmitData",
                dataType: 'json',
                data: { ProjectID: ProjectIDQS, FileTitle: $scope.filetitle, linktext: $scope.textlink },
                headers: { "Content-Type": "application/json" }
            }).then(function (response1) {
                if (response1.data.d.length > 0) {
                    var d = response1.data.d
                    if (d == "Success")
                        toastr.success('Link Added successfully.');
                    else
                        toastr.error(d);
                    $scope.PRJResetData();
                    $scope.GetPRJReqDocuments();
                }
            }).catch(function onError(error) {
            });
        }
    }

    $scope.PRJResetData = function () {
        $scope.filetitle = "";
        $scope.files = "";
        $scope.textlink = "";
        $scope.filetype = 'file';
        $scope.PRJIsFile = true;
        $scope.PRJIsLink = false;
    }
    $scope.openmodal = function (PRJfileID) {        var modalInstance = $uibModal.open({            template: '<div class="modal-body"><h4>Are you sure want to delete it?</h4></div><div class="modal-footer"><button class="btn btn-default" ng-click="ok()">Yes</button><button class="btn btn-default gray" ng-click="cancel()">No</button></div>',            controller: "ModalContentCtrl",            size: '',        });        modalInstance.result.then(function (response) {            $scope.PRJDeleteFileData(PRJfileID);        });    };
    $scope.PRJDeleteFileData = function (fileid) {

        $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/RequirementDocuments.aspx/PRJDeleteFile",
            dataType: 'json',
            data: { FileID: fileid },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            if (response1.data.d.length > 0) {
                var d = response1.data.d
                if (!d.includes("wrong"))
                    toastr.success(d);
                else
                    toastr.error(d);
                $scope.GetPRJReqDocuments();
            }
        }).catch(function onError(error) {
        });
    }
}]);
app.controller('ModalContentCtrl', function ($scope, $uibModalInstance) {

    $scope.ok = function () {
        $uibModalInstance.close("Yes");
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss();
    }

});