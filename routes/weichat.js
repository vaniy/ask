// var express = require('express');
// var fetch = require('node-fetch')
// var mysql = require('mysql');
// var router = express.Router();
// var connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     // password: 'Qwaszx123@',
//     password: 'jiangshenaini921',
//     database: 'shopping'
// });

// connection.connect();

// router.get('/user/getOpenId', function(req, res, next) {
//     if (req.query && req.query.code) {
//         // dbHandler.findUser(req, res);
//         fetch(`https://api.weixin.qq.com/sns/jscode2session?appid=wx6c5f1054f9c29d6b&secret=cc64d5a95b64037f71ef8bde56b78bbb&js_code=${req.query.code}&grant_type=authorization_code`, { headers: { 'content-type': 'application/json' }, method: 'Get' }).then(function(res) {
//             return res.json();
//         }).then(function(json) {
//             res.send(json);
//         })
//     } else {
//         res.send('failed')
//     }
//     // res.send({"a":"a"})
// })

// router.get('/product', function(req, res, next) {
//     connection.query(`SELECT * from ims_integral_product where status = 1 order by priority`, function(error, results, fields) {
//         if (error || !results) { res.status(200).send({ status: 'failed' }); return; }
//         let products = [];
//         results.map(function(child, index) {
//             products.push(mergeProduct(child));
//         })
//         res.status(200).send({ results: products, status: 'success' });
//     });
//     // res.send([
//     //     { productid: '8001919001', title: 'iLELE益生菌固体饮料', description: ['独有LGG+BB12', '原装进口'], feature1: '全年龄段适用', price: 199.00, shippingcharge: 0, warehouse_type: 1, qty: 99 },
//     //     { productid: '8001919002', title: 'iLELE DHA', description: ['独有核桃油提取物', '增强宝宝智力'], feature1: '全年龄段适用', price: 199.00, shippingcharge: 0, warehouse_type: 1, qty: 99 },
//     //     { productid: '8001919003', title: 'iLELE DHA', description: ['独有核桃油提取物', '增强宝宝智力'], feature1: '全年龄段适用', price: 199.00, shippingcharge: 0, warehouse_type: 1, qty: 99 }
//     // ])
// })


// router.get('/user/getUser', function(req, res, next) {
//     if (req.query.openId) {
//         connection.query(`SELECT * from ims_integral_user where openid = "${req.query.openId}"`, function(error, results, fields) {
//             if (error) { res.status(200).send({ status: 'failed' }); return; }
//             res.status(200).send(results[0] ? { results: results[0], status: 'success' } : { status: 'failed' });
//         });
//     } else {
//         res.status(200).send({ status: 'failed' });
//     }
// })

// //短信验证码发送
// router.get('/user/vc', function(req, res, next) {
//     if (req.query.openId && (req.session.vc == undefined || req.session.vc <= 5)) {
//         var vc = Math.ceil(Math.random() * 1000000);
//         var message = `您的验证码为：${vc} (5分钟内有效)`;
//         fetch(`http://sdk4rptws.eucp.b2m.cn:8080/sdkproxy/sendsms.action?cdkey=8SDK-EMY-6699-RJZSN&password=455751&seqid=8SDK-EMY-6699-RJZSN&message=${encodeURIComponent(message)}&smspriority=1&phone=${req.query.phone}`, { headers: { 'content-type': 'application/json' }, method: 'Get' }).then(function(result) {
//             res.send({ status: 'success', vc: vc });
//             req.session.vc = req.session.vc ? req.session.vc + 1 : 1;
//         }).catch(function(err) {
//             res.send({ status: 'failed' })
//         })
//     } else {
//         res.send({ status: 'failed' })
//     }
// })

