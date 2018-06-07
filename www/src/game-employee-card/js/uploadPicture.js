$(function() {

    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    });

    //获取微信 js-sdk 签名信息
    _setShareData(false);

    var xxEvents = ('ontouchstart' in window) ? { start: 'touchstart', move: 'touchmove', end: 'touchend' } : { start: 'mousedown', move: 'mousemove', end: 'mouseup' };

    var _z = _z || {};
    _z.card = function() {
        var $nameVal = '', //名称
            $congraturationVal = '', //祝福语
            $manBtn = $('#sureMan'),
            $girlBtn = $('#sureGirl'),
            $sex = 'man'; //选择性别,man:男，girl:女

        var canvas = $('#pic_canvas')[0];
        var stage = new createjs.Stage(canvas);
        var $file = $('#Upload'), // 获取图片
            clearBase64 = '', // 传给后台的图片
            uolploadUrl = ''; // 上传的图片的 url
        var w = 180,
            h = 160,
            imgWidth = 180,
            imgHight = 160,
            imgRadius = 10,
            imgLeft = 0,
            imgTop = 0;
        canvas.width = w;
        canvas.height = h;
        var cphoto_box = new createjs.Container(),
            photoImg = null;

        //获取图片
        function getImg(source) {
            var file = source.target.files[0];
            if (!/image\/\w+/.test(file.type)) {
                alert('上传文件必须为图片');
                return false;
            }
            photoImg = null;
            var URL = window.URL || window.webkitURL;
            var blob = URL.createObjectURL(file);
            var img = new Image();
            img.src = blob;
            img.onload = function() {
                // 判断拍照设备持有方向调整照片角度
                EXIF.getData(img, function() {
                    img.orientation = EXIF.getTag(this, 'Orientation') || 1;
                    $file.val('');
                    updateImg(img);
                });
            };
        }

        (function() {
            //元素手势控制
            var mc = new Hammer.Manager($('#canvsa_i')[0]);
            mc.add(new Hammer.Pinch());
            mc.add(new Hammer.Rotate());
            mc.add(new Hammer.Pan());
            mc.add(new Hammer.Tap());
            var ir = 0;
            mc.on('pinchstart rotatestart panstart', function(e) {
                var x = e.changedPointers[0].clientX,
                    y = e.changedPointers[0].clientY;
                if (!photoImg) return;
                photoImg.i_x = photoImg.x;
                photoImg.i_y = photoImg.y;
                photoImg.i_rotation = photoImg.rotation;
                photoImg.i_scale = photoImg.scaleX;
                ir = e.rotation;
            });

            mc.on('pinchmove rotatemove panmove', function(e) {
                if (!photoImg) return;
                photoImg.x = photoImg.i_x + e.deltaX;
                photoImg.y = photoImg.i_y + e.deltaY;
                var s = photoImg.i_scale + (e.scale - 1);
                if (s < initScale) s = initScale;
                photoImg.scaleX = photoImg.scaleY = s;
                photoImg.rotation = photoImg.i_rotation + e.rotation - ir;
                stage.update();
            });
            mc.on('tap', function() {
                $file.trigger('click');
            })
        })();

        //更新画布
        function updateImg(img) {
            photoImg = new createjs.Bitmap(img);
            cphoto_box.removeAllChildren();
            var iw = img.width,
                ih = img.height;
            if (iw < ih) {
                initScale = h / ih;
            } else {
                initScale = w / iw;
            };
            // 判断拍照设备持有方向调整照片角度
            switch (img.orientation) {
                case 3:
                    photoImg.rotation = 180;
                    break;
                case 6:
                    photoImg.rotation = 90;
                    break;
                case 8:
                    photoImg.rotation = 270;
                    break;
            }
            photoImg.set({
                regX: iw / 2,
                regY: ih / 2,
                x: w / 2,
                y: h / 2,
                scaleX: initScale,
                scaleY: initScale
            });
            var phbg = new createjs.Shape();
            phbg.graphics.f('#fff').dr(0, 0, w, h);
            cphoto_box.addChild(phbg, photoImg);
            stage.update();
            $('#canvsa_i').css('display', 'block');
        };

        // 生成图片
        function generate() {
            uolploadUrl = canvas.toDataURL('image/jpeg', 0.5);
            clearBase64 = uolploadUrl.split(',')[1];
            localStorage.url = uolploadUrl;
            localStorage.sex = $sex;
            localStorage.congraturation = $congraturationVal;
            localStorage.name = $nameVal;
            window.location.href = './compose.html';
        }


        //初始化
        function init() {

            var image = new Image();
            image.src = $('#upload_bg')[0].src;
            image.onload = handlerImageLoad;

            function handlerImageLoad(event) { //等图片加载完再做处理
                var bg = new createjs.Bitmap(event.target);
                bg.scaleX = w / image.width;
                bg.scaleY = h / image.height;

                var mask = new createjs.Shape();
                mask.graphics.f('#fff').dr(imgLeft, imgTop, imgWidth, imgHight);
                cphoto_box.mask = mask; //设置mask 来添加截图区域
                stage.addChild(bg, cphoto_box);
                stage.update();
                $('#canvsa_i').css('display', 'none');
            }

            $file.on('change', getImg);

            //选择男
            $manBtn.on('click', function() {
                $sex = 'man';
                $manBtn.attr("src", './image/sure.png');
                $girlBtn.attr("src", './image/notSure.png');
            })

            //选择女
            $girlBtn.on('click', function() {
                $sex = 'girl';
                $girlBtn.attr("src", './image/sure.png');
                $manBtn.attr("src", './image/notSure.png');
            })

            // 生成工作证
            $('.generate').on('click', function() {
                $nameVal = $('#name').val();
                $congraturationVal = $('#congraturation').val();
                if (!$nameVal) {
                    layer.open({
                        content: '请输入您的姓名',
                        skin: 'msg',
                        time: 2 //1.5秒后自动关闭
                    });
                    return;
                }
                if (!photoImg) {
                    layer.open({
                        content: '先上传照片才能生成工作证哦!',
                        skin: 'msg',
                        time: 2 //1.5秒后自动关闭
                    });
                    return;
                }
                generate();
            })
        }
        init();
    }
    _z.card();
})