$(function() {
    var openIdStr = getQueryString('openId');
    //抽奖查询
    _prizeRecord();

    //获取微信 js-sdk 签名信息
    _setShareData(false);

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
                    }
                });
            } else {
                layer.open({
                    title: '<span style="margin-top:20px;display: block;">温馨提示<span>',
                    content: res.message,
                    btn: '确定',
                    yes: function() {
                        location.reload();
                    }
                });
            }
        })
    }

    function _prizeRecord() {
        var r = request;
        r.method.post(r.url.prizeRecord, { openId: openIdStr }, function(res) {
            if (res.returnCode == r.code.ok) {
                if (res.records && res.records instanceof Array) {
                    if (res.records.length > 0) {
                        res.records.forEach(element => {
                            var t = timestampToTime(parseInt(element.createdTime));
                            var tips = '';
                            var c = '';
                            if (element.state == '1') {
                                tips = '立即领取';
                            } else if (element.state == '2') {
                                tips = '已领取';
                                c = 'btn-unvalid';
                            } else if (element.state == '3') {
                                tips = '已过期';
                                c = 'btn-unvalid';
                            }
                            var str = ` <li class="item">
                    <img src="../game-jww-taiAn/images/avator.png" class="avator" alt="用户头像" />
                    <div class="info">
                        <p class="info-name">${element.number}MB流量券</p>
                        <p class="info-counter">中奖时间：${t}</p>
                    </div>
                    <button type="button" class="btn-send ${c}" peiceId=${element.id} state=${element.state}>${tips}</button>
                </li>`;
                            $('.content ul').append(str);
                        });

                        $(".btn-send").on('click', function() {
                            var peiceId = $(this).attr("peiceId");
                            var state = $(this).attr("state");
                            if (state == 1) {
                                _claimPrize(peiceId);
                            }

                        })
                    }
                }
            } else if (res.returnCode == 1002) {

            } else {
                layer.open({
                    title: '<span style="margin-top:20px;display: block;">温馨提示<span>',
                    content: res.message,
                    btn: '确定'
                });
            }
        })
    }

})