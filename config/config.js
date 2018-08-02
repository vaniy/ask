module.exports = {
    wx_config: {
        aotu: {
            EncodingAESKey:'OYWlhtupSkI9zwS2QZFwK5cRMghZRxQnS7jCK2S4nLs',
            token: 'taduoke',
            appid: 'wxde7efc12d725e8b3',
            secret: '2d963e3071adcc1996bde5f8fbc97ea5',
            cached: {},
            menu: {
                "button": [{
                    "type": "view",
                    "name": "减肥产品",
                    "url": "http://www.taduoke.com/order"
                }, {
                    "name": "会员平台",
                    "sub_button": [{
                        "type": "view",
                        "name": "打卡记录",
                        "url": "http://www.taduoke.com/clockIndex"
                    }, {
                        "type": "view",
                        "name": "个人中心",
                        "url": "http://www.taduoke.com/account"
                    }]
                }]
            }
        },
        tq: {
            "ipURL": "http://whois.pconline.com.cn/ipJson.jsp?json=true",
            "ipToCityNameURL": "http://apis.baidu.com/apistore/iplookupservice/iplookup?ip=",
            "ipToCityNameApiKey": "7328474baf90532437b4becdc5f65706",
            'cityUrl': 'http://apistore.baidu.com/microservice/cityinfo?cityname=',
            'weatherApikey': '7328474baf90532437b4becdc5f65706',
            'weatherUrl': 'http://apis.baidu.com/apistore/weatherservice/recentweathers?cityid='
        }
    }
};