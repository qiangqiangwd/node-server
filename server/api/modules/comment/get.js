// 获取评论

function getComment(req, res) {
    // let CQUID = req.headers.authorization; // 获取对应的 uid（从请求头部）
    let params = this.getQuery(req); // get 获取参数（同步获取）
    let comment = new this.cqqSql({
        name: 'comment',
    });

    // 获取分页数据
    let pageIndex = Number(params.pageIndex) || 1; // 当前页数 （1开始）
    let pageSize = Number(params.pageSize) || 10; // 每页显示数量
    let pageStr = (pageIndex - 1) * pageSize + ',' + pageIndex * pageSize

    // 进行查询
    // 这里添加了虚拟数据（linked_user_name：关联用户的姓名 linked_head_img：关联用户的头像）
    comment.query("SELECT c.*,(SELECT COUNT(*) FROM COMMENT WHERE linked_comment_id = c.`id`) AS second_comment,(SELECT NAME FROM USER WHERE id = c.`linked_user_id`) AS linked_user_name,(SELECT head_img FROM USER WHERE id = c.`linked_user_id`) AS linked_head_img,u.`name`,u.`head_img` FROM COMMENT c,USER u WHERE c.`user_id` = u.`id` AND c.`linked_comment_id` IS NULL ORDER BY c.`create_time` DESC LIMIT " + pageStr).then(firstResult => {
        // 循环查询是否含二级评论
        function selectSecondResult(index = 0) {
            if (firstResult.length < 0 || index === (firstResult.length - 1)) { // 当查询结束后
                // 获取评论总的数量
                comment.query(`SELECT COUNT(*) FROM COMMENT WHERE linked_comment_id IS NULL `).then(count => {
                    // 返回的结果
                    let resData = {
                        pageIndex: pageIndex,
                        pageSize: pageSize,
                        dataList: firstResult,
                        count: count[0]['COUNT(*)']
                    }
                    this.sendData(res, { data: resData, status: true, msg: '查询成功' });
                });
                return
            }

            let len = firstResult[index].second_comment;
            firstResult[index].second_comment = [];
            if (len <= 0) { // 若不含有二级评论则直接查询下一个一级评论
                selectSecondResult.bind(this)(index + 1);
                return
            }
            // 查询对应的二级评论
            comment.query('SELECT c.*,(SELECT NAME FROM USER WHERE id = c.`linked_user_id`) AS linked_user_name,(SELECT head_img FROM USER WHERE id = c.`linked_user_id`) AS linked_head_img,u.`name`,u.`head_img` FROM COMMENT c,USER u WHERE c.`user_id` = u.`id` AND linked_comment_id = ' + firstResult[index].id + ' ORDER BY c.`create_time`').then(secondResult => {
                firstResult[index].second_comment.push(...secondResult);
                // console.log('次级查询的结果' + index + '：', secondResult);
                selectSecondResult.bind(this)(index + 1);
            });
        }

        selectSecondResult.bind(this)();
    });
};

module.exports = getComment;