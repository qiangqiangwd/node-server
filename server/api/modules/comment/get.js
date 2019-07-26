// 获取评论

function getComment(req, res) {
    let CQUID = req.headers.authorization; // 获取对应的 uid（从请求头部）
    let params = this.getQuery(req); // get 获取参数（同步获取）
    let comment = new this.cqqSql({
        name: 'comment',
    });

    // 获取分页数据
    let pageIndex = params.pageIndex || 0; // 当前页数 （0开始）
    let pageSize = params.pageSize || 10; // 每页显示数量
    let pageStr = pageIndex + ',' + (pageIndex + 1) * pageSize

    // 进行查询
    // 这里添加了虚拟数据（linked_user_name：关联用户的姓名 linked_head_img：关联用户的头像）
    comment.query("SELECT c.*,(SELECT NAME FROM USER WHERE id = c.`linked_user_id`) AS linked_user_name,(SELECT head_img FROM USER WHERE id = c.`linked_user_id`) AS linked_head_img,u.`name`,u.`head_img` FROM COMMENT c,USER u WHERE c.`user_id` = u.`id` LIMIT " + pageStr).then(result => {
        // 对返回的评论数据进行分级（这里只包含；两级）
        let firstLevel = result.filter(r => !r.linked_user_id); // 不包含有关联用户id时为第一级
        firstLevel.forEach((item,index) => {
            let second_comment = result.filter(r => item.id == r.linked_comment_id);
            firstLevel[index].second_comment = [...second_comment];
        });
        
        // 获取评论总的数量
        comment.query(`SELECT COUNT(*) FROM COMMENT`).then(count => {
            // 返回的结果
            let resData = {
                pageIndex: pageIndex,
                pageSize: pageSize,
                dataList: firstLevel,
                count: count[0]['COUNT(*)']
            }
            this.sendData(res, { data: resData, status: true, msg: '查询成功' });
        });
    });
};

module.exports = getComment;