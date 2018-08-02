var mongoClient = require('mongodb').MongoClient;
var mogoUrl = 'mongodb://localhost:27017/kemppi';
var BSON = require('bson');
var viewHandler = require('./viewHandler')

function checkUserExists(req, res, fromUser = false) {
    var collection = fromUser ? 'user' : 'admin';
    mongoClient.connect(mogoUrl, function(err, db) {
        var cursor = db.collection(collection).find({ "phoneNumber": req.body.phoneNumber }).toArray(function(err, doc) {
            if (err) {
                res.send({ status: 'failed' });
                db.close();
            } else if (!doc || doc.length == 0) {
                res.send({ status: 'failed' });
                db.close();

            } else {
                if (doc[0].password === req.body.password) {
                    if (fromUser) {
                        let userStatus = parseInt(doc[0].status);
                        let chapterStatus = parseInt(req.body.status);
                        if (userStatus && userStatus >= 1) {
                            req.session.custom = { userName: doc[0].name, status: userStatus }
                        } else {
                            req.session.custom = null;
                        }
                    } else {
                        req.session.user = { userName: doc[0].userName, type: doc[0].type }
                    }
                    res.send({ status: 'succeed' });
                } else {
                    res.send({ status: 'failed' });
                }
                db.close();
            }
        });
    });
};

function remove(req, res) {
    var sid = req.query.sid;
    mongoClient.connect(mogoUrl, function(err, db) {
        db.collection('productlist').find({ subcategoryId: sid, languageCode: 'CHN' }).toArray(function(err, doc) {
            if (err) {
                db.close();
            } else if (!doc || doc.length == 0) {
                db.close();

            } else {
                let data = doc[0];
                let products = Object.assign([], data.products);
                let newsProdcuts = [];
                products.map((child, index) => {
                    if (child.productNumber !== req.query.productNumber) {
                        newsProdcuts.push(child)
                    }
                })
                if (newsProdcuts.length === 0) {
                    db.collection('productlist').remove({ "subcategoryId": sid, "languageCode": 'CHN' });
                } else {
                    db.collection('productlist').updateOne({ "subcategoryId": sid, "languageCode": 'CHN' }, {
                        $set: { products: newsProdcuts },
                        $currentDate: { "lastModified": true }
                    });
                }
                db.close();
            }
        })
    })

    mongoClient.connect(mogoUrl, function(err, db) {
        db.collection('productlist').find({ subcategoryId: sid, languageCode: 'USA' }).toArray(function(err, doc) {
            if (err) {
                db.close();
            } else if (!doc || doc.length == 0) {
                db.close();

            } else {
                let data = doc[0];
                let products = Object.assign([], data.products);
                let newsProdcuts = [];
                products.map((child, index) => {
                    if (child.productNumber !== req.query.productNumber) {
                        newsProdcuts.push(child)
                    }
                })

                if (newsProdcuts.length === 0) {
                    db.collection('productlist').remove({ "subcategoryId": sid, "languageCode": 'USA' });
                } else {
                    db.collection('productlist').updateOne({ "subcategoryId": sid, "languageCode": 'USA' }, {
                        $set: { products: newsProdcuts },
                        $currentDate: { "lastModified": true }
                    });
                }
                db.close();
            }
        })
    })
}

