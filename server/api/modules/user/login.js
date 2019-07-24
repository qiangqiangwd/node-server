
/**
 * === 登录接口 ===
 */
let { aseEncode } = require('../../../public/crypto');
function login(req, res){
    // let params = getQuery(req); // get 获取参数（同步获取）
    let User = new this.cqqSql({
        name:'user',
        notShow: ['psd', 'desc'], // 不展示数据
    });

    // post 参数为（异步获取）
    this.getBodySysc(req, res, params => {
        if (!params.email || !params.psd){
            this.sendData(res, { data: null, status: false, msg: '用户名或密码不能为空' });
            return
        }

        User.select({
            email: params.email,
            psd: params.psd,
        }).then(result => {
            if (result.length > 0){
                let resData = {
                    userInfo: result[0],
                    // 生成 uid 参数：id、生成时间戳（11为）
                    COUID: aseEncode(JSON.stringify([result[0].id, Math.floor((new Date()).getTime() / 1000)]))
                }
                this.sendData(res, { data: resData, status: true, msg: '登录成功' });
            }else{
                this.sendData(res, { data: null, status: false, msg: '邮箱或密码错误' });
            }
        });
    });
};


module.exports = login;