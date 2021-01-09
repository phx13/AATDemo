var myEditor = null;
window.onload = function () {
    ClassicEditor
        .create(document.querySelector("#editor"))
        .then(editor => {
            myEditor = editor;
        })
        .catch(error => {
            console.error(error);
        });
}

function fileChange(element) {
    if (element.files[0].name.endsWith('.txt')) {
        $("#filenameLabel").html(element.files[0].name);
        let reader = new FileReader();
        reader.readAsDataURL(element.files[0]);
        reader.onload = function () {
            let base64text = reader.result.split(",")[1]
            let text = window.atob(base64text)
            myEditor.setData(text);
        };
    } else {
        alert("choose .txt document");
    }
}

function ShowFormativeScoreAndFeedback() {
    let course = $(document).attr("title").split("-")[0];
    let examname = $('h1.display-4')[0].innerText;
    let questions = $('p.lead');
    let param = "total=" + questions.length + "&";
    for (let i = 0; i < questions.length; i++) {
        let id = questions[i].innerText.split(".")[0];
        if ($("input[name='" + id + "']:checked")[0] != undefined) {
            let answer = $("input[name='" + id + "']:checked")[0].id.split('-')[1]
            let feedback = $("input[name='star" + id + "']:checked")[0].id
            param += id + "=" + answer + "-" + feedback + "&";
        }
    }
    param = param.substring(0, param.length - 1)

    $("#formativeScore")[0].style.display = "none";
    $("#formativeFeedback")[0].style.display = "none";
    $.get('/course/' + course + '/' + examname + '/getformativeresult', param, function (data) {
        if (!jQuery.isEmptyObject(data)) {
            $("#formativeScore")[0].style.display = "block";
            $("#formativeFeedback")[0].style.display = "block";

            let myScoreChart = echarts.init(document.getElementById('formativeScore'));
            let scoreOption = {
                title: {
                    text: examname + ' Formative Score'
                },
                series: [
                    {
                        type: 'pie',
                        radius: '75%',
                        data: [
                            {value: data['correctanswer'], name: 'correct'},
                            {value: questions.length - 1 - data['correctanswer'], name: 'wrong'}
                        ]
                    }
                ]
            };
            myScoreChart.setOption(scoreOption);

            let myFeedbackChart = echarts.init(document.getElementById('formativeFeedback'));
            let feedbackOption = {
                title: {
                    text: examname + ' Formative Feedback'
                },
                series: [
                    {
                        type: 'pie',
                        radius: '75%',
                        data: [
                            {value: data['smilefeedback'], name: 'smilefeedback'},
                            {value: data['mehfeedback'], name: 'mehfeedback'},
                            {value: data['frownfeedback'], name: 'frownfeedback'},
                        ]
                    }
                ]
            };
            myFeedbackChart.setOption(feedbackOption);
        }
    })
}

function ShowSummativeScore() {
    let course = $(document).attr("title").split("-")[0];
    let examname = $('h1.display-4')[0].innerText;
    let answer = myEditor.getData();
    answer = answer.replace("<p>", "");
    answer = answer.replace("</p>", "");
    answer = answer.replace("&nbsp;", "");

    let id = $("#summativeQuestion")[0].innerText.split(".")[0];
    let param = id + "=" + answer;

    $("#summativeScoreLine")[0].style.display = "none";
    $("#summativeScoreDashboard")[0].style.display = "none";
    $.get('/course/' + course + '/' + examname + '/getsummativeresult', param, function (data) {
        if (!jQuery.isEmptyObject(data)) {
            $("#filenameLabel").html("Choose file");
            myEditor.setData("");

            $("#summativeScoreLine")[0].style.display = "block";
            $("#summativeScoreDashboard")[0].style.display = "block";

            let myScoreLineChart = echarts.init(document.getElementById('summativeScoreLine'));
            let scoreOptionLine = {
                title: {
                    text: examname + ' Summative Analysis'
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['answer', 'standardAnswer'],
                    top: 30
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: data['keyword']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: 'answer',
                        type: 'line',
                        data: data['v1']
                    },
                    {
                        name: 'standardAnswer',
                        type: 'line',
                        data: data['v2']
                    }
                ]
            };
            myScoreLineChart.setOption(scoreOptionLine);

            let myScoreDashboardChart = echarts.init(document.getElementById('summativeScoreDashboard'));
            let scoreOptionDashboard = {
                title: {
                    text: examname + ' Summative Score'
                },
                series: [{
                    type: 'gauge',
                    startAngle: 210,
                    endAngle: -30,
                    min: 0,
                    max: 1,
                    splitNumber: 8,
                    axisLine: {
                        lineStyle: {
                            width: 6,
                            color: [
                                [0.5, '#FF6E76'],
                                [0.6, '#FDDD60'],
                                [0.7, '#58D9F9'],
                                [1, '#7CFFB2']
                            ]
                        }
                    },
                    pointer: {
                        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
                        length: '10%',
                        width: 10,
                        offsetCenter: [0, '-75%'],
                        itemStyle: {
                            color: 'auto'
                        }
                    },
                    axisTick: {
                        length: 12,
                        lineStyle: {
                            color: 'auto',
                            width: 2
                        }
                    },
                    splitLine: {
                        length: 20,
                        lineStyle: {
                            color: 'auto',
                            width: 5
                        }
                    },
                    axisLabel: {
                        color: '#464646',
                        fontSize: 0,
                        distance: -60,
                        formatter: function (value) {
                            if (value === 0.85) {
                                // return 'distinction';
                            } else if (value === 0.65) {
                                // return 'merit';
                            } else if (value === 0.55) {
                                // return 'pass';
                            } else if (value === 0.25) {
                                // return 'fail';
                            }
                        }
                    },
                    title: {
                        offsetCenter: [0, '-20%'],
                        fontSize: 30
                    },
                    detail: {
                        fontSize: 30,
                        offsetCenter: [0, '30%'],
                        valueAnimation: true,
                        formatter: function (value) {
                            return Math.round(value * 100);
                        },
                        color: 'auto'
                    },
                    data: [{
                        value: data['res'] / 100,
                        name: 'score'
                    }]
                }]
            };
            myScoreDashboardChart.setOption(scoreOptionDashboard);
        }
    })
}