function removeNavigation(req, res) {
    mongoClient.connect(mogoUrl, function(err, db) {
        db.collection('navigation').find({ navigationId: req.query.navigationId, languageCode: 'CHN' }).toArray(function(err, doc) {
            if (err) {
                db.close();
            } else if (!doc || doc.length == 0) {
                db.close();

            } else {
                let data = doc[0];
                let subcategorys = Object.assign([], data.subcategorys);
                let newsSubcategorys = [];
                subcategorys.map((child, index) => {
                        if (child.sid !== req.query.sid) {
                            newsSubcategorys.push(child)
                        }
                    })
                    // if (newsSubcategorys.length === 0) {
                    //     db.collection('productlist').remove({ "subcategoryId": sid, "languageCode": 'CHN' });
                    // } else {
                db.collection('navigation').updateOne({ "navigationId": req.query.navigationId, "languageCode": 'CHN' }, {
                    $set: { subcategorys: newsSubcategorys },
                    $currentDate: { "lastModified": true }
                });
                // }
                db.close();
            }
        })
    })
    mongoClient.connect(mogoUrl, function(err, db) {
        db.collection('navigation').find({ navigationId: req.query.navigationId, languageCode: 'USA' }).toArray(function(err, doc) {
            if (err) {
                db.close();
            } else if (!doc || doc.length == 0) {
                db.close();

            } else {
                let data = doc[0];
                let subcategorys = Object.assign([], data.subcategorys);
                let newsSubcategorys = [];
                subcategorys.map((child, index) => {
                        if (child.sid !== req.query.sid) {
                            newsSubcategorys.push(child)
                        }
                    })
                    // if (newsSubcategorys.length === 0) {
                    //     db.collection('productlist').remove({ "subcategoryId": sid, "languageCode": 'CHN' });
                    // } else {
                db.collection('navigation').updateOne({ "navigationId": req.query.navigationId, "languageCode": 'USA' }, {
                    $set: { subcategorys: newsSubcategorys },
                    $currentDate: { "lastModified": true }
                });
                // }
                db.close();
            }
        })
    })
}

//kemppi
function getNavigation(req, res) {
    mongoClient.connect(mogoUrl, function(err, db) {
        db.collection('navigation').find({ languageCode: req.query.languageCode }).sort({ priority: 1 }).toArray(function(err, doc) {
            if (err) {
                res.send({ status: 'failed' });
                db.close();
            } else if (!doc || doc.length == 0) {
                res.send({ status: 'failed' });
                db.close();

            } else {
                res.send(doc);
                db.close();
            }
        })
    })
}

function getProductlist(req, res, languageCode, translate) {
    let params = { languageCode: languageCode, subcategoryId: req.query.sid }
    mongoClient.connect(mogoUrl, function(err, db) {
        db.collection('productlist').find(params).toArray(function(err, doc) {
            if (err) {
                res.redirect("/");
                db.close();
            } else if (!doc || doc.length == 0) {
                res.redirect("/");
                db.close();

            } else {
                var dom = viewHandler.buildProductListItemView(doc[0], translate, languageCode);
                res.render("product", { language: translate, route: '/product?sid=' + req.query.sid, data: doc[0], dom: dom });
                db.close();
            }
        })
    })
}

function getProductDetail(req, res, languageCode, translate) {
    let params = { languageCode: languageCode, productId: req.query.pid }
    mongoClient.connect(mogoUrl, function(err, db) {
        db.collection('product').find(params).toArray(function(err, doc) {
            if (err) {
                res.redirect("/");
                db.close();
            } else if (!doc || doc.length == 0) {
                res.redirect("/");
                db.close();

            } else {
                var dom = viewHandler.buildProductDetailView(doc[0], translate, languageCode);
                res.render("productdetail", { language: translate, route: '/productdetail?pid=' + req.query.pid, data: doc[0], dom: dom });
                db.close();
            }
        })
    })
}

