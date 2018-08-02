var express = require('express');
var fetch = require('node-fetch')
var router = express.Router();
var dbHandler = require('../lib/dbHandler');
var viewHandler = require('../lib/viewHandler');
var manageHandler = require('../lib/manageHandler');
var formidable = require('formidable'),
    // var multiparty = require('multiparty');
    fs = require('fs'),
    TITLE = 'formidable',
    AVATAR_UPLOAD_FOLDER = '/tenzhong/';

router.get('/', (req, res) => {
    if (!req.session.admin) {
        res.redirect("/management/signIn");
    } else {
        var dom = viewHandler.buildManagementView();
        res.render('manage', { title: TITLE, user: {}, type: "1", dom: dom });
    }
})

router.route('/signIn').get((req, res) => {
    res.render('signin', { route: 'manage', chapter: '' });
}).post((req, res) => {
    if (req.body.phoneNumber && req.body.password) {
        dbHandler.checkAdmin(req, res)
    } else {
        res.send({ status: 'failed' })
    }
    // dbHandler.findAllQuestion(req, res);
})

router.get('/api/addUser', (req, res) => {
    if(req.query.email){
        dbHandler.addUser(req, res)
    }
    else{
        res.send({ status: 'failed' })
    }
})


router.get('/api/getAllOrder', (req, res) => {
    dbHandler.getOrder(req, res, true);
})

router.get('/api/getAllUser', (req, res) => {
    dbHandler.getUserInfo(req, res, true);
})

router.get('/api/getAllWithDraw', (req, res) => {
    dbHandler.getWithDraw(req, res, true);
})

router.get('/api/updateWithDraw', (req, res) => {
    if (req.query.status && req.query.withDrawId) {
        dbHandler.updateWithDraw(req, res)
    }
    else{
        res.send({ status: 'failed' })
    }
})


router.get('/api/updateOrder', (req, res) => {
    if (req.query.status && req.query.orderId) {
        dbHandler.updateOrder(req, res)
    }
    else{
        res.send({ status: 'failed' })
    }
})


router.get('/api/getUserCount', (req, res) => {
        dbHandler.getUserCount(req, res)
})

router.get('/api/getUserBenfits', (req, res) => {
    if(req.query.peronName){
        dbHandler.getBenfits(req, res, req.query.peronName)
    }
    else{
        res.send({ status: 'failed' })
    }
})



// router.get('/questions', (req, res) => {
//     dbHandler.findAllQuestion(req, res);
// })

// router.get('/create', (req, res) => {
//     if (!req.session.user) {
//         res.redirect("/management/signIn");
//     }

//     if (req.query.phoneNumber) {
//         dbHandler.createUser(req, res)
//     } else {
//         res.send({ status: 'failed' })
//     }
// })



// router.post('/create', function(req, res) {
//     var email = "";
//     // if (!req.session.user) {
//     //     res.redirect("/sign_in");
//     // } else {
//     // email = req.session.user[0].email;
//     var form = new formidable.IncomingForm(); //创建上传表单
//     form.encoding = 'utf-8'; //设置编辑
//     form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER; //设置上传目录
//     form.keepExtensions = true; //保留后缀
//     form.maxFieldsSize = 2 * 1024 * 1024; //文件大小

