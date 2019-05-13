
const express = require('express');
const router = express.Router();

const jm = require('../main/crypto');
const code_msg = require('../main/code_msg'); //公共提示和返回码
const mainFun = require('../main/com_fun'); //公共函数

// // 所有使用 /user/* 接口的中间过程
// router.use(function timeLog(req, res, next) {
//     let token = req.params.token;
//     if(!!token){
//         jm.aesDecrypt(token);
//     }
//     console.log(token);
//     // console.log('Time: ', Date.now());
//     next();
// });

// 获取用户信息
router.get('/:token',(req, res) => {
    // console.log(jm.aesEncrypt('[1,1534838761]'));
    let token = req.params.token || 'false';  //获取token

    let check_token = mainFun.check_token(token);
    let json;
    if(!check_token.f){
        res.json(code_msg(check_token.data));
        return
    }else{
        json = check_token.data;
    }

    // 返回正确的用户信息
    req.models.user.get(`${json[0]}`,(err, users) => {
        if(err){
            res.json(code_msg(7));
            return
        }

        // 能够返回的被查询到的信息
        let canSendInfo = mainFun.canSendInfo(users);

        res.json(code_msg({
            data:canSendInfo,
        }));
    });

});
// 登录部分
router.post('/login', (req, res) => {
    //jm.aesEncrypt('[1,1534838761]') 参数说明：第一个为id，第二个为时间戳
    let get_info = req.body;

    let psd = mainFun.decrypto(get_info.psd,123,25);

    req.models.user.find({email:get_info.email,psd:psd},(err, users) => {
        // console.log(err);
        if(err){
            res.json(code_msg(7));
            return
        }

        // 若查询不到用户时，判断哪里出错
        if(users.length <= 0){
            req.models.user.find({ email:get_info.email },(err_inf,cb_inf) => {
                res.json(code_msg(
                    err_inf ? 7 :
                    ( cb_inf.length <= 0 ? 5 : 6 )
                ));
            });
            return
        }

        let user = users[0]; //获取信息,并删除不必要的信息
        // 能够返回的被查询到的信息
        let canSendInfo =  mainFun.canSendInfo(user);

        let t = Math.floor((new Date()).getTime() / 1000);
        users[0].last_login_time = t;
        users[0].save(function (err) {
            console.log(user.name+":登录时间修改成功!");
        });

        t += 60 * 60 * 24 * 7; //有效期七天
        res.json(code_msg({
            data:{
                token:jm.aesEncrypt(`[${user.id},${t}]`),
                user:canSendInfo
            }
        }));
    });
});

// 修改个人资料
router.post('/modify',(req, res) => {
    // console.log(jm.aesEncrypt('[1,1534838761]'));
    let body = req.body;
    let token = req.body.token || '';  //获取token

    let check_token = mainFun.check_token(token);
    let json;
    if(!check_token.f){
        res.json(code_msg(check_token.data));
        return
    }else if(mainFun.type(body.name) === 'undefined'||mainFun.type(body.desc) === 'undefined'||mainFun.type(body.sex) === 'undefined'){
        res.json(code_msg(3));
        return
    }else{
        json = check_token.data;
    }

    // 返回正确的用户信息
    req.models.user.get(`${json[0]}`,(err, users) => {
        if(err){
            res.json(code_msg(7));
            return
        }

        // console.log(body);
        // 修改个人信息
        users.name = body.name;
        users.desc = body.desc;
        users.sex = body.sex;
        // 能够返回的被查询到的信息
        let canSendInfo = mainFun.canSendInfo(users);
        users.save((err_msg)=>{
            if(err_msg){
                console.log(err_msg);
                return
            }
            return res.json(code_msg({
                data:canSendInfo,
            }));
        });
    });
});

module.exports = router;