// router.get('/user/createUser', function(req, res, next) {
//     if (req.query.openId) {
//         var addSql = 'INSERT INTO ims_integral_user(qyuserid,username,mobile,gender,avatar,status,logincount,lastlogintime,createtime,updatetime,openid) VALUES(?,?,?,?,?,?,?,?,?,?,?)';
//         var addSqlParams = [
//             `${new Date().getTime()}_${req.query.openId}`,
//             req.query.userName,
//             req.query.phone,
//             req.query.gender,
//             req.query.avatar,
//             1,
//             1,
//             new Date(),
//             new Date(),
//             new Date(),
//             req.query.openId
//         ];
//         connection.query(addSql, addSqlParams, function(err, result) {
//             if (err) {
//                 res.status(200).send({ status: 'failed' });
//                 return;
//             }

//             console.log('--------------------------INSERT----------------------------');
//             console.log('INSERT ID:', result);
//             res.status(200).send({ status: 'success' });
//             console.log('-----------------------------------------------------------------\n\n');
//         });
//     } else {
//         res.status(200).send({ status: 'failed' });
//     }
// })

// // CREATE TABLE `ims_integral_shoppingcart`(
// //     `cartid` int(11) unsigned NOT NULL AUTO_INCREMENT,
// //     `qyuserid` varchar(64) DEFAULT NULL COMMENT '用户ID',
// //     `productid` varchar(32) DEFAULT NULL COMMENT '商品编号',
// //     `status` tinyint(2) DEFAULT NULL COMMENT '当前状态0下架，1上架',
// //     `qty` int(11) NOT NULL DEFAULT '0' COMMENT '商品数量',
// //     `createtime` datetime DEFAULT NULL COMMENT '创建时间',
// //     `updatetime` datetime DEFAULT NULL COMMENT '更新时间',
// //     PRIMARY KEY (`cartid`)
// //   ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='购物车表';
// router.get('/user/addToCart', function(req, res, next) {
//     if (req.query.openId && req.query.qyuserid && req.query.productid) {
//         connection.query(`SELECT * from ims_integral_shoppingcart where productid = "${req.query.productid}" and qyuserid = "${req.query.qyuserid}"`, function(error, results, fields) {
//             if (error) { res.status(200).send({ status: 'failed' }); return; }
//             if (results && results[0]) {
//                 let cart = Object.assign({}, results[0])
//                 cart.qty = cart.qty + 1;
//                 cart.updatetime = new Date();
//                 var modSql = 'UPDATE ims_integral_shoppingcart SET qty = ?,updatetime = ? WHERE productid = ? and qyuserid = ?';
//                 var modSqlParams = [cart.qty, cart.updatetime, req.query.productid, req.query.qyuserid];
//                 //改
//                 connection.query(modSql, modSqlParams, function(err, result) {
//                     if (err) {
//                         res.status(200).send({ status: 'failed' });
//                         return;
//                     }
//                     console.log('--------------------------UPDATE----------------------------');
//                     console.log('UPDATE affectedRows', result.affectedRows);
//                     res.status(200).send({ status: 'success' });
//                     console.log('-----------------------------------------------------------------\n\n');
//                 });

//             } else {
//                 var addSql = 'INSERT INTO ims_integral_shoppingcart(qyuserid,productid,status,qty,createtime,updatetime) VALUES(?,?,?,?,?,?)';
//                 var addSqlParams = [
//                     req.query.qyuserid,
//                     req.query.productid,
//                     1,
//                     1,
//                     new Date(),
//                     new Date(),
//                 ];
//                 connection.query(addSql, addSqlParams, function(err, result) {
//                     if (err) {
//                         res.status(200).send({ status: 'failed' });
//                         return;
//                     }

//                     console.log('--------------------------INSERT----------------------------');
//                     console.log('INSERT ID:', result);
//                     res.status(200).send({ status: 'success' });
//                     console.log('-----------------------------------------------------------------\n\n');
//                 });
//             }
//         });
//     } else {
//         res.status(200).send({ status: 'failed' });
//     }
// })

