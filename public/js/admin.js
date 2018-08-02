/**
 * Created by chenkuanxin on 2017/10/29.
 */

//删除管理员
function delAdminUser(id) {
    if (confirm('确认要删除管理员吗？')) {
        $.ajax({
            type: 'get',
            url: 'index.php?c=user&a=index&do=deluser',
            data: {'uid':id},
            dataType: 'json',
            success: function (res) {
                if (res.code == 100) {
                    freshHtml('index.php?c=user&a=index&do=index');
                } else {
                    alert(res.msg);
                }
            }
        });
    }
}

//刷新管理员列表
function freshAdminTable() {
    freshHtml('index.php?c=user&a=index&do=index');
}

//显示添加管理员
function addUser(id) {
    freshHtml('index.php?c=user&a=index&do=adduser', {id:id});
}




//添加管理员
function saveAdmin() {
    var url = 'index.php?c=user&a=index&do=doadduser';
    var formdata = $("#admin_add_form").serialize();
    var username = $("#username").val();
    var role_id = $("#role_id").val();
    var password = $("#password").val();
    var again_pass = $("#again_pass").val();
    var uid = $("#uid").val();
    if(username == ''){
        $("#username").attr({placeholder: "名字不能为空"}).focus().val("");
        return false;
    }
    if(password == ''){
        $("#password").attr({placeholder: "密码不能为空"}).focus().val("");
        return false;
    }
    if(again_pass == ''){
        $("#again_pass").attr({placeholder: "确认密码不能为空"}).focus().val("");
        return false;
    }
    if(password != again_pass){
        $("#password").attr({placeholder: "两次密码不一致"}).focus().val("");
        $("#again_pass").attr({placeholder: ""}).focus().val("");
        return false;
    }
    $.ajax({
        type: 'get',
        url: url,
        data:formdata,
        dataType: 'json',
        success: function (res) {
            if (res.code == 100) {
                freshHtml('index.php?c=user&a=index&do=index');
            } else {
                alert(res.msg);
            }
        }
    });
}
