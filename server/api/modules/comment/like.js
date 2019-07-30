// 给评论点赞！！

let { judgeToken } = require('../../../public/crypto');

function liked(req, res) {
    let CQUID = req.headers.authorization; // 获取对应的 uid（从请求头部）
    let comment = new this.cqqSql({
        name: 'comment',
    });
    // 判断是否登录
    judgeToken(CQUID, data => {
        if (!data.status) { // 未登录
            this.sendData(res, {
                status: false,
                msg: '登录后才能进行点赞哦'
            });
            return
        }
        let params = this.getQuery(req); // get 获取参数（同步获取）
        let id = params.id; // 评论的id
        let type = params.type ? (params.type == 'true') : true; // 为点赞还是取消点赞
        // console.log(type, typeof params.type);
        if (!id) {
            this.sendData(res, {
                status: false,
                msg: '参数不正确'
            });
            return
        }
        comment.query(`SELECT liked FROM COMMENT WHERE id=${id}`).then(likeOpt => {
            let num = type ? likeOpt[0].liked + 1 : (likeOpt[0].liked - 1 < 0 ? 0 : likeOpt[0].liked - 1);
            comment.update({ liked: num }, { id: (params.id || 0) }).then(result => {
                this.sendData(res, {
                    status: true,
                    data: num,
                    msg: type ? '点赞成功' : '已取消点赞'
                });
            });
        });
    });
};

module.exports = liked;