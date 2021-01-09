$(document).on('click', '.value-control', function () {
    let action = $(this).attr('data-action');
    let target = $(this).attr('data-target');
    let value = parseFloat($('[id="' + target + '"]').val());
    if (action == "plus") {
        value++;
        if (value > 10) {
            value = 10;
        }
    }
    if (action == "minus") {
        value--;
        if (value < 1) {
            value = 1;
        }
    }
    $('[id="' + target + '"]').val(value)
})

function GoExam(location) {
    let param = "";
    let assessmentNumber = $("#assessmentNumber").val();
    param += "?assessmentNumber=" + assessmentNumber;
    window.location.href = location + param;
}

function courseManagement(courseid) {
    $('#table-' + courseid).bootstrapTable({
        url: '/course/' + courseid + '/coursemanagement',  // 请求数据源的路由
        dataType: "json",
        pagination: true, //前端处理分页
        singleSelect: false,//是否只能单选
        search: true, //显示搜索框，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        toolbar: '#toolbar-' + courseid, //工具按钮用哪个容器
        striped: true, //是否显示行间隔色
        cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pageNumber: 1, //初始化加载第10页，默认第一页
        pageSize: 10, //每页的记录行数（*）
        pageList: [10, 20, 50, 100], //可供选择的每页的行数（*）
        strictSearch: true,//设置为 true启用 全匹配搜索，false为模糊搜索
        // showColumns: true, //显示内容列下拉框
        // showRefresh: true, //显示刷新按钮
        minimumCountColumns: 2, //当列数小于此值时，将隐藏内容列下拉框
        // clickToSelect: true, //设置true， 将在点击某行时，自动勾选rediobox 和 checkbox
        // height: 500, //表格高度，如果没有设置height属性，表格自动根据记录条数决定表格高度
        uniqueId: "id", //每一行的唯一标识，一般为主键列
        showToggle: true, //是否显示详细视图和列表视图的切换按钮
        // cardView: true, //是否显示详细视图
        // detailView: true, //是否显示父子表，设置为 true 可以显示详细页面模式,在每行最前边显示+号#}
        sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
        columns: [
            {
                title: "selectAll",
                field: "select",
                checkbox: true,
                align: "center"
            },
            {
                field: 'id',
                title: 'Id',
                align: 'center'
            }, {
                field: 'email',
                title: 'Email',
                align: 'center'
            }, {
                field: 'course',
                title: 'Course',
                align: 'center'
            }
        ],
        onDblClickCell: function (field, value, row, cell) {
            if (field == 'id') {
                cell.attr('contenteditable', false);
            } else {
                cell.attr('contenteditable', true);
                cell.blur(function () {
                    let index = cell.parent().data('index');
                    let tdValue = cell.html();
                    updateCellData(courseid, null, index, field, tdValue);
                })
            }
        }
    });
}

function examManagement(courseid, examname) {
    $('#table-' + courseid + '-' + examname).bootstrapTable({
        url: '/course/' + courseid + '/' + examname + '/exammanagement',  // 请求数据源的路由
        dataType: "json",
        pagination: true, //前端处理分页
        singleSelect: false,//是否只能单选
        search: true, //显示搜索框，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        toolbar: '#toolbar-' + courseid + '-' + examname, //工具按钮用哪个容器
        striped: true, //是否显示行间隔色
        cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pageNumber: 1, //初始化加载第10页，默认第一页
        pageSize: 10, //每页的记录行数（*）
        pageList: [10, 20, 50, 100], //可供选择的每页的行数（*）
        strictSearch: true,//设置为 true启用 全匹配搜索，false为模糊搜索
        // showColumns: true, //显示内容列下拉框
        // showRefresh: true, //显示刷新按钮
        minimumCountColumns: 2, //当列数小于此值时，将隐藏内容列下拉框
        // clickToSelect: true, //设置true， 将在点击某行时，自动勾选rediobox 和 checkbox
        // height: 500, //表格高度，如果没有设置height属性，表格自动根据记录条数决定表格高度
        uniqueId: "id", //每一行的唯一标识，一般为主键列
        showToggle: true, //是否显示详细视图和列表视图的切换按钮
        // cardView: true, //是否显示详细视图
        // detailView: true, //是否显示父子表，设置为 true 可以显示详细页面模式,在每行最前边显示+号#}
        sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
        columns: [
            {
                title: "selectAll",
                field: "select",
                checkbox: true,
                align: "center"
            },
            {
                field: 'id',
                title: 'Id',
                align: 'center'
            }, {
                field: 'type',
                title: 'Type',
                align: 'center'
            }, {
                field: 'question',
                title: 'Question',
                align: 'center'
            }, {
                field: 'answer',
                title: 'Answer',
                align: 'center'
            }
        ],
        onDblClickCell: function (field, value, row, cell) {
            if (field == 'id') {
                cell.attr('contenteditable', false);
            } else {
                cell.attr('contenteditable', true);
                cell.blur(function () {
                    let index = cell.parent().data('index');
                    let tdValue = cell.html();
                    updateCellData(courseid, examname, index, field, tdValue);
                })
            }
        }
    });
}

