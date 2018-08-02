var router = require('express').Router();
var dbHandler = require('../lib/dbHandler');
var request = require('request');

var config = require('../config/config');
var aotuConfig = config.wx_config.aotu;

router.get('/', function(req, res) {
    // if (req.query.code) {
    //     var url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + aotuConfig.appid + '&secret=' + aotuConfig.secret + '&code=' + req.query.code + '&grant_type=authorization_code';
    //     request.get(url, function (err, httpResponse, body) {
    //         //res.json(body);
    //         if (err) return res.send('error');
    //         var data = JSON.parse(body);
    //         var access_token = data.access_token;
    //         var openid = data.openid;
    //         res.render('index', { title: '' });
    //     });
    // }
    res.render('index', { title: '' });
});

// router.get('/course', function (req, res) {
//     if (!req.session.custom) {
//         res.redirect(`/view/signIn`);

//     }
//     else {
//         let customStatus = parseInt(req.session.custom.status);
//         var dom = ``;
//         if (customStatus) {
//             switch (customStatus) {
//                 case 1:
//                     dom = `<a class="btn" href="/view/coursemenu?chapter=1"><img src="/avatar/Course_2.png" style="height:100%;width:100%" /></a>`
//                     break;
//                 case 2:
//                     dom = `<a class="btn" href="/view/coursemenu?chapter=1"><img src="/avatar/Course_2.png" style="height:100%;width:100%" /></a><img src="/avatar/Course_3.png" style="height:100%;width:100%" />`
//                     break;
//                 case 3:
//                     dom = `<a class="btn" href="/view/coursemenu?chapter=1"><img src="/avatar/Course_2.png" style="height:100%;width:100%" /></a><img src="/avatar/Course_3.png" style="height:100%;width:100%" /><img src="/avatar/Course_4.png" style="height:100%;width:100%" />`
//                     break;
//                 case 4:
//                     dom = `<a class="btn" href="/view/coursemenu?chapter=1"><img src="/avatar/Course_2.png" style="height:100%;width:100%" /></a><img src="/avatar/Course_3.png" style="height:100%;width:100%" /><img src="/avatar/Course_4.png" style="height:100%;width:100%" /><img src="/avatar/Course_5.png" style="height:100%;width:100%" />`
//                     break;
//             }
//         }
//         res.render('course', { title: '', dom: dom });
//     }
// });

// router.get('/coursemenu', function (req, res) {
//     if (!req.session.custom) {
//         res.redirect(`/view/signIn`);

//     }
//     else {
//         let customStatus = parseInt(req.session.custom.status);
//         if (customStatus && customStatus >= 1 && req.query.chapter && req.query.chapter === '1') {
//             res.render('coursemenu', { title: '' });
//         }
//         else if (customStatus && customStatus >= 2 && req.query.chapter && req.query.chapter === '2') {
//             res.render('coursemenu', { title: '' });
//         }
//         else {
//             res.render('index', { title: '' });
//         }
//     }
// });

