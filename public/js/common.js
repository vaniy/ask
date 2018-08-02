//刷新右侧主体调用方法
function freshHtml(url, data) {
    var url = '/admin/'+url;
    $('.main-content').html('');
    $.ajax({
        type: 'get',
        url: url,
        data:data,
        dataType: 'html',
        success: function (res) {
            $('.main-content').html(res);
        }
    });
}
function freshHtml2(url, data) {
    var url = '/admin/'+url;
    $('.main-content').html('');
    $.ajax({
        type: 'get',
        url: url,
        data:data,
        dataType: 'html',
        success: function (res) {
            $('.main-content').html(res);
        }
    });
}

//分页调用方法
function _freshTable(obj) {
    var page = $(obj).attr('data-page'),
    url = $('#fresh_path').val(),
        data = {
            'page' : page
        };
    freshHtml(url, data);
}

//ajax提交form表单
function ajaxSubmitForm(formEle, successCallback, errorCallback) {
    if (successCallback == undefined) {
        successCallback = function(result) {
            showMsg(result);
        }
    }
    if (errorCallback == undefined) {
        errorCallback = function(result) {
            showMsg(result);
        }
    }
    var options = {
        forceSync: true,
        dataType : 'json',
        success  : successCallback,
        error    : errorCallback
    };
    formEle.ajaxSubmit(options);
}

//弹框提示框-待完善
function showMsg(text, time) {
    alert(text);
}

//登出
function logOut() {
    var url = '/admin/index.php?c=user&a=loginout';
    $.ajax({
        type: 'get',
        url: url,
        dataType: 'json',
        success: function (res) {
            if (res.code == 100) {
                location.href=res.data;
            } else {
                alert(res.data);
            }
        }
    });
}

function getDate() {
    if($("#reservation").length>0){
        $('#reservation').daterangepicker({
            timePicker: false,
            timePickerIncrement: 30,
            format: 'YYYY/MM/DD'
        }, function(start, end, label) {
            var stime = start.format('MM/DD/YYYY');
            var etime = end.format('MM/DD/YYYY');
            $("#startdate").val(stime);
            $("#enddate").val(etime);
        });
    }
}

