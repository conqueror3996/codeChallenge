const express = require('express')
const db = require('../../../services/db')
const {permissionsMiddleWare} = require('../../../middlewares')
const validation = require('../../../validation')
const { check } = require('prettier')

const employeeRouter = express.Router()

/**
 * APIID = Api010201
 */
employeeRouter.get('/get-employees', async (req, res) => {
    try {
        const {keyWords} = req.query
        const arrValues = [`%${keyWords}%`]
        const query = `
            SELECT e.employee_id
                , e.employee_lastname || ' ' || e.employee_firstname as employee_fullname
                , e.employee_status
                , r.role_id
                , r.role_name
                , t.team_id
                , t.team_name
                , d.department_id
                , d.department_name
            FROM tbl_employees e
            LEFT JOIN tbl_emp_team et ON et.employee_id = e.employee_id
            LEFT JOIN tbl_teams t ON et.team_id = t.team_id
            LEFT JOIN tbl_roles r ON et.role_id = r.role_id
            LEFT JOIN tbl_departments d ON t.department_id = d.department_id
            WHERE e.employee_status = false
            ${keyWords ? 
                `AND (e.employee_lastname LIKE $1 
                    OR e.employee_firstname LIKE $1
                    OR r.role_name LIKE $1
                    OR t.team_name LIKE $1
                    OR d.department_name LIKE $1
                ) `
                : ''}
        `
        let result
        if (!keyWords) {
            result = await db.postgre.run(query)
            .catch(() => {
                return null
            })
        } else {
            result = await db.postgre.runWithPrepare(query, arrValues)
            .catch((err) => {
                return null
            })
        }

        if (result !== null) {
            const { rows } = result
            return res.status(200).json({
                code: '000000000000',
                data: rows,
            })
        }
        return res.status(400).json({
            code: '010201400100',
            data: []
        })
    } catch (error) {
        return res.status(500).json({
            code: '010201500100',
            data: []
        })
    }
})

/**
 * APIID = Api010202
 */
employeeRouter.get('/get-employees/:employee_id', async (req, res) => {
    try {
        const validateError = validation.employeeValidation.validateGetEmployeeByID({}, req.params)
        if (validateError) {
            return res.status(400).json({
                code: validateError
            })
        }
        const arrValues = [req.params.employee_id]
        const query = `
        SELECT e.employee_id
            , e.employee_lastname || ' ' || e.employee_firstname as employee_fullname
            , e.employee_status
            , r.role_id
            , r.role_name
            , t.team_id
            , t.team_name
            , d.department_id
            , d.department_name
        FROM tbl_employees e
        LEFT JOIN tbl_emp_team et ON et.employee_id = e.employee_id
        LEFT JOIN tbl_teams t ON et.team_id = t.team_id
        LEFT JOIN tbl_roles r ON et.role_id = r.role_id
        LEFT JOIN tbl_departments d ON t.department_id = d.department_id
            WHERE e.employee_id = $1 
                AND e.employee_status = false
        `
        const result = await db.postgre.runWithPrepare(query, arrValues)
            .catch(() => {
                return null
            })

        if (result !== null) {
            const { rows } = result
            if (rows.length !== 0) {
                return res.status(200).json({
                    code: '000000000000',
                    data: rows[0],
                })
            }
        }
        return res.status(400).json({
            code: '010202400100',
            data: {}
        })
    } catch (error) {
        return res.status(500).json({
            code: '010202500100',
            data: {}
        })
    }
})

const insertToEmployeeTeamTable = async (arr) => {
    const query = `
        INSERT INTO tbl_emp_team (employee_id, team_id, role_id)
        VALUES ($1, $2, 3);`
    const result = await db.postgre.runWithPrepare(query, arr)
        .catch(() => {
            return null
        })

    if (result !== null) {
        if (result.rowCount !== 0) {
            return null
        }
    }
    return '010203400202'
}

/**
 * APIID = Api010203
 */
