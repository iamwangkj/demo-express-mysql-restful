
var express = require('express')
var app = express()
var morgan = require('morgan')
var createError = require('http-errors')

const indexRouter = require('./routes/index')
const sessionRouter = require('./routes/session')
const usersRouter = require('./routes/users')

// 配置
var port = process.env.PORT || 3000 // 设置启动端口
// express-v4.16 支持：
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// 使用 morgan 将请求日志打印到控制台
app.use(morgan('dev'))

// 路由
app.use('/', indexRouter)
app.use('/session', sessionRouter)
app.use('/users', usersRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// 启动服务
app.listen(port)
console.log(`Magic happens at http://localhost:${port}`)
