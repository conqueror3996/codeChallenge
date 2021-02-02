const dev = require('./environment.dev')
const test = require('./environment.test')
const prod = require('./environment.prod')

let environment = dev
const setEnv = (env) => {
    switch (env) {
        case 'test':
            environment = test
            break;
        case 'prod':
            environment = prod
            break;
        default:
            environment = dev
            break;
    }
}

module.exports = { environment, setEnv}
