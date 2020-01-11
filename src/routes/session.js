const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const mysqlConfig = require('../config/db.js')

// 查询语句
const db = {
  query: 'select * from user where username=?',
  // insert: 'insert into user(id, name, age) value(0,?,?)',
  // queryAll: 'select * from user',
  // update: 'update user set name=?, age=? where id=?',
  // delete: 'delete from user where id=?'
}

// 使用连接池，提升性能
const poolConfig = Object.assign({ connectionLimit: 10 }, mysqlConfig)
const pool = mysql.createPool(poolConfig)

router.post('/', (req, res, next) => {
  let { username, password } = req.body
	pool.getConnection((err, connection) => {
		if (err) throw err; // not connected!
		connection.query(db.query, username, (err, result) => {
      if(result.length > 0 && result[0].password === password){
        res.status(200).json({
          msg: 'sign in',
          data: {
            username
          }
        })
      }
      else {
        res.status(200).json({
          msg: 'sign in failed',
          data: {
            username
          }
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


router.delete('/', (req, res, next) => {
  let { username, password } = req.body
  res.status(200).json({
    msg: 'sign out'
  })
})


module.exports = router
