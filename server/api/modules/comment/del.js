// 给评论点赞！！

let { judgeToken } = require('../../../public/crypto');

function deleteCom(req, res) {
    let CQUID = req.headers.authorization; // 获取对应的 uid（从请求头部）
    let comment = new this.cqqSql({
        name: 'comment',
    });
    // 判断是否登录
    judgeToken(CQUID, data => {
        if (!data.status) { // 未登录
            this.sendData(res, data);
            return
        }
        let params = this.getQuery(req); // get 获取参数（同步获取）
        let id = Number(params.id); // 评论的id
        if (!id) {
            this.sendData(res, {
                status: false,
                msg: '哈，参数不正确啦~'
            });
            return
        }
        // 查询
        comment.select(id).then(selectArr => {
            if (selectArr.length <= 0){
                this.sendData(res, {
                    status: false,
                    msg: '哎呀，评论不存在啦~'
                });
                return
            } else if (data.data.id != selectArr[0].user_id){
                this.sendData(res, {
                    status: false,
                    msg: '嗯哼，非本人不能进行删除哦~'
                });
                return
            }

            // 删除一级及其以下所有的评论
            comment.delete(` WHERE id=${id} OR linked_comment_id=${id}`).then(delArr => {
                this.sendData(res, {
                    status: true,
                    data: delArr,
                    msg: '删除成功~'
                });
            });
        });
    });
};

module.exports = deleteCom;