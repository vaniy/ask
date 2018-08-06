function buildManagementView() {
    return `
    <div class="sidebar-nav">
    <div class='leftNavigation'>
        <button class='left btn user'>用户管理</button>
        <button class='left btn order'>订单管理</button>
        <button class='left btn money'>提现管理</button>
    </div>
</div>
<div class="main_container">
    <div class="user_main main" style="display:none">
        <p>用户管理</p>
        <div class="user_container"></div>
    </div>
    <div class="order_main main" style="display:none">
        <p>订单管理</p>
        <div class="order_container"></div>
    </div>
    <div class="money_main main" style="display:none">
        <p>提现管理</p>
        <div class="money_container"></div>
        <!--</form>-->
    </div>
</div>`
}

function buildAllWithDrawView(data) {
    var trs = '';
    if (data && data.length > 0) {
        data.map((child, index) => {
            trs += `
            <tr>
                <td>${child.withDrawId}</td>
                <td>${child.name}</td>
                <td>${child.card}</td>
                <td>${child.bank}</td>
                <td>${child.price}</td>
                <td>${child.time}</td>
                <td><select class="orderId_${child.withDrawId}" data-target="status"><option value="1">进行中</option><option value="2">已成功</option></select><script>$('.orderId_${child.withDrawId}')[0].selectedIndex = ${child.status - 1}</script></td>
                <td>
                    <a href="#" class="fa fa-edit " onclick="updateWidthDraw('${child.withDrawId}')">提交修改</a>
                </td>
            </tr>`
        })
    }
    var html = `<div class="box-header with-border">
    <h3 class="box-title">提现列表</h3>
</div>
<div class="box-body">
    <div class="box-body no-padding">
        <div class="table-responsive mailbox-messages"><table class="table table-bordered table-hover">
                <thead>
                <tr>
                    <th style="width: 100px;">ID</th>
                    <th class="col-md-1">用户名:</th>
                    <th class="col-md-1">银行卡:</th>
                    <th class="col-md-1">开户银行:</th>
                    <th class="col-md-3">提现金额:</th>
                    <th class="col-md-1">申请时间:</th>
                    <th class="col-md-1">状态:</th>
                </tr>
                ${trs}
                </thead>
                <tbody>                                   
                </tbody>
            </table>
            <!-- /.table -->
        </div>

</div>`
    return html;
}

