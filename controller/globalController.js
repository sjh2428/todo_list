import dbconfig from "../dbconfig";
const mysql = require("mysql");
const conn = mysql.createConnection(dbconfig);

export const home = (req, res) => {
    try {
        const query = "select todo_id, priority, title, contents, date_format(dead_line_date, '%Y-%m-%d') as dead_line_date, date_format(dead_line_time, '%H:%i') as dead_line_time, completed, is_dead_line from todo order by completed asc, priority asc, todo_id desc";
        conn.query(query, async(error, result) => {
            if (error) throw error;
            const rows = await result;
            res.status(200);
            res.render("home", {rows});
        });
    } catch {
        const error = {message: '일시적인 오류일 수 있습니다. 새로고침을 시도해보세요. 그래도 안된다면 관리자에게 문의해주세요!'};
        res.status(404);
        res.render("home", error);
    }
}
