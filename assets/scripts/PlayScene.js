cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        checkLabel: {
            default: null,
            type: cc.Label
        },
        checkRadius: {
            default: 60
        },
        oauthLoginServer: 'http://sandbox-s1.chinacloudapp.cn:3000/Login',
        appKey: '69A16BA4-6AE6-E8E8-0078-80E6C2182195',
        appSecret: 'bd2f2cbf1fcafd81459e97732ffc4a41',
        privateKey: 'E79D311B958876683851CD117D3B44B8'
    },

    // use this for initialization
    onLoad: function () {
        this.star = this.node.getChildByName('star');
        this.score = 0;
        this._spawnNewStar();
        var self = this;
        var listener = {
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                var posTouch = target.convertToNodeSpace(touch.getLocation());
                var dis = cc.pDistance(posTouch, self.star);
                if (dis <= self.checkRadius) {
                    self._spawnNewStar();
                    self.score += 1;
                    self.label.string = '获得星星数量：' + self.score;
                }
                return true;
            },
        };
        cc.eventManager.addListener(listener, this.node);
        if (cc.sys.isMobile) {
            try {
                this.agentManager = anysdk.agentManager;
                this.agentManager.init(this.appKey, this.appSecret, this.privateKey, this.oauthLoginServer);
                this.sharePlugin = this.agentManager.getSharePlugin();
                if (this.sharePlugin) {
                    this.sharePlugin.setListener(this.onShareResult, this);
                }
            } catch (e) {
                this.checkLabel.string = 'some error happen';
            }
        } else {
            this.checkLabel.string = 'not a mobile device';
        }
    },
    
    _spawnNewStar: function () {
        var x = (Math.random() * this.node.width - this.node.width/2) * 0.9;
        var y = (Math.random() * this.node.height - this.node.height/2) * 0.9;
        this.star.setPosition(cc.p(x, y));
    },
    
    onShare: function share() {
        if (this.sharePlugin) {
            var info = {
                'title': 'Counting Star', // 标题名称
                'titleUrl': 'http://www.cocos.com', // 标题链接
                'site': 'Counting Star', // 标题网站名
                'siteUrl': 'http://www.cocos.com', // 标题网站链接
                'text': 'Counting Star -- 数星星益智类游戏', //分享内容
                'comment': '无', //评论
                'description': 'Counting Star -- 数星星益智类游戏', //描述
                'imageTitle': 'Counting Star', //图片标题
                'imageUrl': 'http://veewo.com/promo/img/darkslash_web_web_banner.png', //分享图片链接
                'url': 'http://www.veewo.com/games/?name=darkslash' };
            //分享链接
            this.sharePlugin.share(info);
        }
    },
    
    onShareResult: function onShareResult(code, msg) {
        switch (code) {
            case anysdk.ShareResultCode.kShareSuccess:
                this.checkLabel.string = '分享系统分享成功';
                break;
            case anysdk.ShareResultCode.kShareFail:
                this.checkLabel.string = '分享系统分享失败';
                break;
            case anysdk.ShareResultCode.kShareCancel:
                this.checkLabel.string = '分享系统分享取消';
                break;
            case anysdk.ShareResultCode.kShareNetworkError:
                this.checkLabel.string = '分享系统分享网络出错';
                break;
            default:
                this.checkLabel.string = '分享系统其他';
                break;
        }
    }
    
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