function getProductDetailApi(req, res) {
    let params = { productNumber: req.query.productNumber }
    mongoClient.connect(mogoUrl, function(err, db) {
        db.collection('product').find(params).toArray(function(err, doc) {
            if (err) {
                res.send({ status: 'failed' });
                db.close();
            } else if (!doc || doc.length == 0) {
                res.send({ status: 'failed' });
                db.close();

            } else {
                let data = {};
                doc.map((child, index) => {
                    if (child.languageCode === 'CHN') {
                        for (var obj in child) {
                            if (obj === 'productImages' || obj === 'productOverViewImages' || obj === 'priority' || obj === 'productNumber' || obj === 'productId') {
                                data[obj] = child[obj];
                            } else {
                                if (obj === 'productCharacter') {
                                    if (child[obj] && child[obj].length > 0) {
                                        let ddx = 1;
                                        child[obj].map((cld, idx) => {
                                            data[`${obj}_${ddx}`] = cld;
                                            ddx = ddx + 2;
                                        })
                                    }
                                } else if (obj === 'tab' || obj === 'category' || obj === 'subcategory') {
                                    data[`${obj}Name_1`] = child[obj][`${obj}Name`];
                                    data[`${obj}Id`] = child[obj][`${obj}Id`];
                                } else {
                                    data[`${obj}_1`] = child[obj]
                                }
                            }
                        }
                    } else if (child.languageCode === 'USA') {
                        for (var obj in child) {
                            if (obj === 'productImages' || obj === 'productOverViewImages' || obj === 'priority' || obj === 'productNumber' || obj === 'productId') {
                                data[obj] = child[obj];
                            } else {
                                if (obj === 'productCharacter') {
                                    if (child[obj] && child[obj].length > 0) {
                                        let ddx = 2;
                                        child[obj].map((cld, idx) => {
                                            data[`${obj}_${ddx}`] = cld;
                                            ddx = ddx + 2;
                                        })
                                    }
                                } else if (obj === 'tab' || obj === 'category' || obj === 'subcategory') {
                                    data[`${obj}Name_2`] = child[obj][`${obj}Name`]
                                    data[`${obj}Id`] = child[obj][`${obj}Id`];
                                } else {
                                    data[`${obj}_2`] = child[obj]
                                }
                            }
                        }
                    }
                })
                res.send([data]);
                db.close();
            }
        })
    })
}

function getProductlistApi(req, res) {
    let params = { subcategoryId: req.query.subcategoryId }
    mongoClient.connect(mogoUrl, function(err, db) {
        db.collection('productlist').find(params).toArray(function(err, doc) {
            if (err) {
                res.send({ status: 'failed' });
                db.close();
            } else if (!doc || doc.length == 0) {
                res.send({ status: 'failed' });
                db.close();

            } else {
                let data = {};
                let tid = '';
                doc.map((child, index) => {
                    if (child.languageCode === 'CHN') {
                        for (var obj in child) {
                            if (obj === 'priority' || obj === 'subcategoryId') {
                                data[obj] = child[obj];
                            } else {
                                if (obj === 'tab' || obj === 'category') {
                                    data[`${obj}Name_1`] = child[obj][`${obj}Name`];
                                    data[`${obj}Id`] = child[obj][`${obj}Id`];
                                } else if (obj !== 'products') {
                                    data[`${obj}_1`] = child[obj]
                                }
                            }
                        }
                    } else if (child.languageCode === 'USA') {
                        for (var obj in child) {
                            if (obj === 'priority' || obj === 'subcategoryId') {
                                data[obj] = child[obj];
                            } else {
                                if (obj === 'tab' || obj === 'category') {
                                    data[`${obj}Name_2`] = child[obj][`${obj}Name`]
                                    data[`${obj}Id`] = child[obj][`${obj}Id`];
                                } else if (obj !== 'products') {
                                    data[`${obj}_2`] = child[obj]
                                }
                            }
                        }
                    }
                })
                tid = data.tabId;
                if (tid !== '') {
                    db.collection('navigation').find({ tabId: tid }).toArray(function(err, doc) {
                        if (doc && doc.length > 0) {
                            let menu = doc[0];
                            data.priority = menu.priority;
                            data.navigationId = menu.navigationId;
                            res.send([data]);
                            db.close();
                        } else {
                            res.send([data]);
                            db.close();
                        }
                    })
                } else {
                    res.send([data]);
                    db.close();
                }
            }
        })
    })
}

function getNewsDetailApi(req, res) {
    let params = { newsNumber: req.query.newsNumber }
    mongoClient.connect(mogoUrl, function(err, db) {
        db.collection('news').find(params).toArray(function(err, doc) {
            if (err) {
                res.send({ status: 'failed' });
                db.close();
            } else if (!doc || doc.length == 0) {
                res.send({ status: 'failed' });
                db.close();

            } else {
                let data = {};
                doc.map((child, index) => {
                    if (child.languageCode === 'CHN') {
                        for (var obj in child) {
                            if (obj === 'newsImages' || obj === 'priority' || obj === 'type' || obj === 'newsId' || obj === 'newsNumber') {
                                data[obj] = child[obj];
                            } else {
                                data[`${obj}_1`] = child[obj]
                            }
                        }
                    } else if (child.languageCode === 'USA') {
                        for (var obj in child) {
                            if (obj === 'newsImages' || obj === 'priority' || obj === 'type' || obj === 'newsId' || obj === 'newsNumber') {
                                data[obj] = child[obj];
                            } else {
                                data[`${obj}_2`] = child[obj]
                            }
                        }
                    }
                })
                res.send([data]);
                db.close();
            }
        })
    })
}

