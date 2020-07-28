
var app = angular.module("uatapp", ["ngRoute", "ngFileUpload", "ui.grid", "ui.grid.grouping", "ui.grid.exporter", "ui.grid.autoResize", "ui.bootstrap"]);

app.directive("jqdatepicker", function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function link(scope, element, attrs, controller) {

            element.datepicker({
                dateFormat: "dd-MM-yy",
                onSelect: function (dt) {
                    scope.$apply(function () {
                        controller.$setViewValue(dt);
                        scope.$apply();
                    });
                },
            });
            var date, otherDate;
            scope.$watch(attrs.dateAfter, function (value) {
                otherDate = value;
                validate();
            });
            scope.$watch(attrs.ngModel, function (value) {
                date = value;
                validate();
            });
            function validate() {
                controller.$setValidity('dateAfter', !date || !otherDate || date >= otherDate);
            }
        }
    };
});
app.controller("uatctrl", ['$scope', '$http', '$q', '$window', '$uibModal', function ($scope, $http, $q, $window, $uibModal) {

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

    $scope.gridOptionsUATLogs = {
        enableSorting: true,
        enableFiltering: true,
        enableGridMenu: true,
        treeRowHeaderAlwaysVisible: false,
        useUiGridDraggableRowsHandle: false,
        data: 'UatLogData',
        columnDefs: [
            {
                field: 'dt_SubmittedDate',
                displayName: 'Date',
                //cellClass: 'text-center fontcentre',
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
                field: 'int_TestedTransaction',
                displayName: 'Transaction Tested',
            },
            {
                field: 'int_PassedTransaction',
                displayName: 'Passed Transaction',
            },
            {
                field: 'int_FailedTransaction',
                displayName: 'Failed Transaction',
            },
            {
                field: 'int_NotProcessedTransaction',
                displayName: 'Not Processed Transaction',
            },
            {
                field: 'int_FailedQC',
                displayName: 'Failed QC Transaction',
            },
            {
                field: 'Name',
                displayName: 'Tester',
                cellClass: 'text-center fontcentre',
                cellTemplate: '<div><img src=\"{{row.entity.ProfilePic}}\" class="setProfileImage"  width="45" height="45" "/>&nbsp{{row.entity.Name}}<div>',
            },
            {
                field: 'View',
                displayName: 'View',
                cellClass: 'text-center fontcentre',
                cellTemplate: '<div><a ng-click="grid.appScope.GetViewDetails(row.entity.int_UATLogID)"><i class="la la-eye mt-1" style="font-size: 25px;"></a></div>',
                enableFiltering: false
            },
        ],
        enableSelectAll: true,
        exporteOprMenuAllData: false,        exporterCsvFilename: 'UATLogs.csv',        exporterPdfDefaultStyle: { fontSize: 9 },        exporterPdfTableStyle: { margin: [10, 10, 10, 10] },        exporterPdfTableHeaderStyle: { fontSize: 10, bold: true, italics: true, color: 'black' },        exporterPdfHeader: { text: "UAT Log", style: 'headerStyle' },        exporterPdfFooter: function (currentPage, pageCount) {            return { text: currentPage.toString() + ' of ' + pageCount.toString(), style: 'footerStyle' };        },        exporterPdfCustomFormatter: function (docDefinition) {            docDefinition.styles.headerStyle = { fontSize: 12, bold: true, alignment: 'center', padding: 5 };            docDefinition.styles.footerStyle = { fontSize: 10, bold: true, alignment: 'center', padding: 5 };            return docDefinition;        },
        exporterPdfOrientation: 'portrait',
        exporterPdfPageSize: 'LETTER',
        exporterPdfMaxGridWidth: 450,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        exporterExcelFilename: 'UATLogs.xlsx',
        exporterExcelSheetName: 'Sheet1',
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        },
    };

    $scope.gridOptionsUATLogs.excessRows = 5000;
    $scope.UatLogData = {
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

    $scope.GetUATLogData = function () {
        $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/UATLogs.aspx/GetUATLogData",
            data: { projectID: ProjectID, userID: $scope.SessionUserID },
            dataType: 'json',
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {

            var d = JSON.parse(response1.data.d);
            if (d.length > 0) {
                $scope.UatLogData = d;
            }
            else {
                $scope.Message = "Record does not exists";
            }
        })
            .catch(function onError(error) {
            });

    }

    $scope.GetUATLogData();

    $scope.OpenSlider = function () {
        $scope.ResetData();
        document.getElementById("UATNav").style.width = "50%";
    }
    $scope.CloseUATNav = function () {
        document.getElementById("UATNav").style.width = "0%";
        $scope.GetUATLogData();
    }

    $scope.OpenViewSlider = function () {
        document.getElementById("myNav").style.width = "50%";
    }

    $scope.CloseViewNav = function () {
        document.getElementById("myNav").style.width = "0%";
        $scope.GetUATLogData();
    }

    $scope.ResetData = function () {
        $scope.testedTransaction = "";
        $scope.passedTransaction = "";
        $scope.failedtransaction = "";
        $scope.notprocessedTransaction = "";
        $scope.failedQC = "";
        $scope.tbx_comments = "";
        $scope.startdatevalue = "";
    }

    $scope.AddData = function () {
        $scope.loading = true;
        if ($scope.tbx_comments == "" || $scope.tbx_comments == undefined) {
            $scope.tbx_comments = "";
        }
        var post = $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/UATLogs.aspx/AddData",
            dataType: 'json',
            data: { projectID: ProjectID, testedTransaction: $scope.testedTransaction, passedTransaction: $scope.passedTransaction, failedTransaction: $scope.failedtransaction, notProcessedTransaction: $scope.notprocessedTransaction, failedQCTransaction: $scope.failedQC, description: $scope.tbx_comments, date: $scope.startdatevalue },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = response1.data.d;
            if (d == "Success") {
                $scope.ResetData();
                $scope.CloseUATNav();
                $scope.loading = false;
                toastr.success('UAT added successfully.');
            }
            else {
                $scope.ResetData();
                $scope.CloseUATNav();
                $scope.loading = false;
                toastr.error('Log already exist for this date');
            }
            $scope.GetUATLogData();
        })
            .catch(function onError(error) {
            });
    };

    $scope.GetViewDetails = function (uatlogid) {
        var post = $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/UATLogs.aspx/GetUATDetails",
            dataType: 'json',
            data: { uatlogid: uatlogid },
            headers: { "Content-Type": "application/json" }
        }).then(function (response1) {
            var d = JSON.parse(response1.data.d);
            $scope.OpenViewSlider();
            $scope.date = d[0].dt_SubmittedDate;
            $scope.testedtrans = d[0].int_TestedTransaction;
            $scope.passedtrans = d[0].int_PassedTransaction;
            $scope.failedtrans = d[0].int_FailedTransaction;
            $scope.notprocessedtrans = d[0].int_NotProcessedTransaction;
            $scope.failedqc = d[0].int_FailedQC;
            $scope.remarks = d[0].Remarks;

        })
            .catch(function onError(error) {
            });
    }

    $scope.GetChart = function () {
        $http({
            method: "POST",
            url: "../../../App/Dashboard/ProjectANG/UATLogs.aspx/Get_Chart_Data",
            data: { projectID: ProjectID },
            dataType: 'json',
            headers: { "Content-Type": "application/json" }
        }).then(function (response) {
            var result = JSON.parse(response.data.d);
            var Monthname = result.split("^")[0].split(',');
            var TestedTransaction = result.split("^")[1].split(',');
            var PassedTransaction = result.split("^")[2].split(',');
            var FailedTransaction = result.split("^")[3].split(',');
            var NotProcessedTransaction = result.split("^")[4].split(',');
            var FailedQCTransaction = result.split("^")[5].split(',');
            var TotalTransactionTested = result.split("^")[6].split(',');
            var TotalPassedTransaction = result.split("^")[7].split(',');
            var TotalFailedTransaction = result.split("^")[8].split(',');
            var TotalNotProcessedTransaction = result.split("^")[9].split(',');
            var TotalFailedQCTransaction = result.split("^")[10].split(',');

            var valuename = 'Number of Transactions';
            var labelname = 'Date';
            new Chart(document.getElementById('echarts_bar2').getContext('2d'), {
                type: 'line',
                data: {
                    labels: Monthname,

                    datasets: [
                        {
                            label: 'Transaction Tested',
                            tension: 0,
                            borderColor: "rgba(102, 201, 201)",
                            data: TestedTransaction,
                            fill: false
                        },
                        {
                            label: 'Passed Transaction',
                            tension: 0,
                            borderColor: "rgba(181, 114, 255)",
                            data: PassedTransaction,
                            fill: false

                        },
                        {
                            label: 'Failed Transaction',
                            tension: 0,
                            borderColor: "rgba(255, 212, 111)",
                            data: FailedTransaction,
                            fill: false
                        },
                        {
                            label: 'Transaction not Processed',
                            tension: 0,
                            borderColor: "rgba(127, 212, 150)",
                            data: NotProcessedTransaction,
                            fill: false
                        },
                        {
                            label: 'Transaction Failed QC',
                            tension: 0,
                            borderColor: "rgba(232, 218, 239)",
                            data: FailedQCTransaction,
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
                                display: true,
                                fontSize: 15,
                                fontStyle: "bold",
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
                                display: true,
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
        });
    }


    $scope.GetChart();
}]);



