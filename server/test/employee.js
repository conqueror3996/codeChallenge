process.env.NODE_ENV = 'test';

//Require the dev-dependencies
const { expect } = require('chai');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();
const db = require('../services/db')
const {environment, setEnv} = require('../environments/index')

chai.use(chaiHttp);

//Our parent block
describe('Employees', () => {
    let employeeDisabled = ''
    let token = '';
    let newEmployeeID = ''
    
    before( async (done) => {
        try {
            await db.postgre.run(`TRUNCATE TABLE tbl_departments;`).catch((err) => err)
            await db.postgre.run(`TRUNCATE TABLE tbl_teams;`).catch((err) => err)
            await db.postgre.run(`TRUNCATE TABLE tbl_employees;`).catch((err) => err)
            await db.postgre.run(`TRUNCATE TABLE tbl_emp_team;`).catch((err) => err)

            const queryInsert3 = `
            INSERT INTO public.tbl_departments(department_id, department_name) VALUES (1, 'Department 1');
            INSERT INTO public.tbl_departments(department_id, department_name) VALUES (2, 'Department 2');
            INSERT INTO public.tbl_departments(department_id, department_name) VALUES (3, 'Department 3');`
            await db.postgre.run(queryInsert3).catch((err) => err)

            const queryInsert4 = `
            INSERT INTO public.tbl_teams(team_id, team_name, department_id)VALUES (1, 'Team 1', 1);
            INSERT INTO public.tbl_teams(team_id, team_name, department_id)VALUES (2, 'Team 2', 3);
            INSERT INTO public.tbl_teams(team_id, team_name, department_id)VALUES (3, 'Team 3', 2);
            INSERT INTO public.tbl_teams(team_id, team_name, department_id)VALUES (4, 'Team 4', 3);
            INSERT INTO public.tbl_teams(team_id, team_name, department_id)VALUES (5, 'Team 5', 2);`
            await db.postgre.run(queryInsert4).catch((err) => err)

            const queryInsert1 = `
                INSERT INTO tbl_employees ( employee_lastname, employee_firstname)
                VALUES ('Test1', 'User1') 
                RETURNING employee_id;
                INSERT INTO tbl_employees ( employee_lastname, employee_firstname)
                VALUES ('Test2', 'User2')
                RETURNING employee_id;
                INSERT INTO tbl_employees ( employee_lastname, employee_firstname)
                VALUES ('Test3', 'User3')
                RETURNING employee_id;`
            const result = await db.postgre.run(queryInsert1).catch((err) => err)
            if (result === null) {
                done(new Error);
            }

            /** INSERT into tbl_emp_team */
            const queryInsert2 = `
                INSERT INTO tbl_emp_team ( employee_id, team_id, role_id)
                VALUES ('${result[0].rows[0].employee_id}', 3, 3) 
                RETURNING employee_id;
                INSERT INTO tbl_emp_team ( employee_id, team_id, role_id)
                VALUES ('${result[1].rows[0].employee_id}', 2, 2) 
                RETURNING employee_id;
                INSERT INTO tbl_emp_team ( employee_id, team_id, role_id)
                VALUES ('${result[2].rows[0].employee_id}', 3, 2) 
                RETURNING employee_id;`
            const result2 = await db.postgre.run(queryInsert2).catch((err) => err)
            if (result2 === null) {
                done(new Error);
            }
            const { rows } = result2[0]

            /** Update tbl_employees */
            const queryUpdate1 = `
                UPDATE tbl_employees
                SET   employee_status = true
                WHERE employee_id = '${rows[0].employee_id}' AND employee_status = false
                RETURNING employee_id;`
            const result3 = await db.postgre.run(queryUpdate1).catch((err) => err)
            if (result3 === null) {
                done(new Error);
            }
            employeeDisabled = result3.rows[0].employee_id
            done();
        } catch (error) {
            done(error)
        }
        
    })
    beforeEach((done) => {
        // console.log(process.env.NODE_ENV)
        //Before each test we empty the database in your case
        done();
    });

    /**
     * Login
     */
    describe('/POST Login', () => {
        it(`it should Fail to login because username doesn't exists`, (done) => {
            let loginInfoFail1 = {
                user_username: "wrongadmin",
                user_password: "123456789"
            }
            chai.request(server)
                .post('/api/authen/login')
                .send(loginInfoFail1)
                .end((err, res) => {
                    // if (err) { return done(err) }
                    res.should.have.status(401);
                    res.body.should.have.property('code').eql('010101401101')
                    done();
                });
        });

        it(`it should Fail to login because of wrong password`, (done) => {
            let loginInfoFail2 = {
                user_username: "admin",
                user_password: "wrongPassword"
            }
            chai.request(server)
                .post('/api/authen/login')
                .send(loginInfoFail2)
                .end((err, res) => {
                    // if (err) { return done(err) }
                    // res.should.have.status(401);
                    res.body.should.have.property('code').eql('010101401101')
                    done();
                });
        });
        it('it should Login and return a token', (done) => {
            let loginInfo = {
                user_username: "admin",
                user_password: "123456789"
            }
            chai.request(server)
                .post('/api/authen/login')
                .send(loginInfo)
                .end((err, res) => {
                    if (err) { return done(err) }
                    res.should.have.status(200);
                    res.body.should.have.property('data')
                    res.body.data.should.have.property('token')
                    token = res.body.data.token
                    done();
                });
        });
        
    });
    /*
     * Test the /GET Employees
     */
    describe('/GET Employees', () => {
        it('it should GET all the employees', (done) => {
            chai.request(server)
                .get('/api/employees/get-employees')
                .set({ "Authorization": `${token}` })
                .end((err, res) => {
                    if (err) { return done(err) }
                    res.should.have.status(200);
                    res.body.should.have.property('data')
                    res.body.data.should.be.a('array');
                    res.body.should.have.property('code').eql('000000000000')
                    const {data} = res.body
                    const find = data.includes((e) => e.employee_status === true)
                    expect(find).eql(false)
                    done();
                });
        });
        
    });
    /*
     * Test the /GET Search Employees
     */
    describe('/GET Search Employees', () => {
        it('it should GET the employees base on Keyword', (done) => {
            chai.request(server)
                .get('/api/employees/get-employees')
                .set({ 'Authorization': `${token}` })
                .query({keyWords: 'Man'})
                .end((err, res) => {
                    if (err) { return done(err) }
                    res.should.have.status(200);
                    res.body.should.have.property('data')
                    res.body.data.should.be.a('array');
                    res.body.should.have.property('code').eql('000000000000')
                    const {data} = res.body
                    const find = data.find((e) => e.role_name === 'Manager')
                    expect(find).not.eql(undefined)
                    done();
                });
        });
    });
    /*
     * Test the /POST Add an employee
     */
    describe('/POST add an employee', () => {
        it('it should SUCCESSFULLY add an employee', (done) => {
            let newEmployee = {
                "employee_lastname": "Test2",
                "employee_firstname": "User2",
                "team_id": 3
            }
            chai.request(server)
                .post('/api/employees/add-employees')
                .set({ "Authorization": `${token}` })
                .send(newEmployee)
                .end((err, res) => {
                    // if (err) { return done(err) }
                    res.should.have.status(200);
                    res.body.should.have.property('data')
                    res.body.should.have.property('code').eql('000000000000')
                    newEmployeeID = res.body.data.employee_id
                    done();
                });
        });

        // let clock;
        // clock = sinon.useFakeTimers();
        // clock.tick(1800001)
        // it('it should FAIL to add an employee', (done) => {
        //     let loginInfo = {
        //         user_username: "test1",
        //         user_password: "123456789"
        //     }
        //     chai.request(server)
        //         .post('/api/authen/login')
        //         .send(loginInfo)
        //         .end((err, res) => {
        //             res.should.have.status(200);
        //             res.body.should.have.property('data')
        //             res.body.data.should.have.property('token')
        //             token = res.body.data.token
        //             clock.restore();
        //         });
        //     let newEmployee = {
        //         "employee_lastname": "Test",
        //         "employee_firstname": "User",
        //         "team_id": 4
        //     }
        //     chai.request(server)
        //         .get('/api/employees/add-employees')
        //         .set({ "Authorization": `${token}` })
        //         .send(newEmployee)
        //         .end((err, res) => {
        //             res.should.have.status(200);
        //             res.body.should.have.property('data')
        //             res.body.data.should.be.a('array');
        //             res.body.should.have.property('code').eql('000000000000')
        //             done();
        //         });
        // });
    });
    /*
     * Test the /GET Employees Detail
     */
    describe('/GET Employees Detail by ID', () => {
        it('it should FAIL to GET employee detail', (done) => {
            chai.request(server)
                .get(`/api/employees/get-employees/${employeeDisabled}`)
                .set({ "Authorization": `${token}` })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('code').eql('010202400100')
                    done();
                });
        });
        it('it should GET employee detail', (done) => {
            chai.request(server)
                .get(`/api/employees/get-employees/${newEmployeeID}`)
                .set({ "Authorization": `${token}` })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('code').eql('000000000000')
                    res.body.should.have.property('data')
                    res.body.data.should.have.property('employee_id').eql(newEmployeeID)
                    done();
                });
        });
    });

    /**
     * Test the PUT Update Logic Employee
     */
    describe('/PUT Update an Employee', () => {
        it(`it should FAIL to UPDATE the employee because params 'employee_id' is missing`, (done) => {
            let data = {
                "employee_lastname": "TestUpate",
                "employee_firstname": "UserUpdate",
                "role_id": 2,
                "team_id": 5
            }
            chai.request(server)
                .put(`/api/employees/update-employees`)
                .set({ "Authorization": `${token}` })
                .send(data)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
        let notExistsEmployeeID = 'd6076f8c-2088-47a3-a306'
        it(`it should FAIL to UPDATE the employee because this employee_id doesn't exists`, (done) => {
            let data = {
                "employee_lastname": "TestUpate",
                "employee_firstname": "UserUpdate",
                "role_id": 2,
                "team_id": 5
            }
            chai.request(server)
                .put(`/api/employees/update-employees/${notExistsEmployeeID}`)
                .set({ "Authorization": `${token}` })
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('code').eql('010204400100')
                    done();
                });
        });

        it(`it should FAIL to UPDATE the employee because a body item 'role_id' is missing`, (done) => {
            let data = {
                "employee_lastname": "TestUpate",
                "employee_firstname": "UserUpdate",
                "role_id": null,
                "team_id": 3
            }
            chai.request(server)
                .put(`/api/employees/update-employees/${newEmployeeID}`)
                .set({ "Authorization": `${token}` })
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('code').eql('010204400102')
                    done();
                });
        });

        it(`it should FAIL to UPDATE the employee because a body item 'team_id' is missing`, (done) => {
            let data = {
                "employee_lastname": "TestUpate",
                "employee_firstname": "UserUpdate",
                "role_id": 2,
                "team_id": null
            }
            chai.request(server)
                .put(`/api/employees/update-employees/${newEmployeeID}`)
                .set({ "Authorization": `${token}` })
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('code').eql('010204400103')
                    done();
                });
        });

        it(`it should FAIL to UPDATE the employee because role_id or team_id doesn't exists`, (done) => {
            let data = {
                "employee_lastname": "TestUpate",
                "employee_firstname": "UserUpdate",
                "role_id": 8,
                "team_id": 8
            }
            chai.request(server)
                .put(`/api/employees/update-employees/${newEmployeeID}`)
                .set({ "Authorization": `${token}` })
                .send(data)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('code').eql('010204400100')
                    done();
                });
        });

        it('it should SUCCESSFULLY Update the employee', (done) => {
            let data = {
                "employee_lastname": "TestUpate",
                "employee_firstname": "UserUpdate",
                "role_id": 2,
                "team_id": 4
            }
            chai.request(server)
                .put(`/api/employees/update-employees/${newEmployeeID}`)
                .set({ "Authorization": `${token}` })
                .send(data)
                .end((err, res) => {
                    // if (err) { return done(err) }
                    res.should.have.status(200);
                    res.body.should.have.property('data')
                    res.body.should.have.property('code').eql('000000000000')
                    newEmployeeID = res.body.data.employee_id
                    done();
                });
        });
    });
    
    /**
     * Test the PUT Delete Logic Employee
     */
    describe('/PUT Delete logic an Employee', () => {
        it(`it should FAIL to DELETE the employee because params 'employee_id' is missing`, (done) => {
            chai.request(server)
                .put(`/api/employees/delete-employees`)
                .set({ "Authorization": `${token}` })
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
        let notExistsEmployeeID = 'd6076f8c-2088-47a3-a306'
        it(`it should FAIL to DELETE the employee because this employee_id doesn't exists`, (done) => {
            chai.request(server)
                .put(`/api/employees/delete-employees/${notExistsEmployeeID}`)
                .set({ "Authorization": `${token}` })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('code').eql('010205400100')
                    done();
                });
        });

        it(`it should FAIL to DELETE the employee because this employee is already deleted`, (done) => {
            chai.request(server)
                .put(`/api/employees/delete-employees/${notExistsEmployeeID}`)
                .set({ "Authorization": `${token}` })
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('code').eql('010205400100')
                    done();
                });
        });

        it('it should SUCCESSFULLY Delete the employee', (done) => {
            chai.request(server)
                .put(`/api/employees/delete-employees/${newEmployeeID}`)
                .set({ "Authorization": `${token}` })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('data')
                    res.body.should.have.property('code').eql('000000000000')
                    newEmployeeID = res.body.data.employee_id
                    done();
                });
        });
    });
});