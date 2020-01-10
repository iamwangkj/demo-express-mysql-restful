const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const mysqlConfig = require('../config/db.js')

// 查询语句
const db = {
  query: 'select * from user where username=?',

  
  insert: 'insert into user(id, name, age) value(0,?,?)',
  get: 'select * from user where username=?',
  getAll: 'select * from user',
  update: 'update user set name=?, age=? where id=?',
  del: 'delete from user where id=?'
}

// 使用连接池，提升性能
const poolConfig = Object.assign({ connectionLimit: 10 }, mysqlConfig)
const pool = mysql.createPool(poolConfig)

router.post('/', (req, res, next) => {
  let { username, password } = req.body
	pool.getConnection((err, connection) => {
		if (err) throw err; // not connected!
		connection.query(db.query, username, (err, result) => {
      console.log(result)
      res.json({
        msg: 'ok'
      })
			// 释放连接 
			connection.release()
			// Handle error after the release.
			if (err) throw err
			// Don't use the connection here, it has been returned to the pool.
		})
	})
})

module.exports = router
