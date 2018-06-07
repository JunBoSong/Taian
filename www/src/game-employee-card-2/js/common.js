var request = {
    shareConfig: { //分享
        title: ' ',
        content: ' ',
        linkIcon: ' ',
        linkUrl: '',
        shareSuccess: function() {}
    },


    url: {
        'getJsApiAuth': baseUrl + '/wechat/getJsApiAuth', //获取分享参数
        'imgUploadByBase64': uoloadBaseUrl + '/moses/upload/file/imgUploadByBase64', //上传图片
    },
    code: {
        ok: 1000
    },
    data: {
        "token": getQueryString('token')
    },
    method: {
        post: function(url, paramter, callBack, a) {
            // $('.loading').show();
            $.ajax({
                cache: false,
                dataType: "JSON",
                type: "POST",
                async: a,
                url: url,
                contentType: "application/json", //必须有
                data: JSON.stringify(paramter),
                success: function(result) {
                    if (callBack) {
                        callBack(result);
                    }
                },
                error: function(msg) {

                }
            })
        },
        get: function(url, callBack, a) {
            $.ajax({
                cache: false,
                type: "GET",
                async: a,
                url: url,
                success: function(result) {
                    if (callBack) {
                        callBack(result);
                    }
                },
                error: function(msg) {

                }
            })
        },
        uploadBybase64: function(url, paramter, callBack) {
            $.ajax({
                cache: false,
                type: "post",
                url: url,
                data: JSON.stringify(paramter),
                contentType: "application/json", //必须有
                success: function(result) {
                    if (callBack) {
                        callBack(result);
                    }
                },
                error: function(msg) {

                }
            })
        }
    }
}

function wxConfig(params, showMenu) {
    var shareData = params;
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: shareData.appId, // 必填，公众号的唯一标识
        timestamp: shareData.timestamp, // 必填，生成签名的时间戳
        nonceStr: shareData.nonceStr, // 必填，生成签名的随机串
        signature: shareData.signature, // 必填，签名，见附录1
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
    wx.ready(function() {
        if (showMenu) {
            wx.showOptionMenu();
        } else {
            wx.hideOptionMenu();
        }

        wx.onMenuShareTimeline({
            title: request.shareConfig.title, // 分享标题
            link: request.shareConfig.linkUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: request.shareConfig.linkIcon, // 分享图标
            success: request.shareConfig.shareSuccess
        });
        wx.onMenuShareAppMessage({
            title: request.shareConfig.title, // 分享标题
            desc: request.shareConfig.content, // 分享描述
            link: request.shareConfig.linkUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: request.shareConfig.linkIcon, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: request.shareConfig.shareSuccess
        });
        wx.onMenuShareQQ({
            title: request.shareConfig.title, // 分享标题
            desc: request.shareConfig.content, // 分享描述
            link: request.shareConfig.linkUrl, // 分享链接
            imgUrl: request.shareConfig.linkIcon, // 分享图标
            success: request.shareConfig.shareSuccess
        });
        wx.onMenuShareWeibo({
            title: request.shareConfig.title, // 分享标题
            desc: request.shareConfig.content, // 分享描述
            link: request.shareConfig.linkUrl, // 分享链接
            imgUrl: request.shareConfig.linkIcon, // 分享图标
            success: request.shareConfig.shareSuccess
        });
        wx.onMenuShareQZone({
            title: request.shareConfig.title, // 分享标题
            desc: request.shareConfig.content, // 分享描述
            link: request.shareConfig.linkUrl, // 分享链接
            imgUrl: request.shareConfig.linkIcon, // 分享图标
            success: request.shareConfig.shareSuccess
        });
    });

}



function _setShareData(showMenu) { //查询分享信息
    var r = request;
    r.method.post(r.url.getJsApiAuth, { pageUrl: location.href.split('#')[0] }, function(res) {
        if (res.returnCode == r.code.ok) {
            if (isWeixin()) {
                var times = 1;
                var inter = window.setInterval(function() {
                    times++;
                    wxConfig(res.dataInfo, showMenu)
                    if (times == 10) {
                        window.clearInterval(inter);
                    }
                }, 200);
            } else {
                r.shareConfig = res.dataInfo;
            }
        } else {
            layer.open({
                title: '温馨提示',
                content: res.message,
                btn: '确定'
            });
        }
    })
}

function isWeixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}


//时间戳转换成时间格式
function timestampToTime(timestamp) {
    if (timestamp.toString().length == 10) { //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var date = new Date(timestamp * 1000);
    } else {
        var date = new Date(timestamp);
    }
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = date.getDate() + ' ';
    // h = date.getHours() + ':';
    // m = date.getMinutes() + ':';
    // s = date.getSeconds();
    return Y + M + D;
}

//验证手机号码
function valiPhone(phone) {
    phone = phone ? phone : '';
    var reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
    if (!reg.test(phone)) { //如果格式不对
        return false;
    }
    return true;
}


//获取当前日期
function getCurrentDate() {
    var now = new Date();
    var year = now.getFullYear(); //年
    var month = now.getMonth() + 1; //月
    var day = now.getDate(); //日
    return year + '/' + month + '/' + day;
}

function formatTime(time, fmt) { //YYYY-MM-DD
    var date = new Date(time);
    if (/(Y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, date.getFullYear() + '').substr(4 - RegExp.$1.length)
    }
    var o = {
        'M+': date.getMonth() + 1,
        'D+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    }
    for (var key in o) {
        if (new RegExp('(' + key + ')').test(fmt)) {
            var str = o[key] + ''
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
        }
    }
    return fmt
}

function padLeftZero(str) {
    return ('00' + str).substr(str.length)
}

function filterPageConf(params) {
    var obj = {};
    if (Object.prototype.toString.call(params) !== '[object Array]') {
        return layer.open({
            content: '页面配置参数应为数组',
            btn: '确定'
        });
    }
    params.forEach(function(item) {
        obj[item.propertyCode] = item.content
    }, this);
    return obj;
}

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function getQueryObj() {
    var url = window.location.search;
    var obj = {};
    var reg = /[?&][^?&]+=[^?&]+/g;
    var arr = url.match(reg);
    if (arr) {
        arr.forEach(function(item) {
            var tempArr = item.substring(1).split('=');
            var key = decodeURIComponent(tempArr[0]);
            var val = decodeURIComponent(tempArr[1]);
            obj[key] = val;
        });
        return obj;
    }
    return null;
}