// router.get('/user/getShopping', function(req, res, next) {
//     if (req.query.openId && req.query.qyuserid) {
//         connection.query(`SELECT * from ims_integral_shoppingcart where qyuserid = "${req.query.qyuserid}"`, function(error, carts, fields) {
//             if (error) { res.status(200).send({ status: 'failed' }); return; }
//             if (carts && carts.length > 0) {
//                 let products = [];
//                 carts.map(function(child, index) {
//                     products.push(child.productid)
//                 });
//                 connection.query(`SELECT * from ims_integral_product where status = 1 and productid in (${products.join(',')}) and qty > 0`, function(error, results, fields) {
//                     if (error || !results) { res.status(200).send({ status: 'failed' }); return; }
//                     let cartInfos = [];
//                     let type1 = {
//                         wareHouse: '本地仓发货',
//                         houseType: 1,
//                         shippingcharge: 0,
//                         items: []
//                     };
//                     let type2 = {
//                         wareHouse: '保税仓发货',
//                         houseType: 2,
//                         shippingcharge: 0,
//                         items: []
//                     };
//                     carts.map(function(child, index) {
//                         results.map(function(cld, idx) {
//                             if (child.productid === cld.productid) {
//                                 if (index === 0) {
//                                     type1.id = cld.warehouse_type === 1 ? 0 : 1;
//                                     type2.id = cld.warehouse_type === 1 ? 1 : 0;
//                                 }

//                                 switch (cld.warehouse_type) {
//                                     case 0:
//                                     default:
//                                         type1.shippingcharge += cld.shippingcharge;
//                                         type1.items.push({
//                                             id: type1.items.length,
//                                             houseType: 1,
//                                             index: `${type1.id},${type1.items.length}`,
//                                             shippingcharge: cld.shippingcharge,
//                                             isRemoved: false,
//                                             itemNumber: cld.productid,
//                                             image: `http://www.cztzhg.com/product/img/${cld.productid}.png`,
//                                             description: cld.description,
//                                             finalPriceText: `¥${cld.price}`,
//                                             finalPrice: cld.price,
//                                             finalQty: child.qty,
//                                             qty: child.qty,
//                                             choose: false
//                                         });
//                                         break;
//                                     case 1:
//                                         type2.shippingcharge += cld.shippingcharge;
//                                         type2.items.push({
//                                             id: type2.items.length,
//                                             houseType: 2,
//                                             index: `${type2.id},${type2.items.length}`,
//                                             shippingcharge: cld.shippingcharge,
//                                             isRemoved: false,
//                                             itemNumber: cld.productid,
//                                             image: `http://www.cztzhg.com/product/img/${cld.productid}.png`,
//                                             description: cld.description,
//                                             finalPriceText: `¥${cld.price}`,
//                                             finalPrice: cld.price,
//                                             finalQty: child.qty,
//                                             qty: child.qty,
//                                             choose: false
//                                         });
//                                         break;
//                                 }
//                             }
//                         });
//                     });
//                     if (type1.id === 0) {
//                         if (type1.items.length > 0) {
//                             cartInfos.push(type1)
//                         }
//                         if (type2.items.length > 0) {
//                             cartInfos.push(type2)
//                         }
//                     }

//                     if (type2.id === 0) {
//                         if (type2.items.length > 0) {
//                             cartInfos.push(type2)
//                         }
//                         if (type1.items.length > 0) {
//                             cartInfos.push(type1)
//                         }
//                     }

//                     if (cartInfos.length === 1) {
//                         cartInfos[0].id = 0;
//                         cartInfos[0].items.map(function(child, index) {
//                             child.index = `0,${index}`
//                         })
//                     }
//                     res.status(200).send({ results: cartInfos, status: 'success' });
//                 });
//             } else {
//                 res.status(200).send({ status: 'failed' });
//             }
//         });
//     } else {
//         res.status(200).send({ status: 'failed' });
//     }
// })

// router.get('/user/getStreet', function(req, res, next) {
//     if (req.query.openId && req.query.area) {
//         var areas = require('../public/json/areas.json');
//         var streets = require('../public/json/streets.json');
//         let key = '';
//         let results = [];
//         for (var i = 0; i < areas.length; i++) {
//             if (areas[i].name === req.query.area) {
//                 key = areas[i].code;
//                 break;
//             }
//         }

