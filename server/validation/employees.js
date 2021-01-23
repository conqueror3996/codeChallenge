const validateGetEmployeeByID = (body = {}, params = {}) => {
    if (!params.employee_id) {
        return '010202400101'
    }

    return null
}

const validateAddEmployees = (body = {}, params = {}) => {
    if (!body.team_id) {
        return '010203400101'
    }

    return null
}

const validateUpdateEmployees = (body = {}, params = {}) => {
    // if (!params.employee_id) {
    //     return '010204400101'
    // }
    if (!body.role_id) {
        return '010204400102'
    }
    if (!body.team_id) {
        return '010204400103'
    }

    return null
}

const validateDeleteEmployees = (body = {}, params = {}) => {
    // if (!params.employee_id) {
    //     return '010205400101'
    // }

    return null
}

module.exports = {
    validateGetEmployeeByID,
    validateAddEmployees,
    validateUpdateEmployees,
    validateDeleteEmployees,
}