//     form.parse(req, function(err, fields, files) {
//         if (err) {
//             res.send({ status: 'failed' });
//             return;
//         }
//         var tempstamp = new Date().getTime();
//         var productId = `pid_${tempstamp}`;
//         var en = {};
//         var zh = {};
//         for (var obj in fields) {
//             if (obj.indexOf('_') !== -1) {
//                 let tmpIn = obj.substring(obj.indexOf('_') + 1, obj.length);
//                 let tempNum = parseInt(tmpIn);
//                 let objName = obj.substring(0, obj.indexOf('_'))
//                 if (tempNum && tempNum > 0) {
//                     if (tempNum % 2 === 0) {
//                         if (objName === 'productCharacter') {
//                             if (en.productCharacter) {
//                                 en.productCharacter.push(fields[obj])
//                             } else {
//                                 en.productCharacter = [];
//                                 en.productCharacter.push(fields[obj])
//                             }
//                         } else {
//                             en[objName] = fields[obj];
//                         }
//                     } else {
//                         if (objName === 'productCharacter') {
//                             if (zh.productCharacter) {
//                                 zh.productCharacter.push(fields[obj])
//                             } else {
//                                 zh.productCharacter = [];
//                                 zh.productCharacter.push(fields[obj])
//                             }
//                         } else {
//                             zh[objName] = fields[obj];
//                         }
//                     }
//                 }
//             } else {
//                 en[obj] = fields[obj];
//                 zh[obj] = fields[obj];
//             }
//         }
//         // var jobTabs = fields.jobTabs ? fields.jobTabs.split(',') : [];
//         // var jobTabsCHN = fields.jobTabs ? fields.jobTabs.split('，') : [];
//         // var userTab = fields.userTab ? fields.userTab.split(',') : [];
//         // var userTabCHN = fields.userTab ? fields.userTab.split('，') : [];
//         var productInfoCN = {
//             "productId": productId,
//             "productNumber": zh.productNumber,
//             "tab": {
//                 "tabId": `tid_${tempstamp}`,
//                 "tabName": zh.tabName
//             },
//             "category": {
//                 "categoryId": `cid_${tempstamp}`,
//                 "categoryName": zh.categoryName
//             },
//             "subcategory": {
//                 "subcategoryId": zh.subcategoryId,
//                 "subcategoryName": zh.subcategoryName
//             },
//             "productTitle": zh.productTitle,
//             "productShortDescription": zh.productShortDescription,
//             "productDescription": zh.productDescription,
//             "productLongDescriptionTop": zh.productLongDescriptionTop,
//             "productLongDescriptionBottom": zh.productLongDescriptionBottom,
//             "productCharacter": zh.productCharacter,
//             "productOverView": zh.productOverView,
//             "productOverTitle": zh.productOverTitle,
//             // "productImages": zh.productImages,
//             // "productOverViewImages":zh.productOverViewImages,
//             "priority": zh.priority,
//             "languageCode": "CHN"
//         }
//         var productInfoUS = {
//             "productId": productId,
//             "productNumber": en.productNumber,
//             "tab": {
//                 "tabId": `tid_${tempstamp}`,
//                 "tabName": en.tabName
//             },
//             "category": {
//                 "categoryId": `cid_${tempstamp}`,
//                 "categoryName": en.categoryName
//             },
//             "subcategory": {
//                 "subcategoryId": en.subcategoryId,
//                 "subcategoryName": en.subcategoryName
//             },
//             "productTitle": en.productTitle,
//             "productShortDescription": en.productShortDescription,
//             "productDescription": en.productDescription,
//             "productLongDescriptionTop": en.productLongDescriptionTop,
//             "productLongDescriptionBottom": en.productLongDescriptionBottom,
//             "productCharacter": en.productCharacter,
//             "productOverView": en.productOverView,
//             "productOverTitle": en.productOverTitle,
//             // "productImages": en.productImages,
//             // "productOverViewImages":en.productOverViewImages,
//             "priority": en.priority,
//             "languageCode": "USA"
//         }
//         var needChange = true;
//         for (var key in files) {
//             var extName = ''; //后缀名
//             switch (files[key].type) {
//                 case 'image/pjpeg':
//                     extName = 'jpg';
//                     break;
//                 case 'image/jpeg':
//                     extName = 'jpg';
//                     break;
//                 case 'image/png':
//                     extName = 'png';
//                     break;
//                 case 'image/x-png':
//                     extName = 'png';
//                     break;
//             }
//             if (files[key].size == 0) {
//                 fs.unlinkSync(files[key].path);
//             } else {
//                 needChange = true;
//                 if (key === 'productImages') {
//                     var avatarName = 'product_l_' + productId + '.' + extName;
//                     productInfoUS.productImages = `/tenzhong/${avatarName}`;
//                     productInfoCN.productImages = `/tenzhong/${avatarName}`;
//                     var newPath = form.uploadDir + avatarName;
//                 } else {
//                     var avatarName = 'product_m_' + productId + '.' + extName;
//                     productInfoUS.productOverViewImages = `/tenzhong/${avatarName}`;
//                     productInfoCN.productOverViewImages = `/tenzhong/${avatarName}`;
//                     var newPath = form.uploadDir + avatarName;
//                 }