//         if (key !== '') {
//             streets.map((child, index) => {
//                 if (child.areaCode === key) {
//                     results.push(child.name);
//                 }
//             })

//             res.status(200).send({ status: 'success', results });
//         } else {
//             res.status(200).send({ status: 'failed' });
//         }
//     } else {
//         res.status(200).send({ status: 'failed' });
//     }
// })

// router.get('/user/modefiyAddress', function(req, res, next) {
//     if (req.query.openId && req.query.qyuserid) {
//         if (req.query.isDelete && req.query.isDelete === '1') {
//             var delSql = 'DELETE FROM ims_integral_delivery_address WHERE qyuserid = ? and addressid = ?';
//             var delSqlParams = [req.query.qyuserid, parseInt(req.query.addressid)];
//             //删
//             connection.query(delSql, delSqlParams, function(err, result) {
//                 if (err) {
//                     res.status(200).send({ status: 'failed' });
//                     return;
//                 }

//                 res.status(200).send({ status: 'success' });
//             })
//         } else {
//             let time = new Date();
//             var addSql = 'INSERT INTO ims_integral_delivery_address(qyuserid,consignee_name,consignee_phone,consignee_province,consignee_city,consignee_area,consignee_street,consignee_address,consignee_defalut,createtime,updatetime,status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)';
//             var addSqlParams = [
//                 req.query.qyuserid,
//                 req.query.name,
//                 req.query.phone,
//                 req.query.province,
//                 req.query.city,
//                 req.query.area,
//                 req.query.street,
//                 req.query.address,
//                 parseInt(req.query.default),
//                 time,
//                 time,
//                 1
//             ];
//             connection.query(addSql, addSqlParams, function(err, result) {
//                 if (err) {
//                     res.status(200).send({ status: 'failed' });
//                     return;
//                 }
//                 if (req.query.default === '1') {
//                     var modSql = 'UPDATE ims_integral_delivery_address SET consignee_defalut = 0 WHERE qyuserid = ? and createtime != ? and consignee_defalut = 1 ';
//                     var modSqlParams = [req.query.qyuserid, time];
//                     //改
//                     connection.query(modSql, modSqlParams, function(err, result) {
//                         if (err) {
//                             res.status(200).send({ status: 'failed' });
//                             return;
//                         }
//                         res.status(200).send({ status: 'success' });
//                     });
//                 } else {
//                     res.status(200).send({ status: 'success' });
//                 }
//             });
//         }
//     } else {
//         res.status(200).send({ status: 'failed' });
//     }
// })

// router.get('/user/address', function(req, res, next) {
//     if (req.query.openId && req.query.qyuserid) {
//         connection.query(`SELECT * from ims_integral_delivery_address where qyuserid = "${req.query.qyuserid}" and status = 1`, function(error, results, fields) {
//             if (error) { res.status(200).send({ status: 'failed' }); return; }
//             let userInfo = {};
//             if (results && results[0]) {
//                 userInfo.addresses = [];
//                 results.map((child, index) => {
//                     let addresses = [];
//                     if (child.consignee_province != undefined) {
//                         addresses.push(child.consignee_province);
//                     }
//                     if (child.consignee_city != undefined) {
//                         addresses.push(child.consignee_city);
//                     }
//                     if (child.consignee_area != undefined) {
//                         addresses.push(child.consignee_area);
//                     }
//                     if (child.consignee_address != undefined) {
//                         addresses.push(child.consignee_address);
//                     }
//                     userInfo.addresses.push({
//                         id: index,
//                         addressid: child.addressid,
//                         address: addresses,
//                         name: child.consignee_name,
//                         phone: child.consignee_phone,
//                         addressText: `${addresses[0] || ''}${addresses[1] || ''}${addresses[2] || ''}${addresses[3] || ''}`
//                     })
//                 })
//                 res.status(200).send({ status: 'success', userInfo });
//                 return;
//             }
//             res.status(200).send({ status: 'failed' });
//             return;
//         });
//     } else {
//         res.status(200).send({ status: 'failed' });
//     }
// })

