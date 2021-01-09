var base64src = ""

function fileChange(element) {
    $("#filenameLabel").html(element.files[0].name);
    if (!/image\/\w+/.test(element.files[0].type)) {
        return false;
    }
    let reader = new FileReader();
    reader.readAsDataURL(element.files[0]);
    reader.onload = function () {
        base64src = reader.result;
        document.getElementById('imgAvatar').src = reader.result;
    };
}

function UpdateProfile() {
    let nickname = $("#inputNickname").val();
    let password = $("#inputPassword").val();
    let profile = $("#inputProfile").val();
    let formData = new FormData();
    formData.append("imgAvatar", base64src);
    formData.append("nickname", nickname);
    formData.append("password", password);
    formData.append("profile", profile);
    $.ajax({
        url: "/account/updateprofile",
        type: 'POST',
        cache: false,
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            alert(data);
            setTimeout('window.location.href="/logout";', 500)
        },
        error: function (data) {
        }
    });
}

function ShowScoreStat(element, identity) {
    let param = "identity=" + identity;
    let course = element.innerHTML;
    $("#formativeScoreStat")[0].style.display = "none";
    $("#summativeScoreStat")[0].style.display = "none";
    $.get('/account/' + course + '/getscorestat', param, function (data) {
        if (!jQuery.isEmptyObject(data)) {
            $("#formativeScoreStat")[0].style.display = "block";
            $("#summativeScoreStat")[0].style.display = "block";
            let formativeScoreStat = echarts.init(document.getElementById('formativeScoreStat'));
            let summativeScoreStat = echarts.init(document.getElementById('summativeScoreStat'));
            let formativedataAxis = []
            let formativedatavalue = []
            let summativedataAxis = []
            let summativedatavalue = []
            for (let key in data) {
                if (data[key][1] == "formative") {
                    formativedataAxis.push(data[key][3]);
                    formativedatavalue.push(data[key][2]);
                } else {
                    summativedataAxis.push(data[key][3]);
                    summativedatavalue.push(data[key][2]);
                }
            }
            let yMax = 100;
            let dataShadow = [];

            for (let i = 0; i < formativedatavalue.length; i++) {
                dataShadow.push(yMax);
            }

            let formativeScoreStatOption = {
                title: {
                    text: 'Formative Score Stat'
                },
                xAxis: {
                    data: formativedataAxis,
                    axisLabel: {
                        inside: false,
                        textStyle: {
                            color: 'black'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    z: 10
                },
                yAxis: {
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#999'
                        }
                    }
                },
                dataZoom: [
                    {
                        type: 'inside'
                    }
                ],
                series: [
                    {
                        type: 'bar',
                        itemStyle: {
                            color: 'rgba(0,0,0,0.05)'
                        },
                        barGap: '-100%',
                        barCategoryGap: '40%',
                        data: dataShadow,
                        animation: false
                    },
                    {
                        type: 'bar',
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#83bff6'},
                                    {offset: 0.5, color: '#188df0'},
                                    {offset: 1, color: '#188df0'}
                                ]
                            )
                        },
                        emphasis: {
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#2378f7'},
                                        {offset: 0.7, color: '#2378f7'},
                                        {offset: 1, color: '#83bff6'}
                                    ]
                                )
                            }
                        },
                        data: formativedatavalue
                    }
                ]
            };

            let zoomSize = 6;
            formativeScoreStat.on('click', function (params) {
                console.log(formativedataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
                formativeScoreStat.dispatchAction({
                    type: 'dataZoom',
                    startValue: formativedataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
                    endValue: formativedataAxis[Math.min(params.dataIndex + zoomSize / 2, formativedatavalue.length - 1)]
                });
            });
            formativeScoreStat.setOption(formativeScoreStatOption);

            let summativeScoreStatOption = {
                title: {
                    text: 'Summative Score Stat'
                },
                xAxis: {
                    type: 'category',
                    data: summativedataAxis
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: summativedatavalue,
                    type: 'line',
                    symbol: 'circle',
                    symbolSize: 15,
                    lineStyle: {
                        color: '#5470C6',
                        width: 0,
                        type: 'dashed'
                    },
                    itemStyle: {
                        borderWidth: 3,
                        borderColor: '#EE6666',
                        color: 'yellow'
                    }
                }]
            };
            summativeScoreStat.setOption(summativeScoreStatOption);
        }
    })
}

