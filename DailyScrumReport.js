var app = angular.module("Dailyscrumgrid", ["ngRoute", "ngFileUpload", "ui.grid", "ui.grid.grouping", "ui.grid.selection", "ui.bootstrap"]);

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

            //scope.$watch(attrs.dateAfter, function (value) {

            //    otherDate = value;
            //    validate();
            //});
            //scope.$watch(attrs.ngModel, function (value) {

            //    date = value;
            //    validate();
            //});
            //function validate() {
            //    controller.$setValidity('dateAfter', !date || !otherDate || new Date(date) >= new Date(otherDate));
            //}
        }
    };
});

app.controller("dailyscrumctrl", ['$scope', '$http', '$filter', '$window', '$uibModal', 'uiGridConstants', 'Upload', function ($scope, $http, $filter, $window, $uibModal, uiGridConstants, Upload) {
    $scope.taskname = "";
    $scope.Milestone = "";
    $scope.Type = "";
    $scope.AssignedBy = "";
    $scope.StartDate = "";
    $scope.EndDate = "";
    $scope.AssignedTo = "";
    $scope.EstimatedTime = "";
    $scope.SpentTime = "";
    $scope.TaskBugData = "";
    $scope.TaskEnhancementData = "";
    $scope.TaskBlockerData = "";
    $scope.TaskRiskData = "";
    $scope.globalTaskID = 0;
    $scope.globalProjectID = 0;
    $scope.BUData = {
        "data": []
    };
    $scope.FillBusinessUnit = function () {

        $http.post('../../../App/Reports/DailyScrumReport.aspx/GetBusinessUnit',
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
        $scope.BUSelect = '0';
    }
    $scope.FillBusinessUnit();
    $scope.gridOptionsdailyscrum = {
        //enableHorizontalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED, // Here!
        //enableVerticalScrollbar: uiGridConstants.scrollbars.WHEN_NEEDED,
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'DailyscrumData',
        columnDefs: [
            {
                field: 'txt_ProjectName',
                displayName: 'Project',
                grouping: { groupPriority: 1 },
                width: '20%',
                cellTemplate: '<div ng-if="!(row.groupHeader && col.grouping.groupPriority === row.treeLevel)" class="task-name project-width border-left-dark"><span class="dropdown-toggle d-block text-overflow" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="{{row.entity.txt_ProjectName}}">{{row.entity.txt_ProjectName}}</span><small class="board-no">{{row.entity.txt_ProjectCode}}</small></div>' + '<div class="task-name project-width ui-grid-cell-contents" ng-if="(row.groupHeader && col.grouping.groupPriority === row.treeLevel)"><div > {{grid.appScope.getValue(\'txt_ProjectName\', row.treeNode.children )}} </div></div>'


            },
            {
                field: 'txt_TaskName',
                displayName: 'Task',
                width: '10%',
                cellTemplate: '<div ng-if="!(row.groupHeader && col.grouping.groupPriority === row.treeLevel)" class="task-name project-width"><span class="dropdown-toggle d-block text-overflow" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" title="{{row.entity.txt_TaskName}}">{{row.entity.txt_TaskName}}</span><div class="dropdown-menu" style="width: auto !important;padding:8px;" aria-labelledby="dropdownMenuButton"><a class="dropdown-item" style="cursor:pointer; background-color:#e2445b;color:#fff;text-align:center;" ng-click="grid.appScope.OpenNav(row.entity.int_ProjectTaskID,row.entity.int_ProjectID,row.entity.txt_Activity)">Comment</a></div></div>' + '<div class="task-name project-width ui-grid-cell-contents" ng-if="(row.groupHeader && col.grouping.groupPriority === row.treeLevel)"><div > {{grid.appScope.getValue(\'txt_TaskName\', row.treeNode.children )}} </div></div>'
            },
            {
                field: 'UserName',
                displayName: 'Username',
                width: '10%',
                cellTemplate: '<div ng-if="row.entity.Profilepic!=null" class="ui-grid-cell-contents"><img src=\"{{row.entity.Profilepic}}\" class="setProfileImage" width="45" height="45" "/>&nbsp{{row.entity.UserName}}<div>',
                cellClass: 'fontcentre'
            },
            {
                field: 'DasytoETA',
                displayName: 'Days to ETA',
                width: '10%',
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'int_TaskStatus',
                displayName: '% Completed',
                width: '10%',
                cellTemplate: '<div ng-if="row.entity.int_ProjectTaskActionID!=3" style="width:100%" class="task-field project-width p-0 projectprogress"><div class="progress"><span class="progress-bar" style="width:{{grid.getCellValue(row, col)>100 ? 100 : grid.getCellValue(row, col)}}%;"> </span></div> <span class="progress-value">{{grid.getCellValue(row, col)>100 ? 100 : grid.getCellValue(row, col)}}%</span></div><div ng-if="row.entity.int_ProjectTaskActionID==3" class="text-center fontcentre">Not Accepted</div>',

            },
            {
                field: 'dt_StartDate', displayName: 'Start Date', cellClass: 'text-center fontcentre',
                cellFilter: 'date:\'dd-MMM-yyyy\'', width: '10%',
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
                cellFilter: 'date:\'dd-MMM-yyyy\'', width: '10%',
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
                field: 'txt_Activity',
                displayName: 'Stage',
                width: '10%',
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'HoursMinutes',
                displayName: 'Estimated Time',
                width: '10%',
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'SpentHoursDec',
                displayName: 'Hours Spent',
                width: '10%',
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'Sprint',
                displayName: 'Sprint',
                width: '10%',
                cellClass: 'text-center fontcentre'
            },
            {
                field: 'txt_tasktype',
                displayName: 'Type',
                width: '10%',
                cellClass: 'text-center fontcentre'
            },

        ],
        enableSelectAll: true,
        exporterMenuAllData: true,        exporterCsvFilename: 'DailyScrum.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "Daily Scrum", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'DailyScrum.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };
    $scope.gridOptionsdailyscrum.excessRows = 100000;

    $scope.MessageDailyscrum = "Please Wait....";
    $scope.DailyscrumData = {
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
    //Daily scrum Grid Bind Function
    $scope.GetDailyScrumTask = function () {

        $http({
            method: "POST",
            url: "../../../App/Reports/DailyScrumReport.aspx/GetTaskData",
            dataType: 'json',
            data: { BUID: $scope.BUSelect },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            if (response1.data.d.length > 0) {
                var d = JSON.parse(response1.data.d);
                if (d.length > 0) {
                    $scope.DailyscrumData = d;
                }
                else {
                    $scope.DailyscrumData = {
                        "data": []
                    };
                    $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                    $scope.MessageDailyscrum = "Record does not exists";
                }
            }
            else {
                $scope.DailyscrumData = {
                    "data": []
                };
                $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.ALL);
                $scope.MessageDailyscrum = "Record does not exists";
            }
        })
            .catch(function onError(error) {
            });
    }
    $scope.GetDailyScrumTask();
    $scope.TaskHistoryData = {
        "data": []
    };
    $scope.GetTaskDetails = function (taskid, projectid, type) {

        var hdfEdit = $("hdf_IsEditAccess").val();
        if (hdfEdit == "1")
            $("#Edit-tab").show();
        else
            $("#Edit-tab").hide();

        if (type == "UAT")
            $("#uat-tab").show();
        else
            $("#uat-tab").hide();
        $http({
            method: "POST",
            url: "../../../App/Reports/DailyScrumReport.aspx/GetTaskDetails",
            dataType: 'json',
            data: { taskid: taskid },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            if (response1.data.d.length > 0) {
                var d = JSON.parse(response1.data.d);
                console.log(d);
                if (d.Table != undefined) {

                    $scope.taskname = d.Table[0].txt_TaskName;
                    $scope.Milestone = d.Table[0].txt_Activity;
                    $scope.Type = d.Table[0].txt_tasktype;
                    $scope.AssignedBy = d.Table[0].AssignedBy;
                    $scope.StartDate = $filter('date')(new Date(d.Table[0].dt_StartDate), "dd-MMM-yyyy");
                    $scope.EndDate = $filter('date')(new Date(d.Table[0].dt_Enddate), "dd-MMM-yyyy");
                    $scope.AssignedTo = d.Table[0].AssignedTo;
                    $scope.EstimatedTime = d.Table[0].HoursMinutes;
                    $scope.SpentTime = ConvertDecToHour(d.Table[0].int_totalHoursSpend);
                    $("#img_AssignedTo").attr("src", (d.Table[0].AssignedToProfileimage != null) ? d.Table[0].AssignedToProfileimage : "../../assets/img/avatar3_small.jpg");
                    $("#img_Assignedby").attr("src", (d.Table[0].Profileimage != null) ? d.Table[0].Profileimage : "../../assets/img/avatar3_small.jpg");
                    $scope.GetTaskStages();
                    $scope.GetTaskSprint();
                    $scope.GetMinutes();

                    $scope.stageSelect = d.Table[0].int_WorkFlowActivityID.toString();
                    $scope.GetTaskStageUser();
                    $scope.userSelect = d.Table[0].int_UserID.toString();
                    $scope.sprintSelect = d.Table[0].int_SprintID.toString();
                    $scope.enddatevalue = $filter('date')(new Date(d.Table[0].dt_Enddate), "dd-MMM-yyyy");
                    $scope.taskhours = d.Table[0].Hours;
                   
                    $scope.minuteSelect = d.Table[0].Minutes.toString();
                    if (d.Table[0].Minutes.toString().length == 1)
                        $scope.minuteSelect = "0" + d.Table[0].Minutes.toString();
                    $scope.commentdesc = d.Table[0].txt_Comment;
                    var TaskStatus = d.Table[0].TaskStatus;
                    var ProjectStatus = d.Table[0].ProjectStatus;

                    if (TaskStatus == 6 || ProjectStatus == 2 || ProjectStatus == 3)
                        $("#Edit-tab").hide();
                    else
                        $("#Edit-tab").show();
                }
                var firstoption = [];
                if (d.Table1 != undefined && Object.keys(d.Table1).length != 0) {
                    $("#div_bugcard").show();
                    $.each(d.Table1, function (index) {
                        var x = d.Table1[index];
                        x["dt_SubmittedDate"] = $filter('date')(new Date(d.Table1[index].dt_SubmittedDate), "dd-MMM-yyyy");
                    })
                    $scope.TaskBugData = d.Table1;
                    firstoption.push('show');
                }
                else {
                    $("#div_bugcard").hide();
                    firstoption.push('hide');
                }
                if (d.Table2 != undefined && Object.keys(d.Table2).length != 0) {
                    $("#div_enhancementcard").show();
                    $.each(d.Table2, function (index) {
                        var x = d.Table2[index];
                        x["dt_SubmittedDate"] = $filter('date')(new Date(d.Table2[index].dt_SubmittedDate), "dd-MMM-yyyy");
                    })
                    $scope.TaskEnhancementData = d.Table2;
                    firstoption.push('show');


                }
                else { $("#div_enhancementcard").hide(); firstoption.push('hide'); }
                if (d.Table3 != undefined && Object.keys(d.Table3).length != 0) {
                    $("#div_blockercard").show();
                    $.each(d.Table3, function (index) {
                        var x = d.Table3[index];
                        x["dtSubmittedDate"] = $filter('date')(new Date(d.Table3[index].dtSubmittedDate), "dd-MMM-yyyy");
                    })
                    $scope.TaskBlockerData = d.Table3;
                    firstoption.push('show');
                }
                else { $("#div_blockercard").hide(); firstoption.push('hide'); }
                if (d.Table4 != undefined && Object.keys(d.Table4).length != 0) {
                    $("#div_riskcard").show();
                    $.each(d.Table4, function (index) {
                        var x = d.Table4[index];
                        x["dtSubmittedDate"] = $filter('date')(new Date(d.Table4[index].dtSubmittedDate), "dd-MMM-yyyy");

                    })
                    $scope.TaskRiskData = d.Table4;
                    firstoption.push('show');
                }
                else { $("#div_riskcard").hide(); firstoption.push('hide'); }

                $.each(firstoption, function (index) {
                    if (firstoption[index] == "show") {
                        switch (index) {
                            case 0: $("#div_bugcard").find("#collapseeight").collapse('show');;
                                break;
                            case 1: $("#div_enhancementcard").find("#collapseNine").collapse('show');;
                                break;
                            case 2: $("#div_blockercard").find("#collapseTen").collapse('show');
                                break;
                            case 3: $("#div_riskcard").find("#collapseEleven").collapse('show');
                                break;
                        }
                    }
                });

                $scope.getTaskHistory(taskid);
                $scope.get_UATData(projectid);
               
            }
        })
            .catch(function onError(error) {
            });
    }

    $scope.getTaskHistory = function (taskid) {
        $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/ManageProjectPlan.aspx/GetTaskHistory",
            dataType: 'json',
            data: { taskid: taskid },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = response1.data.d;
            if (d.length > 0) {
                $scope.TaskHistoryData = d;
            }
        })
    }
    $scope.AddTaskComments = function () {
        var post = $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/ManageProjectPlan.aspx/AddReply",
            dataType: 'json',
            data: { taskid: $scope.globalTaskID, comments: $scope.comment },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = response1.data.d;
            if (d.length > 0) {
                $scope.comment = '';
                $scope.getTaskHistory($scope.globalTaskID);
            }
        })
            .catch(function onError(error) {
            });
    }
    $scope.minutesData = {
        "data": []
    };
    $scope.GetMinutes = function () {

        $http.post('../../../App/Dashboard/ProjectANG/ManageProjectPlan.aspx/GetMinutes',
            {
                data:
                    {}
            }).then(function (response) {

                if (response.data.d.length > 0) {
                    var d = JSON.parse(response.data.d);
                    $scope.minutesData = d;
                }
            });
        $scope.minuteSelect = "00";
    }
    //Stages Bind End

    //task user stage wise Bind
    $scope.TaskStageUserData = {
        "data": []
    };


    //Stages Bind
    $scope.TaskStageData = {
        "data": []
    };
    $scope.GetTaskStages = function () {

        $http.post('../../../App/Dashboard/ProjectANG/ManageProjectPlan.aspx/GetTaskStage',
            {
                data:
                    {}
            }).then(function (response) {

                if (response.data.d.length > 0) {
                    var d = JSON.parse(response.data.d);
                    $scope.TaskStageData = d;
                }
            });
       
    }
    //Stages Bind End
    $scope.GetTaskStageUser = function () {

        var post = $http({
            method: "POST",
            url: "../../../App/Reports/DailyScrumReport.aspx/GetUsers",
            dataType: 'json',
            data: { stageid: $scope.stageSelect, projectid: $scope.globalProjectID },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            console.log(response1);
            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.TaskStageUserData = d;
            }
        })
            .catch(function onError(error) {
            });
    }
    //Bind Sprint
    $scope.TaskSprintData = {
        "data": []
    };
    $scope.GetTaskSprint = function () {

        $http.post('../../../App/Dashboard/ProjectANG/ManageProjectPlan.aspx/GetSprint',
            {
                data:
                    {}
            }).then(function (response) {

                if (response.data.d.length > 0) {
                    var d = JSON.parse(response.data.d);
                    $scope.TaskSprintData = d;
                }
            });
    }
    //Bind Sprint End
    $scope.OpenNav = function (taskid, projectid, type = '') {
        $scope.globalTaskID = taskid;
        $scope.globalProjectID = projectid;
       
        $scope.GetTaskDetails(taskid, projectid, type);
        document.getElementById("myNav").style.width = "60%";
        document.getElementById("tasks-tab").click();
        //$("#tasks-tab").click();
    }
    $scope.CloseNav = function () { document.getElementById("myNav").style.width = "0"; }
    $scope.getValue = function (field, treeRowEntity) {
        return treeRowEntity[0].row.entity[field] + ' (' + treeRowEntity.length + ')';
    };

    function ConvertDecToHour(remaininghours) {
        var decimalTimeString = remaininghours;
        var decimalTime = parseFloat(decimalTimeString);
        decimalTime = decimalTime * 60 * 60;
        var hours = Math.floor((decimalTime / (60 * 60)));
        decimalTime = decimalTime - (hours * 60 * 60);
        var minutes = Math.round((decimalTime / 60));
        decimalTime = decimalTime - (minutes * 60);
        var seconds = Math.round(decimalTime);
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        return hours + ":" + minutes;
    }

    $scope.UATchart=function(resultdata) {
        var label = resultdata.Monthname.split(',');
        var TestedTransactionData = resultdata.TestedTransaction.split(',');
        var PassedTransactionData = resultdata.PassedTransaction.split(',');
        var FailedTransactionData = resultdata.FailedTransaction.split(',');
        var NotProcessedTransactionData = resultdata.NotProcessedTransaction.split(',');
        var FailedQCTransactionData = resultdata.FailedQCTransaction.split(',');
        var valuename = 'Number of Transactions';
        var labelname = 'Date';

        new Chart(document.getElementById('echarts_bar2').getContext('2d'), {

            type: 'line',
            data: {
                labels: label,

                datasets: [
                    {
                        label: 'Transaction Tested',
                        tension: 0,
                        borderColor: "rgba(102, 201, 201)",
                        data: TestedTransactionData,
                        fill: false
                    },
                    {
                        label: 'Passed Transaction',
                        tension: 0,
                        borderColor: "rgba(181, 114, 255)",
                        data: PassedTransactionData,
                        fill: false

                    },
                    {
                        label: 'Failed Transaction',
                        tension: 0,
                        borderColor: "rgba(255, 212, 111)",
                        data: FailedTransactionData,
                        fill: false
                    },
                    {
                        label: 'Transaction not processed',
                        tension: 0,
                        borderColor: "rgba(127, 212, 150)",
                        data: NotProcessedTransactionData,
                        fill: false
                    },
                    {
                        label: 'Transaction Failed QC',
                        tension: 0,
                        borderColor: "rgba(232, 218, 239)",
                        data: FailedQCTransactionData,
                        fill: false
                    }
                ]
            },
            options: {
                legend: {
                    display: true,
                    labels: {
                        fontStyle: "bold", fontSize: 15
                    }
                },
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: false,
                            labelString: valuename,
                        },
                        ticks: {
                            beginAtZero: true,
                            userCallback: function (label, index, labels) {
                                // when the floored value is the same as the value we have a whole number
                                if (Math.floor(label) === label) {
                                    return label;
                                }
                            }
                        },
                    }],
                    xAxes: [{
                        scaleLabel: {
                            display: false,
                            fontSize: 15,
                            fontStyle: "bold",
                            labelString: labelname
                        },
                        ticks: {
                            fontSize: 14,
                            fontStyle: "bold",
                            autoSkip: false,
                            beginAtZero: true
                        }
                    }]
                }
            }
        });

    }

    $scope.get_UATData = function (projectid) {
        $http({
            method: "POST",
            url: "../../../App/Reports/DailyScrumReport.aspx/Fill_UATChartData",
            dataType: 'json',
            data: { projectid: projectid },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var Adata = JSON.parse(response1.data.d);
            $scope.UATchart(Adata);
        })
       

    }
    $scope.UpdateTask = function () {
        var post = $http({
            method: "POST",
            url: "../../../App/Reports/DailyScrumReport.aspx/UpdateTask",
            dataType: 'json',
            data: { stage: $scope.stageSelect, user: $scope.userSelect, estimatedefforts: $scope.taskhours, enddate: $scope.enddatevalue, comment: $scope.commentdesc, projectTaskID: $scope.globalTaskID, sprint: $scope.sprintSelect, minutes: $scope.minuteSelect },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            console.log(response1);
            if (response1.data.d == "onSuccess") {
                $scope.CloseNav();
                toastr.success("Task Updated Successfully.");
            }
        })
            .catch(function onError(error) {
            });
    }
}]);
function sticktothetop() {    var window_top = $(window).scrollTop();    var top = $('#stick-here').offset().top;    $('.ui-grid-header').addClass('stick');    if (window_top > top) {        $('.ui-grid-header').addClass('stick');        $('.main-header').hide();        $('#stick-here').height($('.ui-grid-header').outerHeight());        if (tmp == 0) {            $('.ui-grid-viewport').height($(document).height() - 300);            tmp = 1;        }    } else {        $('.ui-grid-header').removeClass('stick');        $('.main-header').show();        $('#stick-here').height(0);    }}
$(function () {    $(window).scroll(sticktothetop);    sticktothetop();});

