$(function() {
    var arm;
    var time = null; //计时器
    var $add = $('.page-add'); //广告帘
    var $arm = $('.arm'); //摇臂
    var $armString = $('.arm-string'); //摇臂轴
    var $luckyRabbit = $('.lucky-rabbit'); //中奖的兔子
    var openIdStr = getQueryString('openId');
    var amount = 5; //剩余抽奖次数
    var isBinded = false;

    //是否已经绑定
    _queryByOpenId();

    var pageUrlArr = window.location.href.split('?');
    // 配置分享信息
    var r = request;
    r.shareConfig.title = '泰安移动新福利上线！夹娃娃送流量！！';
    r.shareConfig.content = '男神女神都在玩，夹到娃娃就送流量！泰安移动重金“千万”悬赏夹娃娃大神！';
    r.shareConfig.linkIcon = 'https://prod.vpclub.cn/group1/M00/00/FE/wKgAGFpxpk2APYM7AAB4zFhTrKY083.png';
    r.shareConfig.linkUrl = pageUrlArr[0];
    r.shareConfig.shareSuccess = function() { //分享成功回调
        var currentDate = getCurrentDate();
        if (!localStorage.currentDate || localStorage.currentDate != currentDate) { //今日首次
            if (isBinded) {
                _addLotteryCount();
                localStorage.currentDate = currentDate;
            }
        }
    }

    //获取微信 js-sdk 签名信息
    _setShareData(true);

    $('.btn-lucky').on('click', function() { //夹==爪子下降
        $arm.addClass('paused')
        clearInterval(time);
        var timer = setTimeout(function() { //延迟100ms是为了保障更加自然
            clearTimeout(timer);
            $armString.addClass('down');
        }, 100);
    })

    $armString.on('transitionend webkitTransitionEnd', function(e) {

        if ($armString.hasClass('down')) { //钩子到底了
            _luckDraw();
        } else { //钩子抓完
        }

    })
    $('#startGame').on('click', function() { //开始游戏
        //链接由公众号进入会在链接上带上openId 参数，证明已经关注公众号，分享出去的链接上不带openId ,证明未关注公众号
        if (!openIdStr) {
            showQrcode();
            return
        }
        if (amount < 1) { //抽奖机会已经用完
            nochance();
            return;
        }
        if (isBinded) { //
            $add.hide();
            $arm.addClass('moveAnimtion');
            timer();
            _queryCountDrawByOpenId();
        } else {
            sendInfo();
        }
    })

    $('#handleBusiness').on('click', function() { //办理业务，游戏机会+10
        var urlArr = window.location.href.split('game-jww-taiAn');
        window.location = urlArr[0] + 'game-jww-taiAn/' + 'handleBusiness.html';
    })

    $('.go-my-rabbits').on('click', function() { //查看我的娃娃
        var urlArr = window.location.href.split('game-jww-taiAn');
        window.location = urlArr[0] + 'game-jww-taiAn/' + 'myrabbits.html?openId=' + openIdStr;
    })


    function timer() { //计时器
        var $timer = $('.timer-text');
        var t = 30;
        var text = '';
        clearInterval(time);
        time = setInterval(function() {
            t--;
            text = '00:' + (t < 10 ? '0' + t : t);
            $timer.text(text);
            if (t === 0) { //倒计时结束不点默认失败
                // $('.btn-lucky').trigger('click');
                $arm.addClass('paused')
                outTime();
                clearInterval(time);
            }

        }, 1000)
    }

    //未关注弹出二维码提示
    function showQrcode() {
        layer.open({
            content: '<img src="../game-jww-taiAn/images/taiAn-public-qrcode.png" style="width:100%"/>',
        })
    }

    function lucky(luckyName, priceId) { //中奖
        layer.open({
            titleImg: './images/msg_star.png',
            title: '<span style="margin-top:20px;display: block;">恭喜您夹到流量娃娃，内含<span>',
            content: '<span style="font-size: 0.46rem;color: #333;font-weight: 600;">' + luckyName + 'MB流量券' + '</span>',
            btn: ['领取'],
            yes: function() {
                _claimPrize(priceId);
                console.log('领取')
            },
            end: function() { //弹窗关闭回调
                location.reload();
            }
        })
    }

    function nochance() { //机会用完
        layer.open({
            titleImg: './images/msg_sweaty.png',
            title: '<span style="margin-top:20px;display: block;">您今天夹娃娃的机会已经用完<span>',
            content: '<span style="font-size: 0.3rem;color: #333;">每日首次分享给好友可多获得3次机会，办理业务可获得10次机会</span>',
            btn: ['立即办理'],
            yes: function() {
                var urlArr = window.location.href.split('game-jww-taiAn');
                window.location = urlArr[0] + 'game-jww-taiAn/' + 'handleBusiness.html';
                console.log('立即办理')
            },
            end: function() { //弹窗关闭回调
                console.log('弹窗关闭了')
                location.reload();
            }
        })
    }

    function unLucky() { //没有中奖
        layer.open({
            titleImg: './images/msg_sweaty.png',
            title: '<span style="margin-top:20px;display: block;">差一点就夹到了<span>',
            content: '<span style="font-size: 0.3rem;color: #333;">熟能生巧，再试试吧</span>',
            btn: ['再玩一次'],
            yes: function() {
                $add.show()
                $luckyRabbit.css('visibility', 'hidden')
                console.log('再玩一次')
                location.reload();
            },
            end: function() { //弹窗关闭回调
                location.reload();
            }
        })
    }

    function outTime() { //超时未夹
        layer.open({
            titleImg: './images/msg_sweaty.png',
            content: '<span style="font-size: 0.3rem;color: #333;">好可惜啊，该出手时就出手，再试试吧</span>',
            btn: ['再玩一次'],
            yes: function() {
                $add.show()
                $luckyRabbit.css('visibility', 'hidden')
                console.log('再玩一次')
                location.reload();
            },
            end: function() { //弹窗关闭回调
                location.reload();
            }
        })
    }

    function sendInfo() {

        var str = '<p style="font-size: 0.3rem;color:#666;">登记手机号，成功后才能领取流量</p>\
                  <div style="width: 4.8rem;height: 0.9rem;line-height: 0.9rem;margin: 0.5rem auto 0;border:1px solid #ec2459;border-radius: 0.16rem;">\
                  <input type="tel" id="sendPhone" style="width: 90%;font-size: 0.3rem;border: none; background: none;" maxlength="11" placeholder="请输入泰安移动手机号"/>\
                  </div>'
        layer.open({
            titleImg: './images/msg_star.png',
            title: '<span style="margin-top:20px;display: block;">抓娃娃领流量<span>',
            content: str,
            btn: ['确定'],
            yes: function() {
                var sendPhone = $('#sendPhone').val()
                _bindMobile(sendPhone);
            },
            end: function() { //弹窗关闭回调
            }
        })
    }

    function _bindMobile(phoneNum) { //绑定手机号
        var phoneIsOk = valiPhone(phoneNum);
        if (!phoneIsOk) {
            layer.open({
                title: '<span style="margin-top:20px;display: block;">温馨提示<span>',
                content: '您输入的手机号码格式有误',
                skin: 'msg',
                time: 1.5 //1.5秒后自动关闭
            });
        } else {
            var r = request;
            r.method.post(r.url.bindMobile, { openId: openIdStr, mobile: phoneNum }, function(res) {
                if (res.returnCode == r.code.ok) {
                    layer.open({
                        title: '<span style="margin-top:20px;display: block;">温馨提示<span>',
                        content: '绑定成功',
                        btn: '确定',
                        yes: function() {
                            location.reload();
                        },
                        end: function() { //弹窗关闭回调
                            location.reload();
                        }
                    });
                } else {
                    layer.open({ title: '<span style="margin-top:20px;display: block;">温馨提示<span>', content: res.message, btn: '确定' });
                }
            })
        }

    }

    function _queryByOpenId() { //查询用户是否已经绑定
        var r = request;
        r.method.post(r.url.queryByOpenId, { openId: openIdStr }, function(res) {
            if (res.returnCode == r.code.ok) {
                isBinded = true;
                _queryCountDrawByOpenId();
            } else {
                isBinded = false;
                $('.couter').text('5');
            }
        })
    }

    function _queryCountDrawByOpenId() { //根据 openId 查询抽奖次数
        var r = request;
        r.method.post(r.url.queryCountDrawByOpenId, { openId: openIdStr }, function(res) {
            if (res.returnCode == r.code.ok) {
                $('.couter').text(res.dataInfo.amount);
                amount = res.dataInfo.amount;
            } else {
                layer.open({ title: '<span style="margin-top:20px;display: block;">温馨提示<span>', content: res.message, btn: '确定' });
            }
        })
    }

    //增加抽奖次数
    function _addLotteryCount() {
        var r = request;
        r.method.post(r.url.addLotteryCount, { openId: openIdStr, type: '1' }, function(res) {
            if (res.returnCode == r.code.ok) {
                layer.open({ title: '<span style="margin-top:20px;display: block;">温馨提示<span>', content: '您今日首次分享成功，已额外获得3次夹娃娃机会', btn: '确定' });
                _queryCountDrawByOpenId();
            } else {
                layer.open({ title: '<span style="margin-top:20px;display: block;">温馨提示<span>', content: res.message, btn: '确定' });
            }
        })
    }

    //抽奖
    function _luckDraw() {
        var r = request;
        r.method.post(r.url.luckDraw, { openId: openIdStr }, function(res) {
            $armString.removeClass('down');
            if (res.returnCode == r.code.ok) {
                $luckyRabbit.css('visibility', 'visible')
                _queryCountDrawByOpenId();
                window.setTimeout(function() {
                    lucky(res.dataInfo.number, res.dataInfo.id);
                }, 1500);
            } else if (res.returnCode == 2005) {
                $luckyRabbit.css('visibility', 'hideen')
                _queryCountDrawByOpenId();
                window.setTimeout(function() {
                    unLucky();
                }, 1500);
            } else {
                $luckyRabbit.css('visibility', 'hideen')
                window.setTimeout(function() {
                    layer.open({ title: '<span style="margin-top:20px;display: block;">温馨提示<span>', content: res.message, btn: '确定' });
                }, 1500);
            }
        })
    }


    //领取
    function _claimPrize(priceId) {
        var r = request;
        r.method.post(r.url.claimPrize, { id: priceId }, function(res) {
            if (res.returnCode == r.code.ok) {
                layer.open({
                    title: '<span style="margin-top:20px;display: block;">温馨提示<span>',
                    content: '领取成功',
                    btn: '确定',
                    yes: function() {
                        location.reload();
                    },
                    end: function() { //弹窗关闭回调
                        location.reload();
                    }
                });
            } else {
                layer.open({
                    title: '<span style="margin-top:20px;display: block;">温馨提示<span>',
                    content: res.message,
                    btn: '确定',
                    yes: function() {
                        location.reload();
                    },
                    end: function() { //弹窗关闭回调
                        location.reload();
                    }
                });
            }
        })
    }

})