function UpdateScoreStat(element, identity) {
    let param = "identity=" + identity + "&";
    let course = element.id.split("-")[1];
    let exams = $('input.custom-control-input');
    let examname = "";
    for (let index in exams) {
        if (index == "length") {
            break;
        }
        let examstate = exams[index].checked;
        let examcourse = exams[index].id.split("-")[1];
        if (examstate && examcourse == course) {
            examname = exams[index].id.split("-")[2];
            param += index + "=" + examname + "&";
        }
    }
    param = param.substring(0, param.length - 1)

    $("#formativeScoreStat")[0].style.display = "none";
    $("#summativeScoreStat")[0].style.display = "none";

    $.get('/account/' + course + '/updatescorestat', param, function (data) {
        if (!jQuery.isEmptyObject(data)) {
            $("#formativeScoreStat")[0].style.display = "block";
            $("#summativeScoreStat")[0].style.display = "block";
            let formativeScoreStat = echarts.init(document.getElementById('formativeScoreStat'));
            let summativeScoreStat = echarts.init(document.getElementById('summativeScoreStat'));
            let formativedataAxis = []
            let formativedatavalue = []
            let summativedataAxis = []
            let summativedatavalue = []
            for (let key in data) {
                if (data[key][1] == "formative") {
                    formativedataAxis.push(data[key][3]);
                    formativedatavalue.push(data[key][2]);
                } else {
                    summativedataAxis.push(data[key][3]);
                    summativedatavalue.push(data[key][2]);
                }
            }
            let yMax = 100;
            let dataShadow = [];

            for (let i = 0; i < formativedatavalue.length; i++) {
                dataShadow.push(yMax);
            }

            let formativeScoreStatOption = {
                title: {
                    text: 'Formative Score Stat'
                },
                xAxis: {
                    data: formativedataAxis,
                    axisLabel: {
                        inside: false,
                        textStyle: {
                            color: 'black'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    z: 10
                },
                yAxis: {
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#999'
                        }
                    }
                },
                dataZoom: [
                    {
                        type: 'inside'
                    }
                ],
                series: [
                    {
                        type: 'bar',
                        itemStyle: {
                            color: 'rgba(0,0,0,0.05)'
                        },
                        barGap: '-100%',
                        barCategoryGap: '40%',
                        data: dataShadow,
                        animation: false
                    },
                    {
                        type: 'bar',
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#83bff6'},
                                    {offset: 0.5, color: '#188df0'},
                                    {offset: 1, color: '#188df0'}
                                ]
                            )
                        },
                        emphasis: {
                            itemStyle: {
                                color: new echarts.graphic.LinearGradient(
                                    0, 0, 0, 1,
                                    [
                                        {offset: 0, color: '#2378f7'},
                                        {offset: 0.7, color: '#2378f7'},
                                        {offset: 1, color: '#83bff6'}
                                    ]
                                )
                            }
                        },
                        data: formativedatavalue
                    }
                ]
            };

            let zoomSize = 6;
            formativeScoreStat.on('click', function (params) {
                console.log(formativedataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
                formativeScoreStat.dispatchAction({
                    type: 'dataZoom',
                    startValue: formativedataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
                    endValue: formativedataAxis[Math.min(params.dataIndex + zoomSize / 2, formativedatavalue.length - 1)]
                });
            });
            formativeScoreStat.setOption(formativeScoreStatOption);

            let summativeScoreStatOption = {
                title: {
                    text: 'Summative Score Stat'
                },
                xAxis: {
                    type: 'category',
                    data: summativedataAxis
                },
                yAxis: {
                    type: 'value'
                },
                series: [{
                    data: summativedatavalue,
                    type: 'line',
                    symbol: 'circle',
                    symbolSize: 15,
                    lineStyle: {
                        color: '#5470C6',
                        width: 0,
                        type: 'dashed'
                    },
                    itemStyle: {
                        borderWidth: 3,
                        borderColor: '#EE6666',
                        color: 'yellow'
                    }
                }]
            };
            summativeScoreStat.setOption(summativeScoreStatOption);
        }
    })
}