//                 console.log(newPath);
//                 fs.renameSync(files[key].path, newPath); //重命名

//             }
//         }

//         if (needChange) {
//             dbHandler.createItem(req, res, { en: productInfoUS, zh: productInfoCN })
//             res.send({ status: 'succeed' });
//         } else {
//             res.send({ status: 'failed' });
//         }
//     });

//     // res.locals.success = '上传成功';
//     // res.render('perInformation', { title: TITLE, user: req.session.user[0] });
//     // }

// });

// router.post('/createNews', function(req, res) {
//     var email = "";
//     // if (!req.session.user) {
//     //     res.redirect("/sign_in");
//     // } else {
//     // email = req.session.user[0].email;
//     var form = new formidable.IncomingForm(); //创建上传表单
//     form.encoding = 'utf-8'; //设置编辑
//     form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER; //设置上传目录
//     form.keepExtensions = true; //保留后缀
//     form.maxFieldsSize = 2 * 1024 * 1024; //文件大小

//     form.parse(req, function(err, fields, files) {
//         if (err) {
//             res.send({ status: 'failed' });
//             return;
//         }
//         var tempstamp = new Date().getTime();
//         var newsId = `nid_${tempstamp}`;
//         var en = {};
//         var zh = {};
//         for (var obj in fields) {
//             if (obj.indexOf('_') !== -1) {
//                 let tmpIn = obj.substring(obj.indexOf('_') + 1, obj.length);
//                 let tempNum = parseInt(tmpIn);
//                 let objName = obj.substring(0, obj.indexOf('_'))
//                 if (tempNum && tempNum > 0) {
//                     if (tempNum % 2 === 0) {
//                         en[objName] = fields[obj];
//                     } else {
//                         zh[objName] = fields[obj];
//                     }
//                 }
//             } else {
//                 en[obj] = fields[obj];
//                 zh[obj] = fields[obj];
//             }
//         }

//         var productInfoCN = {
//             "newsNumber": zh.newsNumber,
//             "newsId": newsId,
//             "newsTitle": zh.newsTitle,
//             "newsShortDescription": zh.newsShortDescription,
//             "newsLongDescriptionTop": zh.newsLongDescriptionTop,
//             "newsLongDescriptionBottom": zh.newsLongDescriptionBottom,
//             "newsDescription": zh.newsDescription,
//             "newsContent": zh.newsContent,
//             // "newsImages": "/img/FastMig-X-Intelligent_w.png",
//             "type": zh.type,
//             "priority": zh.priority,
//             "languageCode": "CHN"
//         }
//         var productInfoUS = {
//             "newsNumber": en.newsNumber,
//             "newsId": newsId,
//             "newsTitle": en.newsTitle,
//             "newsShortDescription": en.newsShortDescription,
//             "newsLongDescriptionTop": en.newsLongDescriptionTop,
//             "newsLongDescriptionBottom": en.newsLongDescriptionBottom,
//             "newsDescription": en.newsDescription,
//             "newsContent": en.newsContent,
//             // "newsImages": "/img/FastMig-X-Intelligent_w.png",
//             "type": en.type,
//             "priority": en.priority,
//             "languageCode": "USA"
//         }
//         var needChange = true;
//         for (var key in files) {
//             var extName = ''; //后缀名
//             switch (files[key].type) {
//                 case 'image/pjpeg':
//                     extName = 'jpg';
//                     break;
//                 case 'image/jpeg':
//                     extName = 'jpg';
//                     break;
//                 case 'image/png':
//                     extName = 'png';
//                     break;
//                 case 'image/x-png':
//                     extName = 'png';
//                     break;
//             }
//             if (files[key].size == 0) {
//                 fs.unlinkSync(files[key].path);
//             } else {
//                 needChange = true;
//                 if (key === 'newsImages') {
//                     var avatarName = 'news_l_' + newsId + '.' + extName;
//                     productInfoUS.newsImages = `/tenzhong/${avatarName}`;
//                     productInfoCN.newsImages = `/tenzhong/${avatarName}`;
//                     var newPath = form.uploadDir + avatarName;
//                 }

//                 console.log(newPath);
//                 fs.renameSync(files[key].path, newPath); //重命名