function buildAllUserView(data, benfits) {
    var trs = '';
    if (data && data.length > 0) {
        data.map((child, index) => {
            var myAllBenfits = 0;
            if (benfits && benfits.length > 0) {
                benfits.map((cld, idx) => {
                    if (cld.person === child.openId) {
                        myAllBenfits += cld.benfits
                    }
                })
            }
            let value = [];
            if (child.progress && child.progress.length > 0) {
                child.progress.forEach((child) => {
                    if (child.value == 1) {
                        value.push('已读')
                    }
                    else if (child.value == 2) {
                        value.push('补读')
                    }
                    else {
                        value.push('未读')
                    }
                })
            }
            else {
                for (let j = 0; j <= 14; j++) {
                    value.push('未读')
                }
            }
            trs += `
            <tr  style="
            display: flex;
        ">
                <td>${index + 1}</td>
                <td>${child.name || ''}</td>
                <td><img src="${child.avator || '/images/nick.png'}" width="100px" height="100px"></td>
                <td>${child.phone || ''}</td>
                <td>${child.email || ''}</td>
                <td>${child.team || ''}</td>
                <td>${value[0]}</td>
                <td>${value[1]}</td>
                <td>${value[2]}</td>
                <td>${value[3]}</td>
                <td>${value[4]}</td>
                <td>${value[5]}</td>
                <td>${value[6]}</td>
                <td>${value[7]}</td>
                <td>${value[8]}</td>
                <td>${value[9]}</td>
                <td>${value[10]}</td>
                <td>${value[11]}</td>
                <td>${value[12]}</td>
                <td>${value[13]}</td>
                <td>${value[14]}</td>
                <td>${child.createTime}</td>
            </tr>`;
        })
    }
    var html = `<div class="box-header with-border">
    <h3 class="box-title">会员列表</h3>
</div>
<div class="box-tools">
        <div class="input-group input-group-sm" style="width: 400px; float: left; margin-bottom: 10px; ">
            <div class="search_value " attr_id="0">
                <input type="text" id="email" value="" class="form-control pull-right" style="font-size:14px;height:30px;" placeholder="添加邮箱">
            </div>
            <div class="input-group-btn">
                <input type="hidden" id="parentid" value="">
                <button type="button" class="btn btn-info btn-fla add" onclick="add()"><i class="fa fa-add"></i>add</button>
            </div>
            
        </div>
    </div>
<div class="box-body">
    <div class="box-body no-padding">
        <div class="table-responsive mailbox-messages"><table class="table table-bordered table-hover">
                <thead>
                <tr style="
                display: flex;
            ">
                    <th style="width: 100px;">ID</th>
                    <th class="col-md-1">用户名:</th>
                    <th class="col-md-1">头像:</th>
                    <th class="col-md-1">手机号:</th>
                    <th class="col-md-1">邮箱:</th>
                    <th class="col-md-1">团队:</th>
                    <th class="col-md-1">阅读情况第1天:</th>
                    <th class="col-md-1">阅读情况第2天:</th>
                    <th class="col-md-1">阅读情况第3天:</th>
                    <th class="col-md-1">阅读情况第4天:</th>
                    <th class="col-md-1">阅读情况第5天:</th>
                    <th class="col-md-1">阅读情况第6天:</th>
                    <th class="col-md-1">阅读情况第7天:</th>
                    <th class="col-md-1">阅读情况第8天:</th>
                    <th class="col-md-1">阅读情况第9天:</th>
                    <th class="col-md-1">阅读情况第10天:</th>
                    <th class="col-md-1">阅读情况第11天:</th>
                    <th class="col-md-1">阅读情况第12天:</th>
                    <th class="col-md-1">阅读情况第13天:</th>
                    <th class="col-md-1">阅读情况第14天:</th>
                    <th class="col-md-1">阅读情况第15天:</th>
                    <th class="col-md-3">注册时间:</th>
                </tr>
                ${trs}
                </thead>
                <tbody>                                   
                </tbody>
            </table>
            <!-- /.table -->
        </div>

</div>`
    return html;
}
// logistics
function buildAllOrderView(data) {
    var trs = '';
    if (data && data.length > 0) {
        data.map((child, index) => {
            trs += `
            <tr>
                <td>${child.orderId}</td>
                <td>${child.name}</td>
                <td>${child.address}</td>
                <td>${child.phone}</td>
                <td>${child.createTime}</td>
                <td>${child.cost}</td>
                <td><input id="orderId_${child.orderId}" type='text' placeholder='请输入物流订单号' value='${child.logisticsId || ""}'/></td>
                <td><select class="orderId_${child.orderId}" data-target="status"><option value="1">已付款</option><option value="2">已发货</option></select><script>$('.orderId_${child.orderId}')[0].selectedIndex = ${child.status - 1}</script></td>
                <td>
                    <a href="#" class="fa fa-edit " onclick="updateOrder('${child.orderId}')">提交修改</a>
                </td>
            </tr>`
        })
    }
    var html = `<div class="box-header with-border">
    <h3 class="box-title">订单列表</h3>
</div>

<div class="box-body">
    <div class="box-body no-padding">
        <div class="table-responsive mailbox-messages"><table class="table table-bordered table-hover">
                <thead>
                <tr>
                    <th style="width: 100px;">ID</th>
                    <th class="col-md-1">用户名:</th>
                    <th class="col-md-1">地址:</th>
                    <th class="col-md-1">手机号:</th>
                    <th class="col-md-3">下单时间:</th>
                    <th class="col-md-1">金额:</th>
                    <th class="col-md-1">物流订单号:</th>
                    <th class="col-md-1">状态:</th>
                </tr>
                ${trs}
                </thead>
                <tbody>                                   
                </tbody>
            </table>
            <!-- /.table -->
        </div>

</div>`
    return html;
}