function getNews(req, res, languageCode, translate) {
    let params = { languageCode: languageCode, newsId: req.query.nid }
    mongoClient.connect(mogoUrl, function(err, db) {
        db.collection('news').find(params).toArray(function(err, doc) {
            if (err) {
                res.redirect("/");
                db.close();
            } else if (!doc || doc.length == 0) {
                res.redirect("/");
                db.close();

            } else {
                res.render("new", { language: translate, route: '/news?nid=' + req.query.nid, data: doc[0] });
                db.close();
            }
        })
    })
}

function getAllNews(req, res, languageCode, translate) {
    mongoClient.connect(mogoUrl, function(err, db) {
        db.collection('news').find({ languageCode: languageCode }).sort({ priority: 1 }).toArray(function(err, doc) {
            if (err) {
                // res.redirect("/");
                res.render("homepage", { language: translate, route: '', dom: { newsScroll: '', newsCase: '' } });
                db.close();
            } else if (!doc || doc.length == 0) {
                res.render("homepage", { language: translate, route: '', dom: { newsScroll: '', newsCase: '' } });
                // res.redirect("/");
                db.close();

            } else {
                var dom = viewHandler.buildHomeView(doc, translate, languageCode)
                res.render("homepage", { language: translate, route: '', dom: dom });
                // res.render("new", { language: translate, route: '/', data: doc });
                db.close();
            }
        })
    })
}

function createItem(req, res, product) {
    mongoClient.connect(mogoUrl, function(err, db) {
        if (product.zh) {
            db.collection('product').insertOne(product.zh);
            let sid = product.zh.subcategory.subcategoryId;
            mongoClient.connect(mogoUrl, function(err, db) {
                db.collection('productlist').find({ subcategoryId: sid, languageCode: 'CHN' }).toArray(function(err, doc) {
                    if (err) {
                        db.close();
                    } else if (!doc || doc.length == 0) {
                        let productlist = {};
                        let products = [];
                        productlist.subcategoryId = sid;
                        productlist.subcategoryName = product.zh.subcategory.subcategoryName
                        productlist.tab = product.zh.tab;
                        productlist.category = product.zh.category;
                        productlist.languageCode = 'CHN';
                        products.push({
                            "productId": product.zh.productId,
                            "productNumber": product.zh.productNumber,
                            "productImage": product.zh.productImages,
                            "prodcutTitle": product.zh.productTitle,
                            "productDescription": product.zh.productDescription
                        })
                        productlist.products = products;
                        db.collection('productlist').insertOne(productlist);
                        db.close();

                    } else {
                        let data = doc[0];
                        let products = Object.assign([], data.products);
                        products.push({
                            "productId": product.zh.productId,
                            "productNumber": product.zh.productNumber,
                            "productImage": product.zh.productImages,
                            "prodcutTitle": product.zh.productTitle,
                            "productDescription": product.zh.productDescription
                        })

                        db.collection('productlist').updateOne({ "subcategoryId": sid, "languageCode": product.zh.languageCode }, {
                            $set: { products: products },
                            $currentDate: { "lastModified": true }
                        });
                        db.close();
                    }
                })
            })
        }
        if (product.en) {
            db.collection('product').insertOne(product.en);
            let sid = product.en.subcategory.subcategoryId;
            mongoClient.connect(mogoUrl, function(err, db) {
                db.collection('productlist').find({ subcategoryId: sid, languageCode: 'USA' }).toArray(function(err, doc) {
                    if (err) {
                        db.close();
                    } else if (!doc || doc.length == 0) {
                        let productlist = {};
                        let products = [];
                        productlist.subcategoryId = sid;
                        productlist.subcategoryName = product.en.subcategory.subcategoryName
                        productlist.tab = product.en.tab;
                        productlist.category = product.en.category;
                        productlist.languageCode = 'USA';
                        products.push({
                            "productId": product.en.productId,
                            "productNumber": product.en.productNumber,
                            "productImage": product.en.productImages,
                            "prodcutTitle": product.en.productTitle,
                            "productDescription": product.en.productDescription
                        })
                        productlist.products = products;
                        db.collection('productlist').insertOne(productlist);
                        db.close();

                    } else {
                        let data = doc[0];
                        let products = Object.assign([], data.products);
                        products.push({
                            "productId": product.en.productId,
                            "productNumber": product.en.productNumber,
                            "productImage": product.en.productImages,
                            "prodcutTitle": product.en.productTitle,
                            "productDescription": product.en.productDescription
                        })

                        db.collection('productlist').updateOne({ "subcategoryId": sid, "languageCode": product.en.languageCode }, {
                            $set: { products: products },
                            $currentDate: { "lastModified": true }
                        });
                        db.close();
                    }
                })
            })
        }

        db.close();
    })
}

