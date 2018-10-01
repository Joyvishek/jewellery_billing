(function() {

  angular
    .module('meanApp')
    .controller('studentplatformCtrl', studentplatformCtrl);
  studentplatformCtrl.$inject = ['$location','$routeParams', 'meanData', '$scope', '$http', 'authentication','$window'];
    function studentplatformCtrl ($location, $routeParams, meanData, $scope, $http, authentication,$window) {
      console.log('Bagless-student-platform controller is running');
        var vm = this;

        vm.user = {};
        vm.classroomsessiondata={};
        vm.sectionStudentIds = [];
        vm.schoolCurrentSession = {};
        $scope.enterClass = function () {
            meanData.getOngoingSession(vm.jsondata.currentsection._id)
            .success(function(ongoingsession){
                vm.ongoingsession = ongoingsession;
                meanData.getIfStudentEnteredClass({"classroom_sessionId" : vm.ongoingsession[0]._id, "studentId" : vm.jsondata._id})
                .success(function(onlinestudent){

                    if (onlinestudent.res == false) {
                        meanData.enterClass({"classroom_sessionId" : vm.ongoingsession[0]._id})
                        .success(function(stdenterclass){
                            $window.location = '/students/enterclass/' + vm.jsondata.currentsection._id;
                        });
                    }
                    else{
                        $window.location = '/students/enterclass/' + vm.jsondata.currentsection._id;
                    }
                });
            });
        };
        meanData.getUserProfile()
          .success(function(userdata) {
            vm.jsondata = userdata;
            vm.currentClass= "";
/************** Get current session for the school ***************/
			meanData.getSchoolCurrentSession({"schoolId" : vm.jsondata.currentschool._id})
			.success(function(currentsessiondata){
				vm.schoolCurrentSession = currentsessiondata;
			});
/************** End current session for the school *********/

          //alert(JSON.stringify(data));
               //console.log(vm.attendancedata.attendancePercentage);
            meanData.getSection($routeParams.sectionid)
            .success(function(sectiondata){
                vm.sectiondata = sectiondata;
                for (var key in sectiondata.students) {
                if (sectiondata.students.hasOwnProperty(key)){
                //vm.jsondata._id.push(sectiondata.students[key]._id);
                    }
                }

                  meanData.getClassAgainstSection(vm.jsondata.currentsection._id)
               .success(function(classdata){
                vm.currentClass = classdata._id;
            });


                meanData.getClassTeacherMonitor(vm.jsondata.currentsection._id)
                .success(function(techmonitordata){
                    vm.techmonitordata = techmonitordata;
                    meanData.getTeacherSubjects(vm.jsondata._id)
                    .success(function(techsubjectdata){
                        vm.techsubjectdata = techsubjectdata;
                  meanData.getTodaysAttendance(vm.jsondata.currentsection._id)
               .success(function(attendancedata){
                       //alert(JSON.stringify(data));
                       vm.attendancedata = attendancedata;
                       meanData.getSchoolTeachers(vm.jsondata.currentschool._id)
                      .success(function(teacherdata) {
                      vm.teachersdata = teacherdata[0];
                      //alert(JSON.stringify(teacherdata));
                      /*meanData.getClassTeacherMonitor(vm.jsondata.sectionId._id)
                      .success(function(classdetailsdata){
                          vm.classdetailsdata = classdetailsdata;
                              });*/
                              meanData.getStudentRoutineSubjects(vm.jsondata._id)
                              .success(function(studentsubjectdata){
                                  vm.studentsubjectdata = studentsubjectdata;
                                      /*getWeeklyStudentAttendance*/
                                      meanData.getWeeklyStudentAttendance( {"sectionId": $routeParams.sectionid, "studentId" : vm.jsondata._id, "endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart} )
                                      .success(function(weeklyattendancedataown){

                                    meanData.getWeeklyStudentAttendance( {"sectionId": $routeParams.sectionid, "endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart} )
                                    .success(function(weeklyattendancedata){
                                        var data = weeklyattendancedata;
                                        var chartData = [];
                                        for(var i in data) {
                                            var week = data[i]._id.week;
                                            var year = data[i]._id.year;
                                            var date = getDateOfWeek(week, year);
                                            var attendancePercentage = 0;
                                            if(data[i].presentCount + data[i].absentCount > 0){
                                                attendancePercentage = (100 * data[i].presentCount) / (data[i].presentCount + data[i].absentCount);
                                            }
                                            chartData.push([date,attendancePercentage]);    
                                        }

                                        var data = weeklyattendancedataown;
                                        var chartDataown = [];
                                        for(var i in data) {
                                            var week = data[i]._id.week;
                                            var year = data[i]._id.year;
                                            var date = getDateOfWeek(week, year);
                                            var attendancePercentage = 0;
                                            if(data[i].presentCount + data[i].absentCount > 0){
                                                attendancePercentage = (100 * data[i].presentCount) / (data[i].presentCount + data[i].absentCount);
                                            }
                                            chartDataown.push([date,attendancePercentage]);    
                                        }


                                        Highcharts.chart('container-graph1', {
                                            chart: {
                                            type: 'spline'
                                            },
                                            title: {
                                            text: 'Weekly Attendance'
                                            },
                                            subtitle: {
                                            text: ''
                                            },
                                            xAxis: {
                                            type: 'datetime',
                                            dateTimeLabelFormats: { // don't display the dummy year
                                                month: '%e. %b',
                                                year: '%b'
                                            },
                                            title: {
                                                text: 'Date'
                                            }
                                            },
                                            yAxis: {
                                            title: {
                                                text: 'Attendance (%)'
                                            },
                                            min: 0
                                            },
                                            tooltip: {
                                            headerFormat: '<b>{series.name}</b><br>',
                                            pointFormat: '{point.x:%e. %b}: {point.y} %'
                                            },

                                            plotOptions: {
                                            spline: {
                                                marker: {
                                                enabled: true
                                                }
                                            }
                                            },

                                            series: [{
                                            name: 'Overall Attendance',
                                            data: chartData
                                            }]
                                        });


                                    });
                                      });
                                    /*getdaysofweek*/
                                    meanData.getDayOfWeekBasedStudentAttendance( {"sectionId": $routeParams.sectionid, "endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart} )
                                    .success(function(todaysattendancedata){
                                        var data = todaysattendancedata;
                                        var avgAttendance=[];

                                        var weekday=new Array(8);
                                        weekday[2]="Monday";
                                        weekday[3]="Tuesday";
                                        weekday[4]="Wednesday";
                                        weekday[5]="Thursday";
                                        weekday[6]="Friday";
                                        weekday[7]="Saturday";
                                        weekday[1]="Sunday";

                                        for(var i in data) {
                                            attendance = data[i];
                                            dayOfWeek = attendance._id.dayOfWeek;
                                            if(!avgAttendance[dayOfWeek]){
                                            avgAttendance[dayOfWeek] = {};
                                            avgAttendance[dayOfWeek].attendancePercentage = 0;
                                            if(attendance.presentCount + attendance.absentCount > 0 ){
                                                avgAttendance[dayOfWeek].attendancePercentage = ( 100 * attendance.presentCount ) / (attendance.presentCount + attendance.absentCount);
                                                avgAttendance[dayOfWeek].weekday = weekday[dayOfWeek];
                                            }
                                            }else{

                                            }

                                        }
                                        var chartData = [];
                                        for(var i in avgAttendance) {
                                            chartData.push({"name":avgAttendance[i].weekday,
                                                    "data":[avgAttendance[i].attendancePercentage]
                                                    });
                                        }

                                        Highcharts.chart('container-graph2', {
                                            chart: {
                                            type: 'column'
                                            },
                                            title: {
                                            text: 'Day Of Week Based Attendance Percentage'
                                            },
                                            xAxis: {
                                            categories: [
                                                'Days'
                                            ],
                                            crosshair: true
                                            },
                                            yAxis: {
                                            min: 0,
                                            title: {
                                                text: ''
                                            }
                                            },
                                            tooltip: {
                                            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                                '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
                                            footerFormat: '</table>',
                                            shared: true,
                                            useHTML: true
                                            },
                                            plotOptions: {
                                            column: {
                                                pointPadding: 0.2,
                                                borderWidth: 0
                                            }
                                            },
                                            series: chartData
                                        });
                                    });

                                    /* Scores */
var stdarr = [vm.jsondata._id,"5a1a93e31cb5536e104eec46"];
                                      meanData.getAllModuleScoresForSubject( { "subjectId": vm.studentsubjectdata[0]._id, "classId" : vm.currentClass, "studentId": stdarr } )
                                      .success(function(modulewisescoredata){
                                        var data = modulewisescoredata;

                                var topicnames = [];
                                var chartData = [];
                                var xAxisCategories = [];
                                for (var key in data) {
                                    topicObj = data[key];
                                    if(!topicnames[topicObj["posX"]]){
                                    topicnames[topicObj["posX"]] = [];
                                    }
                                    chartData.push([
                                        topicObj["posX"], 
                                        topicObj["posY"], 
                                        topicObj["avgScore"]
                                    ]);
                                    topicnames[topicObj["posX"]][topicObj["posY"]] = topicObj["topic_name"];
                                    xAxisCategories[topicObj["posX"]] = topicObj["syllabusModuleName"];
                                }

                                    Highcharts.chart('container-graph3', {

                                        chart: {
                                        type: 'heatmap',
                                        marginTop: 40,
                                        marginBottom: 80,
                                        plotBorderWidth: 1
                                        },


                                        title: {
                                        text: 'Module Wise Marks Obtained'
                                        },

                                        xAxis: {
                                        categories: xAxisCategories
                                        },

                                        yAxis: {
                                        title: 'Score %',
                                        labels: {
                                           enabled: false
                                        }
                                        },

                                        colorAxis: {
                                        min: 0,
                                        minColor: '#FFFFFF',
                                        maxColor: Highcharts.getOptions().colors[0]
                                        },

                                        legend: {
                                        align: 'right',
                                        layout: 'vertical',
                                        margin: 0,
                                        verticalAlign: 'top',
                                        y: 25,
                                        symbolHeight: 280
                                        },

                                        tooltip: {
                                        formatter: function () {
                                            return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> : <br><b>' +
                                            this.point.value + '</b> % <br>';
                                        }
                                        },

                                        series: [{
                                        name: 'Topic-wise Score',
                                        borderWidth: 1,
                                        data: chartData,
                                        dataLabels: {
                                            enabled: true,
                                            color: '#000000',
                                            formatter:function(){
                                                        return topicnames[this.point.x][this.point.y];
                                                    }
                                        }
                                        }]

                                    });

                                  });

    
/* Syllabus Progress */

var data = {
  "5a479c3604f32f1029e5b70e":{
    "posX":0,
    "posY":0,
    "topicId":"5a479c3604f32f1029e5b70e",
    "syllabusModule":"5a479a2904f32f1029e5b4ba",
    "syllabusModuleName":"Simple Machines",
    "avgScore":51,
    "topic_name":"Lever"
  },
  "5a479c6704f32f1029e5b74a":{
    "posX":0,
    "posY":1,
    "topicId":"5a479c6704f32f1029e5b74a",
    "syllabusModule":"5a479a2904f32f1029e5b4ba",
    "syllabusModuleName":"Simple Machines",
    "avgScore":3,
    "topic_name":"Inclined Plane"
  },
  "5a479c8604f32f1029e5b76b":{
    "posX":1,
    "posY":0,
    "topicId":"5a479c8604f32f1029e5b76b",
    "syllabusModule":"5a479ab304f32f1029e5b556",
    "syllabusModuleName":"Force",
    "avgScore":155,
    "topic_name":"Laws Of Motion"
  },
  "5a479cbd04f32f1029e5b7aa":{
    "posX":1,
    "posY":1,
    "topicId":"5a479cbd04f32f1029e5b7aa",
    "syllabusModule":"5a479ab304f32f1029e5b556",
    "syllabusModuleName":"Force",
    "avgScore":65,
    "topic_name":"Momentum"
  },
  "5a479ccf04f32f1029e5b7c4":{
    "posX":2,
    "posY":0,
    "topicId":"5a479ccf04f32f1029e5b7c4",
    "syllabusModule":"5a479ac904f32f1029e5b56e",
    "syllabusModuleName":"Work Power Energy",
    "avgScore":100,
    "topic_name":"Work"
  },
  "5a479cf804f32f1029e5b7f1":{
    "posX":2,
    "posY":1,
    "topicId":"5a479cf804f32f1029e5b7f1",
    "syllabusModule":"5a479ac904f32f1029e5b56e",
    "syllabusModuleName":"Work Power Energy",
    "avgScore":79,
    "topic_name":"Power"
  },
  "5a479d3604f32f1029e5b84a":{
    "posX":2,
    "posY":2,
    "topicId":"5a479d3604f32f1029e5b84a",
    "syllabusModule":"5a479ac904f32f1029e5b56e",
    "syllabusModuleName":"Work Power Energy",
    "avgScore":0,
    "topic_name":"Energy"
  }
};

var topicnames = [];
var chartData = [];
var xAxisCategories = [];
for (var key in data) {
    topicObj = data[key];
    if(!topicnames[topicObj["posX"]]){
    topicnames[topicObj["posX"]] = [];
    }
    chartData.push([
        topicObj["posX"],
        topicObj["posY"],
        topicObj["avgScore"]
    ]);
    topicnames[topicObj["posX"]][topicObj["posY"]] = topicObj["topic_name"];
    xAxisCategories[topicObj["posX"]] = topicObj["syllabusModuleName"];
}

        Highcharts.chart('container-graph4', {

            chart: {
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 80,
            plotBorderWidth: 1
            },


            title: {
            text: 'Topic-wise Syllabus Progress'
            },

            xAxis: {
            categories: xAxisCategories
            },

            yAxis: {
            title: 'Score %',
            labels: {
               enabled: false
            }
            },

            colorAxis: {
            min: 0,
            minColor: '#FFFFFF',
            maxColor: Highcharts.getOptions().colors[0]
            },

            legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 280
            },

            tooltip: {
            formatter: function () {
                return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> : <br><b>' +
                this.point.value + '</b> % <br>';
            }
            },

            series: [{
            name: 'Syllabus Progress',
            borderWidth: 1,
            data: chartData,
            dataLabels: {
                enabled: true,
                color: '#000000',
                formatter:function(){
                            return topicnames[this.point.x][this.point.y];
                        }
            }
            }]

        });

/*********************/
                                  });
                              });
                          });
                       });
                });       
            });

        });

// Week number to Date conversion
    var getDateOfWeek = function(w, y) {
        var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week

        return Date.UTC(y, 0, d);
    }

// Initialize Highcharts sample for pageviews heatmap
        $scope.changeGraph = function(graphtitle, subjectId) {
/****** Today's Attendance  **************/
if(graphtitle == "todaysattendance"){
    meanData.getTodaysAttendance( $routeParams.sectionid )
    .success(function(todaysattendancedata){

        Highcharts.chart('container-graph', {
            chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
            },
            title: {
            text: "Today's Attendance"
            },
            tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
                }
            }
            },
            series: [{
            name: 'Attendance',
            colorByPoint: true,
            data: [{
                name: 'Present',
                y: todaysattendancedata.attendancePercentage
            }, {
                name: 'Absent',
                y: (100 - todaysattendancedata.attendancePercentage)
            }]
            }]
        });

    });
}
/********************** End Today's Attendance ***********************/
/****** Day of Week based attendance of a Student between a date range **************/

if(graphtitle == "dayofweekbasedattendance"){
    meanData.getDayOfWeekBasedStudentAttendance( {"sectionId": $routeParams.sectionid, "endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart} )
    .success(function(todaysattendancedata){
        var data = todaysattendancedata;
        var avgAttendance=[];

        var weekday=new Array(8);
        weekday[2]="Monday";
        weekday[3]="Tuesday";
        weekday[4]="Wednesday";
        weekday[5]="Thursday";
        weekday[6]="Friday";
        weekday[7]="Saturday";
        weekday[1]="Sunday";

        for(var i in data) {
            attendance = data[i];
            dayOfWeek = attendance._id.dayOfWeek;
            if(!avgAttendance[dayOfWeek]){
            avgAttendance[dayOfWeek] = {};
            avgAttendance[dayOfWeek].attendancePercentage = 0;
            if(attendance.presentCount + attendance.absentCount > 0 ){
                avgAttendance[dayOfWeek].attendancePercentage = ( 100 * attendance.presentCount ) / (attendance.presentCount + attendance.absentCount);
                avgAttendance[dayOfWeek].weekday = weekday[dayOfWeek];
            }
            }else{

            }

        }
        var chartData = [];
        for(var i in avgAttendance) {
            chartData.push({"name":avgAttendance[i].weekday,
                    "data":[avgAttendance[i].attendancePercentage]
                    });
        }

        Highcharts.chart('container-graph', {
            chart: {
            type: 'column'
            },
            title: {
            text: 'Day Of Week Based Attendance Percentage'
            },
            xAxis: {
            categories: [
                'Teachers'
            ],
            crosshair: true
            },
            yAxis: {
            min: 0,
            title: {
                text: ''
            }
            },
            tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
            },
            plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
            },
            series: chartData
        });
    });
}

//////// End Day of Week based attendance of a Student between a date range  /////////////

/****** Weekly attendance of overall class **************/

if(graphtitle == "weeklyattendance"){
      meanData.getWeeklyStudentAttendance( {"sectionId": $routeParams.sectionid, "teacherId" : vm.jsondata._id, "endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart} )
      .success(function(weeklyattendancedataown){

    meanData.getWeeklyStudentAttendance( {"sectionId": $routeParams.sectionid, "endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart} )
    .success(function(weeklyattendancedata){
        var data = weeklyattendancedata;
        var chartData = [];
        for(var i in data) {
            var week = data[i]._id.week;
            var year = data[i]._id.year;
            var date = getDateOfWeek(week, year);
            var attendancePercentage = 0;
            if(data[i].presentCount + data[i].absentCount > 0){
                attendancePercentage = (100 * data[i].presentCount) / (data[i].presentCount + data[i].absentCount);
            }
            chartData.push([date,attendancePercentage]);    
        }

        var data = weeklyattendancedataown;
        var chartDataown = [];
        for(var i in data) {
            var week = data[i]._id.week;
            var year = data[i]._id.year;
            var date = getDateOfWeek(week, year);
            var attendancePercentage = 0;
            if(data[i].presentCount + data[i].absentCount > 0){
                attendancePercentage = (100 * data[i].presentCount) / (data[i].presentCount + data[i].absentCount);
            }
            chartDataown.push([date,attendancePercentage]);    
        }


        Highcharts.chart('container-graph', {
            chart: {
            type: 'spline'
            },
            title: {
            text: 'Weekly Attendance'
            },
            subtitle: {
            text: 'Of Entire section'
            },
            xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            },
            title: {
                text: 'Date'
            }
            },
            yAxis: {
            title: {
                text: 'Attendance (%)'
            },
            min: 0
            },
            tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x:%e. %b}: {point.y} %'
            },

            plotOptions: {
            spline: {
                marker: {
                enabled: true
                }
            }
            },

            series: [{
            name: 'Overall',
            data: chartData
            },{
            name: 'In Your Class',
            data: chartDataown
            }]
        });


    });
      });
}

//////// Weekly attendance of overall class  /////////////

/****** Topic-wise assignment scores for all modules of a subject and class for students **************/

if(graphtitle == "scoreheatmapmodulewisesubject"){
      meanData.getAllModuleScoresForSubject( { "subjectId": subjectId, "classId" : vm.currentClass, "studentId": vm.jsondata._id } )
      .success(function(modulewisescoredata){
        var data = modulewisescoredata;

var topicnames = [];
var chartData = [];
var xAxisCategories = [];
for (var key in data) {
    topicObj = data[key];
    if(!topicnames[topicObj["posX"]]){
    topicnames[topicObj["posX"]] = [];
    }
    chartData.push([
        topicObj["posX"], 
        topicObj["posY"], 
        topicObj["avgScore"]
    ]);
    topicnames[topicObj["posX"]][topicObj["posY"]] = topicObj["topic_name"];
    xAxisCategories[topicObj["posX"]] = topicObj["syllabusModuleName"];
}

        Highcharts.chart('container-graph', {

            chart: {
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 80,
            plotBorderWidth: 1
            },


            title: {
            text: 'Module Wise Marks Obtained'
            },

            xAxis: {
            categories: xAxisCategories
            },

            yAxis: {
            title: 'Score %',
            labels: {
               enabled: false
            }
            },

            colorAxis: {
            min: 0,
            minColor: '#FFFFFF',
            maxColor: Highcharts.getOptions().colors[0]
            },

            legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 280
            },

            tooltip: {
            formatter: function () {
                return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> : <br><b>' +
                this.point.value + '</b> % <br>';
            }
            },

            series: [{
            name: 'Topic-wise Score',
            borderWidth: 1,
            data: chartData,
            dataLabels: {
                enabled: true,
                color: '#000000',
                formatter:function(){
                            return topicnames[this.point.x][this.point.y];
                        }
            }
            }]

        });

      });
}

//////// End Topic-wise assignment scores for all modules of a subject and class for students  /////////////

/****** Topic-wise number of students having scores < 30%, >=30-50%, >=50-80%, >= 80% of all modules **************/
(function() {

  angular
    .module('meanApp')
    .controller('studentplatformCtrl', studentplatformCtrl);
  studentplatformCtrl.$inject = ['$location','$routeParams', 'meanData', '$scope', '$http', 'authentication','$window'];
    function studentplatformCtrl ($location, $routeParams, meanData, $scope, $http, authentication,$window) {
      console.log('Bagless-student-platform controller is running');
        var vm = this;

        vm.user = {};
        vm.classroomsessiondata={};
        vm.currentClass= "";
        vm.sectionStudentIds = [];
        vm.schoolCurrentSession = {};
        $scope.enterClass = function () {
             $window.location = '/students/enterclass/' + vm.jsondata.currentsection;
        };
        meanData.getUserProfile()
          .success(function(userdata) {
            vm.jsondata = userdata;
            vm.currentClass= "";
/************** Get current session for the school ***************/
            meanData.getSchoolCurrentSession({"schoolId" : vm.jsondata.currentschool._id})
            .success(function(currentsessiondata){
                vm.schoolCurrentSession = currentsessiondata;
            });
/************** End current session for the school *********/

          //alert(JSON.stringify(data));
               //console.log(vm.attendancedata.attendancePercentage);
            meanData.getSection($routeParams.sectionid)
            .success(function(sectiondata){
                vm.sectiondata = sectiondata;
                for (var key in sectiondata.students) {
                if (sectiondata.students.hasOwnProperty(key)){
                //vm.jsondata._id.push(sectiondata.students[key]._id);
                    }
                }

                  meanData.getClassAgainstSection(vm.jsondata.currentsection._id)
               .success(function(classdata){
                vm.currentClass = classdata._id;
            });


                meanData.getClassTeacherMonitor(vm.jsondata.currentsection._id)
                .success(function(techmonitordata){
                    vm.techmonitordata = techmonitordata;
                    meanData.getTeacherSubjects(vm.jsondata._id)
                    .success(function(techsubjectdata){
                        vm.techsubjectdata = techsubjectdata;
                  meanData.getTodaysAttendance(vm.jsondata.currentsection._id)
               .success(function(attendancedata){
                       //alert(JSON.stringify(data));
                       vm.attendancedata = attendancedata;
                       meanData.getSchoolTeachers(vm.jsondata.currentschool._id)
                      .success(function(teacherdata) {
                      vm.teachersdata = teacherdata[0];
                      //alert(JSON.stringify(teacherdata));
                      /*meanData.getClassTeacherMonitor(vm.jsondata.sectionId._id)
                      .success(function(classdetailsdata){
                          vm.classdetailsdata = classdetailsdata;
                              });*/
                              meanData.getStudentRoutineSubjects(vm.jsondata._id)
                              .success(function(studentsubjectdata){
                                  vm.studentsubjectdata = studentsubjectdata;
                                      /*getWeeklyStudentAttendance*/
                                      meanData.getWeeklyStudentAttendance( {"sectionId": $routeParams.sectionid, "studentId" : vm.jsondata._id, "endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart} )
                                      .success(function(weeklyattendancedataown){

                                    meanData.getWeeklyStudentAttendance( {"sectionId": $routeParams.sectionid, "endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart} )
                                    .success(function(weeklyattendancedata){
                                        var data = weeklyattendancedata;
                                        var chartData = [];
                                        for(var i in data) {
                                            var week = data[i]._id.week;
                                            var year = data[i]._id.year;
                                            var date = getDateOfWeek(week, year);
                                            var attendancePercentage = 0;
                                            if(data[i].presentCount + data[i].absentCount > 0){
                                                attendancePercentage = (100 * data[i].presentCount) / (data[i].presentCount + data[i].absentCount);
                                            }
                                            chartData.push([date,attendancePercentage]);    
                                        }

                                        var data = weeklyattendancedataown;
                                        var chartDataown = [];
                                        for(var i in data) {
                                            var week = data[i]._id.week;
                                            var year = data[i]._id.year;
                                            var date = getDateOfWeek(week, year);
                                            var attendancePercentage = 0;
                                            if(data[i].presentCount + data[i].absentCount > 0){
                                                attendancePercentage = (100 * data[i].presentCount) / (data[i].presentCount + data[i].absentCount);
                                            }
                                            chartDataown.push([date,attendancePercentage]);    
                                        }


                                        Highcharts.chart('container-graph1', {
                                            chart: {
                                            type: 'spline'
                                            },
                                            title: {
                                            text: 'Weekly Attendance'
                                            },
                                            subtitle: {
                                            text: ''
                                            },
                                            xAxis: {
                                            type: 'datetime',
                                            dateTimeLabelFormats: { // don't display the dummy year
                                                month: '%e. %b',
                                                year: '%b'
                                            },
                                            title: {
                                                text: 'Date'
                                            }
                                            },
                                            yAxis: {
                                            title: {
                                                text: 'Attendance (%)'
                                            },
                                            min: 0
                                            },
                                            tooltip: {
                                            headerFormat: '<b>{series.name}</b><br>',
                                            pointFormat: '{point.x:%e. %b}: {point.y} %'
                                            },

                                            plotOptions: {
                                            spline: {
                                                marker: {
                                                enabled: true
                                                }
                                            }
                                            },

                                            series: [{
                                            name: 'Overall Attendance',
                                            data: chartData
                                            }]
                                        });


                                    });
                                      });
                                    /*getdaysofweek*/
                                    meanData.getDayOfWeekBasedStudentAttendance( {"sectionId": $routeParams.sectionid, "endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart} )
                                    .success(function(todaysattendancedata){
                                        var data = todaysattendancedata;
                                        var avgAttendance=[];

                                        var weekday=new Array(8);
                                        weekday[2]="Monday";
                                        weekday[3]="Tuesday";
                                        weekday[4]="Wednesday";
                                        weekday[5]="Thursday";
                                        weekday[6]="Friday";
                                        weekday[7]="Saturday";
                                        weekday[1]="Sunday";

                                        for(var i in data) {
                                            attendance = data[i];
                                            dayOfWeek = attendance._id.dayOfWeek;
                                            if(!avgAttendance[dayOfWeek]){
                                            avgAttendance[dayOfWeek] = {};
                                            avgAttendance[dayOfWeek].attendancePercentage = 0;
                                            if(attendance.presentCount + attendance.absentCount > 0 ){
                                                avgAttendance[dayOfWeek].attendancePercentage = ( 100 * attendance.presentCount ) / (attendance.presentCount + attendance.absentCount);
                                                avgAttendance[dayOfWeek].weekday = weekday[dayOfWeek];
                                            }
                                            }else{

                                            }

                                        }
                                        var chartData = [];
                                        for(var i in avgAttendance) {
                                            chartData.push({"name":avgAttendance[i].weekday,
                                                    "data":[avgAttendance[i].attendancePercentage]
                                                    });
                                        }

                                        Highcharts.chart('container-graph2', {
                                            chart: {
                                            type: 'column'
                                            },
                                            title: {
                                            text: 'Day Of Week Based Attendance Percentage'
                                            },
                                            xAxis: {
                                            categories: [
                                                'Days'
                                            ],
                                            crosshair: true
                                            },
                                            yAxis: {
                                            min: 0,
                                            title: {
                                                text: ''
                                            }
                                            },
                                            tooltip: {
                                            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                                '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
                                            footerFormat: '</table>',
                                            shared: true,
                                            useHTML: true
                                            },
                                            plotOptions: {
                                            column: {
                                                pointPadding: 0.2,
                                                borderWidth: 0
                                            }
                                            },
                                            series: chartData
                                        });
                                    });

                                    /* Scores */
var stdarr = [vm.jsondata._id,"5a1a93e31cb5536e104eec46"];
                                      meanData.getAllModuleScoresForSubject( { "subjectId": vm.studentsubjectdata[0]._id, "classId" : vm.currentClass, "studentId": stdarr } )
                                      .success(function(modulewisescoredata){
                                        var data = modulewisescoredata;

                                var topicnames = [];
                                var chartData = [];
                                var xAxisCategories = [];
                                for (var key in data) {
                                    topicObj = data[key];
                                    if(!topicnames[topicObj["posX"]]){
                                    topicnames[topicObj["posX"]] = [];
                                    }
                                    chartData.push([
                                        topicObj["posX"], 
                                        topicObj["posY"], 
                                        topicObj["avgScore"]
                                    ]);
                                    topicnames[topicObj["posX"]][topicObj["posY"]] = topicObj["topic_name"];
                                    xAxisCategories[topicObj["posX"]] = topicObj["syllabusModuleName"];
                                }

                                    Highcharts.chart('container-graph3', {

                                        chart: {
                                        type: 'heatmap',
                                        marginTop: 40,
                                        marginBottom: 80,
                                        plotBorderWidth: 1
                                        },


                                        title: {
                                        text: 'Module Wise Marks Obtained'
                                        },

                                        xAxis: {
                                        categories: xAxisCategories
                                        },

                                        yAxis: {
                                        title: 'Score %',
                                        labels: {
                                           enabled: false
                                        }
                                        },

                                        colorAxis: {
                                        min: 0,
                                        minColor: '#FFFFFF',
                                        maxColor: Highcharts.getOptions().colors[0]
                                        },

                                        legend: {
                                        align: 'right',
                                        layout: 'vertical',
                                        margin: 0,
                                        verticalAlign: 'top',
                                        y: 25,
                                        symbolHeight: 280
                                        },

                                        tooltip: {
                                        formatter: function () {
                                            return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> : <br><b>' +
                                            this.point.value + '</b> % <br>';
                                        }
                                        },

                                        series: [{
                                        name: 'Topic-wise Score',
                                        borderWidth: 1,
                                        data: chartData,
                                        dataLabels: {
                                            enabled: true,
                                            color: '#000000',
                                            formatter:function(){
                                                        return topicnames[this.point.x][this.point.y];
                                                    }
                                        }
                                        }]

                                    });

                                  });

    
/* Syllabus Progress */

var data = {
  "5a479c3604f32f1029e5b70e":{
    "posX":0,
    "posY":0,
    "topicId":"5a479c3604f32f1029e5b70e",
    "syllabusModule":"5a479a2904f32f1029e5b4ba",
    "syllabusModuleName":"Simple Machines",
    "avgScore":51,
    "topic_name":"Lever"
  },
  "5a479c6704f32f1029e5b74a":{
    "posX":0,
    "posY":1,
    "topicId":"5a479c6704f32f1029e5b74a",
    "syllabusModule":"5a479a2904f32f1029e5b4ba",
    "syllabusModuleName":"Simple Machines",
    "avgScore":3,
    "topic_name":"Inclined Plane"
  },
  "5a479c8604f32f1029e5b76b":{
    "posX":1,
    "posY":0,
    "topicId":"5a479c8604f32f1029e5b76b",
    "syllabusModule":"5a479ab304f32f1029e5b556",
    "syllabusModuleName":"Force",
    "avgScore":155,
    "topic_name":"Laws Of Motion"
  },
  "5a479cbd04f32f1029e5b7aa":{
    "posX":1,
    "posY":1,
    "topicId":"5a479cbd04f32f1029e5b7aa",
    "syllabusModule":"5a479ab304f32f1029e5b556",
    "syllabusModuleName":"Force",
    "avgScore":65,
    "topic_name":"Momentum"
  },
  "5a479ccf04f32f1029e5b7c4":{
    "posX":2,
    "posY":0,
    "topicId":"5a479ccf04f32f1029e5b7c4",
    "syllabusModule":"5a479ac904f32f1029e5b56e",
    "syllabusModuleName":"Work Power Energy",
    "avgScore":100,
    "topic_name":"Work"
  },
  "5a479cf804f32f1029e5b7f1":{
    "posX":2,
    "posY":1,
    "topicId":"5a479cf804f32f1029e5b7f1",
    "syllabusModule":"5a479ac904f32f1029e5b56e",
    "syllabusModuleName":"Work Power Energy",
    "avgScore":79,
    "topic_name":"Power"
  },
  "5a479d3604f32f1029e5b84a":{
    "posX":2,
    "posY":2,
    "topicId":"5a479d3604f32f1029e5b84a",
    "syllabusModule":"5a479ac904f32f1029e5b56e",
    "syllabusModuleName":"Work Power Energy",
    "avgScore":0,
    "topic_name":"Energy"
  }
};

var topicnames = [];
var chartData = [];
var xAxisCategories = [];
for (var key in data) {
    topicObj = data[key];
    if(!topicnames[topicObj["posX"]]){
    topicnames[topicObj["posX"]] = [];
    }
    chartData.push([
        topicObj["posX"],
        topicObj["posY"],
        topicObj["avgScore"]
    ]);
    topicnames[topicObj["posX"]][topicObj["posY"]] = topicObj["topic_name"];
    xAxisCategories[topicObj["posX"]] = topicObj["syllabusModuleName"];
}

        Highcharts.chart('container-graph4', {

            chart: {
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 80,
            plotBorderWidth: 1
            },


            title: {
            text: 'Topic-wise Syllabus Progress'
            },

            xAxis: {
            categories: xAxisCategories
            },

            yAxis: {
            title: 'Score %',
            labels: {
               enabled: false
            }
            },

            colorAxis: {
            min: 0,
            minColor: '#FFFFFF',
            maxColor: Highcharts.getOptions().colors[0]
            },

            legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 280
            },

            tooltip: {
            formatter: function () {
                return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> : <br><b>' +
                this.point.value + '</b> % <br>';
            }
            },

            series: [{
            name: 'Syllabus Progress',
            borderWidth: 1,
            data: chartData,
            dataLabels: {
                enabled: true,
                color: '#000000',
                formatter:function(){
                            return topicnames[this.point.x][this.point.y];
                        }
            }
            }]

        });

/*********************/
                                  });
                              });
                          });
                       });
                });       
            });

        });

// Week number to Date conversion
    var getDateOfWeek = function(w, y) {
        var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week

        return Date.UTC(y, 0, d);
    }

// Initialize Highcharts sample for pageviews heatmap
        $scope.changeGraph = function(graphtitle, subjectId) {
/****** Today's Attendance  **************/
if(graphtitle == "todaysattendance"){
    meanData.getTodaysAttendance( $routeParams.sectionid )
    .success(function(todaysattendancedata){

        Highcharts.chart('container-graph', {
            chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
            },
            title: {
            text: "Today's Attendance"
            },
            tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
                }
            }
            },
            series: [{
            name: 'Attendance',
            colorByPoint: true,
            data: [{
                name: 'Present',
                y: todaysattendancedata.attendancePercentage
            }, {
                name: 'Absent',
                y: (100 - todaysattendancedata.attendancePercentage)
            }]
            }]
        });

    });
}
/********************** End Today's Attendance ***********************/
/****** Day of Week based attendance of a Student between a date range **************/

if(graphtitle == "dayofweekbasedattendance"){
    meanData.getDayOfWeekBasedStudentAttendance( {"sectionId": $routeParams.sectionid, "endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart} )
    .success(function(todaysattendancedata){
        var data = todaysattendancedata;
        var avgAttendance=[];

        var weekday=new Array(8);
        weekday[2]="Monday";
        weekday[3]="Tuesday";
        weekday[4]="Wednesday";
        weekday[5]="Thursday";
        weekday[6]="Friday";
        weekday[7]="Saturday";
        weekday[1]="Sunday";

        for(var i in data) {
            attendance = data[i];
            dayOfWeek = attendance._id.dayOfWeek;
            if(!avgAttendance[dayOfWeek]){
            avgAttendance[dayOfWeek] = {};
            avgAttendance[dayOfWeek].attendancePercentage = 0;
            if(attendance.presentCount + attendance.absentCount > 0 ){
                avgAttendance[dayOfWeek].attendancePercentage = ( 100 * attendance.presentCount ) / (attendance.presentCount + attendance.absentCount);
                avgAttendance[dayOfWeek].weekday = weekday[dayOfWeek];
            }
            }else{

            }

        }
        var chartData = [];
        for(var i in avgAttendance) {
            chartData.push({"name":avgAttendance[i].weekday,
                    "data":[avgAttendance[i].attendancePercentage]
                    });
        }

        Highcharts.chart('container-graph', {
            chart: {
            type: 'column'
            },
            title: {
            text: 'Day Of Week Based Attendance Percentage'
            },
            xAxis: {
            categories: [
                'Teachers'
            ],
            crosshair: true
            },
            yAxis: {
            min: 0,
            title: {
                text: ''
            }
            },
            tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
            },
            plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
            },
            series: chartData
        });
    });
}

//////// End Day of Week based attendance of a Student between a date range  /////////////

/****** Weekly attendance of overall class **************/

if(graphtitle == "weeklyattendance"){
      meanData.getWeeklyStudentAttendance( {"sectionId": $routeParams.sectionid, "teacherId" : vm.jsondata._id, "endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart} )
      .success(function(weeklyattendancedataown){

    meanData.getWeeklyStudentAttendance( {"sectionId": $routeParams.sectionid, "endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart} )
    .success(function(weeklyattendancedata){
        var data = weeklyattendancedata;
        var chartData = [];
        for(var i in data) {
            var week = data[i]._id.week;
            var year = data[i]._id.year;
            var date = getDateOfWeek(week, year);
            var attendancePercentage = 0;
            if(data[i].presentCount + data[i].absentCount > 0){
                attendancePercentage = (100 * data[i].presentCount) / (data[i].presentCount + data[i].absentCount);
            }
            chartData.push([date,attendancePercentage]);    
        }

        var data = weeklyattendancedataown;
        var chartDataown = [];
        for(var i in data) {
            var week = data[i]._id.week;
            var year = data[i]._id.year;
            var date = getDateOfWeek(week, year);
            var attendancePercentage = 0;
            if(data[i].presentCount + data[i].absentCount > 0){
                attendancePercentage = (100 * data[i].presentCount) / (data[i].presentCount + data[i].absentCount);
            }
            chartDataown.push([date,attendancePercentage]);    
        }


        Highcharts.chart('container-graph', {
            chart: {
            type: 'spline'
            },
            title: {
            text: 'Weekly Attendance'
            },
            subtitle: {
            text: 'Of Entire section'
            },
            xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            },
            title: {
                text: 'Date'
            }
            },
            yAxis: {
            title: {
                text: 'Attendance (%)'
            },
            min: 0
            },
            tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x:%e. %b}: {point.y} %'
            },

            plotOptions: {
            spline: {
                marker: {
                enabled: true
                }
            }
            },

            series: [{
            name: 'Overall',
            data: chartData
            },{
            name: 'In Your Class',
            data: chartDataown
            }]
        });


    });
      });
}

//////// Weekly attendance of overall class  /////////////

/****** Topic-wise assignment scores for all modules of a subject and class for students **************/

if(graphtitle == "scoreheatmapmodulewisesubject"){
      meanData.getAllModuleScoresForSubject( { "subjectId": subjectId, "classId" : vm.currentClass, "studentId": vm.jsondata._id } )
      .success(function(modulewisescoredata){
        var data = modulewisescoredata;

var topicnames = [];
var chartData = [];
var xAxisCategories = [];
for (var key in data) {
    topicObj = data[key];
    if(!topicnames[topicObj["posX"]]){
    topicnames[topicObj["posX"]] = [];
    }
    chartData.push([
        topicObj["posX"], 
        topicObj["posY"], 
        topicObj["avgScore"]
    ]);
    topicnames[topicObj["posX"]][topicObj["posY"]] = topicObj["topic_name"];
    xAxisCategories[topicObj["posX"]] = topicObj["syllabusModuleName"];
}

        Highcharts.chart('container-graph', {

            chart: {
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 80,
            plotBorderWidth: 1
            },


            title: {
            text: 'Module Wise Marks Obtained'
            },

            xAxis: {
            categories: xAxisCategories
            },

            yAxis: {
            title: 'Score %',
            labels: {
               enabled: false
            }
            },

            colorAxis: {
            min: 0,
            minColor: '#FFFFFF',
            maxColor: Highcharts.getOptions().colors[0]
            },

            legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 280
            },

            tooltip: {
            formatter: function () {
                return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> : <br><b>' +
                this.point.value + '</b> % <br>';
            }
            },

            series: [{
            name: 'Topic-wise Score',
            borderWidth: 1,
            data: chartData,
            dataLabels: {
                enabled: true,
                color: '#000000',
                formatter:function(){
                            return topicnames[this.point.x][this.point.y];
                        }
            }
            }]

        });

      });
}

//////// End Topic-wise assignment scores for all modules of a subject and class for students  /////////////

/****** Topic-wise number of students having scores < 30%, >=30-50%, >=50-80%, >= 80% of all modules **************/

if(graphtitle == "topicslagging"){
      meanData.getClassSubjectScoreBracket( { "subjectId": subjectId, "classId" : vm.currentClass, "studentId": vm.jsondata._id } )
      .success(function(modulewisescoredata){
        var data = modulewisescoredata;
var xAxisCategories = [];
var topicArr = [];
var chartData = {
       "lessThan30": [],
       "between30To50": [],
       "between50To80": [],
       "greaterThan80": []    
};

for(var i in data) {
    topics = data[i];
    topicId = topics._id.topicId;
    topicName = topics._id.topic_name;
    if(!topicArr[topicId]){
    topicArr[topicId] = {};
    xAxisCategories.push(topicName);
    topicArr[topicId].lessThan30 = topics.lessThan30;
    topicArr[topicId].between30To50 = topics.between30To50;
    topicArr[topicId].between50To80 = topics.between50To80;
    topicArr[topicId].greaterThan80 = topics.greaterThan80;

    chartData.lessThan30.push(topics.lessThan30);
    chartData.between30To50.push(topics.between30To50);
    chartData.between50To80.push(topics.between50To80);
    chartData.greaterThan80.push(topics.greaterThan80);

    }else{

    }

}

        Highcharts.chart('container-graph', {
            chart: {
            type: 'bar'
            },
            title: {
            text: 'Topic Wise Score Bracket Of a Class'
            },
            xAxis: {
            categories: xAxisCategories
            },
            yAxis: {
            min: 0,
            title: {
                text: 'Topics'
            }
            },
            legend: {
            reversed: true
            },
            plotOptions: {
            series: {
                stacking: 'normal'
            }
            },
            series: [{
            name: 'Greater Than 80',
            data: chartData.greaterThan80
            }, {
            name: 'Between 50 to 80',
            data: chartData.between50To80
            }, {
            name: 'Between 30 to 50',
            data: chartData.between30To50
            },{
            name: 'Less Than 30',
            data: chartData.lessThan30
            }]
        });

      });
}

//////// End opic-wise number of students having scores < 30%, >=30-50%, >=50-80%, >= 80% of all modules  /////////////

/****** Student-wise score vs attendance of an array of studentIds of a startDate and endDate **************/

if(graphtitle == "scorevsattendance"){
      meanData.getStudentWiseScoreVsAttendance( { "endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart, "studentIds": vm.jsondata._id } )
      .success(function(scorevsattendancedata){
        var data = scorevsattendancedata;
        var chartData = [];
        for (var key in data) {
            var studentObj = data[key];
            chartData.push({
            name : studentObj["studentName"],
            data : [[
                parseInt(studentObj["attendancePercentage"]),
                parseInt(studentObj["avgScore"])
                ]]
            });

        }
        //alert(JSON.stringify(chartDataFinal));
        
        Highcharts.chart('container-graph', {
            chart: {
            type: 'scatter'
            },
            title: {
            text: 'Student-wise Score vs Attendance'
            },
            plotOptions: {
               scatter: {
              marker: {
                 radius: 4,
                 states: {
                hover: {
                   enabled: true,
                   lineColor: 'rgb(100,100,100)'
                }
                 }
              },
              states: {
                 hover: {
                marker: {
                   enabled: false
                }
                 }
              }
               }
            },
            series: chartData
        });

      });
}

//////// End Student-wise score vs attendance of an array of studentIds of a startDate and endDate  /////////////

/****** Student-wise score vs pageviews of an array of studentIds of a startDate and endDate **************/

if(graphtitle == "scorevstimespent"){(function() {

  angular
    .module('meanApp')
    .controller('studentplatformCtrl', studentplatformCtrl);
  studentplatformCtrl.$inject = ['$location','$routeParams', 'meanData', '$scope', '$http', 'authentication','$window'];
    function studentplatformCtrl ($location, $routeParams, meanData, $scope, $http, authentication,$window) {
      console.log('Bagless-student-platform controller is running');
        var vm = this;

        vm.user = {};
        vm.classroomsessiondata={};
        vm.currentClass= "";
        vm.sectionStudentIds = [];
        vm.schoolCurrentSession = {};
        $scope.enterClass = function () {
             $window.location = '/students/enterclass/' + vm.jsondata.currentsection;
        };
        meanData.getUserProfile()
          .success(function(userdata) {
            vm.jsondata = userdata;
            vm.currentClass= "";
/************** Get current session for the school ***************/
            meanData.getSchoolCurrentSession({"schoolId" : vm.jsondata.currentschool._id})
            .success(function(currentsessiondata){
                vm.schoolCurrentSession = currentsessiondata;
            });
/************** End current session for the school *********/

          //alert(JSON.stringify(data));
               //console.log(vm.attendancedata.attendancePercentage);
            meanData.getSection($routeParams.sectionid)
            .success(function(sectiondata){
                vm.sectiondata = sectiondata;
                for (var key in sectiondata.students) {
                if (sectiondata.students.hasOwnProperty(key)){
                //vm.jsondata._id.push(sectiondata.students[key]._id);
                    }
                }

                  meanData.getClassAgainstSection(vm.jsondata.currentsection._id)
               .success(function(classdata){
                vm.currentClass = classdata._id;
            });


                meanData.getClassTeacherMonitor(vm.jsondata.currentsection._id)
                .success(function(techmonitordata){
                    vm.techmonitordata = techmonitordata;
                    meanData.getTeacherSubjects(vm.jsondata._id)
                    .success(function(techsubjectdata){
                        vm.techsubjectdata = techsubjectdata;
                  meanData.getTodaysAttendance(vm.jsondata.currentsection._id)
               .success(function(attendancedata){
                       //alert(JSON.stringify(data));
                       vm.attendancedata = attendancedata;
                       meanData.getSchoolTeachers(vm.jsondata.currentschool._id)
                      .success(function(teacherdata) {
                      vm.teachersdata = teacherdata[0];
                      //alert(JSON.stringify(teacherdata));
                      /*meanData.getClassTeacherMonitor(vm.jsondata.sectionId._id)
                      .success(function(classdetailsdata){
                          vm.classdetailsdata = classdetailsdata;
                              });*/
                              meanData.getStudentRoutineSubjects(vm.jsondata._id)
                              .success(function(studentsubjectdata){
                                  vm.studentsubjectdata = studentsubjectdata;
                                      /*getWeeklyStudentAttendance*/
                                      meanData.getWeeklyStudentAttendance( {"sectionId": $routeParams.sectionid, "studentId" : vm.jsondata._id, "endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart} )
                                      .success(function(weeklyattendancedataown){

                                    meanData.getWeeklyStudentAttendance( {"sectionId": $routeParams.sectionid, "endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart} )
                                    .success(function(weeklyattendancedata){
                                        var data = weeklyattendancedata;
                                        var chartData = [];
                                        for(var i in data) {
                                            var week = data[i]._id.week;
                                            var year = data[i]._id.year;
                                            var date = getDateOfWeek(week, year);
                                            var attendancePercentage = 0;
                                            if(data[i].presentCount + data[i].absentCount > 0){
                                                attendancePercentage = (100 * data[i].presentCount) / (data[i].presentCount + data[i].absentCount);
                                            }
                                            chartData.push([date,attendancePercentage]);    
                                        }

                                        var data = weeklyattendancedataown;
                                        var chartDataown = [];
                                        for(var i in data) {
                                            var week = data[i]._id.week;
                                            var year = data[i]._id.year;
                                            var date = getDateOfWeek(week, year);
                                            var attendancePercentage = 0;
                                            if(data[i].presentCount + data[i].absentCount > 0){
                                                attendancePercentage = (100 * data[i].presentCount) / (data[i].presentCount + data[i].absentCount);
                                            }
                                            chartDataown.push([date,attendancePercentage]);    
                                        }


                                        Highcharts.chart('container-graph1', {
                                            chart: {
                                            type: 'spline'
                                            },
                                            title: {
                                            text: 'Weekly Attendance'
                                            },
                                            subtitle: {
                                            text: ''
                                            },
                                            xAxis: {
                                            type: 'datetime',
                                            dateTimeLabelFormats: { // don't display the dummy year
                                                month: '%e. %b',
                                                year: '%b'
                                            },
                                            title: {
                                                text: 'Date'
                                            }
                                            },
                                            yAxis: {
                                            title: {
                                                text: 'Attendance (%)'
                                            },
                                            min: 0
                                            },
                                            tooltip: {
                                            headerFormat: '<b>{series.name}</b><br>',
                                            pointFormat: '{point.x:%e. %b}: {point.y} %'
                                            },

                                            plotOptions: {
                                            spline: {
                                                marker: {
                                                enabled: true
                                                }
                                            }
                                            },

                                            series: [{
                                            name: 'Overall Attendance',
                                            data: chartData
                                            }]
                                        });


                                    });
                                      });
                                    /*getdaysofweek*/
                                    meanData.getDayOfWeekBasedStudentAttendance( {"sectionId": $routeParams.sectionid, "endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart} )
                                    .success(function(todaysattendancedata){
                                        var data = todaysattendancedata;
                                        var avgAttendance=[];

                                        var weekday=new Array(8);
                                        weekday[2]="Monday";
                                        weekday[3]="Tuesday";
                                        weekday[4]="Wednesday";
                                        weekday[5]="Thursday";
                                        weekday[6]="Friday";
                                        weekday[7]="Saturday";
                                        weekday[1]="Sunday";

                                        for(var i in data) {
                                            attendance = data[i];
                                            dayOfWeek = attendance._id.dayOfWeek;
                                            if(!avgAttendance[dayOfWeek]){
                                            avgAttendance[dayOfWeek] = {};
                                            avgAttendance[dayOfWeek].attendancePercentage = 0;
                                            if(attendance.presentCount + attendance.absentCount > 0 ){
                                                avgAttendance[dayOfWeek].attendancePercentage = ( 100 * attendance.presentCount ) / (attendance.presentCount + attendance.absentCount);
                                                avgAttendance[dayOfWeek].weekday = weekday[dayOfWeek];
                                            }
                                            }else{

                                            }

                                        }
                                        var chartData = [];
                                        for(var i in avgAttendance) {
                                            chartData.push({"name":avgAttendance[i].weekday,
                                                    "data":[avgAttendance[i].attendancePercentage]
                                                    });
                                        }

                                        Highcharts.chart('container-graph2', {
                                            chart: {
                                            type: 'column'
                                            },
                                            title: {
                                            text: 'Day Of Week Based Attendance Percentage'
                                            },
                                            xAxis: {
                                            categories: [
                                                'Days'
                                            ],
                                            crosshair: true
                                            },
                                            yAxis: {
                                            min: 0,
                                            title: {
                                                text: ''
                                            }
                                            },
                                            tooltip: {
                                            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                                '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
                                            footerFormat: '</table>',
                                            shared: true,
                                            useHTML: true
                                            },
                                            plotOptions: {
                                            column: {
                                                pointPadding: 0.2,
                                                borderWidth: 0
                                            }
                                            },
                                            series: chartData
                                        });
                                    });

                                    /* Scores */
var stdarr = [vm.jsondata._id,"5a1a93e31cb5536e104eec46"];
                                      meanData.getAllModuleScoresForSubject( { "subjectId": vm.studentsubjectdata[0]._id, "classId" : vm.currentClass, "studentId": stdarr } )
                                      .success(function(modulewisescoredata){
                                        var data = modulewisescoredata;

                                var topicnames = [];
                                var chartData = [];
                                var xAxisCategories = [];
                                for (var key in data) {
                                    topicObj = data[key];
                                    if(!topicnames[topicObj["posX"]]){
                                    topicnames[topicObj["posX"]] = [];
                                    }
                                    chartData.push([
                                        topicObj["posX"], 
                                        topicObj["posY"], 
                                        topicObj["avgScore"]
                                    ]);
                                    topicnames[topicObj["posX"]][topicObj["posY"]] = topicObj["topic_name"];
                                    xAxisCategories[topicObj["posX"]] = topicObj["syllabusModuleName"];
                                }

                                    Highcharts.chart('container-graph3', {

                                        chart: {
                                        type: 'heatmap',
                                        marginTop: 40,
                                        marginBottom: 80,
                                        plotBorderWidth: 1
                                        },


                                        title: {
                                        text: 'Module Wise Marks Obtained'
                                        },

                                        xAxis: {
                                        categories: xAxisCategories
                                        },

                                        yAxis: {
                                        title: 'Score %',
                                        labels: {
                                           enabled: false
                                        }
                                        },

                                        colorAxis: {
                                        min: 0,
                                        minColor: '#FFFFFF',
                                        maxColor: Highcharts.getOptions().colors[0]
                                        },

                                        legend: {
                                        align: 'right',
                                        layout: 'vertical',
                                        margin: 0,
                                        verticalAlign: 'top',
                                        y: 25,
                                        symbolHeight: 280
                                        },

                                        tooltip: {
                                        formatter: function () {
                                            return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> : <br><b>' +
                                            this.point.value + '</b> % <br>';
                                        }
                                        },

                                        series: [{
                                        name: 'Topic-wise Score',
                                        borderWidth: 1,
                                        data: chartData,
                                        dataLabels: {
                                            enabled: true,
                                            color: '#000000',
                                            formatter:function(){
                                                        return topicnames[this.point.x][this.point.y];
                                                    }
                                        }
                                        }]

                                    });

                                  });

    
/* Syllabus Progress */

var data = {
  "5a479c3604f32f1029e5b70e":{
    "posX":0,
    "posY":0,
    "topicId":"5a479c3604f32f1029e5b70e",
    "syllabusModule":"5a479a2904f32f1029e5b4ba",
    "syllabusModuleName":"Simple Machines",
    "avgScore":51,
    "topic_name":"Lever"
  },
  "5a479c6704f32f1029e5b74a":{
    "posX":0,
    "posY":1,
    "topicId":"5a479c6704f32f1029e5b74a",
    "syllabusModule":"5a479a2904f32f1029e5b4ba",
    "syllabusModuleName":"Simple Machines",
    "avgScore":3,
    "topic_name":"Inclined Plane"
  },
  "5a479c8604f32f1029e5b76b":{
    "posX":1,
    "posY":0,
    "topicId":"5a479c8604f32f1029e5b76b",
    "syllabusModule":"5a479ab304f32f1029e5b556",
    "syllabusModuleName":"Force",
    "avgScore":155,
    "topic_name":"Laws Of Motion"
  },
  "5a479cbd04f32f1029e5b7aa":{
    "posX":1,
    "posY":1,
    "topicId":"5a479cbd04f32f1029e5b7aa",
    "syllabusModule":"5a479ab304f32f1029e5b556",
    "syllabusModuleName":"Force",
    "avgScore":65,
    "topic_name":"Momentum"
  },
  "5a479ccf04f32f1029e5b7c4":{
    "posX":2,
    "posY":0,
    "topicId":"5a479ccf04f32f1029e5b7c4",
    "syllabusModule":"5a479ac904f32f1029e5b56e",
    "syllabusModuleName":"Work Power Energy",
    "avgScore":100,
    "topic_name":"Work"
  },
  "5a479cf804f32f1029e5b7f1":{
    "posX":2,
    "posY":1,
    "topicId":"5a479cf804f32f1029e5b7f1",
    "syllabusModule":"5a479ac904f32f1029e5b56e",
    "syllabusModuleName":"Work Power Energy",
    "avgScore":79,
    "topic_name":"Power"
  },
  "5a479d3604f32f1029e5b84a":{
    "posX":2,
    "posY":2,
    "topicId":"5a479d3604f32f1029e5b84a",
    "syllabusModule":"5a479ac904f32f1029e5b56e",
    "syllabusModuleName":"Work Power Energy",
    "avgScore":0,
    "topic_name":"Energy"
  }
};

var topicnames = [];
var chartData = [];
var xAxisCategories = [];
for (var key in data) {
    topicObj = data[key];
    if(!topicnames[topicObj["posX"]]){
    topicnames[topicObj["posX"]] = [];
    }
    chartData.push([
        topicObj["posX"],
        topicObj["posY"],
        topicObj["avgScore"]
    ]);
    topicnames[topicObj["posX"]][topicObj["posY"]] = topicObj["topic_name"];
    xAxisCategories[topicObj["posX"]] = topicObj["syllabusModuleName"];
}

        Highcharts.chart('container-graph4', {

            chart: {
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 80,
            plotBorderWidth: 1
            },


            title: {
            text: 'Topic-wise Syllabus Progress'
            },

            xAxis: {
            categories: xAxisCategories
            },

            yAxis: {
            title: 'Score %',
            labels: {
               enabled: false
            }
            },

            colorAxis: {
            min: 0,
            minColor: '#FFFFFF',
            maxColor: Highcharts.getOptions().colors[0]
            },

            legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 280
            },

            tooltip: {
            formatter: function () {
                return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> : <br><b>' +
                this.point.value + '</b> % <br>';
            }
            },

            series: [{
            name: 'Syllabus Progress',
            borderWidth: 1,
            data: chartData,
            dataLabels: {
                enabled: true,
                color: '#000000',
                formatter:function(){
                            return topicnames[this.point.x][this.point.y];
                        }
            }
            }]

        });

/*********************/
                                  });
                              });
                          });
                       });
                });       
            });

        });

// Week number to Date conversion
    var getDateOfWeek = function(w, y) {
        var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week

        return Date.UTC(y, 0, d);
    }

// Initialize Highcharts sample for pageviews heatmap
        $scope.changeGraph = function(graphtitle, subjectId) {
/****** Today's Attendance  **************/
if(graphtitle == "todaysattendance"){
    meanData.getTodaysAttendance( $routeParams.sectionid )
    .success(function(todaysattendancedata){

        Highcharts.chart('container-graph', {
            chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
            },
            title: {
            text: "Today's Attendance"
            },
            tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
                }
            }
            },
            series: [{
            name: 'Attendance',
            colorByPoint: true,
            data: [{
                name: 'Present',
                y: todaysattendancedata.attendancePercentage
            }, {
                name: 'Absent',
                y: (100 - todaysattendancedata.attendancePercentage)
            }]
            }]
        });

    });
}
/********************** End Today's Attendance ***********************/
/****** Day of Week based attendance of a Student between a date range **************/

if(graphtitle == "dayofweekbasedattendance"){
    meanData.getDayOfWeekBasedStudentAttendance( {"sectionId": $routeParams.sectionid, "endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart} )
    .success(function(todaysattendancedata){
        var data = todaysattendancedata;
        var avgAttendance=[];

        var weekday=new Array(8);
        weekday[2]="Monday";
        weekday[3]="Tuesday";
        weekday[4]="Wednesday";
        weekday[5]="Thursday";
        weekday[6]="Friday";
        weekday[7]="Saturday";
        weekday[1]="Sunday";

        for(var i in data) {
            attendance = data[i];
            dayOfWeek = attendance._id.dayOfWeek;
            if(!avgAttendance[dayOfWeek]){
            avgAttendance[dayOfWeek] = {};
            avgAttendance[dayOfWeek].attendancePercentage = 0;
            if(attendance.presentCount + attendance.absentCount > 0 ){
                avgAttendance[dayOfWeek].attendancePercentage = ( 100 * attendance.presentCount ) / (attendance.presentCount + attendance.absentCount);
                avgAttendance[dayOfWeek].weekday = weekday[dayOfWeek];
            }
            }else{

            }

        }
        var chartData = [];
        for(var i in avgAttendance) {
            chartData.push({"name":avgAttendance[i].weekday,
                    "data":[avgAttendance[i].attendancePercentage]
                    });
        }

        Highcharts.chart('container-graph', {
            chart: {
            type: 'column'
            },
            title: {
            text: 'Day Of Week Based Attendance Percentage'
            },
            xAxis: {
            categories: [
                'Teachers'
            ],
            crosshair: true
            },
            yAxis: {
            min: 0,
            title: {
                text: ''
            }
            },
            tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
            },
            plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
            },
            series: chartData
        });
    });
}

//////// End Day of Week based attendance of a Student between a date range  /////////////

/****** Weekly attendance of overall class **************/

if(graphtitle == "weeklyattendance"){
      meanData.getWeeklyStudentAttendance( {"sectionId": $routeParams.sectionid, "teacherId" : vm.jsondata._id, "endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart} )
      .success(function(weeklyattendancedataown){

    meanData.getWeeklyStudentAttendance( {"sectionId": $routeParams.sectionid, "endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart} )
    .success(function(weeklyattendancedata){
        var data = weeklyattendancedata;
        var chartData = [];
        for(var i in data) {
            var week = data[i]._id.week;
            var year = data[i]._id.year;
            var date = getDateOfWeek(week, year);
            var attendancePercentage = 0;
            if(data[i].presentCount + data[i].absentCount > 0){
                attendancePercentage = (100 * data[i].presentCount) / (data[i].presentCount + data[i].absentCount);
            }
            chartData.push([date,attendancePercentage]);    
        }

        var data = weeklyattendancedataown;
        var chartDataown = [];
        for(var i in data) {
            var week = data[i]._id.week;
            var year = data[i]._id.year;
            var date = getDateOfWeek(week, year);
            var attendancePercentage = 0;
            if(data[i].presentCount + data[i].absentCount > 0){
                attendancePercentage = (100 * data[i].presentCount) / (data[i].presentCount + data[i].absentCount);
            }
            chartDataown.push([date,attendancePercentage]);    
        }


        Highcharts.chart('container-graph', {
            chart: {
            type: 'spline'
            },
            title: {
            text: 'Weekly Attendance'
            },
            subtitle: {
            text: 'Of Entire section'
            },
            xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            },
            title: {
                text: 'Date'
            }
            },
            yAxis: {
            title: {
                text: 'Attendance (%)'
            },
            min: 0
            },
            tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x:%e. %b}: {point.y} %'
            },

            plotOptions: {
            spline: {
                marker: {
                enabled: true
                }
            }
            },

            series: [{
            name: 'Overall',
            data: chartData
            },{
            name: 'In Your Class',
            data: chartDataown
            }]
        });


    });
      });
}

//////// Weekly attendance of overall class  /////////////

/****** Topic-wise assignment scores for all modules of a subject and class for students **************/

if(graphtitle == "scoreheatmapmodulewisesubject"){
      meanData.getAllModuleScoresForSubject( { "subjectId": subjectId, "classId" : vm.currentClass, "studentId": vm.jsondata._id } )
      .success(function(modulewisescoredata){
        var data = modulewisescoredata;

var topicnames = [];
var chartData = [];
var xAxisCategories = [];
for (var key in data) {
    topicObj = data[key];
    if(!topicnames[topicObj["posX"]]){
    topicnames[topicObj["posX"]] = [];
    }
    chartData.push([
        topicObj["posX"], 
        topicObj["posY"], 
        topicObj["avgScore"]
    ]);
    topicnames[topicObj["posX"]][topicObj["posY"]] = topicObj["topic_name"];
    xAxisCategories[topicObj["posX"]] = topicObj["syllabusModuleName"];
}

        Highcharts.chart('container-graph', {

            chart: {
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 80,
            plotBorderWidth: 1
            },


            title: {
            text: 'Module Wise Marks Obtained'
            },

            xAxis: {
            categories: xAxisCategories
            },

            yAxis: {
            title: 'Score %',
            labels: {
               enabled: false
            }
            },

            colorAxis: {
            min: 0,
            minColor: '#FFFFFF',
            maxColor: Highcharts.getOptions().colors[0]
            },

            legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 280
            },

            tooltip: {
            formatter: function () {
                return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> : <br><b>' +
                this.point.value + '</b> % <br>';
            }
            },

            series: [{
            name: 'Topic-wise Score',
            borderWidth: 1,
            data: chartData,
            dataLabels: {
                enabled: true,
                color: '#000000',
                formatter:function(){
                            return topicnames[this.point.x][this.point.y];
                        }
            }
            }]

        });

      });
}

//////// End Topic-wise assignment scores for all modules of a subject and class for students  /////////////

/****** Topic-wise number of students having scores < 30%, >=30-50%, >=50-80%, >= 80% of all modules **************/

if(graphtitle == "topicslagging"){
      meanData.getClassSubjectScoreBracket( { "subjectId": subjectId, "classId" : vm.currentClass, "studentId": vm.jsondata._id } )
      .success(function(modulewisescoredata){
        var data = modulewisescoredata;
var xAxisCategories = [];
var topicArr = [];
var chartData = {
       "lessThan30": [],
       "between30To50": [],
       "between50To80": [],
       "greaterThan80": []    
};

for(var i in data) {
    topics = data[i];
    topicId = topics._id.topicId;
    topicName = topics._id.topic_name;
    if(!topicArr[topicId]){
    topicArr[topicId] = {};
    xAxisCategories.push(topicName);
    topicArr[topicId].lessThan30 = topics.lessThan30;
    topicArr[topicId].between30To50 = topics.between30To50;
    topicArr[topicId].between50To80 = topics.between50To80;
    topicArr[topicId].greaterThan80 = topics.greaterThan80;

    chartData.lessThan30.push(topics.lessThan30);
    chartData.between30To50.push(topics.between30To50);
    chartData.between50To80.push(topics.between50To80);
    chartData.greaterThan80.push(topics.greaterThan80);

    }else{

    }

}

        Highcharts.chart('container-graph', {
            chart: {
            type: 'bar'
            },
            title: {
            text: 'Topic Wise Score Bracket Of a Class'
            },
            xAxis: {
            categories: xAxisCategories
            },
            yAxis: {
            min: 0,
            title: {
                text: 'Topics'
            }
            },
            legend: {
            reversed: true
            },
            plotOptions: {
            series: {
                stacking: 'normal'
            }
            },
            series: [{
            name: 'Greater Than 80',
            data: chartData.greaterThan80
            }, {
            name: 'Between 50 to 80',
            data: chartData.between50To80
            }, {
            name: 'Between 30 to 50',
            data: chartData.between30To50
            },{
            name: 'Less Than 30',
            data: chartData.lessThan30
            }]
        });

      });
}

//////// End opic-wise number of students having scores < 30%, >=30-50%, >=50-80%, >= 80% of all modules  /////////////

/****** Student-wise score vs attendance of an array of studentIds of a startDate and endDate **************/

if(graphtitle == "scorevsattendance"){
      meanData.getStudentWiseScoreVsAttendance( { "endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart, "studentIds": vm.jsondata._id } )
      .success(function(scorevsattendancedata){
        var data = scorevsattendancedata;
        var chartData = [];
        for (var key in data) {
            var studentObj = data[key];
            chartData.push({
            name : studentObj["studentName"],
            data : [[
                parseInt(studentObj["attendancePercentage"]),
                parseInt(studentObj["avgScore"])
                ]]
            });

        }
        //alert(JSON.stringify(chartDataFinal));
        
        Highcharts.chart('container-graph', {
            chart: {
            type: 'scatter'
            },
            title: {
            text: 'Student-wise Score vs Attendance'
            },
            plotOptions: {
               scatter: {
              marker: {
                 radius: 4,
                 states: {
                hover: {
                   enabled: true,
                   lineColor: 'rgb(100,100,100)'
                }
                 }
              },
              states: {
                 hover: {
                marker: {
                   enabled: false
                }
                 }
              }
               }
            },
            series: chartData
        });

      });
}

//////// End Student-wise score vs attendance of an array of studentIds of a startDate and endDate  /////////////

/****** Student-wise score vs pageviews of an array of studentIds of a startDate and endDate **************/

if(graphtitle == "scorevstimespent"){
      meanData.getStudentWiseScoreVsPageviews( {"endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart, "studentIds": vm.jsondata._id } )
      .success(function(scorevstimespentdata){
        var data = scorevstimespentdata;
        var chartData = [];
        for (var key in data) {
            var studentObj = data[key];
            chartData.push({
            name : studentObj["studentName"],
            data : [[
                parseInt(studentObj["time_spent"]),
                parseInt(studentObj["avgScore"])
                ]]
            });

        }
        Highcharts.chart('container-graph', {
            chart: {
            type: 'scatter'
            },
            title: {
            text: 'Student-wise Score vs Time Spent'
            },
            plotOptions: {
               scatter: {
              marker: {
                 radius: 4,
                 states: {
                hover: {
                   enabled: true,
                   lineColor: 'rgb(100,100,100)'
                }
                 }
              },
              states: {
                 hover: {
                marker: {
                   enabled: false
                }
                 }
              }
               }
            },
            series: chartData
        });

      });
}

//////// End Student-wise score vs pageviews of an array of studentIds of a startDate and endDate  /////////////
/****** Topic-wise number of students having scores 0-10%, 10-20%... of all modules  **************/
if(graphtitle == "marksdistribution"){
    meanData.getClassSubjectScoreBracketGranular( { "classId" : vm.currentClass , "subjectId": subjectId } )
    .success(function(marksdistributiondata){

        var data = marksdistributiondata;
        var xAxisCategories = [];
        var topicArr = [];
        var chartData = {
               "between0To10": [],
               "between10To20": [],
               "between20To30": [],
               "between30To40": [],    
               "between40To50": [],    
               "between50To60": [],    
               "between60To70": [],    
               "between70To80": [],    
               "between80To90": [],    
               "greaterThan90": []
        };

        for(var i in data) {
            topics = data[i];
            topicId = topics._id.topicId;
            topicName = topics._id.topic_name;
            if(!topicArr[topicId]){
            topicArr[topicId] = {};
            xAxisCategories.push(topicName);
            topicArr[topicId].between0To10 = topics.between0To10;
            topicArr[topicId].between10To20 = topics.between10To20;
            topicArr[topicId].between20To30 = topics.between20To30;
            topicArr[topicId].between30To40 = topics.between30To40;
            topicArr[topicId].between40To50 = topics.between40To50;
            topicArr[topicId].between50To60 = topics.between50To60;
            topicArr[topicId].between60To70 = topics.between60To70;
            topicArr[topicId].between70To80 = topics.between70To80;
            topicArr[topicId].between80To90 = topics.between80To90;
            topicArr[topicId].greaterThan90 = topics.greaterThan90;

            chartData.between0To10.push(topics.between0To10);
            chartData.between10To20.push(topics.between10To20);
            chartData.between20To30.push(topics.between20To30);
            chartData.between30To40.push(topics.between30To40);
            chartData.between40To50.push(topics.between40To50);
            chartData.between50To60.push(topics.between50To60);
            chartData.between60To70.push(topics.between60To70);
            chartData.between70To80.push(topics.between70To80);
            chartData.between80To90.push(topics.between80To90);
            chartData.greaterThan90.push(topics.greaterThan90);


            }else{

            }

        }

        Highcharts.chart('container-graph', {
            chart: {
            type: 'bar'
            },
            title: {
            text: 'Topic Wise Marks Distribution'
            },
            xAxis: {
            categories: xAxisCategories
            },
            yAxis: {
            min: 0,
            title: {
                text: 'Topics'
            }
            },
            legend: {
            reversed: true
            },
            plotOptions: {
            series: {
                stacking: 'normal'
            }
            },
            series: [{
            name: 'Greater Than 90',
            data: chartData.greaterThan90
            }, {
            name: 'Between 80 to 90',
            data: chartData.between80To90
            }, {
            name: 'Between 70 to 80',
            data: chartData.between20To30
            },{
            name: 'Less Than 30',
            data: chartData.between30To40
            }]
        });

    });
}
/********************** End Topic-wise number of students having scores 0-10%, 10-20%... of all modules ***********************/
        }


    }


})();

      meanData.getStudentWiseScoreVsPageviews( {"endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart, "studentIds": vm.jsondata._id } )
      .success(function(scorevstimespentdata){
        var data = scorevstimespentdata;
        var chartData = [];
        for (var key in data) {
            var studentObj = data[key];
            chartData.push({
            name : studentObj["studentName"],
            data : [[
                parseInt(studentObj["time_spent"]),
                parseInt(studentObj["avgScore"])
                ]]
            });

        }
        Highcharts.chart('container-graph', {
            chart: {
            type: 'scatter'
            },
            title: {
            text: 'Student-wise Score vs Time Spent'
            },
            plotOptions: {
               scatter: {
              marker: {
                 radius: 4,
                 states: {
                hover: {
                   enabled: true,
                   lineColor: 'rgb(100,100,100)'
                }
                 }
              },
              states: {
                 hover: {
                marker: {
                   enabled: false
                }
                 }
              }
               }
            },
            series: chartData
        });

      });
}

//////// End Student-wise score vs pageviews of an array of studentIds of a startDate and endDate  /////////////
/****** Topic-wise number of students having scores 0-10%, 10-20%... of all modules  **************/
if(graphtitle == "marksdistribution"){
    meanData.getClassSubjectScoreBracketGranular( { "classId" : vm.currentClass , "subjectId": subjectId } )
    .success(function(marksdistributiondata){

        var data = marksdistributiondata;
        var xAxisCategories = [];
        var topicArr = [];
        var chartData = {
               "between0To10": [],
               "between10To20": [],
               "between20To30": [],
               "between30To40": [],    
               "between40To50": [],    
               "between50To60": [],    
               "between60To70": [],    
               "between70To80": [],    
               "between80To90": [],    
               "greaterThan90": []
        };

        for(var i in data) {
            topics = data[i];
            topicId = topics._id.topicId;
            topicName = topics._id.topic_name;
            if(!topicArr[topicId]){
            topicArr[topicId] = {};
            xAxisCategories.push(topicName);
            topicArr[topicId].between0To10 = topics.between0To10;
            topicArr[topicId].between10To20 = topics.between10To20;
            topicArr[topicId].between20To30 = topics.between20To30;
            topicArr[topicId].between30To40 = topics.between30To40;
            topicArr[topicId].between40To50 = topics.between40To50;
            topicArr[topicId].between50To60 = topics.between50To60;
            topicArr[topicId].between60To70 = topics.between60To70;
            topicArr[topicId].between70To80 = topics.between70To80;
            topicArr[topicId].between80To90 = topics.between80To90;
            topicArr[topicId].greaterThan90 = topics.greaterThan90;

            chartData.between0To10.push(topics.between0To10);
            chartData.between10To20.push(topics.between10To20);
            chartData.between20To30.push(topics.between20To30);
            chartData.between30To40.push(topics.between30To40);
            chartData.between40To50.push(topics.between40To50);
            chartData.between50To60.push(topics.between50To60);
            chartData.between60To70.push(topics.between60To70);
            chartData.between70To80.push(topics.between70To80);
            chartData.between80To90.push(topics.between80To90);
            chartData.greaterThan90.push(topics.greaterThan90);


            }else{

            }

        }

        Highcharts.chart('container-graph', {
            chart: {
            type: 'bar'
            },
            title: {
            text: 'Topic Wise Marks Distribution'
            },
            xAxis: {
            categories: xAxisCategories
            },
            yAxis: {
            min: 0,
            title: {
                text: 'Topics'
            }
            },
            legend: {
            reversed: true
            },
            plotOptions: {
            series: {
                stacking: 'normal'
            }
            },
            series: [{
            name: 'Greater Than 90',
            data: chartData.greaterThan90
            }, {
            name: 'Between 80 to 90',
            data: chartData.between80To90
            }, {
            name: 'Between 70 to 80',
            data: chartData.between20To30
            },{
            name: 'Less Than 30',
            data: chartData.between30To40
            }]
        });

    });
}
/********************** End Topic-wise number of students having scores 0-10%, 10-20%... of all modules ***********************/
        }


    }


})();

if(graphtitle == "topicslagging"){
      meanData.getClassSubjectScoreBracket( { "subjectId": subjectId, "classId" : vm.currentClass, "studentId": vm.jsondata._id } )
      .success(function(modulewisescoredata){
        var data = modulewisescoredata;
var xAxisCategories = [];
var topicArr = [];
var chartData = {
       "lessThan30": [],
       "between30To50": [],
       "between50To80": [],
       "greaterThan80": []    
};

for(var i in data) {
    topics = data[i];
    topicId = topics._id.topicId;
    topicName = topics._id.topic_name;
    if(!topicArr[topicId]){
    topicArr[topicId] = {};
    xAxisCategories.push(topicName);
    topicArr[topicId].lessThan30 = topics.lessThan30;
    topicArr[topicId].between30To50 = topics.between30To50;
    topicArr[topicId].between50To80 = topics.between50To80;
    topicArr[topicId].greaterThan80 = topics.greaterThan80;

    chartData.lessThan30.push(topics.lessThan30);
    chartData.between30To50.push(topics.between30To50);
    chartData.between50To80.push(topics.between50To80);
    chartData.greaterThan80.push(topics.greaterThan80);

    }else{

    }

}

        Highcharts.chart('container-graph', {
            chart: {
            type: 'bar'
            },
            title: {
            text: 'Topic Wise Score Bracket Of a Class'
            },
            xAxis: {
            categories: xAxisCategories
            },
            yAxis: {
            min: 0,
            title: {
                text: 'Topics'
            }
            },
            legend: {
            reversed: true
            },
            plotOptions: {
            series: {
                stacking: 'normal'
            }
            },
            series: [{
            name: 'Greater Than 80',
            data: chartData.greaterThan80
            }, {
            name: 'Between 50 to 80',
            data: chartData.between50To80
            }, {
            name: 'Between 30 to 50',
            data: chartData.between30To50
            },{
            name: 'Less Than 30',
            data: chartData.lessThan30
            }]
        });

      });
}

//////// End opic-wise number of students having scores < 30%, >=30-50%, >=50-80%, >= 80% of all modules  /////////////

/****** Student-wise score vs attendance of an array of studentIds of a startDate and endDate **************/

if(graphtitle == "scorevsattendance"){
      meanData.getStudentWiseScoreVsAttendance( { "endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart, "studentIds": vm.jsondata._id } )
      .success(function(scorevsattendancedata){
        var data = scorevsattendancedata;
        var chartData = [];
        for (var key in data) {
            var studentObj = data[key];
            chartData.push({
            name : studentObj["studentName"],
            data : [[
                parseInt(studentObj["attendancePercentage"]),
                parseInt(studentObj["avgScore"])
                ]]
            });

        }
        //alert(JSON.stringify(chartDataFinal));
        
        Highcharts.chart('container-graph', {
            chart: {
            type: 'scatter'
            },
            title: {
            text: 'Student-wise Score vs Attendance'
            },
            plotOptions: {
               scatter: {
              marker: {
                 radius: 4,
                 states: {
                hover: {
                   enabled: true,
                   lineColor: 'rgb(100,100,100)'
                }
                 }
              },
              states: {
                 hover: {
                marker: {
                   enabled: false
                }
                 }
              }
               }
            },
            series: chartData
        });

      });
}

//////// End Student-wise score vs attendance of an array of studentIds of a startDate and endDate  /////////////

/****** Student-wise score vs pageviews of an array of studentIds of a startDate and endDate **************/

if(graphtitle == "scorevstimespent"){(function() {

  angular
    .module('meanApp')
    .controller('studentplatformCtrl', studentplatformCtrl);
  studentplatformCtrl.$inject = ['$location','$routeParams', 'meanData', '$scope', '$http', 'authentication','$window'];
    function studentplatformCtrl ($location, $routeParams, meanData, $scope, $http, authentication,$window) {
      console.log('Bagless-student-platform controller is running');
        var vm = this;

        vm.user = {};
        vm.classroomsessiondata={};
        vm.currentClass= "";
        vm.sectionStudentIds = [];
        vm.schoolCurrentSession = {};
        $scope.enterClass = function () {
             $window.location = '/students/enterclass/' + vm.jsondata.currentsection;
        };
        meanData.getUserProfile()
          .success(function(userdata) {
            vm.jsondata = userdata;
            vm.currentClass= "";
/************** Get current session for the school ***************/
            meanData.getSchoolCurrentSession({"schoolId" : vm.jsondata.currentschool._id})
            .success(function(currentsessiondata){
                vm.schoolCurrentSession = currentsessiondata;
            });
/************** End current session for the school *********/

          //alert(JSON.stringify(data));
               //console.log(vm.attendancedata.attendancePercentage);
            meanData.getSection($routeParams.sectionid)
            .success(function(sectiondata){
                vm.sectiondata = sectiondata;
                for (var key in sectiondata.students) {
                if (sectiondata.students.hasOwnProperty(key)){
                //vm.jsondata._id.push(sectiondata.students[key]._id);
                    }
                }

                  meanData.getClassAgainstSection(vm.jsondata.currentsection._id)
               .success(function(classdata){
                vm.currentClass = classdata._id;
            });


                meanData.getClassTeacherMonitor(vm.jsondata.currentsection._id)
                .success(function(techmonitordata){
                    vm.techmonitordata = techmonitordata;
                    meanData.getTeacherSubjects(vm.jsondata._id)
                    .success(function(techsubjectdata){
                        vm.techsubjectdata = techsubjectdata;
                  meanData.getTodaysAttendance(vm.jsondata.currentsection._id)
               .success(function(attendancedata){
                       //alert(JSON.stringify(data));
                       vm.attendancedata = attendancedata;
                       meanData.getSchoolTeachers(vm.jsondata.currentschool._id)
                      .success(function(teacherdata) {
                      vm.teachersdata = teacherdata[0];
                      //alert(JSON.stringify(teacherdata));
                      /*meanData.getClassTeacherMonitor(vm.jsondata.sectionId._id)
                      .success(function(classdetailsdata){
                          vm.classdetailsdata = classdetailsdata;
                              });*/
                              meanData.getStudentRoutineSubjects(vm.jsondata._id)
                              .success(function(studentsubjectdata){
                                  vm.studentsubjectdata = studentsubjectdata;
                                      /*getWeeklyStudentAttendance*/
                                      meanData.getWeeklyStudentAttendance( {"sectionId": $routeParams.sectionid, "studentId" : vm.jsondata._id, "endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart} )
                                      .success(function(weeklyattendancedataown){

                                    meanData.getWeeklyStudentAttendance( {"sectionId": $routeParams.sectionid, "endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart} )
                                    .success(function(weeklyattendancedata){
                                        var data = weeklyattendancedata;
                                        var chartData = [];
                                        for(var i in data) {
                                            var week = data[i]._id.week;
                                            var year = data[i]._id.year;
                                            var date = getDateOfWeek(week, year);
                                            var attendancePercentage = 0;
                                            if(data[i].presentCount + data[i].absentCount > 0){
                                                attendancePercentage = (100 * data[i].presentCount) / (data[i].presentCount + data[i].absentCount);
                                            }
                                            chartData.push([date,attendancePercentage]);    
                                        }

                                        var data = weeklyattendancedataown;
                                        var chartDataown = [];
                                        for(var i in data) {
                                            var week = data[i]._id.week;
                                            var year = data[i]._id.year;
                                            var date = getDateOfWeek(week, year);
                                            var attendancePercentage = 0;
                                            if(data[i].presentCount + data[i].absentCount > 0){
                                                attendancePercentage = (100 * data[i].presentCount) / (data[i].presentCount + data[i].absentCount);
                                            }
                                            chartDataown.push([date,attendancePercentage]);    
                                        }


                                        Highcharts.chart('container-graph1', {
                                            chart: {
                                            type: 'spline'
                                            },
                                            title: {
                                            text: 'Weekly Attendance'
                                            },
                                            subtitle: {
                                            text: ''
                                            },
                                            xAxis: {
                                            type: 'datetime',
                                            dateTimeLabelFormats: { // don't display the dummy year
                                                month: '%e. %b',
                                                year: '%b'
                                            },
                                            title: {
                                                text: 'Date'
                                            }
                                            },
                                            yAxis: {
                                            title: {
                                                text: 'Attendance (%)'
                                            },
                                            min: 0
                                            },
                                            tooltip: {
                                            headerFormat: '<b>{series.name}</b><br>',
                                            pointFormat: '{point.x:%e. %b}: {point.y} %'
                                            },

                                            plotOptions: {
                                            spline: {
                                                marker: {
                                                enabled: true
                                                }
                                            }
                                            },

                                            series: [{
                                            name: 'Overall Attendance',
                                            data: chartData
                                            }]
                                        });


                                    });
                                      });
                                    /*getdaysofweek*/
                                    meanData.getDayOfWeekBasedStudentAttendance( {"sectionId": $routeParams.sectionid, "endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart} )
                                    .success(function(todaysattendancedata){
                                        var data = todaysattendancedata;
                                        var avgAttendance=[];

                                        var weekday=new Array(8);
                                        weekday[2]="Monday";
                                        weekday[3]="Tuesday";
                                        weekday[4]="Wednesday";
                                        weekday[5]="Thursday";
                                        weekday[6]="Friday";
                                        weekday[7]="Saturday";
                                        weekday[1]="Sunday";

                                        for(var i in data) {
                                            attendance = data[i];
                                            dayOfWeek = attendance._id.dayOfWeek;
                                            if(!avgAttendance[dayOfWeek]){
                                            avgAttendance[dayOfWeek] = {};
                                            avgAttendance[dayOfWeek].attendancePercentage = 0;
                                            if(attendance.presentCount + attendance.absentCount > 0 ){
                                                avgAttendance[dayOfWeek].attendancePercentage = ( 100 * attendance.presentCount ) / (attendance.presentCount + attendance.absentCount);
                                                avgAttendance[dayOfWeek].weekday = weekday[dayOfWeek];
                                            }
                                            }else{

                                            }

                                        }
                                        var chartData = [];
                                        for(var i in avgAttendance) {
                                            chartData.push({"name":avgAttendance[i].weekday,
                                                    "data":[avgAttendance[i].attendancePercentage]
                                                    });
                                        }

                                        Highcharts.chart('container-graph2', {
                                            chart: {
                                            type: 'column'
                                            },
                                            title: {
                                            text: 'Day Of Week Based Attendance Percentage'
                                            },
                                            xAxis: {
                                            categories: [
                                                'Days'
                                            ],
                                            crosshair: true
                                            },
                                            yAxis: {
                                            min: 0,
                                            title: {
                                                text: ''
                                            }
                                            },
                                            tooltip: {
                                            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                                            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                                '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
                                            footerFormat: '</table>',
                                            shared: true,
                                            useHTML: true
                                            },
                                            plotOptions: {
                                            column: {
                                                pointPadding: 0.2,
                                                borderWidth: 0
                                            }
                                            },
                                            series: chartData
                                        });
                                    });

                                    /* Scores */
var stdarr = [vm.jsondata._id,"5a1a93e31cb5536e104eec46"];
                                      meanData.getAllModuleScoresForSubject( { "subjectId": vm.studentsubjectdata[0]._id, "classId" : vm.currentClass, "studentId": stdarr } )
                                      .success(function(modulewisescoredata){
                                        var data = modulewisescoredata;

                                var topicnames = [];
                                var chartData = [];
                                var xAxisCategories = [];
                                for (var key in data) {
                                    topicObj = data[key];
                                    if(!topicnames[topicObj["posX"]]){
                                    topicnames[topicObj["posX"]] = [];
                                    }
                                    chartData.push([
                                        topicObj["posX"], 
                                        topicObj["posY"], 
                                        topicObj["avgScore"]
                                    ]);
                                    topicnames[topicObj["posX"]][topicObj["posY"]] = topicObj["topic_name"];
                                    xAxisCategories[topicObj["posX"]] = topicObj["syllabusModuleName"];
                                }

                                    Highcharts.chart('container-graph3', {

                                        chart: {
                                        type: 'heatmap',
                                        marginTop: 40,
                                        marginBottom: 80,
                                        plotBorderWidth: 1
                                        },


                                        title: {
                                        text: 'Module Wise Marks Obtained'
                                        },

                                        xAxis: {
                                        categories: xAxisCategories
                                        },

                                        yAxis: {
                                        title: 'Score %',
                                        labels: {
                                           enabled: false
                                        }
                                        },

                                        colorAxis: {
                                        min: 0,
                                        minColor: '#FFFFFF',
                                        maxColor: Highcharts.getOptions().colors[0]
                                        },

                                        legend: {
                                        align: 'right',
                                        layout: 'vertical',
                                        margin: 0,
                                        verticalAlign: 'top',
                                        y: 25,
                                        symbolHeight: 280
                                        },

                                        tooltip: {
                                        formatter: function () {
                                            return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> : <br><b>' +
                                            this.point.value + '</b> % <br>';
                                        }
                                        },

                                        series: [{
                                        name: 'Topic-wise Score',
                                        borderWidth: 1,
                                        data: chartData,
                                        dataLabels: {
                                            enabled: true,
                                            color: '#000000',
                                            formatter:function(){
                                                        return topicnames[this.point.x][this.point.y];
                                                    }
                                        }
                                        }]

                                    });

                                  });

    
/* Syllabus Progress */

var data = {
  "5a479c3604f32f1029e5b70e":{
    "posX":0,
    "posY":0,
    "topicId":"5a479c3604f32f1029e5b70e",
    "syllabusModule":"5a479a2904f32f1029e5b4ba",
    "syllabusModuleName":"Simple Machines",
    "avgScore":51,
    "topic_name":"Lever"
  },
  "5a479c6704f32f1029e5b74a":{
    "posX":0,
    "posY":1,
    "topicId":"5a479c6704f32f1029e5b74a",
    "syllabusModule":"5a479a2904f32f1029e5b4ba",
    "syllabusModuleName":"Simple Machines",
    "avgScore":3,
    "topic_name":"Inclined Plane"
  },
  "5a479c8604f32f1029e5b76b":{
    "posX":1,
    "posY":0,
    "topicId":"5a479c8604f32f1029e5b76b",
    "syllabusModule":"5a479ab304f32f1029e5b556",
    "syllabusModuleName":"Force",
    "avgScore":155,
    "topic_name":"Laws Of Motion"
  },
  "5a479cbd04f32f1029e5b7aa":{
    "posX":1,
    "posY":1,
    "topicId":"5a479cbd04f32f1029e5b7aa",
    "syllabusModule":"5a479ab304f32f1029e5b556",
    "syllabusModuleName":"Force",
    "avgScore":65,
    "topic_name":"Momentum"
  },
  "5a479ccf04f32f1029e5b7c4":{
    "posX":2,
    "posY":0,
    "topicId":"5a479ccf04f32f1029e5b7c4",
    "syllabusModule":"5a479ac904f32f1029e5b56e",
    "syllabusModuleName":"Work Power Energy",
    "avgScore":100,
    "topic_name":"Work"
  },
  "5a479cf804f32f1029e5b7f1":{
    "posX":2,
    "posY":1,
    "topicId":"5a479cf804f32f1029e5b7f1",
    "syllabusModule":"5a479ac904f32f1029e5b56e",
    "syllabusModuleName":"Work Power Energy",
    "avgScore":79,
    "topic_name":"Power"
  },
  "5a479d3604f32f1029e5b84a":{
    "posX":2,
    "posY":2,
    "topicId":"5a479d3604f32f1029e5b84a",
    "syllabusModule":"5a479ac904f32f1029e5b56e",
    "syllabusModuleName":"Work Power Energy",
    "avgScore":0,
    "topic_name":"Energy"
  }
};

var topicnames = [];
var chartData = [];
var xAxisCategories = [];
for (var key in data) {
    topicObj = data[key];
    if(!topicnames[topicObj["posX"]]){
    topicnames[topicObj["posX"]] = [];
    }
    chartData.push([
        topicObj["posX"],
        topicObj["posY"],
        topicObj["avgScore"]
    ]);
    topicnames[topicObj["posX"]][topicObj["posY"]] = topicObj["topic_name"];
    xAxisCategories[topicObj["posX"]] = topicObj["syllabusModuleName"];
}

        Highcharts.chart('container-graph4', {

            chart: {
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 80,
            plotBorderWidth: 1
            },


            title: {
            text: 'Topic-wise Syllabus Progress'
            },

            xAxis: {
            categories: xAxisCategories
            },

            yAxis: {
            title: 'Score %',
            labels: {
               enabled: false
            }
            },

            colorAxis: {
            min: 0,
            minColor: '#FFFFFF',
            maxColor: Highcharts.getOptions().colors[0]
            },

            legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 280
            },

            tooltip: {
            formatter: function () {
                return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> : <br><b>' +
                this.point.value + '</b> % <br>';
            }
            },

            series: [{
            name: 'Syllabus Progress',
            borderWidth: 1,
            data: chartData,
            dataLabels: {
                enabled: true,
                color: '#000000',
                formatter:function(){
                            return topicnames[this.point.x][this.point.y];
                        }
            }
            }]

        });

/*********************/
                                  });
                              });
                          });
                       });
                });       
            });

        });

// Week number to Date conversion
    var getDateOfWeek = function(w, y) {
        var d = (1 + (w - 1) * 7); // 1st of January + 7 days for each week

        return Date.UTC(y, 0, d);
    }

// Initialize Highcharts sample for pageviews heatmap
        $scope.changeGraph = function(graphtitle, subjectId) {
/****** Today's Attendance  **************/
if(graphtitle == "todaysattendance"){
    meanData.getTodaysAttendance( $routeParams.sectionid )
    .success(function(todaysattendancedata){

        Highcharts.chart('container-graph', {
            chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
            },
            title: {
            text: "Today's Attendance"
            },
            tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
                }
            }
            },
            series: [{
            name: 'Attendance',
            colorByPoint: true,
            data: [{
                name: 'Present',
                y: todaysattendancedata.attendancePercentage
            }, {
                name: 'Absent',
                y: (100 - todaysattendancedata.attendancePercentage)
            }]
            }]
        });

    });
}
/********************** End Today's Attendance ***********************/
/****** Day of Week based attendance of a Student between a date range **************/

if(graphtitle == "dayofweekbasedattendance"){
    meanData.getDayOfWeekBasedStudentAttendance( {"sectionId": $routeParams.sectionid, "endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart} )
    .success(function(todaysattendancedata){
        var data = todaysattendancedata;
        var avgAttendance=[];

        var weekday=new Array(8);
        weekday[2]="Monday";
        weekday[3]="Tuesday";
        weekday[4]="Wednesday";
        weekday[5]="Thursday";
        weekday[6]="Friday";
        weekday[7]="Saturday";
        weekday[1]="Sunday";

        for(var i in data) {
            attendance = data[i];
            dayOfWeek = attendance._id.dayOfWeek;
            if(!avgAttendance[dayOfWeek]){
            avgAttendance[dayOfWeek] = {};
            avgAttendance[dayOfWeek].attendancePercentage = 0;
            if(attendance.presentCount + attendance.absentCount > 0 ){
                avgAttendance[dayOfWeek].attendancePercentage = ( 100 * attendance.presentCount ) / (attendance.presentCount + attendance.absentCount);
                avgAttendance[dayOfWeek].weekday = weekday[dayOfWeek];
            }
            }else{

            }

        }
        var chartData = [];
        for(var i in avgAttendance) {
            chartData.push({"name":avgAttendance[i].weekday,
                    "data":[avgAttendance[i].attendancePercentage]
                    });
        }

        Highcharts.chart('container-graph', {
            chart: {
            type: 'column'
            },
            title: {
            text: 'Day Of Week Based Attendance Percentage'
            },
            xAxis: {
            categories: [
                'Teachers'
            ],
            crosshair: true
            },
            yAxis: {
            min: 0,
            title: {
                text: ''
            }
            },
            tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
            },
            plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
            },
            series: chartData
        });
    });
}

//////// End Day of Week based attendance of a Student between a date range  /////////////

/****** Weekly attendance of overall class **************/

if(graphtitle == "weeklyattendance"){
      meanData.getWeeklyStudentAttendance( {"sectionId": $routeParams.sectionid, "teacherId" : vm.jsondata._id, "endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart} )
      .success(function(weeklyattendancedataown){

    meanData.getWeeklyStudentAttendance( {"sectionId": $routeParams.sectionid, "endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart} )
    .success(function(weeklyattendancedata){
        var data = weeklyattendancedata;
        var chartData = [];
        for(var i in data) {
            var week = data[i]._id.week;
            var year = data[i]._id.year;
            var date = getDateOfWeek(week, year);
            var attendancePercentage = 0;
            if(data[i].presentCount + data[i].absentCount > 0){
                attendancePercentage = (100 * data[i].presentCount) / (data[i].presentCount + data[i].absentCount);
            }
            chartData.push([date,attendancePercentage]);    
        }

        var data = weeklyattendancedataown;
        var chartDataown = [];
        for(var i in data) {
            var week = data[i]._id.week;
            var year = data[i]._id.year;
            var date = getDateOfWeek(week, year);
            var attendancePercentage = 0;
            if(data[i].presentCount + data[i].absentCount > 0){
                attendancePercentage = (100 * data[i].presentCount) / (data[i].presentCount + data[i].absentCount);
            }
            chartDataown.push([date,attendancePercentage]);    
        }


        Highcharts.chart('container-graph', {
            chart: {
            type: 'spline'
            },
            title: {
            text: 'Weekly Attendance'
            },
            subtitle: {
            text: 'Of Entire section'
            },
            xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            },
            title: {
                text: 'Date'
            }
            },
            yAxis: {
            title: {
                text: 'Attendance (%)'
            },
            min: 0
            },
            tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x:%e. %b}: {point.y} %'
            },

            plotOptions: {
            spline: {
                marker: {
                enabled: true
                }
            }
            },

            series: [{
            name: 'Overall',
            data: chartData
            },{
            name: 'In Your Class',
            data: chartDataown
            }]
        });


    });
      });
}

//////// Weekly attendance of overall class  /////////////

/****** Topic-wise assignment scores for all modules of a subject and class for students **************/

if(graphtitle == "scoreheatmapmodulewisesubject"){
      meanData.getAllModuleScoresForSubject( { "subjectId": subjectId, "classId" : vm.currentClass, "studentId": vm.jsondata._id } )
      .success(function(modulewisescoredata){
        var data = modulewisescoredata;

var topicnames = [];
var chartData = [];
var xAxisCategories = [];
for (var key in data) {
    topicObj = data[key];
    if(!topicnames[topicObj["posX"]]){
    topicnames[topicObj["posX"]] = [];
    }
    chartData.push([
        topicObj["posX"], 
        topicObj["posY"], 
        topicObj["avgScore"]
    ]);
    topicnames[topicObj["posX"]][topicObj["posY"]] = topicObj["topic_name"];
    xAxisCategories[topicObj["posX"]] = topicObj["syllabusModuleName"];
}

        Highcharts.chart('container-graph', {

            chart: {
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 80,
            plotBorderWidth: 1
            },


            title: {
            text: 'Module Wise Marks Obtained'
            },

            xAxis: {
            categories: xAxisCategories
            },

            yAxis: {
            title: 'Score %',
            labels: {
               enabled: false
            }
            },

            colorAxis: {
            min: 0,
            minColor: '#FFFFFF',
            maxColor: Highcharts.getOptions().colors[0]
            },

            legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 280
            },

            tooltip: {
            formatter: function () {
                return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> : <br><b>' +
                this.point.value + '</b> % <br>';
            }
            },

            series: [{
            name: 'Topic-wise Score',
            borderWidth: 1,
            data: chartData,
            dataLabels: {
                enabled: true,
                color: '#000000',
                formatter:function(){
                            return topicnames[this.point.x][this.point.y];
                        }
            }
            }]

        });

      });
}

//////// End Topic-wise assignment scores for all modules of a subject and class for students  /////////////

/****** Topic-wise number of students having scores < 30%, >=30-50%, >=50-80%, >= 80% of all modules **************/

if(graphtitle == "topicslagging"){
      meanData.getClassSubjectScoreBracket( { "subjectId": subjectId, "classId" : vm.currentClass, "studentId": vm.jsondata._id } )
      .success(function(modulewisescoredata){
        var data = modulewisescoredata;
var xAxisCategories = [];
var topicArr = [];
var chartData = {
       "lessThan30": [],
       "between30To50": [],
       "between50To80": [],
       "greaterThan80": []    
};

for(var i in data) {
    topics = data[i];
    topicId = topics._id.topicId;
    topicName = topics._id.topic_name;
    if(!topicArr[topicId]){
    topicArr[topicId] = {};
    xAxisCategories.push(topicName);
    topicArr[topicId].lessThan30 = topics.lessThan30;
    topicArr[topicId].between30To50 = topics.between30To50;
    topicArr[topicId].between50To80 = topics.between50To80;
    topicArr[topicId].greaterThan80 = topics.greaterThan80;

    chartData.lessThan30.push(topics.lessThan30);
    chartData.between30To50.push(topics.between30To50);
    chartData.between50To80.push(topics.between50To80);
    chartData.greaterThan80.push(topics.greaterThan80);

    }else{

    }

}

        Highcharts.chart('container-graph', {
            chart: {
            type: 'bar'
            },
            title: {
            text: 'Topic Wise Score Bracket Of a Class'
            },
            xAxis: {
            categories: xAxisCategories
            },
            yAxis: {
            min: 0,
            title: {
                text: 'Topics'
            }
            },
            legend: {
            reversed: true
            },
            plotOptions: {
            series: {
                stacking: 'normal'
            }
            },
            series: [{
            name: 'Greater Than 80',
            data: chartData.greaterThan80
            }, {
            name: 'Between 50 to 80',
            data: chartData.between50To80
            }, {
            name: 'Between 30 to 50',
            data: chartData.between30To50
            },{
            name: 'Less Than 30',
            data: chartData.lessThan30
            }]
        });

      });
}

//////// End opic-wise number of students having scores < 30%, >=30-50%, >=50-80%, >= 80% of all modules  /////////////

/****** Student-wise score vs attendance of an array of studentIds of a startDate and endDate **************/

if(graphtitle == "scorevsattendance"){
      meanData.getStudentWiseScoreVsAttendance( { "endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart, "studentIds": vm.jsondata._id } )
      .success(function(scorevsattendancedata){
        var data = scorevsattendancedata;
        var chartData = [];
        for (var key in data) {
            var studentObj = data[key];
            chartData.push({
            name : studentObj["studentName"],
            data : [[
                parseInt(studentObj["attendancePercentage"]),
                parseInt(studentObj["avgScore"])
                ]]
            });

        }
        //alert(JSON.stringify(chartDataFinal));
        
        Highcharts.chart('container-graph', {
            chart: {
            type: 'scatter'
            },
            title: {
            text: 'Student-wise Score vs Attendance'
            },
            plotOptions: {
               scatter: {
              marker: {
                 radius: 4,
                 states: {
                hover: {
                   enabled: true,
                   lineColor: 'rgb(100,100,100)'
                }
                 }
              },
              states: {
                 hover: {
                marker: {
                   enabled: false
                }
                 }
              }
               }
            },
            series: chartData
        });

      });
}

//////// End Student-wise score vs attendance of an array of studentIds of a startDate and endDate  /////////////

/****** Student-wise score vs pageviews of an array of studentIds of a startDate and endDate **************/

if(graphtitle == "scorevstimespent"){
      meanData.getStudentWiseScoreVsPageviews( {"endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart, "studentIds": vm.jsondata._id } )
      .success(function(scorevstimespentdata){
        var data = scorevstimespentdata;
        var chartData = [];
        for (var key in data) {
            var studentObj = data[key];
            chartData.push({
            name : studentObj["studentName"],
            data : [[
                parseInt(studentObj["time_spent"]),
                parseInt(studentObj["avgScore"])
                ]]
            });

        }
        Highcharts.chart('container-graph', {
            chart: {
            type: 'scatter'
            },
            title: {
            text: 'Student-wise Score vs Time Spent'
            },
            plotOptions: {
               scatter: {
              marker: {
                 radius: 4,
                 states: {
                hover: {
                   enabled: true,
                   lineColor: 'rgb(100,100,100)'
                }
                 }
              },
              states: {
                 hover: {
                marker: {
                   enabled: false
                }
                 }
              }
               }
            },
            series: chartData
        });

      });
}

//////// End Student-wise score vs pageviews of an array of studentIds of a startDate and endDate  /////////////
/****** Topic-wise number of students having scores 0-10%, 10-20%... of all modules  **************/
if(graphtitle == "marksdistribution"){
    meanData.getClassSubjectScoreBracketGranular( { "classId" : vm.currentClass , "subjectId": subjectId } )
    .success(function(marksdistributiondata){

        var data = marksdistributiondata;
        var xAxisCategories = [];
        var topicArr = [];
        var chartData = {
               "between0To10": [],
               "between10To20": [],
               "between20To30": [],
               "between30To40": [],    
               "between40To50": [],    
               "between50To60": [],    
               "between60To70": [],    
               "between70To80": [],    
               "between80To90": [],    
               "greaterThan90": []
        };

        for(var i in data) {
            topics = data[i];
            topicId = topics._id.topicId;
            topicName = topics._id.topic_name;
            if(!topicArr[topicId]){
            topicArr[topicId] = {};
            xAxisCategories.push(topicName);
            topicArr[topicId].between0To10 = topics.between0To10;
            topicArr[topicId].between10To20 = topics.between10To20;
            topicArr[topicId].between20To30 = topics.between20To30;
            topicArr[topicId].between30To40 = topics.between30To40;
            topicArr[topicId].between40To50 = topics.between40To50;
            topicArr[topicId].between50To60 = topics.between50To60;
            topicArr[topicId].between60To70 = topics.between60To70;
            topicArr[topicId].between70To80 = topics.between70To80;
            topicArr[topicId].between80To90 = topics.between80To90;
            topicArr[topicId].greaterThan90 = topics.greaterThan90;

            chartData.between0To10.push(topics.between0To10);
            chartData.between10To20.push(topics.between10To20);
            chartData.between20To30.push(topics.between20To30);
            chartData.between30To40.push(topics.between30To40);
            chartData.between40To50.push(topics.between40To50);
            chartData.between50To60.push(topics.between50To60);
            chartData.between60To70.push(topics.between60To70);
            chartData.between70To80.push(topics.between70To80);
            chartData.between80To90.push(topics.between80To90);
            chartData.greaterThan90.push(topics.greaterThan90);


            }else{

            }

        }

        Highcharts.chart('container-graph', {
            chart: {
            type: 'bar'
            },
            title: {
            text: 'Topic Wise Marks Distribution'
            },
            xAxis: {
            categories: xAxisCategories
            },
            yAxis: {
            min: 0,
            title: {
                text: 'Topics'
            }
            },
            legend: {
            reversed: true
            },
            plotOptions: {
            series: {
                stacking: 'normal'
            }
            },
            series: [{
            name: 'Greater Than 90',
            data: chartData.greaterThan90
            }, {
            name: 'Between 80 to 90',
            data: chartData.between80To90
            }, {
            name: 'Between 70 to 80',
            data: chartData.between20To30
            },{
            name: 'Less Than 30',
            data: chartData.between30To40
            }]
        });

    });
}
/********************** End Topic-wise number of students having scores 0-10%, 10-20%... of all modules ***********************/
        }


    }


})();

      meanData.getStudentWiseScoreVsPageviews( {"endDate": vm.schoolCurrentSession.currentSessionEnd, "startDate": vm.schoolCurrentSession.currentSessionStart, "studentIds": vm.jsondata._id } )
      .success(function(scorevstimespentdata){
        var data = scorevstimespentdata;
        var chartData = [];
        for (var key in data) {
            var studentObj = data[key];
            chartData.push({
            name : studentObj["studentName"],
            data : [[
                parseInt(studentObj["time_spent"]),
                parseInt(studentObj["avgScore"])
                ]]
            });

        }
        Highcharts.chart('container-graph', {
            chart: {
            type: 'scatter'
            },
            title: {
            text: 'Student-wise Score vs Time Spent'
            },
            plotOptions: {
               scatter: {
              marker: {
                 radius: 4,
                 states: {
                hover: {
                   enabled: true,
                   lineColor: 'rgb(100,100,100)'
                }
                 }
              },
              states: {
                 hover: {
                marker: {
                   enabled: false
                }
                 }
              }
               }
            },
            series: chartData
        });

      });
}

//////// End Student-wise score vs pageviews of an array of studentIds of a startDate and endDate  /////////////
/****** Topic-wise number of students having scores 0-10%, 10-20%... of all modules  **************/
if(graphtitle == "marksdistribution"){
    meanData.getClassSubjectScoreBracketGranular( { "classId" : vm.currentClass , "subjectId": subjectId } )
    .success(function(marksdistributiondata){

        var data = marksdistributiondata;
        var xAxisCategories = [];
        var topicArr = [];
        var chartData = {
               "between0To10": [],
               "between10To20": [],
               "between20To30": [],
               "between30To40": [],    
               "between40To50": [],    
               "between50To60": [],    
               "between60To70": [],    
               "between70To80": [],    
               "between80To90": [],    
               "greaterThan90": []
        };

        for(var i in data) {
            topics = data[i];
            topicId = topics._id.topicId;
            topicName = topics._id.topic_name;
            if(!topicArr[topicId]){
            topicArr[topicId] = {};
            xAxisCategories.push(topicName);
            topicArr[topicId].between0To10 = topics.between0To10;
            topicArr[topicId].between10To20 = topics.between10To20;
            topicArr[topicId].between20To30 = topics.between20To30;
            topicArr[topicId].between30To40 = topics.between30To40;
            topicArr[topicId].between40To50 = topics.between40To50;
            topicArr[topicId].between50To60 = topics.between50To60;
            topicArr[topicId].between60To70 = topics.between60To70;
            topicArr[topicId].between70To80 = topics.between70To80;
            topicArr[topicId].between80To90 = topics.between80To90;
            topicArr[topicId].greaterThan90 = topics.greaterThan90;

            chartData.between0To10.push(topics.between0To10);
            chartData.between10To20.push(topics.between10To20);
            chartData.between20To30.push(topics.between20To30);
            chartData.between30To40.push(topics.between30To40);
            chartData.between40To50.push(topics.between40To50);
            chartData.between50To60.push(topics.between50To60);
            chartData.between60To70.push(topics.between60To70);
            chartData.between70To80.push(topics.between70To80);
            chartData.between80To90.push(topics.between80To90);
            chartData.greaterThan90.push(topics.greaterThan90);


            }else{

            }

        }

        Highcharts.chart('container-graph', {
            chart: {
            type: 'bar'
            },
            title: {
            text: 'Topic Wise Marks Distribution'
            },
            xAxis: {
            categories: xAxisCategories
            },
            yAxis: {
            min: 0,
            title: {
                text: 'Topics'
            }
            },
            legend: {
            reversed: true
            },
            plotOptions: {
            series: {
                stacking: 'normal'
            }
            },
            series: [{
            name: 'Greater Than 90',
            data: chartData.greaterThan90
            }, {
            name: 'Between 80 to 90',
            data: chartData.between80To90
            }, {
            name: 'Between 70 to 80',
            data: chartData.between20To30
            },{
            name: 'Less Than 30',
            data: chartData.between30To40
            }]
        });

    });
}
/********************** End Topic-wise number of students having scores 0-10%, 10-20%... of all modules ***********************/
        }


    }


})();
