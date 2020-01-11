const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const mysqlConfig = require('../config/db.js')

// 查询语句
const sql = {
	insert: 'insert into user(id, username, password) value(0,?,?)',
  query: 'select * from user where username=?',
  queryAll: 'select * from user',
  update: 'update user set name=?, age=? where id=?',
  delete: 'delete from user where id=?'
}

// 使用连接池，提升性能
const poolConfig = Object.assign({ connectionLimit: 10 }, mysqlConfig)
const pool = mysql.createPool(poolConfig)

// 向前台返回JSON方法的简单封装
const jsonWrite = function (res, ret) {
	if(typeof ret === 'undefined') {
		res.json({
			code:'1',
			msg: '操作失败'
		})
	} else {
		res.json(ret)
	}
}

router.post('/', (req, res, next) => {
	// 获取前台页面传过来的参数
	const { username, password } = req.body
	console.log('param=', username, password)
	pool.getConnection((err, connection) => {
		if (err) throw err; // not connected!
		connection.query(sql.query, [username], (err, result) => {
			console.log('result', result)
			if (result.length > 0) {
				res.status(200).json({
					msg: 'username exist'
				})
			}
			else {
				connection.query(sql.insert, [username, password], (err, result) => {
					res.status(200).json({
						msg: 'create'
					})
				})
			}
			// 释放连接 
			connection.release()
			// Handle error after the release.
			if (err) throw err
			// Don't use the connection here, it has been returned to the pool.
		})
	})
})

router.get('/:userId', (req, res, next) => {
	res.status(200).end()
})

router.put('/', function(req, res, next) {
  res.status(403).end()
})

router.delete('/', function(req, res, next) {
  res.status(403).end()
})

module.exports = router
