const jwt = require('jsonwebtoken')
const db = require('../services/db')

const {environment} = require('../environments/index')

const getUser = async (user_id, user_username) => {
  const user_query = `
    SELECT *
    FROM tbl_users
    WHERE user_id = $1 AND user_username = $2
  `
  const arrValues = [user_id, user_username]
  const result = await db.postgre.runWithPrepare(user_query, arrValues).catch(() => null)
  if (result) {
    const { rows } = result
    if (rows.length === 1) {
      return rows[0]
    }

    return null
  }

  return null
}

/**
 * Nhận vào authorization trong headers
 * Trong authorization có chứa token
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const authenMiddleware = (req, res, next) => {
  req.user = undefined
  if (!req.headers || !req.headers.authorization) {
    return res.status(401).json({
      err: 'Unauthorized User!',
      code: '010000401101'
    })
  }
  const token = req.headers.authorization
  /** Hàm verify sẽ dùng privateKey để trích ra thông tin cơ bản của user trong token */
  return jwt.verify(token, environment.privateKey, async (err, decode) => {
    if (err) {
      return res.status(401).json({
        err,
        code: '010000401102',
      })
    }

    const user = {
      user_username: decode.user_username,
      user_id: decode.user_id,
      user_permission_code: '11',
    }

    /** Lấy toàn bộ thông tin user dựa trên user_id */
    const getUserResult = await getUser(user.user_id, user.user_username)
    if (getUserResult) {
      const {
        user_password,
        user_salt,
        user_iteration,
        ...newUser
      } = getUserResult

      if (newUser) {
        req.user = newUser
        return next()
      }
    }

    return res.status(401).json({
      code: '010000401103',
    })
  })
}

const adminMiddleWare = (req, res, next) => {
  const { user } = req

  if (!user) {
    return res.status(401).json({
      err: 'Unauthorized User!',
      code: '010000401104',
    })
  }

  const { user_permission_code } = user

  if (user_permission_code !== '99') {
    return res.status(401).json({
      err: 'Unauthorized User!',
      code: '010000401105',
    })
  }

  return next()
}

module.exports = {
  authenMiddleware,
  adminMiddleWare,
}