function buildAllUserBenfitsView(data) {
    var trs = '';
    if (data && data.length > 0) {
        data.map((child, index) => {
            trs += `
            <tr>
                <td>${index + 1}</td>
                <td>${child.peronName || ''}</td>
                <td>${child.benfits || 0}</td>
                <td>${child.customerName || ''}</td>
                <td>${child.customerLevel || ''}</td>
                <td>${child.time || ''}</td>
            </tr>`;
        })
    }
    var html = `<div class="box-header with-border">
    <h3 class="box-title">会员列表</h3>
</div>

<div class="box-tools">
        <div class="input-group input-group-sm" style="width: 400px; float: left; margin-bottom: 10px; ">
            <div class="search_value " attr_id="0">
                <input type="text" id="search_value" value="" class="form-control pull-right" style="font-size:14px;height:30px;" placeholder="搜索会员名称">
            </div>
            <div class="input-group-btn">
                <input type="hidden" id="parentid" value="">
                <button type="button" class="btn btn-info btn-fla search" onclick="search()"><i class="fa fa-search"></i></button>
            </div>
            
        </div>
    </div>
<div class="box-body">
    <div class="box-body no-padding">
    <div class="mailbox-controls" style="clear:both;">

                
                
            </div>
        <div class="table-responsive mailbox-messages"><table class="table table-bordered table-hover">
                <thead>
                <tr>
                    <th class="col-md-1">ID</th>
                    <th class="col-md-1">用户名:</th>
                    <th class="col-md-1">收益:</th>
                    <th class="col-md-1">分销商:</th>
                    <th class="col-md-1">级别:</th>
                    <th class="col-md-3">时间:</th>
                </tr>
                ${trs}
                </thead>
                <tbody>                                   
                </tbody>
            </table>
            <!-- /.table -->
        </div>

</div>`
    return html;
}

module.exports.buildAllOrderView = buildAllOrderView;
module.exports.buildAllUserView = buildAllUserView;
module.exports.buildAllWithDrawView = buildAllWithDrawView;
module.exports.buildManagementView = buildManagementView;
module.exports.buildAllUserBenfitsView = buildAllUserBenfitsView;
{ /* <input class='searchInput' type="text" placeholder="请输入要查询的订单号"><button class='searchOrder'>确认</button> */ }

// <div class="text-right we7-margin-top">
// <div><ul class="pagination pagination-centered"><li class="active"><a href="javascript:;">1</a></li><li><a href="javascript:;" page="2" onclick="ajaxfreshHtml(&#39;/admin/index.php?c=home&amp;a=member&amp;do=index&#39;, &#39;2&#39;, this);return false;">2</a></li><li><a href="javascript:;" page="3" onclick="ajaxfreshHtml(&#39;/admin/index.php?c=home&amp;a=member&amp;do=index&#39;, &#39;3&#39;, this);return false;">3</a></li><li><a href="javascript:;" page="4" onclick="ajaxfreshHtml(&#39;/admin/index.php?c=home&amp;a=member&amp;do=index&#39;, &#39;4&#39;, this);return false;">4</a></li><li><a href="javascript:;" page="5" onclick="ajaxfreshHtml(&#39;/admin/index.php?c=home&amp;a=member&amp;do=index&#39;, &#39;5&#39;, this);return false;">5</a></li><li><a href="javascript:;" page="6" onclick="ajaxfreshHtml(&#39;/admin/index.php?c=home&amp;a=member&amp;do=index&#39;, &#39;6&#39;, this);return false;">6</a></li><li><a href="javascript:;" page="2" onclick="ajaxfreshHtml(&#39;/admin/index.php?c=home&amp;a=member&amp;do=index&#39;, &#39;2&#39;, this);return false;" class="pager-nav">下一页»</a></li><li><a href="javascript:;" page="10" onclick="ajaxfreshHtml(&#39;/admin/index.php?c=home&amp;a=member&amp;do=index&#39;, &#39;10&#39;, this);return false;" class="pager-nav">尾页</a></li></ul></div>            </div>
// </div>