// router.get('/chapter', function (req, res) {
//     if (!req.session.custom) {
//         res.redirect("/view/signIn");
//     }
//     else {
//         // let chapter = parseInt(req.query.chapter);
//         let customStatus = parseInt(req.session.custom.status);
//         if (req.query.chapter && req.query.chapter === "1" && customStatus && customStatus >= 1) {
//             switch (req.query.page) {
//                 case "1":
//                     var dom = '<img src="/avatar/Class_1.jpg" style="height:100%;width:100%" />'
//                         + '<p style="padding-left: 20px">伴奏</p>'
//                         + '<audio controls="controls" style="width: 100%">伴奏'
//                         + '<source src="/music/1 Hello Electone（伴奏）.mp3" type="audio/mp3" /></audio>'
//                     res.render('chapter', { dom: dom });
//                     break;
//                 case "2":
//                     var dom = '<img src="/avatar/Class_2.png" style="height:100%;width:100%" />'
//                     res.render('chapter', { dom: dom });
//                     break;
//                 case "3":
//                     var dom = '<img src="/avatar/Class_3.png" style="height:100%;width:100%" />'
//                         + '<p style="padding-left: 20px">演奏示范</p>'
//                         + '<audio controls="controls" style="width: 100%">演奏示范'
//                         + '  <source src="/music/3音的行进（演奏示范）.mp3" type="audio/mp3" /></audio>'
//                         + '<p style="padding-left: 20px">伴奏</p>'
//                         + '<audio controls="controls" style="width: 100%">伴奏'
//                         + '<source src="/music/3 音的行进（伴奏）.mp3" type="audio/mp3" /></audio>'
//                     res.render('chapter', { dom: dom });
//                     break;
//                 case "4":
//                     var dom = '<img src="/avatar/Class_4.png" style="height:100%;width:100%" />'
//                         + '<p style="padding-left: 20px">演奏示范</p>'
//                         + '<audio controls="controls" style="width: 100%">演奏示范'
//                         + '  <source src="/music/4.漫步 （演奏示范）.mp3" type="audio/mp3" /></audio>'
//                         + '<p style="padding-left: 20px">伴奏</p>'
//                         + '<audio controls="controls" style="width: 100%">伴奏'
//                         + '<source src="/music/4.漫步 （伴奏）.mp3" type="audio/mp3" /></audio>'
//                     res.render('chapter', { dom: dom });
//                     break;
//                 case "5":
//                     var dom = '<img src="/avatar/Class_5.png" style="height:100%;width:100%" />'
//                         + '<p style="padding-left: 20px">演奏示范</p>'
//                         + '<audio controls="controls" style="width: 100%">演奏示范'
//                         + '  <source src="/music/5 大象散步（演奏示范）.mp3" type="audio/mp3" /></audio>'
//                         + '<p style="padding-left: 20px">伴奏</p>'
//                         + '<audio controls="controls" style="width: 100%">伴奏'
//                         + '<source src="/music/5 大象散步（伴奏）.mp3" type="audio/mp3" /></audio>'
//                     res.render('chapter', { dom: dom });
//                     break;
//                 case "6":
//                     var dom = '<img src="/avatar/Class_6.png" style="height:100%;width:100%" />'
//                         + '<p style="padding-left: 20px">演奏示范</p>'
//                         + '<audio controls="controls" style="width: 100%">演奏示范'
//                         + '  <source src="/music/6 探险（演奏示范）.mp3" type="audio/mp3" /></audio>'
//                         + '<p style="padding-left: 20px">伴奏</p>'
//                         + '<audio controls="controls" style="width: 100%">伴奏'
//                         + '<source src="/music/6 探险（伴奏）.mp3" type="audio/mp3" /></audio>'
//                     res.render('chapter', { dom: dom });
//                     break;
//                 case "7":
//                     var dom = '<img src="/avatar/Class_7.png" style="height:100%;width:100%" />'
//                         + '<p style="padding-left: 20px">演奏示范</p>'
//                         + '<audio controls="controls" style="width: 100%">演奏示范'
//                         + '  <source src="/music/7.欢乐颂  （演奏示范）.mp3" type="audio/mp3" /></audio>'
//                         + '<p style="padding-left: 20px">高声部演奏示范</p>'
//                         + '<audio controls="controls" style="width: 100%">高声部演奏示范'
//                         + '<source src="/music/7 欢乐颂（高声部演奏示范）.mp3" type="audio/mp3" /></audio>'
//                         + '<p style="padding-left: 20px">低声部演奏示范</p>'
//                         + '<audio controls="controls" style="width: 100%">低声部演奏示范'
//                         + '  <source src="/music/7 欢乐颂（ 低声部演奏示范）.mp3" type="audio/mp3" /></audio>'
//                         + '<p style="padding-left: 20px">伴奏</p>'
//                         + '<audio controls="controls" style="width: 100%">伴奏'
//                         + '<source src="/music/7欢乐颂（伴奏）.mp3" type="audio/mp3" /></audio>'
//                     res.render('chapter', { dom: dom });
//                     break;
//                 case "8":
//                     var dom = '<img src="/avatar/Class_8.png" style="height:100%;width:100%" />'
//                         + '<p style="padding-left: 20px">高声部演奏示范</p>'
//                         + '<audio controls="controls" style="width: 100%">高声部演奏示范'
//                         + '  <source src="/music/8 温柔的风（高声部演奏示范）.mp3" type="audio/mp3" /></audio>'
//                         + '<p style="padding-left: 20px">低声部演奏示范</p>'
//                         + '<audio controls="controls" style="width: 100%">低声部演奏示范'
//                         + '<source src="/music/8 温柔的风（低声部演奏示范）.mp3" type="audio/mp3" /></audio>'
//                         + '<p style="padding-left: 20px">伴奏</p>'
//                         + '<audio controls="controls" style="width: 100%">伴奏'
//                         + '<source src="/music/8 温柔的风（伴奏）.mp3" type="audio/mp3" /></audio>'
//                     res.render('chapter', { dom: dom });
//                     break;
//                 case "9":
//                     var dom = '<img src="/avatar/Class_9.png" style="height:100%;width:100%" />'
//                         + '<p style="padding-left: 20px">玛丽的小羊（演奏示范）</p>'
//                         + '<audio controls="controls" style="width: 100%">玛丽的小羊（演奏示范）'
//                         + '  <source src="/music/9 去兜风1-玛丽的小羊（演奏示范）.mp3" type="audio/mp3" /></audio>'
//                         + '<p style="padding-left: 20px">玛丽的小羊（伴奏）</p>'
//                         + '<audio controls="controls" style="width: 100%">玛丽的小羊（伴奏）'
//                         + '<source src="/music/9 去兜风1-玛丽的小羊（伴奏）.mp3" type="audio/mp3" /></audio>'
//                         + '<p style="padding-left: 20px">闪亮的星星（演奏示范）</p>'
//                         + '<audio controls="controls" style="width: 100%">闪亮的星星（演奏示范）'
//                         + '  <source src="/music/9 去兜风2-闪亮的星星（演奏示范）.mp3" type="audio/mp3" /></audio>'
//                         + '<p style="padding-left: 20px">闪亮的星星（伴奏）</p>'
//                         + '<audio controls="controls" style="width: 100%">闪亮的星星（伴奏）'
//                         + '<source src="/music/9 去兜风2-闪亮的星星（伴奏）.mp3" type="audio/mp3" /></audio>'
//                         + '<p style="padding-left: 20px">红鼻子大叔（演奏示范）</p>'
//                         + '<audio controls="controls" style="width: 100%">红鼻子大叔（演奏示范）'
//                         + '  <source src="/music/9 去兜风3-红鼻子大叔（演奏示范）.mp3" type="audio/mp3" /></audio>'
//                         + '<p style="padding-left: 20px">红鼻子大叔（伴奏）</p>'
//                         + '<audio controls="controls" style="width: 100%">红鼻子大叔（伴奏）'
//                         + '<source src="/music/9 去兜风3-红鼻子大叔（伴奏）.mp3" type="audio/mp3" /></audio>'
//                         + '<p style="padding-left: 20px">春天到了（演奏示范）</p>'
//                         + '<audio controls="controls" style="width: 100%">春天到了（演奏示范）'
//                         + '  <source src="/music/9 去兜风4-春天到了（演奏示范）.mp3" type="audio/mp3" /></audio>'
//                         + '<p style="padding-left: 20px">春天到了（伴奏）</p>'
//                         + '<audio controls="controls" style="width: 100%">春天到了（伴奏）'
//                         + '<source src="/music/9 去兜风4-春天到了（伴奏）.mp3" type="audio/mp3" /></audio>'
//                         + '<p style="padding-left: 20px">波力乌丽•嘟嘟（演奏示范）</p>'
//                         + '<audio controls="controls" style="width: 100%">波力乌丽•嘟嘟（演奏示范）'
//                         + '  <source src="/music/9 去兜风5-波力乌丽•嘟嘟（演奏示范）.mp3" type="audio/mp3" /></audio>'
//                         + '<p style="padding-left: 20px">波力乌丽•嘟嘟（伴奏）</p>'
//                         + '<audio controls="controls" style="width: 100%">波力乌丽•嘟嘟（伴奏）'
//                         + '<source src="/music/9 去兜风5-波力乌丽•嘟嘟（伴奏）.mp3" type="audio/mp3" /></audio>'
//                     res.render('chapter', { dom: dom });
//                     break;
//                 case "10":
//                     var dom = '<img src="/avatar/Class_10.png" style="height:100%;width:100%" />'
//                         + '<p style="padding-left: 20px">演奏示范</p>'
//                         + '<audio controls="controls" style="width: 100%">演奏示范'
//                         + '  <source src="/music/10 刺猬体操（演奏示范）.mp3" type="audio/mp3" /></audio>'
//                         + '<p style="padding-left: 20px">伴奏</p>'
//                         + '<audio controls="controls" style="width: 100%">伴奏'
//                         + '<source src="/music/10 刺猬体操（伴奏）.mp3" type="audio/mp3" /></audio>'
//                     res.render('chapter', { dom: dom });
//                     break;
//                 case "11":
//                     var dom = '<img src="/avatar/Class_11.png" style="height:100%;width:100%" />'
//                         + '<p style="padding-left: 20px">高声部演奏示范</p>'
//                         + '<audio controls="controls" style="width: 100%">高声部演奏示范'
//                         + '  <source src="/music/11 蜜蜂进行曲（高声部演奏示范）.mp3" type="audio/mp3" /></audio>'
//                         + '<p style="padding-left: 20px">低声部演奏示范</p>'
//                         + '<audio controls="controls" style="width: 100%">低声部演奏示范'
//                         + '<source src="/music/11 蜜蜂进行曲（低声部演奏示范）.mp3" type="audio/mp3" /></audio>'
//                         + '<p style="padding-left: 20px">伴奏</p>'
//                         + '<audio controls="controls" style="width: 100%">伴奏'
//                         + '<source src="/music/11 蜜蜂进行曲（伴奏）.mp3" type="audio/mp3" /></audio>'
//                     res.render('chapter', { dom: dom });
//                     break;
//                 case "12":
//                     var dom = '<img src="/avatar/Class_12.png" style="height:100%;width:100%" />'
//                         + '<p style="padding-left: 20px">演奏示范</p>'
//                         + '<audio controls="controls" style="width: 100%">演奏示范'
//                         + '  <source src="/music/12 公主圆舞曲（演奏示范）.mp3" type="audio/mp3" /></audio>'
//                         + '<p style="padding-left: 20px">伴奏</p>'
//                         + '<audio controls="controls" style="width: 100%">伴奏'
//                         + '<source src="/music/12 公主圆舞曲（伴奏）.mp3" type="audio/mp3" /></audio>'
//                     res.render('chapter', { dom: dom });
//                     break;
//                 case "13":
//                     var dom = '<img src="/avatar/Class_13.png" style="height:100%;width:100%" />'
//                         + '<p style="padding-left: 20px">演奏示范</p>'
//                         + '<audio controls="controls" style="width: 100%">演奏示范'
//                         + '  <source src="/music/13 大家一起来恰恰恰（演奏示范）.mp3" type="audio/mp3" /></audio>'
//                         + '<p style="padding-left: 20px">伴奏</p>'
//                         + '<audio controls="controls" style="width: 100%">伴奏'
//                         + '<source src="/music/13 大家一起来恰恰恰（伴奏）.mp3" type="audio/mp3" /></audio>'
//                     res.render('chapter', { dom: dom });
//                     break;
//                 case "14":
//                     var dom = '<img src="/avatar/Class_14.png" style="height:100%;width:100%" />'
//                         + '<p style="padding-left: 20px">演奏示范</p>'
//                         + '<audio controls="controls" style="width: 100%">演奏示范'
//                         + '  <source src="/music/14 勇敢的王子和温柔的公主（演奏示范）.mp3" type="audio/mp3" /></audio>'
//                         + '<p style="padding-left: 20px">伴奏</p>'
//                         + '<audio controls="controls" style="width: 100%">伴奏'
//                         + '<source src="/music/14 勇敢的王子和温柔的公主（伴奏）.mp3" type="audio/mp3" /></audio>'
//                     res.render('chapter', { dom: dom });
//                     break;
//                 case "15":
//                     var dom = '<img src="/avatar/Class_15.png" style="height:100%;width:100%" />'
//                         + '<p style="padding-left: 20px">演奏示范</p>'
//                         + '<audio controls="controls" style="width: 100%">演奏示范'
//                         + '  <source src="/music/15 伦敦桥（演奏示范）.mp3" type="audio/mp3" /></audio>'
//                         + '<p style="padding-left: 20px">伴奏</p>'
//                         + '<audio controls="controls" style="width: 100%">伴奏'
//                         + '<source src="/music/15 伦敦桥（伴奏）.mp3" type="audio/mp3" /></audio>'
//                     res.render('chapter', { dom: dom });
//                     break;
//                 case "16":
//                     // var dom = '<img src="/avatar/Class_1.png" style="height:100%;width:100%" /><img src="/avatar/Class_1_1.png" style="height:100%;width:100%" />'
//                     // res.render('chapter', { dom: dom });
//                     break;

//             }
//         }
//         // else{

//         // }
//     }
// });


// router.route('/signIn').get((req, res) => {
//     res.render('signin', { route: 'view', chapter: req.query.chapter });
// }).post((req, res) => {
//     if (req.body.phoneNumber && req.body.password) {
//         dbHandler.checkUserExists(req, res, true)
//     }
//     else {
//         res.send({ status: 'failed' })
//     }
//     // dbHandler.findAllQuestion(req, res);
// })
module.exports = router;