function createNews(req, res, news) {
    mongoClient.connect(mogoUrl, function(err, db) {
        if (news.zh) {
            db.collection('news').insertOne(news.zh);
        }
        if (news.en) {
            db.collection('news').insertOne(news.en);
        }

        db.close();
    })
}

function updateItem(req, res, product) {
    mongoClient.connect(mogoUrl, function(err, db) {
        if (product.zh) {
            db.collection('product').updateOne({ "productNumber": product.zh.productNumber, "languageCode": product.zh.languageCode }, {
                $set: product.zh,
                $currentDate: { "lastModified": true }
            });

            let sid = product.zh.subcategory.subcategoryId;
            mongoClient.connect(mogoUrl, function(err, db) {
                db.collection('productlist').find({ subcategoryId: sid, languageCode: 'CHN' }).toArray(function(err, doc) {
                    if (err) {
                        db.close();
                    } else if (!doc || doc.length == 0) {
                        db.close();

                    } else {
                        let data = doc[0];
                        let products = Object.assign([], data.products);
                        products.map((child, index) => {
                            if (child.productId === product.zh.productId) {
                                child.productImage = product.zh.productImages;
                                child.prodcutTitle = product.zh.prodcutTitle;
                                child.productDescription = product.zh.productDescription;
                            }
                        })

                        db.collection('productlist').updateOne({ "subcategoryId": sid, "languageCode": product.zh.languageCode }, {
                            $set: { products: products },
                            $currentDate: { "lastModified": true }
                        });
                        db.close();
                    }
                })
            })
        }
        if (product.en) {
            db.collection('product').updateOne({ "productNumber": product.en.productNumber, "languageCode": product.en.languageCode }, {
                $set: product.en,
                $currentDate: { "lastModified": true }
            });

            let sid = product.en.subcategory.subcategoryId;
            mongoClient.connect(mogoUrl, function(err, db) {
                db.collection('productlist').find({ subcategoryId: sid, languageCode: 'USA' }).toArray(function(err, doc) {
                    if (err) {
                        db.close();
                    } else if (!doc || doc.length == 0) {
                        db.close();

                    } else {
                        let data = doc[0];
                        let products = Object.assign([], data.products);
                        products.map((child, index) => {
                            if (child.productId === product.en.productId) {
                                child.productImage = product.en.productImages;
                                child.prodcutTitle = product.en.prodcutTitle;
                                child.productDescription = product.en.productDescription;
                            }
                        })

                        db.collection('productlist').updateOne({ "subcategoryId": sid, "languageCode": product.en.languageCode }, {
                            $set: { products: products },
                            $currentDate: { "lastModified": true }
                        });
                        db.close();
                    }
                })
            })
        }
    })
}

function updateNews(req, res, news) {
    mongoClient.connect(mogoUrl, function(err, db) {
        if (news.zh) {
            db.collection('news').updateOne({ "newsNumber": news.zh.newsNumber, "languageCode": news.zh.languageCode }, {
                $set: news.zh,
                $currentDate: { "lastModified": true }
            });
        }
        if (news.en) {
            db.collection('news').updateOne({ "newsNumber": news.en.newsNumber, "languageCode": news.en.languageCode }, {
                $set: news.en,
                $currentDate: { "lastModified": true }
            });
        }

        db.close();
    })
}

