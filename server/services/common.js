const fs = require('fs')
const db = require('./db')

const dateFormatYYYYMMDDHHMMSS = () => {
  const now = new Date()
  function pad2(n) {
    // always returns a string
    return (n < 10 ? '0' : '') + n
  }

  return (
    now.getFullYear() +
    pad2(now.getMonth() + 1) +
    pad2(now.getDate()) +
    pad2(now.getHours()) +
    pad2(now.getMinutes()) +
    pad2(now.getSeconds())
  )
}

const uuidv4 = () => {
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8

    return v.toString(16)
  })
}

/**
 * Lý Lập Thiện - 2020 Sep. 16
 * Kiểm tra xem Thư mục có rỗng không
 * @param {*} dirname
 */
const isDirEmpty = (dirname) => {
  return fs.promises.readdir(dirname).then((files) => {
    return files.length === 0
  })
}

/**
 * Lý Lập Thiện - 2020 Sep. 16
 * Kiểm tra xem User có tồn tại không bằng Username và trả về thông tin user nếu tồn tại
 * @param {*} csvRow
 * @param {*} user_username_param
 */
const checkUser = async (csvRow, user_username_param = null) => {
  try {
    const user_username = user_username_param || csvRow.user_username
    const query = `
      SELECT *
      FROM tbl_users
      WHERE user_username = $1;
    `
    const result = await db.postgre
      .runWithPrepare(query, [user_username])
      .catch(() => ({ result: false }))
    if (result) {
      const { rows } = result
      // const drawing = rows[0]
      if (rows.length !== 0) {
        return {
          result: 1,
          data: csvRow,
        }
      }

      return {
        result: 2,
        data: csvRow,
      }
    }

    return {
      result: 0,
      data: csvRow,
    }
  } catch (error) {
    return {
      result: 0,
      data: csvRow,
    }
  }
}

/**
 * Danh sách các Permission Code mà DMS cho phép
 */
const permissions = ['99', '19', '11', '09']

/**
 * Danh sách các Group Code mà DMS cho phép
 */
const groups = ['admin', 'qc', 'qc', 'office']

/**
 * Danh sách các Department Code mà DMS cho phép
 */
const departmentIds = ['1', '2', '3', '4', '5']

/**
 * Để clone Object
 * @param {*} obj
 */
const strictCloneObject = (obj) => {
  let copy

  // Handle the 3 simple types, and null or undefined
  if (obj == null || typeof obj !== 'object') return obj

  // Handle Date
  if (obj instanceof Date) {
    copy = new Date()
    copy.setTime(obj.getTime())
    return copy
  }

  // Handle Array
  if (obj instanceof Array) {
    copy = []
    for (let i = 0, len = obj.length; i < len; i += 1) {
      copy[i] = strictCloneObject(obj[i])
    }
    return copy
  }

  // Handle Object
  if (obj instanceof Object) {
    copy = {}
    /**
     * Copy mọi thứ, bao gồm cả prototype
     */
    // for (const attr in obj) {
    //     if (obj.hasOwnProperty(attr)) {
    //         copy[attr] = clone(obj[attr])
    //     }
    // }

    /**
     * Copy value thôi, không phải tất cả mọi thứ thuộc về một object
     */
    Object.keys(obj).forEach((e) => {
      if (Object.prototype.hasOwnProperty.call(obj, e)) {
        copy[e] = strictCloneObject(obj[e])
      }
    })

    return copy
  }

  throw new Error("Unable to copy obj! Its type isn't supported.")
}

/**
 * Không thể copy dates, functions, undefined, regExp or Infinity (null)
 */
const looseCloneObject = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

module.exports = {
  dateFormatYYYYMMDDHHMMSS,
  uuidv4,
  isDirEmpty,
  checkUser,
  permissions,
  groups,
  departmentIds,
  strictCloneObject,
  looseCloneObject,
}