employeeRouter.post('/add-employees/', permissionsMiddleWare.adminMiddleWare, async (req, res) => {
    try {
        const validateError = validation.employeeValidation.validateAddEmployees(req.body)
        if (validateError) {
            return res.status(400).json({
                code: validateError
            })
        }
        const {employee_lastname, employee_firstname, team_id} = req.body
        const checkTeamExistsQuery = `
            SELECT team_id FROM tbl_teams WHERE team_status = false AND team_id = ${team_id};
        `
        const resultTeam = await db.postgre.run(checkTeamExistsQuery)
            .catch(() => {
                return null
            })

        if (resultTeam !== null) {
            if (resultTeam.rows.length === 0) {
                return res.status(400).json({
                    code: '010203400201',
                })
            }
        }
        const arrValues = [employee_lastname, employee_firstname]
        const query = `
            INSERT INTO tbl_employees (
                  employee_lastname
                , employee_firstname
            )
            VALUES ($1, $2)
            RETURNING employee_id
        `
        const result = await db.postgre.runWithPrepare(query, arrValues)
            .catch(() => {
                return null
            })

        if (result !== null) {
            const { rows } = result
            if (rows.length !== 0) {
                const arr = [rows[0].employee_id, team_id]
                const insErr = await insertToEmployeeTeamTable(arr)
                if (insErr === null) {
                    return res.status(200).json({
                        code: '000000000000',
                        data: rows[0]
                    })
                }
                return res.status(400).json({
                    code: insErr,
                    data: {}
                })
            }
        }
        return res.status(400).json({
            code: '010203400100',
            data: {}
        })
    } catch (error) {
        return res.status(500).json({
            code: '010203500100',
            data: {}
        })
    }
})

/**
 * APIID = Api010204
 */
employeeRouter.put('/update-employees/:employee_id', permissionsMiddleWare.adminMiddleWare, async (req, res) => {
    try {
        const validateError = validation.employeeValidation.validateUpdateEmployees(req.body, req.params)
        if (validateError) {
            return res.status(400).json({
                code: validateError
            })
        }
        const {employee_lastname, employee_firstname, role_id, team_id} = req.body
        const {employee_id} = req.params
        const arrValues = [employee_id, employee_lastname, employee_firstname]
        const query = `
            UPDATE tbl_employees
            SET   employee_lastname = $2
                , employee_firstname = $3
            WHERE employee_id = $1
                AND employee_status = false;
        `
        const arrValues2= [employee_id, role_id, team_id]
        const query2 =`
            UPDATE tbl_emp_team
            SET   role_id = $2
                , team_id = $3
            WHERE employee_id = $1
                AND $2 IN (SELECT role_id FROM tbl_roles WHERE role_status = false )
                AND $3 IN (SELECT team_id FROM tbl_teams WHERE team_status = false )
            RETURNING employee_id;
            `
        const result = await db.postgre.runWithPrepare(query, arrValues)
            .catch((err) => {
                return null
            })
        const result2 = await db.postgre.runWithPrepare(query2, arrValues2)
            .catch((err) => {
                return null
            })

        if (result !== null && result2 !== null) {
            if (result.rowCount !== 0 && result2.rows.length !== 0) {
                return res.status(200).json({
                    code: '000000000000',
                    data: result2.rows[0]
                })
            }
        }
        return res.status(400).json({
            code: '010204400100',
            data: {}
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            code: '010204500100',
            data: {}
        })
    }
})

/**
 * APIID = Api010205
 */
employeeRouter.put('/delete-employees/:employee_id', permissionsMiddleWare.adminMiddleWare, async (req, res) => {
    try {
        const validateError = validation.employeeValidation.validateDeleteEmployees({}, req.params)
        if (validateError) {
            return res.status(400).json({
                code: validateError
            })
        }
        const {employee_id} = req.params
        const arrValues = [employee_id]
        const query = `
            UPDATE tbl_employees
            SET   employee_status = true
            WHERE employee_id = $1 
                AND employee_status = false
            RETURNING employee_id
        `
        const result = await db.postgre.runWithPrepare(query, arrValues)
            .catch(() => {
                return null
            })

        if (result !== null) {
            const { rows } = result
            if (rows.length !== 0) {
                return res.status(200).json({
                    code: '000000000000',
                    data: rows[0]
                })
            }
        }
        return res.status(400).json({
            code: '010205400100',
            data: {}
        })
    } catch (error) {
        return res.status(500).json({
            code: '010205500100',
            data: {}
        })
    }
})

module.exports = employeeRouter