function updateCellData(courseid, examname, index, field, value) {
    if (examname == null) {
        $('#table-' + courseid).bootstrapTable('updateCell', {
            index: index,
            field: field,
            value: value
        })
    } else {
        $('#table-' + courseid + '-' + examname).bootstrapTable('updateCell', {
            index: index,
            field: field,
            value: value
        })
    }
}

function addTableData(courseid, examname) {
    if (examname == null) {
        let count = $('#table-' + courseid).bootstrapTable('getData').length;
        $('#table-' + courseid).bootstrapTable('insertRow', {
            index: count,
            row: {id: count, email: "random@cardiff.ac.uk", course: "CMT313"}
        });
        let param = "email=random@cardiff.ac.uk&course=CMT313";
        $.post('/course/' + courseid + '/coursemanagementadddata', param, function (data) {
            if (!jQuery.isEmptyObject(data)) {
                alert(data);
                $('#table-' + courseid).bootstrapTable('refresh')
            }
        })
    } else {
        let count = $('#table-' + courseid + '-' + examname).bootstrapTable('getData').length;
        $('#table-' + courseid + '-' + examname).bootstrapTable('insertRow', {
            index: count,
            row: {id: count, type: "formative", question: "formativequestion", answer: "answer"}
        });
        let param = "type=formative&question=formativequestion&answer=answer";
        $.post('/course/' + courseid + '/' + examname + '/exammanagementadddata', param, function (data) {
            if (!jQuery.isEmptyObject(data)) {
                alert(data);
                $('#table-' + courseid + '-' + examname).bootstrapTable('refresh')
            }
        })
    }
}

function updateTableData(courseid, examname) {
    if (examname == null) {
        let datas = $('#table-' + courseid).bootstrapTable('getData');
        let param = "";
        datas.forEach(function (item) {
            param += item["id"] + "=" + item["email"] + "-" + item["course"] + "&";
        })
        param = param.substring(0, param.length - 1);
        $.post('/course/' + courseid + '/coursemanagementupdatedata', param, function (data) {
            if (!jQuery.isEmptyObject(data)) {
                alert(data);
                $('#table-' + courseid).bootstrapTable('refresh')
            }
        })
    } else {
        let datas = $('#table-' + courseid + '-' + examname).bootstrapTable('getData');
        let param = "";
        datas.forEach(function (item) {
            param += item["id"] + "=" + item["type"] + "-" + item["question"] + "-" + item["answer"] + "&";
        })
        param = param.substring(0, param.length - 1);
        $.post('/course/' + courseid + '/' + examname + '/exammanagementupdatedata', param, function (data) {
            if (!jQuery.isEmptyObject(data)) {
                alert(data);
                $('#table-' + courseid + '-' + examname).bootstrapTable('refresh')
            }
        })
    }
}

function deleteTableData(courseid, examname) {
    if (examname == null) {
        let datas = $('#table-' + courseid).bootstrapTable('getSelections');
        let param = "";
        datas.forEach(function (item) {
            param += item["id"] + "=id&";
        })
        param = param.substring(0, param.length - 1);
        $.post('/course/' + courseid + '/coursemanagementdeletedata', param, function (data) {
            if (!jQuery.isEmptyObject(data)) {
                alert(data);
                $('#table-' + courseid).bootstrapTable('refresh')
            }
        })
    } else {
        let datas = $('#table-' + courseid + '-' + examname).bootstrapTable('getSelections');
        let param = "";
        datas.forEach(function (item) {
            param += item["id"] + "=id&";
        })
        param = param.substring(0, param.length - 1);
        $.post('/course/' + courseid + '/' + examname + '/exammanagementdeletedata', param, function (data) {
            if (!jQuery.isEmptyObject(data)) {
                alert(data);
                $('#table-' + courseid + '-' + examname).bootstrapTable('refresh')
            }
        })
    }
}