//             }
//         }

//         if (needChange) {
//             dbHandler.createNews(req, res, { en: productInfoUS, zh: productInfoCN })
//             res.send({ status: 'succeed' });
//         } else {
//             res.send({ status: 'failed' });
//         }
//     });

//     // res.locals.success = '上传成功';
//     // res.render('perInformation', { title: TITLE, user: req.session.user[0] });
//     // }

// });

// router.post('/update', function(req, res) {
//     var email = "";
//     // if (!req.session.user) {
//     //     res.redirect("/sign_in");
//     // } else {
//     // email = req.session.user[0].email;
//     var form = new formidable.IncomingForm(); //创建上传表单
//     form.encoding = 'utf-8'; //设置编辑
//     form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER; //设置上传目录
//     form.keepExtensions = true; //保留后缀
//     form.maxFieldsSize = 2 * 1024 * 1024; //文件大小

//     form.parse(req, function(err, fields, files) {
//         if (err) {
//             res.send({ status: 'failed' });
//             return;
//         }
//         var en = {};
//         var zh = {};
//         for (var obj in fields) {
//             if (obj.indexOf('_') !== -1) {
//                 let tmpIn = obj.substring(obj.indexOf('_') + 1, obj.length);
//                 let tempNum = parseInt(tmpIn);
//                 let objName = obj.substring(0, obj.indexOf('_'))
//                 if (tempNum && tempNum > 0) {
//                     if (tempNum % 2 === 0) {
//                         if (objName === 'productCharacter') {
//                             if (en.productCharacter) {
//                                 en.productCharacter.push(fields[obj])
//                             } else {
//                                 en.productCharacter = [];
//                                 en.productCharacter.push(fields[obj])
//                             }
//                         } else {
//                             en[objName] = fields[obj];
//                         }
//                     } else {
//                         if (objName === 'productCharacter') {
//                             if (zh.productCharacter) {
//                                 zh.productCharacter.push(fields[obj])
//                             } else {
//                                 zh.productCharacter = [];
//                                 zh.productCharacter.push(fields[obj])
//                             }
//                         } else {
//                             zh[objName] = fields[obj];
//                         }
//                     }
//                 }
//             } else {
//                 en[obj] = fields[obj];
//                 zh[obj] = fields[obj];
//             }
//         }
//         // var jobTabs = fields.jobTabs ? fields.jobTabs.split(',') : [];
//         // var jobTabsCHN = fields.jobTabs ? fields.jobTabs.split('，') : [];
//         // var userTab = fields.userTab ? fields.userTab.split(',') : [];
//         // var userTabCHN = fields.userTab ? fields.userTab.split('，') : [];
//         var productInfoCN = {
//             // "productId": zh.productId,
//             "productNumber": zh.productNumber,
//             "tab": {
//                 "tabId": zh.tabId,
//                 "tabName": zh.tabName
//             },
//             "category": {
//                 "categoryId": zh.categoryId,
//                 "categoryName": zh.categoryName
//             },
//             "subcategory": {
//                 "subcategoryId": zh.subcategoryId,
//                 "subcategoryName": zh.subcategoryName
//             },
//             "productTitle": zh.productTitle,
//             "productShortDescription": zh.productShortDescription,
//             "productDescription": zh.productDescription,
//             "productLongDescriptionTop": zh.productLongDescriptionTop,
//             "productLongDescriptionBottom": zh.productLongDescriptionBottom,
//             "productCharacter": zh.productCharacter,
//             "productOverView": zh.productOverView,
//             "productOverTitle": zh.productOverTitle,
//             // "productImages": zh.productImages,
//             // "productOverViewImages":zh.productOverViewImages,
//             "priority": zh.priority,
//             "languageCode": "CHN"
//         }
//         var productInfoUS = {
//             // "productId": en.productId,
//             "productNumber": en.productNumber,
//             "tab": {
//                 "tabId": en.tabId,
//                 "tabName": en.tabName
//             },
//             "category": {
//                 "categoryId": en.categoryId,
//                 "categoryName": en.categoryName
//             },
//             "subcategory": {
//                 "subcategoryId": en.subcategoryId,
//                 "subcategoryName": en.subcategoryName
//             },
//             "productTitle": en.productTitle,
//             "productShortDescription": en.productShortDescription,
//             "productDescription": en.productDescription,
//             "productLongDescriptionTop": en.productLongDescriptionTop,
//             "productLongDescriptionBottom": en.productLongDescriptionBottom,
//             "productCharacter": en.productCharacter,
//             "productOverView": en.productOverView,
//             "productOverTitle": en.productOverTitle,
//             // "productImages": en.productImages,
//             // "productOverViewImages":en.productOverViewImages,
//             "priority": en.priority,
//             "languageCode": "USA"
//         }
//         var needChange = true;
//         for (var key in files) {
//             var extName = ''; //后缀名
//             switch (files[key].type) {
//                 case 'image/pjpeg':
//                     extName = 'jpg';
//                     break;
//                 case 'image/jpeg':
//                     extName = 'jpg';
//                     break;
//                 case 'image/png':
//                     extName = 'png';
//                     break;
//                 case 'image/x-png':
//                     extName = 'png';
//                     break;
//             }
//             if (files[key].size == 0) {
//                 fs.unlinkSync(files[key].path);
//             } else {
//                 needChange = true;
//                 if (key === 'productImages') {
//                     var avatarName = 'product_l_' + en.productId + '.' + extName;
//                     productInfoUS.productImages = `/tenzhong/${avatarName}`;
//                     productInfoCN.productImages = `/tenzhong/${avatarName}`;
//                     var newPath = form.uploadDir + avatarName;
//                 } else {
//                     var avatarName = 'product_m_' + en.productId + '.' + extName;
//                     productInfoUS.productOverViewImages = `/tenzhong/${avatarName}`;
//                     productInfoCN.productOverViewImages = `/tenzhong/${avatarName}`;
//                     var newPath = form.uploadDir + avatarName;
//                 }

