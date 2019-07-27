
// 创建新的评论（post请求）
let { judgeToken } = require('../../../public/crypto');

function getComment(req, res) {
    let CQUID = req.headers.authorization; // 获取对应的 uid（从请求头部）
    let comment = new this.cqqSql({
        name: 'comment',
    });
    // 判断是否登录
    judgeToken(CQUID, data => {
        if (!data.status) { // 未登录
            this.sendData(res, {
                status:false,
                msg:'登录后才能进行评论(￣.￣)'
            });
            return
        }
        // 若已登录则根据用户进行添加

        // post 参数为（异步获取）
        this.getBodySysc(req, res, params => {
            // 上传的数据
            let commentOpt = {
                user_id: data.data.id,
                // content: decodeURIComponent(params.content), // 内容
                content: params.content, // 内容
                create_time: Math.floor((new Date()).getTime() / 1000), // 创建时间，取 10 位数
                linked_comment_id: params.linked_comment_id || null, // 关联评论id
                linked_user_id: params.linked_user_id || null, // 关联用户id
                linked_article_id: null // 关联文章id【这里不用】
            };
            // 进行新增
            comment.insert(commentOpt).then(dbRes => {
                // 根据返回的结果进行提示
                this.sendData(res, {
                    data: commentOpt,
                    msg:'评论添加成功'
                }); 
            });
        });

    });
};

module.exports = getComment;