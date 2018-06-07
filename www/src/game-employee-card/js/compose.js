/**
 * Created by Administrator on 2017/2/7.
 */
//main.js

var canvas, stage, stageWidth, stageHeight, stageScale, images = {},
    bitmap, cartonImg, postName, bless,
    model = new createjs.EventDispatcher(),
    modelData = {};
var postArr = ['主持人', '会场安保', '吃瓜群众', '导演', '灯光师', '群众演员', '摄影师', '送盒饭的', '特约记者', '音响师'];
var blessArr = [
    '笑容灿烂，声色温暖',
    '守岁,守福,守安康',
    '过年好，万事顺',
    '爱你所爱，行你所行',
    '最美灯光，照亮幸福',
    '迎新春，送祝福',
    '岁岁平安，事事如意',
    '祝好吃好喝不长肉',
    '年年如意、岁岁平安',
    '声声祝福，贺新年',
];


function init() {
    //获取微信 js-sdk 签名信息
    _setShareData(false);

    // var fileId = getQueryString('fileId');
    // if (fileId) { //若fileId 存在，则表示这是分享进来的，分享进来只单独显示一张图片
    //     var url = window.location.origin + '/' + fileId;
    //     $('.final img').attr("src", url);
    //     $('#mainView').css('display', 'none');
    //     goShare(fileId);
    //     return;
    // }

    canvas = document.getElementById("mainView");
    stage = new createjs.Stage(canvas);
    stageBreakHandler();
    getCartoonCharacter();

    //获取微信 js-sdk 签名信息
    _setShareData(false);

    //资源预加载
    var loader = new createjs.LoadQueue(false);
    loader.addEventListener("fileload", handleFileLoad);
    loader.addEventListener("progress", progressHandler);
    loader.addEventListener("complete", completeHandler);
    loader.loadManifest([
        { src: "image/gtmaww.png", id: "bg" },
        { src: "image/gtmaqq.png", id: "mu" },
        { src: "image/gtmaPic.png", id: "stage" },
        { src: "image/gtmaLine.png", id: "line" },
        { src: "image/" + cartonImg, id: "p" },
        { src: "image/card.png", id: "card" },
        { src: "image/name.png", id: "name" },
        { src: "image/kuan.png", id: "kuan" },
        { src: "image/qrcode.png", id: "qrcode" },
    ]);

    createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", stageBreakHandler);
}

//资源加载失败
function handleFileLoad(evt) {
    if (evt.item.type == "image") { images[evt.item.id] = evt.result; }
}

//资源加载进度
function progressHandler(event) {
    var progress = event.progress * 100;
    $('.page_loading span').html(parseInt(progress) + '%');
}