// router.post('/user/uploadImg', function(req, res, next) {
//     let a = req;
//     res.status(200).send({ status: 'success' });
// })

// router.get('/product/modifyQty', function(req, res, next) {
//     if (req.query.openId && req.query.qyuserid && req.query.productid) {
//         if (req.query.isDelete === '1') {
//             var delSql = 'DELETE FROM ims_integral_shoppingcart WHERE productid = ? and qyuserid = ?';
//             var delSqlParams = [req.query.productid, req.query.qyuserid];
//             //删
//             connection.query(delSql, delSqlParams, function(err, result) {
//                 if (err) {
//                     res.status(200).send({ status: 'failed' });
//                     return;
//                 }

//                 res.status(200).send({ status: 'success' });
//             })
//         } else {
//             var modSql = 'UPDATE ims_integral_shoppingcart SET qty = ?,updatetime = ? WHERE productid = ? and qyuserid = ?';
//             var modSqlParams = [parseInt(req.query.qty) || 1, new Date(), req.query.productid, req.query.qyuserid];
//             //改
//             connection.query(modSql, modSqlParams, function(err, result) {
//                 if (err) { res.status(200).send({ status: 'failed' }); return; }
//                 res.status(200).send({ status: 'success' });

//             });
//         }
//     } else {
//         res.status(200).send({ status: 'failed' });
//     }
// })

// router.get('/order/checkPcode', function(req, res, next) {
//     if (req.query.openId && req.query.key) {
//         connection.query(`SELECT * from ims_integral_pcode where pcodekey = "${req.query.key}" and status = 1`, function(error, results, fields) {
//             if (error) { res.status(200).send({ status: 'failed' }); return; }
//             if (results && results[0]) {
//                 res.status(200).send({ status: 'success', pcode: results[0].pcode });
//                 return;
//             }
//             res.status(200).send({ status: 'failed' });
//             return;
//         });
//     } else {
//         res.status(200).send({ status: 'failed' });
//     }
// })

// router.get('/order/getAll', function(req, res, next) {
//     if (req.query.openId && req.query.qyuserid) {
//         connection.query(`SELECT * from ims_integral_order where qyuserid = "${req.query.qyuserid}"`, function(error, results, fields) {
//             if (error) { res.status(200).send({ status: 'failed' }); return; }
//             if (results && results.length > 0) {
//                 let showOrderInfos = [];
//                 results.map((child, index) => {
//                     let items = [];
//                     for (var i = 0; i < child.product_count; i++) {
//                         var description = '';
//                         var finalQty = 1;
//                         if (child.product_count === 1) {
//                             description = child.producttitle;
//                             finalQty = child.product_count;
//                         }

//                         items.length < 3 && items.push({
//                             image: './images/product.png',
//                             description: description,
//                             finalQty: finalQty ? finalQty : null
//                         })
//                     }
//                     showOrderInfos.push({
//                         id: index,
//                         orderNum: child.orderno,
//                         orderType: child.order_status,
//                         shoppingCharge: child.shippingcharge,
//                         totalCount: child.product_count,
//                         totalPrice: child.order_amount,
//                         items
//                     })
//                 })

//                 res.status(200).send({ status: 'success', showOrderInfos });
//                 return;
//             }
//             res.status(200).send({ status: 'failed' });
//             return;
//         });
//     } else {
//         res.status(200).send({ status: 'failed' });
//     }
// })