function updateMenu(req, res, productlist, menu) {
    mongoClient.connect(mogoUrl, function(err, db) {
        if (productlist.zh) {
            db.collection('productlist').updateOne({ "subcategoryId": productlist.zh.subcategoryId, "languageCode": productlist.zh.languageCode }, {
                $set: productlist.zh,
                $currentDate: { "lastModified": true }
            });
            let nid = menu.zh.navigationId;
            if (nid) {
                mongoClient.connect(mogoUrl, function(err, db) {
                    db.collection('navigation').find({ navigationId: nid, languageCode: 'CHN' }).toArray(function(err, doc) {
                        if (err) {
                            db.close();
                        } else if (!doc || doc.length == 0) {
                            let menus = {};
                            let subcategorys = [];
                            menus.navigationId = nid;
                            menus.tabId = menu.zh.tabId;
                            menus.tabName = menu.zh.tabName;
                            menus.categoryName = menu.zh.categoryName;
                            menus.priority = menu.zh.priority;
                            menus.languageCode = menu.zh.languageCode;
                            subcategorys.push({
                                "sid": productlist.zh.subcategoryId,
                                "subcategoryName": productlist.zh.subcategoryName
                            })
                            menus.subcategorys = subcategorys;
                            db.collection('navigation').insertOne(menus);
                            db.close();

                        } else {
                            let data = doc[0];
                            let subcategorys = Object.assign([], data.subcategorys);
                            let needPush = true;
                            subcategorys.map((child, index) => {
                                if (child.sid === productlist.zh.subcategoryId) {
                                    // child.subcategoryName = productlist.zh.subcategoryName;
                                    needPush = false;
                                }
                            })
                            if (needPush) {
                                subcategorys.push({
                                    "sid": productlist.zh.subcategoryId,
                                    "subcategoryName": productlist.zh.subcategoryName
                                })
                            }

                            db.collection('navigation').updateOne({ navigationId: nid, "languageCode": 'CHN' }, {
                                $set: { subcategorys: subcategorys, priority: menu.zh.priorit },
                                $currentDate: { "lastModified": true }
                            });
                            db.close();
                        }
                    })
                })
            }
        }
        if (productlist.en) {
            db.collection('productlist').updateOne({ "subcategoryId": productlist.en.subcategoryId, "languageCode": productlist.en.languageCode }, {
                $set: productlist.en,
                $currentDate: { "lastModified": true }
            });
            let nid = menu.en.navigationId;
            if (nid) {

                mongoClient.connect(mogoUrl, function(err, db) {
                    db.collection('navigation').find({ navigationId: nid, languageCode: 'USA' }).toArray(function(err, doc) {
                        if (err) {
                            db.close();
                        } else if (!doc || doc.length == 0) {
                            let menus = {};
                            let subcategorys = [];
                            menus.navigationId = nid;
                            menus.tabId = menu.en.tabId;
                            menus.tabName = menu.en.tabName;
                            menus.categoryName = menu.en.categoryName;
                            menus.priority = menu.en.priority;
                            menus.languageCode = menu.en.languageCode;
                            subcategorys.push({
                                "sid": productlist.en.subcategoryId,
                                "subcategoryName": productlist.en.subcategoryName
                            })
                            menus.subcategorys = subcategorys;
                            db.collection('navigation').insertOne(menus);
                            db.close();

                        } else {
                            let data = doc[0];
                            let subcategorys = Object.assign([], data.subcategorys);
                            let needPush = true;
                            subcategorys.map((child, index) => {
                                if (child.sid === productlist.en.subcategoryId) {
                                    // child.subcategoryName = productlist.zh.subcategoryName;
                                    needPush = false;
                                }
                            })
                            if (needPush) {
                                subcategorys.push({
                                    "sid": productlist.en.subcategoryId,
                                    "subcategoryName": productlist.en.subcategoryName
                                })
                            }

                            db.collection('navigation').updateOne({ navigationId: nid, "languageCode": 'USA' }, {
                                $set: { subcategorys: subcategorys, priority: menu.en.priorit },
                                $currentDate: { "lastModified": true }
                            });
                            db.close();
                        }
                    })
                })
            }
        }

        db.close();
    })
}

