
var app = angular.module("bugenhgrid", ["ngRoute", "ngFileUpload", "ui.grid", "ui.grid.grouping", "ui.grid.exporter", "ui.grid.autoResize", "ui.bootstrap", "angularjs-dropdown-multiselect"]);


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

app.controller("bugenhgridctrl", ['$scope', '$http', '$q', '$window', '$uibModal', 'Upload', function ($scope, $http, $q, $window, $uibModal, Upload) {

    var ProjectID = $window.location.search.substring(5);
    $scope.SessionUserID = $("#hdf_SessionuserTaskID").val().toString();
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
        $http.post('../../../App/Dashboard/ProjectANG/Bugs-Enhancement.aspx/GetExtention',
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

    $scope.gridOptionsBugEnh = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'BugEnhData',
        columnDefs: [
            {
                field: 'txt_Subject',
                displayName: 'Title',
                cellTemplate: '<div class="task-name project-width border-left-dark" style="cursor:pointer;"><div class= "dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria - expanded="false"><div class="text-overflow" title="{{row.entity.txt_Subject}}">{{row.entity.txt_Subject}}</div></div><div class="dropdown-menu" aria-labelledby="dropdownMenuButton1" style="width:10%;padding:9px;text-align:center"><a class="dropdown-item mb-2" style="cursor:pointer; background-color:#0070bb;color:#fff !important" ng-if="row.entity.int_UserID == grid.appScope.SessionUserID" ng-click="grid.appScope.getDetails(row.entity.int_ProjectIssueID,row.entity.txt_IssueType)">Edit</a><a class= "dropdown-item" style="background-color:#3c3939 !important;color:#fff !important;width:100%;text-align:center;" ng-click="grid.appScope.GetViewDetails(row.entity.int_ProjectIssueID,row.entity.txt_IssueType)">View Details</a></div></div>'
            },
            {
                field: 'txt_IssueType',
                displayName: 'Type',
            },
            {
                field: 'dt_SubmittedDate',
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
        exporterMenuAllData: false,        exporterCsvFilename: 'BugEnhacement.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "Bug Enhancement", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'BugEnhacement.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };

    $scope.gridOptionsBugEnh.excessRows = 5000;
    $scope.BugEnhData = {
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

    $scope.GetBugEnhacementData = function () {
        $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/Bugs-Enhancement.aspx/GetBugEnhancementData",
            data: { projectID: ProjectID },
            dataType: 'json',
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.BugEnhData = d;
                $scope.GetSupportTickets();
                $scope.FillUsers();
            }
            else {
                $scope.Message = "Record does not exists";
            }
        })
            .catch(function onError(error) {
            });

    }

    $scope.GetBugEnhacementData();

    $scope.GetSupportTickets = function () {
        $http.post('../../../App/SupportTicket/managesupportticket.aspx/GetSupportTickets',
            {
                data:
                    {}
            }).then(function (response) {
                var d = JSON.parse(response.data.d);
                $scope.Categories = [];
                angular.forEach(d, function (value, index) {
                    $scope.Categories.push({ id: value.int_STicketId, label: value.txt_STicketSubject });
                });
            });
    }

    $scope.FillUsers = function () {
        $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/Bugs-Enhancement.aspx/FillUsers",
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
        document.getElementById("BugEnhNav").style.width = "60%";
    }
    $scope.CloseAddNav = function () {
        document.getElementById("BugEnhNav").style.width = "0%";
        $scope.GetBugEnhacementData();
    }

    $scope.UploadData = function (file, projectIssueID) {
        Upload.upload({
            url: '../../../App/Dashboard/ProjectANG/UploadFileBugEnh.ashx',
            data: { ProjectID: ProjectID, filetitle: $scope.filetitle, ProjectIssueID: projectIssueID },
            file: file
        })
            .then(function (response) {
                if (response.data.length > 0) {
                    var d = response.data;
                }
            })
    }

    $scope.ResetData = function () {
        $scope.filetitle = "";
        $scope.files = "";
        $scope.selectuser = "";
        $scope.tbx_comments = "";
        $scope.filetype = 'file';
        $scope.IsFile = true;
        $scope.IsLink = false;
        $scope.IsVisibleUpdate = false;
        $scope.IsVisibleUpdateFile = false;
        $scope.IsVisibleAdd = true;
        $scope.CategoriesSelected = [];
    }

    $scope.AddData = function () {
        $scope.loading = true;
        var categoryIds = [];
        angular.forEach($scope.CategoriesSelected, function (value, index) {
            categoryIds.push(value.id);
        });

        if ($scope.textlink == "" || $scope.textlink == undefined) {
            $scope.textlink = "";
        }
        if ($scope.tbx_comments == "" || $scope.tbx_comments == undefined) {
            $scope.tbx_comments = "";
        }
        var post = $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/Bugs-Enhancement.aspx/AddData",
            dataType: 'json',
            data: { projectID: ProjectID, subject: $scope.filetitle, description: $scope.tbx_comments, userid: $scope.selectuser, supportticketsIds: categoryIds, type: $scope.Type, linktext: $scope.textlink },
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
                if ($scope.Type == "Bug") {
                    toastr.success('Bug added successfully.');
                }
                if ($scope.Type == "Enhancement") {
                    toastr.success('Enhancement added successfully.');
                }
                $scope.GetBugEnhacementData();
            }
        })
            .catch(function onError(error) {
            });
    };

    $scope.getDetails = function (issueID, type) {

        $scope.GlobalIssueID = issueID;
        $scope.GlobalIssueType = type;
        var post = $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/Bugs-Enhancement.aspx/GetBugEnhancementDetails",
            dataType: 'json',
            data: { issueID: $scope.GlobalIssueID, type: $scope.GlobalIssueType },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = JSON.parse(response1.data.d);
            $scope.OpenSlider();
            $scope.IsVisibleUpdate = true;
            $scope.IsVisibleAdd = false;
            $scope.filetitle = d.Table[0].txt_Subject;
            $scope.FillUsers();
            $scope.selectuser = d.Table[0].int_AssignTo.toString();
            $scope.tbx_comments = d.Table[0].txt_Description;
            $scope.hdnStatus = d.Table[0].txt_Status;
            $scope.Type = d.Table[0].txt_IssueType;

            var cats = [];
            angular.forEach(d.Table2, function (value, index) {
                cats.push({ id: value.int_STicketId, label: value.txt_STicketSubject });
                angular.forEach($scope.Categories, function (value2, index2) {
                    if (value.int_STicketId == value2.id) {
                        $scope.CategoriesSelected.push(value2);
                    }
                });
            });
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
            url: "../../../App/Dashboard/ProjectANG/Bugs-Enhancement.aspx/DeleteFile",
            dataType: 'json',
            data: { fileID: fileid },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            if (response1.data.d.length > 0) {
                var d = response1.data.d
                if (d != "0") {
                    toastr.success('File Deleted Successfully');
                    $scope.getDetails($scope.GlobalIssueID, $scope.GlobalIssueType);
                }
            }
        }).catch(function onError(error) {
        });
    }

    $scope.UpdateData = function () {
        var status = $scope.hdnStatus;
        $scope.loading = true;
        var categoryIds = [];
        angular.forEach($scope.CategoriesSelected, function (value, index) {
            categoryIds.push(value.id);
        });

        if ($scope.textlink == "" || $scope.textlink == undefined) {
            $scope.textlink = "";
        }
        if ($scope.tbx_comments == "" || $scope.tbx_comments == undefined) {
            $scope.tbx_comments = "";
        }
        var post = $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/Bugs-Enhancement.aspx/UpdateData",
            dataType: 'json',
            data: { IssueID: $scope.GlobalIssueID, projectID: ProjectID, subject: $scope.filetitle, description: $scope.tbx_comments, userid: $scope.selectuser, supportticketsIds: categoryIds, type: $scope.Type, linktext: $scope.textlink, hdnStatus: status },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = response1.data.d;
            if (d != null) {
                $scope.GetBugEnhacementData();
                if ($scope.filetype == 'file') {
                    $scope.UploadData($scope.files, d);
                }
                $scope.ResetData();
                $scope.CloseAddNav();
                $scope.loading = false;
                if ($scope.Type == "Bug") {
                    toastr.success('Bug updated successfully.');
                }
                if ($scope.Type == "Enhancement") {
                    toastr.success('Enhancement updated successfully.');
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

    $scope.OpenSTSlider = function () {
        document.getElementById("STNav").style.width = "58.7%";
    }

    $scope.CloseSTSlider = function () {
        document.getElementById("STNav").style.width = "0%";
    }

    $scope.GetViewDetails = function (issueID, type) {
        var post = $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/Bugs-Enhancement.aspx/GetBugEnhancementDetails",
            dataType: 'json',
            data: { issueID: issueID, type: type },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = JSON.parse(response1.data.d);
            $scope.subject = d.Table[0].txt_Subject;
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

            if (d.Table2.length > 0) {
                var stlist = [];
                angular.forEach(d.Table2, function (value, index) {
                    stlist.push({ id: value.int_STicketId, name: value.TicketHeadings, startdate: value.dt_SubmittedDate, assignuser: value.AssignedToUserName, status: value.txt_STicketStatus });
                });
                $scope.STLists = stlist;
                $scope.IsVisibleUpdateSTView = true;
            }
            else {
                $scope.IsVisibleUpdateSTView = false;
            }
        })
            .catch(function onError(error) {
            });
    }


    $scope.DownloadFile = function (fileid, filename) {
        console.log("id", fileid);
        console.log("name", filename);
        $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/Bugs-Enhancement.aspx/DownloadFile",
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

    $scope.OpenSTView = function (sticketID) {
        $scope.OpenSTSlider();
    }
    $scope.GetSTDdetails = function (id) {
        var post = $http({
            method: "POST",
            url: "../../../App/SupportTicket/support-ticket-one.aspx/getSupportTicketsUsers",
            dataType: 'json',
            data: { ticketID: id },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = JSON.parse(response1.data.d);
            var sev;
            if (d.TicketDeatils[0].Severity == 1) { sev = "High" } else if (d.TicketDeatils[0].Severity == 2) { sev = "Medium" } else { sev = "Low" }
            //if (d.TicketDeatils[0].FileDiv == true) {
            //    $scope.FilesDiv = true;
            //} else if (d.TicketDeatils[0].FileDiv == false) {
            //    $scope.FilesDiv = false;
            //}
            $scope.PCode = d.TicketDeatils[0].ProjectCode;
            $scope.TCode = d.TicketDeatils[0].ltr_code;
            $scope.TSubject = d.TicketDeatils[0].ltr_subject;
            $scope.PName = d.TicketDeatils[0].hyAProject;
            $scope.UName = d.TicketDeatils[0].createdusername;
            $scope.UEmail = d.TicketDeatils[0].hyAemail;
            $scope.SLAType = d.TicketDeatils[0].SlaType;
            $scope.SLAHours = d.TicketDeatils[0].ltr_ASLA;
            $scope.CreatedDate = d.TicketDeatils[0].submiteddate;
            $scope.Desc = d.TicketDeatils[0].Description;
            $scope.S_Severity = sev;
            $scope.OpenSTSlider();
        })
            .catch(function onError(error) {
            });
    }
}]);



