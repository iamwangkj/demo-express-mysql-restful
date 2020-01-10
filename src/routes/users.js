const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const mysqlConfig = require('../config/db.js')

// 查询语句
const sql = {
  add: 'insert into user(id, name, age) value(0,?,?)',
  get: 'select * from user where id=?',
  getAll: 'select * from user',
  update: 'update user set name=?, age=? where id=?',
  del: 'delete from user where id=?'
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
	const param = req.body || req.query || req.params
	console.log('param=', param)
	pool.getConnection((err, connection) => {
		if (err) throw err; // not connected!
		connection.query(sql.add, [param.name, param.age], (err, result) => {
			if (result) {
				console.log('result', result)
				result = {
					code: 200,
					msg: '增加成功'
				}
			}
			jsonWrite(res, result)
			// 释放连接 
			connection.release()
			// Handle error after the release.
			if (err) throw err
			// Don't use the connection here, it has been returned to the pool.
		})
	})
})

router.get('/:userId', (req, res, next) => {
  const param = req.body || req.query || req.params
	console.log('param=', req.params[0])
	pool.getConnection((err, connection) => {
		if (err) throw err; // not connected!
		connection.query(sql.get, ['1'], (err, result) => {
			if (result) {
				console.log('result', result, typeof result)
			}
			jsonWrite(res, result)
			// 释放连接 
			connection.release()
			// Handle error after the release.
			if (err) throw err
			// Don't use the connection here, it has been returned to the pool.
		})
	})
})

router.put('/', function(req, res, next) {
  res.send('respond with a resource2')
})

router.delete('/', function(req, res, next) {
  res.send('respond with a resource2')
})

module.exports = router
