import app from "../app";
import dbconfig from "../dbconfig";
const mysql = require("mysql");
const conn = mysql.createConnection(dbconfig);
const pug = require("pug");
const path = require('path');

export const registerTodo = (req, res) => {
    const {
        body: {title, contents, priority, dead_line_date, dead_line_time, completed, is_dead_line}
    } = req;
    const query = `insert into todo(title, contents, priority, dead_line_date, dead_line_time, completed, is_dead_line) values('${title}', '${contents}', '${priority}', '${dead_line_date}', '${dead_line_time}', '${completed}', '${is_dead_line}')`;
    try {
        conn.query(query, async(error) => {
            if (error) throw error;
            res.status(200);
        });
    } catch {
        res.status(404);
    } finally {
        res.end();
    }
}

export const modifyTodo = (req, res) => {
    const {
        body: {todo_id, title, contents, priority, dead_line_date, dead_line_time, completed, is_dead_line}
    } = req;
    const query = `update todo set title = '${title}', contents = '${contents}', priority = '${priority}', dead_line_date = '${dead_line_date}', dead_line_time = '${dead_line_time}', completed = '${completed}', is_dead_line = '${is_dead_line}' where todo_id = ${todo_id}`;
    try {
        conn.query(query, async(error) => {
            if (error) throw error;
            res.status(200);
        });
    } catch {
        res.status(404);
    } finally {
        res.end();
    }
}

export const removeTodo = (req, res) => {
    const {
        body: {todo_id}
    } = req;
    const query = `delete from todo where todo_id = ${todo_id}`;
    try {
        conn.query(query, async(error) => {
            if (error) throw error;
            res.status(200);
        });
    } catch {
        res.status(404);
    } finally {
        res.end();
    }
}

export const refreshTodo = (req, res) => {
    try {
        const query = "select todo_id, priority, title, contents, date_format(dead_line_date, '%Y-%m-%d') as dead_line_date, date_format(dead_line_time, '%H:%i') as dead_line_time, completed, is_dead_line from todo order by completed asc, priority asc, todo_id desc";
        conn.query(query, async(error, result) => {
            if (error) throw error;
            const rows = await result;
            const file = path.join(app.get('views'), 'home.pug');
            const compileHome = pug.compileFile(file);
            res.status(200).json({
                html: compileHome({rows})
            });
            res.end();
        });
    } catch {
        res.status(404);
        res.end();
    }
}