function deleteItem(req, res) {
    mongoClient.connect(mogoUrl, function(err, db) {
        db.collection('product').remove({ productNumber: req.query.productNumber });
        res.send({ status: "succeed" });
        // db.close();
    });

    let sid = req.query.subcategoryId;
    if (sid) {
        mongoClient.connect(mogoUrl, function(err, db) {
            db.collection('productlist').find({ subcategoryId: sid, languageCode: 'CHN' }).toArray(function(err, doc) {
                if (err) {
                    db.close();
                } else if (!doc || doc.length == 0) {
                    db.close();

                } else {
                    let data = doc[0];
                    let products = Object.assign([], data.products);
                    let newsProdcuts = [];
                    products.map((child, index) => {
                        if (child.productNumber !== req.query.productNumber) {
                            newsProdcuts.push(child)
                        }
                    })
                    if (newsProdcuts.length === 0) {
                        db.collection('productlist').remove({ "subcategoryId": sid, "languageCode": 'CHN' });
                    } else {
                        db.collection('productlist').updateOne({ "subcategoryId": sid, "languageCode": 'CHN' }, {
                            $set: { products: newsProdcuts },
                            $currentDate: { "lastModified": true }
                        });
                    }
                    db.close();
                }
            })
        })

        mongoClient.connect(mogoUrl, function(err, db) {
            db.collection('productlist').find({ subcategoryId: sid, languageCode: 'USA' }).toArray(function(err, doc) {
                if (err) {
                    db.close();
                } else if (!doc || doc.length == 0) {
                    db.close();

                } else {
                    let data = doc[0];
                    let products = Object.assign([], data.products);
                    let newsProdcuts = [];
                    products.map((child, index) => {
                        if (child.productNumber !== req.query.productNumber) {
                            newsProdcuts.push(child)
                        }
                    })

                    if (newsProdcuts.length === 0) {
                        db.collection('productlist').remove({ "subcategoryId": sid, "languageCode": 'USA' });
                    } else {
                        db.collection('productlist').updateOne({ "subcategoryId": sid, "languageCode": 'USA' }, {
                            $set: { products: newsProdcuts },
                            $currentDate: { "lastModified": true }
                        });
                    }
                    db.close();
                }
            })
        })
    }

    let tabId = req.query.tabId;
    if (tabId) {
        mongoClient.connect(mogoUrl, function(err, db) {
            db.collection('navigation').find({ tabId: tabId, languageCode: 'CHN' }).toArray(function(err, doc) {
                if (err) {
                    db.close();
                } else if (!doc || doc.length == 0) {
                    db.close();

                } else {
                    let data = doc[0];
                    let subcategorys = Object.assign([], data.subcategorys);
                    let newsSubcategorys = [];
                    subcategorys.map((child, index) => {
                        if (child.sid !== req.query.subcategoryId) {
                            newsSubcategorys.push(child)
                        }
                    })
                    if (newsSubcategorys.length === 0) {
                        db.collection('navigation').remove({ "tabId": tabId, "languageCode": 'CHN' });
                    } else {
                        db.collection('navigation').updateOne({ "tabId": tabId, "languageCode": 'CHN' }, {
                            $set: { subcategorys: newsSubcategorys },
                            $currentDate: { "lastModified": true }
                        });
                    }
                    db.close();
                }
            })
        })
        mongoClient.connect(mogoUrl, function(err, db) {
            db.collection('navigation').find({ tabId: tabId, languageCode: 'USA' }).toArray(function(err, doc) {
                if (err) {
                    db.close();
                } else if (!doc || doc.length == 0) {
                    db.close();

                } else {
                    let data = doc[0];
                    let subcategorys = Object.assign([], data.subcategorys);
                    let newsSubcategorys = [];
                    subcategorys.map((child, index) => {
                        if (child.sid !== req.query.subcategoryId) {
                            newsSubcategorys.push(child)
                        }
                    })
                    if (newsSubcategorys.length === 0) {
                        db.collection('navigation').remove({ "tabId": tabId, "languageCode": 'USA' });
                    } else {
                        db.collection('navigation').updateOne({ "tabId": tabId, "languageCode": 'USA' }, {
                            $set: { subcategorys: newsSubcategorys },
                            $currentDate: { "lastModified": true }
                        });
                    }
                    db.close();
                }
            })
        })
    }
}

