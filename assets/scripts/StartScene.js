cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        oauthLoginServer: 'http://sandbox-s1.chinacloudapp.cn:3000/Login',
        appKey: '69A16BA4-6AE6-E8E8-0078-80E6C2182195',
        appSecret: 'bd2f2cbf1fcafd81459e97732ffc4a41',
        privateKey: 'E79D311B958876683851CD117D3B44B8'
    },
    
    onLoad: function () {
        if (cc.sys.isMobile) {
            try {
                this.agentManager = anysdk.agentManager;
                this.agentManager.init(this.appKey, this.appSecret, this.privateKey, this.oauthLoginServer);
                this.userPlugin = this.agentManager.getUserPlugin();
                if (this.userPlugin) {
                    this.userPlugin.setListener(this.onUserResult, this);
                }
            } catch (e) {
                this.label.string = 'some error happen';
            }
        } else {
            this.label.string = 'not a mobile device';
        }
    },
    
    onLogin: function () {
        if (this.userPlugin) {
            this.userPlugin.login();
        }
    },
    
    onUserResult: function onUserResult(code, msg) {
        switch (code) {
            case anysdk.UserActionResultCode.kInitSuccess:
                // this.label.string = '用户系统初始化成功';
                this.label.string = '数星星游戏';
                break;
            case anysdk.UserActionResultCode.kInitFail:
                this.label.string = '用户系统初始化失败';
                break;
            case anysdk.UserActionResultCode.kLoginSuccess:
                this.label.string = '用户系统登录成功';
                cc.director.loadScene('PlayScene');
                break;
            case anysdk.UserActionResultCode.kLoginNetworkError:
                this.label.string = '用户系统网络错误';
                break;
            case anysdk.UserActionResultCode.kLoginNoNeed:
                this.label.string = '用户系统无需登录';
                break;
            case anysdk.UserActionResultCode.kLoginFail:
                this.label.string = '账户登录出错,请重新登录';
                break;
            case anysdk.UserActionResultCode.kLoginCancel:
                this.label.string = '账户取消登录';
                break;
            default:
                this.label.string = '其他';
                break;
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