//资源加载完成
function completeHandler(event) {

    event.currentTarget.removeEventListener("fileload", handleFileLoad);
    event.currentTarget.removeEventListener("progress", progressHandler);
    event.currentTarget.removeEventListener("complete", completeHandler);

    bitmap1 = new createjs.Bitmap(images.bg);
    stage.addChild(bitmap1)

    bitmap2 = new createjs.Bitmap(images.stage);
    bitmap2.y = 300;
    stage.addChild(bitmap2)

    bitmap3 = new createjs.Bitmap(images.mu);
    stage.addChild(bitmap3)

    bitmap4 = new createjs.Bitmap(images.line);
    bitmap4.x = 30;
    bitmap4.y = 950;
    stage.addChild(bitmap4)


    bitmap5 = new createjs.Bitmap(images.p);
    bitmap5.x = 30;
    bitmap5.y = 600;
    stage.addChild(bitmap5);

    bitmap6 = new createjs.Bitmap(images.card);
    bitmap6.x = 330;
    bitmap6.y = 600;
    stage.addChild(bitmap6);

    bitmap7 = new createjs.Bitmap(images.name);
    bitmap7.x = 390;
    bitmap7.y = 890;
    bitmap7.scaleX = 0.8;
    bitmap7.scaleY = 0.8;
    stage.addChild(bitmap7);

    var img = new Image();
    img.src = localStorage.url;
    var bitmap8 = new createjs.Bitmap(img);
    bitmap8.x = 420;
    bitmap8.y = 730;
    bitmap8.scaleX = 0.8;
    bitmap8.scaleY = 0.8;

    stage.addChild(bitmap8);

    bitmap9 = new createjs.Bitmap(images.qrcode);
    bitmap9.x = 110;
    bitmap9.y = 970;
    bitmap9.scaleX = 0.3;
    bitmap9.scaleY = 0.3;
    stage.addChild(bitmap9);

    var txt1 = new createjs.Text("HELLO", "40px Times", "#FFFBDB");
    txt1.x = 480; //改变txt  X的坐标（在canvas中距离 左侧 的坐标）  
    txt1.y = 1050; //改变txt  Y的坐标（在canvas中距离 顶部 的坐标）  
    txt1.text = localStorage.congraturation ? localStorage.congraturation : bless; //改变txt的文本内容  
    txt1.textAlign = "center"; //水平居中  
    txt1.textBaseline = "middle"; //垂直居中  
    stage.addChild(txt1);

    var txt6 = new createjs.Text("HELLO", "30px Times", "#FFFBDB");
    txt6.x = 600; //改变txt  X的坐标（在canvas中距离 左侧 的坐标）  
    txt6.y = 1120; //改变txt  Y的坐标（在canvas中距离 顶部 的坐标）  
    txt6.text = '----' + localStorage.name; //改变txt的文本内容  
    txt6.textAlign = "center"; //水平居中  
    txt6.textBaseline = "middle"; //垂直居中  
    stage.addChild(txt6);

    var txt2 = new createjs.Text("HELLO", "24px Times", "#FFFBDB");
    txt2.x = 490; //改变txt  X的坐标（在canvas中距离 左侧 的坐标）  
    txt2.y = 915; //改变txt  Y的坐标（在canvas中距离 顶部 的坐标）  
    txt2.text = "姓名：" + localStorage.name; //改变txt的文本内容  
    txt2.textAlign = "center"; //水平居中  
    txt2.textBaseline = "middle"; //垂直居中  
    stage.addChild(txt2);

    var txt3 = new createjs.Text("HELLO", "24px Times", "#D72014");
    txt3.x = 490; //改变txt  X的坐标（在canvas中距离 左侧 的坐标）  
    txt3.y = 960; //改变txt  Y的坐标（在canvas中距离 顶部 的坐标）  
    txt3.text = "岗位：" + postName; //改变txt的文本内容  
    txt3.textAlign = "center"; //水平居中  
    txt3.textBaseline = "middle"; //垂直居中  
    stage.addChild(txt3);

    var txt4 = new createjs.Text("HELLO", "24px Times", "#FFFBDB");
    txt4.x = 190; //改变txt  X的坐标（在canvas中距离 左侧 的坐标）  
    txt4.y = 1110; //改变txt  Y的坐标（在canvas中距离 顶部 的坐标）  
    txt4.text = '长按保存工作证图片'; //改变txt的文本内容  
    txt4.textAlign = "center"; //水平居中  
    txt4.textBaseline = "middle"; //垂直居中  
    stage.addChild(txt4);

    var txt5 = new createjs.Text("HELLO", "24px Times", "#FFFBDB");
    txt5.x = 190; //改变txt  X的坐标（在canvas中距离 左侧 的坐标）  
    txt5.y = 1145; //改变txt  Y的坐标（在canvas中距离 顶部 的坐标）  
    txt5.text = '关注“青春泰安”发祝福'; //改变txt的文本内容  
    txt5.textAlign = "center"; //水平居中  
    txt5.textBaseline = "middle"; //垂直居中  
    stage.addChild(txt5);

    stage.update();
    $('.page_loading').css('display', 'none');
    window.setTimeout(function() {
        composegenerate();
    }, 1000)
}

//根据性别随机生成卡通人物
function getCartoonCharacter() {
    var sex = localStorage.sex;
    var randomNum = Math.floor(Math.random() * 10);
    cartonImg = randomNum + '_' + sex + '.png';
    postName = postArr[randomNum];
    bless = blessArr[randomNum];
}

function stageBreakHandler(event) {
    if (stageWidth != document.documentElement.clientWidth || stageHeight != document.documentElement.clientHeight) {
        stageWidth = document.documentElement.clientWidth;
        stageHeight = document.documentElement.clientHeight;
        debugger

        stageScale = stageWidth / 750;
        canvas.style.width = 750 * stageScale + 'px';
        canvas.style.height = 1206 * stageScale + 'px';
    }
    stage.update();
}


// 合成图片,添加到img 的 src 之后可长按保存图片、识别二维码、发送给好友
function composegenerate() {
    var uolploadUrl = canvas.toDataURL('image/jpeg', 0.5);
    clearBase64 = uolploadUrl.split(',')[1];
    $('.final img').attr("src", uolploadUrl);
    // uploadImageBybase64(clearBase64, 'employeeCard');
}

//上传图片
function uploadImageBybase64(base64String, fileNameStr) {
    var r = request;
    r.method.uploadBybase64(r.url.imgUploadByBase64, { fileData: base64String, fileName: fileNameStr }, function(res) {
        if (res.returnCode == r.code.ok) {
            var fileId = res.dataInfo.fileId;
            var url = res.dataInfo.url;
            $('.final img').attr("src", url);
            // goShare(fileId);
        } else {
            alert('图片上传报错');
        }
    })
}

//去分享
function goShare(fileId) {
    var r = request;
    r.shareConfig.title = '工作证分享标题';
    r.shareConfig.content = '工作证分享描述';
    r.shareConfig.linkIcon = 'https://prod.vpclub.cn/group1/M00/00/FE/wKgAGFpxpk2APYM7AAB4zFhTrKY083.png';
    r.shareConfig.linkUrl = window.location.href + '?' + 'fileId=' + fileId;
    r.shareConfig.shareSuccess = function() { //分享成功回调
        alert('分享成功');
    }
}