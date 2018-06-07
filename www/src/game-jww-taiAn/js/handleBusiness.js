$(function() {

    //获取微信 js-sdk 签名信息
    _setShareData(false);

    var origin = window.location.origin;
    //积分咪咕视频兑换
    $('#convert').on('click', function() {
        if (origin.indexOf("prod") != -1) { //正式环境
            window.location = 'http://yd.clouds.sd.chinamobile.com/xyyd/newh5/#/packageList?storeid=14479443&Ctype=7&id=777&marketType=1';
        } else {
            window.location = 'http://sdh5.vpclub.cn/#/businesDetails?id=5606&storeid=14462585';
        }
    })

    //流量升级
    $('#flow').on('click', function() {
        if (origin.indexOf("prod") != -1) { //正式环境
            window.location = 'http://dx.10086.cn/sARvUbm';
        } else {
            window.location = 'http://sdh5.vpclub.cn/#/businesDetails?id=5605&Ctype=5&storeid=14462585';
        }

    })
})