//                 console.log(newPath);
//                 fs.renameSync(files[key].path, newPath); //重命名

//             }
//         }

//         if (needChange) {
//             dbHandler.updateItem(req, res, { en: productInfoUS, zh: productInfoCN })
//             res.send({ status: 'succeed' });
//         } else {
//             res.send({ status: 'failed' });
//         }
//     });

//     // res.locals.success = '上传成功';
//     // res.render('perInformation', { title: TITLE, user: req.session.user[0] });
//     // }

// });

// router.post('/updateNews', function(req, res) {
//     var email = "";
//     // if (!req.session.user) {
//     //     res.redirect("/sign_in");
//     // } else {
//     // email = req.session.user[0].email;
//     var form = new formidable.IncomingForm(); //创建上传表单
//     form.encoding = 'utf-8'; //设置编辑
//     form.uploadDir = 'public' + AVATAR_UPLOAD_FOLDER; //设置上传目录
//     form.keepExtensions = true; //保留后缀
//     form.maxFieldsSize = 2 * 1024 * 1024; //文件大小

//     form.parse(req, function(err, fields, files) {
//         if (err) {
//             res.send({ status: 'failed' });
//             return;
//         }
//         var tempstamp = new Date().getTime();
//         // var newsId = `nid_${tempstamp}`;
//         var en = {};
//         var zh = {};
//         for (var obj in fields) {
//             if (obj.indexOf('_') !== -1) {
//                 let tmpIn = obj.substring(obj.indexOf('_') + 1, obj.length);
//                 let tempNum = parseInt(tmpIn);
//                 let objName = obj.substring(0, obj.indexOf('_'))
//                 if (tempNum && tempNum > 0) {
//                     if (tempNum % 2 === 0) {
//                         en[objName] = fields[obj];
//                     } else {
//                         zh[objName] = fields[obj];
//                     }
//                 }
//             } else {
//                 en[obj] = fields[obj];
//                 zh[obj] = fields[obj];
//             }
//         }