// router.get('/order/detail', function(req, res, next) {
//     if (req.query.openId && req.query.qyuserid && req.query.orderno) {
//         connection.query(`SELECT * from ims_integral_order_detail where and orderno = "${req.query.orderno}"`, function(error, results, fields) {
//             if (error) { res.status(200).send({ status: 'failed' }); return; }
//             if (results && results.length > 0) {
//                 let carts = [];
//                 let type1 = {
//                     id: 0,
//                     wareHouse: '本地仓发货',
//                     orderType: 0,
//                     houseType: 0,
//                     shoppingCharge: 0,
//                     totalCount: 0,
//                     totalPrice: 0,
//                     items: []
//                 };
//                 let type2 = {
//                     id: 1,
//                     wareHouse: '保税仓发货',
//                     orderType: 0,
//                     houseType: 1,
//                     shoppingCharge: 0,
//                     totalCount: 0,
//                     totalPrice: 0,
//                     items: []
//                 };
//                 results.map((child, index) => {
//                     if (child.warehouse_type === 0) {
//                         type1.shoppingCharge += child.shippingcharge;
//                         type1.totalCount += child.qty;
//                         type1.totalPrice += child.price;
//                         type1.items.push({
//                             id: index,
//                             houseType: 0,
//                             itemNumber: child.productid,
//                             image: `http://www.cztzhg.com/product/img/${child.productid}.png`,
//                             description: child.title,
//                             finalPriceText: `¥${child.price}`,
//                             finalPrice: child.price,
//                             finalQty: child.qty
//                         })
//                     } else if (child.warehouse_type === 0) {
//                         type2.shoppingCharge += child.shippingcharge;
//                         type2.totalCount += child.qty;
//                         type2.totalPrice += child.price;
//                         type2.items.push({
//                             id: index,
//                             houseType: 1,
//                             itemNumber: child.productid,
//                             image: `http://www.cztzhg.com/product/img/${child.productid}.png`,
//                             description: child.title,
//                             finalPriceText: `¥${child.price}`,
//                             finalPrice: child.price,
//                             finalQty: child.qty
//                         })
//                     }
//                 })

//                 let = type1.shoppingCharge + type2.shoppingCharge;
//                 let price = type1.totalPrice + type2.totalPrice;
//                 let orderInfo = {
//                     orderNum: results[0].orderno,
//                     userInfo: {
//                         addressesText: results[0].consignee_address,
//                         name: results[0].consignee_name,
//                         phoneNumber: results[0].consignee_phone,
//                         userIdCard: results[0].user_idcard
//                     },
//                     promotionInfo: {
//                         promotionCode: '',
//                         // usePromotionCode: false,
//                         // errorPromotionCode: false,
//                         promotionPrice: results[0].discount_amount,
//                     },
//                     shoppingCharge: `+ ¥${shoppingCharge}`,
//                     totalPriceText: `¥${price}`,
//                     finalPriceText: `${price+shoppingCharge-results[0].discount_amount}`,
//                     finalPrice: price + shoppingCharge - results[0].discount_amount
//                 }
//                 res.status(200).send({ status: 'success', orderInfo });
//                 return;
//             }
//             res.status(200).send({ status: 'failed' });
//             return;
//         });
//     } else {
//         res.status(200).send({ status: 'failed' });
//     }
// })

// function encodeUtf8(text) {
//     const code = encodeURIComponent(text);
//     const bytes = [];
//     for (var i = 0; i < code.length; i++) {
//         const c = code.charAt(i);
//         if (c === '%') {
//             const hex = code.charAt(i + 1) + code.charAt(i + 2);
//             const hexVal = parseInt(hex, 16);
//             bytes.push(hexVal);
//             i += 2;
//         } else bytes.push(c.charCodeAt(0));
//     }
//     return bytes;
// }

// function mergeProduct(db) {
//     return {
//         productid: db.productid,
//         title: db.title,
//         description: db.description.indexOf(',') > 0 ? db.description.split(',') : db.description.split('，'),
//         feature1: db.feature1,
//         feature2: db.feature2,
//         price: db.price,
//         shippingcharge: db.shippingcharge,
//         warehouse_type: db.warehouse_type,
//         qty: db.qty,
//         rundou_count: db.rundou_count
//     }
// }

// module.exports = router;