function deleteNews(req, res) {
    mongoClient.connect(mogoUrl, function(err, db) {
        db.collection('news').remove({ newsNumber: req.query.newsNumber });
        res.send({ status: "succeed" });
        db.close();
    });
}

//fuge
function findUser(req, res, type = 'normal', data) {
    if (typeof data === 'string') {
        data = JSON.parse(data);
    }
    // for(var i in data){
    // 	console.log('laiba', i)
    // }
    mongoClient.connect(mogoUrl, function(err, db) {
        var cursor = db.collection('user').find({ "userId": req.query.userId }).toArray(function(err, doc) {
            if (doc != null && doc.length != 0) {
                if (type === 'normal') {
                    // res.send(doc);
                } else if (type === 'createUser') {
                    // res.send(doc);
                }
            } else {
                if (type === 'createUser') {
                    db.collection('user').insertOne({
                        "userId": `u_${new Date().getTime()}`,
                        "name": req.query.name,
                        "phoneNumber": req.query.phoneNumber,
                        "password": req.query.password,
                        "time": new Date(),
                        "status": req.query.status,
                    });
                    res.send({ status: 'succeed' });
                } else {
                    // res.send("failed");
                }
            }
            db.close();
        });
    });
}

function deleteUser(req, res) {
    mongoClient.connect(mogoUrl, function(err, db) {
        db.collection('user').remove({ userId: req.query.userId });
        res.send({ status: "succeed" });
        db.close();
    });
}

function findUserDetail(req, res) {
    mongoClient.connect(mogoUrl, function(err, db) {
        var cursor = db.collection('user').find({ "name": req.query.userName }).toArray(function(err, doc) {
            if (doc != null && doc.length != 0) {
                res.send(doc)
            } else {
                res.send({ status: 'failed' })
            }
            db.close();
        });
    });
}

function findAllUser(req, res) {
    mongoClient.connect(mogoUrl, function(err, db) {
        var cursor = db.collection('user').find().toArray(function(err, doc) {
            if (doc != null && doc.length != 0) {
                res.send(doc);
            } else {
                res.send("failed");
            }
            db.close();
        });
    });
}

function createUser(req, res, data) {
    findUser(req, res, 'createUser', data);
}

function updateUser(req, res) {
    var params = {
        status: req.query.status,
        phoneNumber: req.query.phoneNumber,
        password: req.query.password,
        name: req.query.name,
        job: req.query.job
    }
    mongoClient.connect(mogoUrl, function(err, db) {
        db.collection('user').updateOne({ "userId": req.query.userId }, {
            $set: params,
            $currentDate: { "lastModified": true }
        });
        res.send({ status: "succeed" });
        db.close();
    });
}


module.exports.findUser = findUser;
module.exports.findAllUser = findAllUser;
module.exports.findUserDetail = findUserDetail;
module.exports.createUser = createUser;
module.exports.checkUserExists = checkUserExists;
module.exports.deleteUser = deleteUser;
module.exports.updateUser = updateUser;

module.exports.getNavigation = getNavigation;
module.exports.getProductlist = getProductlist;
module.exports.getProductDetail = getProductDetail;
module.exports.getNews = getNews;
module.exports.getAllNews = getAllNews;
module.exports.createItem = createItem;
module.exports.getProductDetailApi = getProductDetailApi;
module.exports.updateItem = updateItem;
module.exports.deleteItem = deleteItem;
module.exports.createNews = createNews;
module.exports.getNewsDetailApi = getNewsDetailApi;
module.exports.updateNews = updateNews;
module.exports.deleteNews = deleteNews;
module.exports.getProductlistApi = getProductlistApi;
module.exports.updateMenu = updateMenu;
module.exports.remove = remove;
module.exports.removeNavigation = removeNavigation;