//         var productInfoCN = {
//             "newsNumber": zh.newsNumber,
//             // "newsId": newsId,
//             "newsTitle": zh.newsTitle,
//             "newsShortDescription": zh.newsShortDescription,
//             "newsLongDescriptionTop": zh.newsLongDescriptionTop,
//             "newsLongDescriptionBottom": zh.newsLongDescriptionBottom,
//             "newsDescription": zh.newsDescription,
//             "newsContent": zh.newsContent,
//             // "newsImages": "/img/FastMig-X-Intelligent_w.png",
//             "type": zh.type,
//             "priority": zh.priority,
//             "languageCode": "CHN"
//         }
//         var productInfoUS = {
//             "newsNumber": en.newsNumber,
//             // "newsId": newsId,
//             "newsTitle": en.newsTitle,
//             "newsShortDescription": en.newsShortDescription,
//             "newsLongDescriptionTop": en.newsLongDescriptionTop,
//             "newsLongDescriptionBottom": en.newsLongDescriptionBottom,
//             "newsDescription": en.newsDescription,
//             "newsContent": en.newsContent,
//             // "newsImages": "/img/FastMig-X-Intelligent_w.png",
//             "type": en.type,
//             "priority": en.priority,
//             "languageCode": "USA"
//         }
//         var needChange = true;
//         for (var key in files) {
//             var extName = ''; //后缀名
//             switch (files[key].type) {
//                 case 'image/pjpeg':
//                     extName = 'jpg';
//                     break;
//                 case 'image/jpeg':
//                     extName = 'jpg';
//                     break;
//                 case 'image/png':
//                     extName = 'png';
//                     break;
//                 case 'image/x-png':
//                     extName = 'png';
//                     break;
//             }
//             if (files[key].size == 0) {
//                 fs.unlinkSync(files[key].path);
//             } else {
//                 needChange = true;
//                 if (key === 'newsImages') {
//                     var avatarName = 'news_l_' + zh.newsId + '.' + extName;
//                     productInfoUS.newsImages = `/tenzhong/${avatarName}`;
//                     productInfoCN.newsImages = `/tenzhong/${avatarName}`;
//                     var newPath = form.uploadDir + avatarName;
//                 }

//                 console.log(newPath);
//                 fs.renameSync(files[key].path, newPath); //重命名

//             }
//         }

//         if (needChange) {
//             dbHandler.updateNews(req, res, { en: productInfoUS, zh: productInfoCN })
//             res.send({ status: 'succeed' });
//         } else {
//             res.send({ status: 'failed' });
//         }
//     });

//     // res.locals.success = '上传成功';
//     // res.render('perInformation', { title: TITLE, user: req.session.user[0] });
//     // }

// });

// router.post('/updateMenu', function(req, res) {
//     var email = "";
//     var form = new formidable.IncomingForm(); //创建上传表单
//     form.encoding = 'utf-8'; //设置编辑

//     form.parse(req, function(err, fields, files) {
//         if (err) {
//             res.send({ status: 'failed' });
//             return;
//         }
//         var tempstamp = new Date().getTime();
//         // var newsId = `nid_${tempstamp}`;
//         var en = {};
//         var zh = {};
//         for (var obj in fields) {
//             if (obj.indexOf('_') !== -1) {
//                 let tmpIn = obj.substring(obj.indexOf('_') + 1, obj.length);
//                 let tempNum = parseInt(tmpIn);
//                 let objName = obj.substring(0, obj.indexOf('_'))
//                 if (tempNum && tempNum > 0) {
//                     if (tempNum % 2 === 0) {
//                         en[objName] = fields[obj];
//                     } else {
//                         zh[objName] = fields[obj];
//                     }
//                 }
//             } else {
//                 en[obj] = fields[obj];
//                 zh[obj] = fields[obj];
//             }
//         }

