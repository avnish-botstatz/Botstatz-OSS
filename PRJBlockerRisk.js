
var app = angular.module("blockerriskapp", ["ngRoute", "ngFileUpload", "ui.grid", "ui.grid.grouping", "ui.grid.exporter", "ui.grid.autoResize", "ui.bootstrap"]);


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

app.controller("blockerriskctrl", ['$scope', '$http', '$q', '$window', '$uibModal', 'Upload', function ($scope, $http, $q, $window, $uibModal, Upload) {

    var ProjectID = $window.location.search.substring(5);
    $scope.SessionUserID = $("#hdf_SessionuserID").val().toString();
    $scope.fileUrl = "";
    $scope.loading = false;
    $scope.IsFile = true;
    $scope.IsLink = false;
    $scope.IsVisibleUpdate = false;
    $scope.IsVisibleAdd = true;
    $scope.Type = "";
    $scope.CategoriesSelected = [];
    $scope.STLists = [];
    $scope.FilesList = [];

    $scope.GlobalIssueID = 0;
    $scope.GlobalIssueType = "";
    $scope.hdnStatus = "";

    $scope.FileExtentions = ".doc,.docx,.dot,.dotx,.rtf,.txt,.pdf,.ppt,.pptx,.xla,.xls,.xlsx,.xlt,.xlx,.zip,.rar,.bmp,.gif,.jpeg,.jpg,.png";
    $scope.GetFileExtention = function () {
        $http.post('../../../App/Dashboard/ProjectANG/Blocker-Risk.aspx/GetExtention',
            { data: {} }).then(function (response) {

                var d = response.data.d
                if (d != null && d.length > 0)
                    $scope.FileExtentions = d;
            });
    }
    $scope.GetFileExtention();
    $scope.Categories = [];
    $scope.dropdownSetting = {
        scrollable: true,
        scrollableHeight: '200px'
    }

    $scope.gridOptionsBlockerRisk = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'BlockerRiskData',
        columnDefs: [
            {
                field: 'txt_Title',
                displayName: 'Title',
                cellTemplate: '<div class="task-name project-width border-left-dark" style="cursor:pointer;"><div class= "dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria - expanded="false"><div class="text-overflow" title="{{row.entity.txt_Title}}">{{row.entity.txt_Title}}</div></div><div class="dropdown-menu" aria-labelledby="dropdownMenuButton1" style="width:10%;padding:9px;text-align:center"><a class="dropdown-item mb-2" style="cursor:pointer; background-color:#0070bb;color:#fff !important" ng-if="row.entity.Int_GeneratedBy == grid.appScope.SessionUserID" ng-click="grid.appScope.getDetails(row.entity.int_BlockerRiskID)">Edit</a><a class= "dropdown-item" style="background-color:#3c3939 !important;color:#fff !important;width:100%;text-align:center;" ng-click="grid.appScope.GetViewDetails(row.entity.int_BlockerRiskID)">View Details</a></div></div>'
            },
            {
                field: 'Type',
                displayName: 'Type',
            },
            {
                field: 'dtSubmittedDate',
                displayName: 'Date',
                cellClass: 'text-center fontcentre',
                cellFilter: 'date:\'dd-MMM-yyyy\'',
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
                field: 'txt_Status',
                displayName: 'Status',
                cellTemplate: '<div ng-if="!(row.groupHeader && col.grouping.groupPriority === row.treeLevel)"  ng-class="(row.entity.txt_Status===\'Completed\') ? \'task-field project-width text-center complete\' : (row.entity.txt_Status===\'Pending\') ? \'task-field project-width text-center pending\' : (row.entity.txt_Status===\'Working\') ? \'task-field project-width text-center working\': \'task-field project-width text-center not-started\'"><div>{{row.entity.txt_Status}}</div></div>' +

                    '<div class="task-name project-width ui-grid-cell-contents"><div ng-if="(row.groupHeader && col.grouping.groupPriority === row.treeLevel)"> {{ grid.appScope.getValue(\'txt_Status\', row.treeNode.children )}} </div></div>',
            },
            {
                field: 'UserName',
                displayName: 'Assign To',
                cellClass: 'text-center fontcentre',
                cellTemplate: '<div><img src=\"{{row.entity.ProfilePic}}\" class="setProfileImage"  width="45" height="45" "/>&nbsp{{row.entity.UserName}}<div>',
            },
        ],
        enableSelectAll: true,
        exporterMenuAllData: false,        exporterCsvFilename: 'BlockerRisk.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "Blocker Risk", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'BlockerRisk.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };

    $scope.gridOptionsBlockerRisk.excessRows = 5000;
    $scope.BlockerRiskData = {
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

    $scope.GetBlockerRiskData = function () {
        $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/Blocker-Risk.aspx/GetBlockerRiskData",
            data: { projectID: ProjectID },
            dataType: 'json',
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.BlockerRiskData = d;
                $scope.FillUsers();
            }
            else {
                $scope.Message = "Record does not exists";
            }
        })
            .catch(function onError(error) {
            });

    }

    $scope.GetBlockerRiskData();

    $scope.FillUsers = function () {
        $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/Blocker-Risk.aspx/FillUsers",
            data: { projectID: ProjectID },
            dataType: 'json',
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.UserData = d;
            }
            else {
                $scope.UserData = "";
            }
        })
            .catch(function onError(error) {
            });

    }

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
    $scope.CheckType = function () {
        if ($scope.filetype == 'file') {
            $scope.IsFile = true;
            $scope.IsLink = false;
        }
        else if ($scope.filetype == 'link') {
            $scope.IsLink = true;
            $scope.IsFile = false;
        }
    }
    $scope.OpenSlider = function (type) {
        $scope.Type = type;
        $scope.ResetData();
        document.getElementById("BloRiskNav").style.width = "60%";
    }
    $scope.CloseAddNav = function () {
        document.getElementById("BloRiskNav").style.width = "0%";
        $scope.GetBlockerRiskData();
    }

    $scope.UploadData = function (file, projectIssueID) {
        Upload.upload({
            url: '../../../App/Dashboard/ProjectANG/UploadFileBlockerRisk.ashx',
            data: { ProjectID: ProjectID, filetitle: $scope.title, ProjectIssueID: projectIssueID },
            file: file
        })
            .then(function (response) {
                if (response.data.length > 0) {
                    var d = response.data;
                }
            })
    }

    $scope.ResetData = function () {
        $scope.title = "";
        $scope.files = "";
        $scope.selectuser = "";
        $scope.tbx_comments = "";
        $scope.filetype = 'file';
        $scope.IsFile = true;
        $scope.IsLink = false;
        $scope.IsVisibleUpdate = false;
        $scope.IsVisibleUpdateFile = false;
        $scope.IsVisibleAdd = true;
    }

    $scope.AddData = function () {
        $scope.loading = true;
        if ($scope.textlink == "" || $scope.textlink == undefined) {
            $scope.textlink = "";
        }
        if ($scope.tbx_comments == "" || $scope.tbx_comments == undefined) {
            $scope.tbx_comments = "";
        }
        var post = $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/Blocker-Risk.aspx/AddData",
            dataType: 'json',
            data: { projectID: ProjectID, subject: $scope.title, description: $scope.tbx_comments, userid: $scope.selectuser, type: $scope.Type, linktext: $scope.textlink },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = response1.data.d;
            if (d != null) {
                if ($scope.filetype == 'file') {
                    $scope.UploadData($scope.files, d);
                }
                $scope.ResetData();
                $scope.CloseAddNav();
                $scope.loading = false;
                if ($scope.Type == "Blocker") {
                    toastr.success('Blocker added successfully.');
                }
                if ($scope.Type == "Risk") {
                    toastr.success('Risk added successfully.');
                }
                $scope.GetBlockerRiskData();
            }
        })
            .catch(function onError(error) {
            });
    };

    $scope.getDetails = function (blockerriskID) {
        $scope.GlobalIssueID = blockerriskID;

        var post = $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/Blocker-Risk.aspx/GetBlockerRiskDetails",
            dataType: 'json',
            data: { blockerriskID: $scope.GlobalIssueID },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = JSON.parse(response1.data.d);
            console.log("d", d);
            $scope.OpenSlider();
            $scope.IsVisibleUpdate = true;
            $scope.IsVisibleAdd = false;
            $scope.title = d.Table[0].txt_Title;
            $scope.FillUsers();
            $scope.selectuser = d.Table[0].int_UserID.toString();
            $scope.tbx_comments = d.Table[0].txt_Description;
            $scope.hdnStatus = d.Table[0].txt_Status;
            $scope.Type = d.Table[0].Type;

            if (d.Table1.length > 0) {
                var lists = [];
                angular.forEach(d.Table1, function (value, index) {
                    lists.push({ name: value.txt_FileName, id: value.int_FileID });
                });
                $scope.FilesList = lists;

                $scope.IsVisibleUpdateFile = true;
            }
            else {
                $scope.IsVisibleUpdateFile = false;
            }
        })
            .catch(function onError(error) {
            });
    }

    $scope.DeleteFileData = function (fileid) {
        $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/Blocker-Risk.aspx/DeleteFile",
            dataType: 'json',
            data: { fileID: fileid },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            if (response1.data.d.length > 0) {
                var d = response1.data.d
                if (d != "0") {
                    toastr.success('File Deleted Successfully');
                    $scope.getDetails($scope.GlobalIssueID);
                }
            }
        }).catch(function onError(error) {
        });
    }

    $scope.UpdateData = function () {
        var status = $scope.hdnStatus;
        $scope.loading = true;
        
        if ($scope.textlink == "" || $scope.textlink == undefined) {
            $scope.textlink = "";
        }
        if ($scope.tbx_comments == "" || $scope.tbx_comments == undefined) {
            $scope.tbx_comments = "";
        }
        var post = $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/Blocker-Risk.aspx/UpdateData",
            dataType: 'json',
            data: { blockerRiskID: $scope.GlobalIssueID, projectID: ProjectID, subject: $scope.title, description: $scope.tbx_comments, userid: $scope.selectuser, type: $scope.Type, linktext: $scope.textlink, hdnStatus: status },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = response1.data.d;
            if (d != null) {
                $scope.GetBlockerRiskData();
                if ($scope.filetype == 'file') {
                    $scope.UploadData($scope.files, d);
                }
                $scope.ResetData();
                $scope.CloseAddNav();
                $scope.loading = false;
                if ($scope.Type == "Blocker") {
                    toastr.success('Blocker updated successfully.');
                }
                if ($scope.Type == "Risk") {
                    toastr.success('Risk updated successfully.');
                }
            }
        })
            .catch(function onError(error) {
            });
    };

    $scope.OpenViewSlider = function () {
        document.getElementById("myNav").style.width = "60%";
    }

    $scope.CloseViewNav = function () {
        document.getElementById("myNav").style.width = "0%";
        $scope.GetBugEnhacementData();
    }


    $scope.GetViewDetails = function (blockerRiskID) {
        var post = $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/Blocker-Risk.aspx/GetBlockerRiskDetails",
            dataType: 'json',
            data: { blockerriskID: blockerRiskID },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = JSON.parse(response1.data.d);
            $scope.OpenViewSlider();
            console.log("d", d);
            $scope.subject = d.Table[0].txt_Title;
            $scope.createdBy = d.Table[0].CreatedBy;
            $scope.assignedTo = d.Table[0].UserName;
            $scope.description = d.Table[0].txt_Description;
            $scope.OpenViewSlider();
            if (d.Table1.length > 0) {
                var lists = [];
                angular.forEach(d.Table1, function (value, index) {
                    lists.push({ name: value.txt_FileName, id: value.int_FileID, type: value.txt_Type });
                });
                $scope.FilesList = lists;
                $scope.IsVisibleUpdateFileView = true;
            }
            else {
                $scope.IsVisibleUpdateFileView = false;
            }
        })
            .catch(function onError(error) {
            });
    }


    $scope.DownloadFile = function (fileid, filename) {
        $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/Blocker-Risk.aspx/DownloadFile",
            dataType: 'json',
            data: { fileID: fileid },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            if (response1.data.d.length > 0) {
                var d = JSON.parse(response1.data.d);
                var data = d[0].blob_Content;
                var byteArray = $scope.base64ToArrayBuffer(data);
                var blob = new Blob([byteArray], { type: d[0].txt_ContentType });
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement("a");
                document.body.appendChild(a);
                a.style = "display: none";
                a.href = url;
                a.download = filename;
                a.click();
                window.URL.revokeObjectURL(url);
            }
        }).catch(function onError(error) {
        });
    }

    $scope.GoToLink = function (fileid) {
        $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/Bugs-Enhancement.aspx/DownloadFile",
            dataType: 'json',
            data: { fileID: fileid },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            if (response1.data.d.length > 0) {
                var d = JSON.parse(response1.data.d);
                window.open(d[0].txt_FileName, "_blank");
            }
        }).catch(function onError(error) {
        });
    }
}]);