//         var productInfoCN = {
//             "subcategoryId": zh.subcategoryId,
//             // "headIntro": "设备面向",
//             "headTitle": zh.headTitle,
//             "headDescription": zh.headDescription,
//             "subcategoryName": zh.subcategoryName,
//             "subcategroyTitle": zh.subcategroyTitle,
//             "subcategoryDescriptionTop": zh.subcategoryDescriptionTop,
//             "subcategoryDescriptionBottom": zh.subcategoryDescriptionBottom,
//             "subcategoryProductTitle": zh.subcategoryProductTitle,
//             "languageCode": "CHN"
//         }
//         var menuCN = {
//             "navigationId": zh.navigationId,
//             "tabId": zh.tabId,
//             "tabName": zh.tabName,
//             // "categroyId": "cid_1",
//             "categoryName": zh.categoryName,
//             // "subcategorys": [
//             //     {
//             //         "sid": "sid_1",
//             //         "subcategoryName": "MIG"
//             //     },
//             //     {
//             //         "sid": "sid_2",
//             //         "subcategoryName": "TIG"
//             //     },
//             //     {
//             //         "sid": "sid_3",
//             //         "subcategoryName": "STICK(MMA)"
//             //     },
//             //     {
//             //         "sid": "sid_4",
//             //         "subcategoryName": "多工艺"
//             //     }
//             // ],
//             "priority": zh.priority,
//             "languageCode": "CHN"
//         }
//         var productInfoUS = {
//             "subcategoryId": en.subcategoryId,
//             // "headIntro": "设备面向",
//             "headTitle": en.headTitle,
//             "headDescription": en.headDescription,
//             "subcategoryName": en.subcategoryName,
//             "subcategroyTitle": en.subcategroyTitle,
//             "subcategoryDescriptionTop": en.subcategoryDescriptionTop,
//             "subcategoryDescriptionBottom": en.subcategoryDescriptionBottom,
//             "subcategoryProductTitle": en.subcategoryProductTitle,
//             "languageCode": "USA"
//         }
//         var menuUS = {
//             "navigationId": en.navigationId,
//             "tabId": en.tabId,
//             "tabName": en.tabName,
//             // "categroyId": "cid_1",
//             "categoryName": en.categoryName,
//             // "subcategorys": [
//             //     {
//             //         "sid": "sid_1",
//             //         "subcategoryName": "MIG"
//             //     },
//             //     {
//             //         "sid": "sid_2",
//             //         "subcategoryName": "TIG"
//             //     },
//             //     {
//             //         "sid": "sid_3",
//             //         "subcategoryName": "STICK(MMA)"
//             //     },
//             //     {
//             //         "sid": "sid_4",
//             //         "subcategoryName": "多工艺"
//             //     }
//             // ],
//             "priority": en.priority,
//             "languageCode": "USA"
//         }
//         var needChange = true;

//         if (needChange) {
//             dbHandler.updateMenu(req, res, { en: productInfoUS, zh: productInfoCN }, { zh: menuCN, en: menuUS })
//             res.send({ status: 'succeed' });
//         } else {
//             res.send({ status: 'failed' });
//         }
//     });

//     // res.locals.success = '上传成功';
//     // res.render('perInformation', { title: TITLE, user: req.session.user[0] });
//     // }

// });

// router.get('/deleteItem', function(req, res) {
//     if (req.query.productNumber) {
//         dbHandler.deleteItem(req, res);
//     } else {
//         res.send({ status: 'failed' })
//     }
// })

// router.get('/deleteNews', function(req, res) {
//     if (req.query.newsNumber) {
//         dbHandler.deleteNews(req, res);
//     } else {
//         res.send({ status: 'failed' })
//     }
// })

// router.get('/updateUser', function(req, res) {
//     if (!req.session.user) {
//         res.redirect("/management/signIn");
//     }

//     if (req.query && req.query.userId) {
//         dbHandler.updateUser(req, res)
//     } else {
//         res.send('failed')
//     }
// });

// router.post('/updateOrder', function (req, res) {
//     if (req.body && req.body.orderId) {
//         dbHandler.updateOrder(req, res);
//     }
//     else {
//         res.send('failed')
//     }
// });

// router.post('/updateAbout', function (req, res) {
//     if (req.body) {
//         dbHandler.updateAbout(req, res);
//     }
//     else {
//         res.send('failed')
//     }
// });

// router.get('/deleteOrder', function (req, res) {
//     if (req.query && req.query.orderId) {
//         dbHandler.deleteOrder(req, res);
//     }
//     else {
//         res.send('failed')
//     }
// });

// router.get('/deleteQuestion', function (req, res) {
//     if (req.query && req.query.questionId) {
//         dbHandler.deleteQuestion(req, res);
//     }
//     else {
//         res.send('failed')
//     }
// });

// router.get('/deleteUser', function(req, res) {
//     if (!req.session.user) {
//         res.redirect("/management/signIn");
//     }

//     if (req.query && req.query.userId) {
//         dbHandler.deleteUser(req, res);
//     } else {
//         res.send('failed')
//     }
// });
module.exports = router;