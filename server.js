const mysql = require('mysql');
const inquirer = require('inquirer');
require('dotenv').config();

const employeeArr = [];
const managerArr = [];
const departmentArr = [];
const roleArr = [];
const salaryArr = [];

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB,
});

connection.connect((err) => {
    if (err) {
        console.log(`There was an error connecting: ${err.stack}`);
        return;
    }
    console.log(`connected as id ${connection.threadId}`);
    seedDatabase();
    prompt();
});

const prompt = () => {
    inquirer
        .prompt({
            name: 'action',
            type: 'rawlist',
            message: 'What would you like to do?',
            choices: [
                'View all Employees',
                'View all Employees by Department',
                'View all Employees by Manager',
                'Add Employee',
                'Add Role',
                'Add Department',
                'Remove Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'View all Roles',
                'View all Departments',
                'Terminate',
            ],
        })
        .then((data) => {
            switch (data.action) {
                case 'View all Employees':
                    viewAllEmployees(); //DONE
                    break;

                case 'View all Employees by Department':
                    viewAllEmployeesByDepartment(); //DONE but still needs work.
                    break;

                case 'View all Employees by Manager':
                    viewAllEmployeesByManager(); //DONE
                    break;

                case 'Add Employee':
                    addEmployee(); //DONE
                    break;

                case 'Add Role':
                    addRole(); //DONE
                    break;

                case 'Add Department':
                    addDepartment(); //DONE
                    break;

                case 'Remove Employee':
                    removeEmployee(); //DONE
                    break;

                case 'Update Employee Role':
                    updateEmployeeRole(); //DONE
                    break;

                case 'Update Employee Manager':
                    updateEmployeeManager();
                    break;

                case 'View all Roles':
                    viewAllRoles(); //DONE
                    break;

                case 'View all Departments':
                    viewAllDepartments(); //DONE
                    break;

                case 'Terminate':
                    console.log('Thank you for using this program :)');
                    connection.end(); //DONE
                    break;
            }
        });
};

// VIEW ALL EMPLOYEES
// =========================================================================================
const viewAllEmployees = () => {
    let query = `SELECT e.first_name, e.last_name, r.title, d.name AS department
                 FROM employee e
                 JOIN role r
                 ON e.role_id = r.id
                 JOIN department d
                 ON r.department_id = d.id;`;

    connection.query(query, (err, results, field) => {
        if (err) throw err;
        console.table(results);
    });
};

// VIEW ALL ROLES
// =========================================================================================
const viewAllRoles = () => {
    let query = `SELECT title, salary 
                 FROM role`;
    connection.query(query, (err, results, field) => {
        if (err) throw err;
        console.table(results);
    });
};

// VIEW ALL EMPLOYEES BY DEPARTMENT
// =========================================================================================
const viewAllEmployeesByDepartment = () => {
    let query = `SELECT d.name AS department, e.first_name, e.last_name, r.title, r.salary 
                 FROM employee e 
                 JOIN role r ON e.role_id = r.id 
                 JOIN department d 
                 ON r.department_id = d.id;`;
    connection.query(query, (err, results, field) => {
        if (err) throw err;
        console.table(results);
    });
};

// VIEW ALL EMPLOYEES BY MANAGER
// =========================================================================================
const viewAllEmployeesByManager = () => {
    let questions = [
        {
            name: 'manager',
            type: 'list',
            message: `Under which manager would you like to view employees?`,
            choices: managerArr,
        },
    ];

    inquirer.prompt(questions).then((answers) => {
        const { manager } = answers;

        let managerFirstName = manager.split(' ').slice(0, 1).join();
        let managerLastName = manager.split(' ').slice(1).join();

        let query = `SELECT id, first_name, last_name, role_id, manager_id
                     FROM employee
                     WHERE manager_id = (
                        SELECT role_id
                        FROM employee
                        WHERE first_name = '${managerFirstName}' AND
                            last_name = '${managerLastName}'
                     );`;

        connection.query(query, (err, results, field) => {
            if (err) throw err;
            console.log(`${manager} manages the following employees:`);
            console.table(results);
        });
    });
};

// ADD EMPLOYEE
// =========================================================================================
const addEmployee = () => {
    let questions = [
        {
            name: 'firstName',
            type: 'input',
            message: `What's the employee's first name?`,
            validate: validateLetters,
        },
        {
            name: 'lastName',
            type: 'input',
            message: `What's the employee's last name?`,
            validate: validateLetters,
        },
        {
            name: 'role',
            type: 'list',
            message: `What's the employee's role`,
            choices: roleArr,
        },
        {
            name: 'manager',
            type: 'list',
            message: `Who's the employee's manager`,
            choices: managerArr,
        },
    ];

    // If the database already has employees, use global employee array for their choice
    if (employeeArr) {
        inquirer.prompt(questions).then((answers) => {
            const { firstName, lastName, role, manager } = answers;

            let managerFirstName = manager.split(' ').slice(0, 1).join();
            let managerLastName = manager.split(' ').slice(1).join();

            let query = `INSERT INTO employee 
                            (id, 
                            first_name, 
                            last_name, 
                            role_id, 
                            manager_id)
                        VALUES 
                            (DEFAULT, 
                            '${firstName}', 
                            '${lastName}', 
                            (SELECT id FROM role r
                                WHERE title = '${role}'), 
                            (SELECT role_id
                                FROM employee e
                                WHERE 
                                    (e.first_name = '${managerFirstName}') AND 
                                    (e.last_name = '${managerLastName}') AND 
                                    (e.manager_id IS NULL)) );`;

            connection.query(query, (err, results, field) => {
                if (err) throw err;
                employeeArr.push(`${firstName} ${lastName}`);
                console.table(employeeArr);
            });
        });
    }
};

// ADD ROLE NEED TO ADD DEPARTMENT INPUT THEN PUSH TO DEPARTMENT ARRAY
// =========================UNDER-CONSTRUCTION========================================
const addRole = () => {
    let questions = [
        {
            name: 'role',
            type: 'input',
            message: `What's the employee's job title?`,
        },
        {
            name: 'salary',
            type: 'input',
            message: `What's the employee's salary?`,
            validate: validateSalary,
        },
    ];

    inquirer.prompt(questions).then((answers) => {
        connection.query(
            `INSERT INTO role 
             VALUES (DEFAULT, '${answers.role}', '${answers.salary}' , DEFAULT)`,
            (err, results, field) => {
                if (err) throw err;
                roleArr.push(answers.role);
                salaryArr.push(answers.salary);
                console.table(results);
                console.log(roleArr);
                console.log(parseInt(salaryArr));
            }
        );
    });
};

// ADD DEPARTMENT
// =========================================================================================
const addDepartment = () => {
    let questions = [
        {
            name: 'department',
            type: 'input',
            message: `What department would you like to add?`,
        },
    ];

    inquirer.prompt(questions).then((answers) => {
        connection.query(
            `INSERT INTO department 
             VALUES (DEFAULT, '${answers.department}')`,
            (err, results, field) => {
                if (err) throw err;
                departmentArr.push(answers.department);
                console.table(results);
                console.log(departmentArr);
            }
        );
    });
};

// UPDATE EMPLOYEE ROLE
// =========================================================================================
const updateEmployeeRole = () => {
    let questions = [
        {
            name: 'employeeName',
            type: 'list',
            message: `Which employee do you want to update with respect to their role?`,
            choices: employeeArr,
        },
        {
            name: 'roleName',
            type: 'list',
            message: `Which role best fits the employee?`,
            choices: roleArr,
        },
    ];

    inquirer.prompt(questions).then((answers) => {
        const { employeeName, roleName } = answers;

        let firstName = employeeName.split(' ').slice(0, 1).join();
        let lastName = employeeName.split(' ').slice(1).join();

        let query = `UPDATE employee
                     SET role_id = (
                        SELECT id
                        FROM role
                        WHERE title = '${roleName}'
                        )
                     WHERE first_name = '${firstName}' AND last_name = '${lastName}';`;

        connection.query(query, (err, results, field) => {
            if (err) throw err;
            console.table(results);
            console.log('Employee successfully updated!');
        });

        const viewUpdate = `SELECT e.id, e.first_name, e.last_name, r.title, r.id AS role_id
                            FROM employee e
                            JOIN role r
                            ON e.role_id = r.id;`;

        connection.query(viewUpdate, (err, results, field) => {
            if (err) throw err;
            console.table(results);
        });
    });
};

// UPDATE EMPLOYEE MANAGER
// =========================================================================================
const updateEmployeeManager = () => {
    let questions = [
        {
            name: 'employeeName',
            type: 'list',
            message: `Which employee do you want to update with respect to their manager?`,
            choices: employeeArr,
        },
        {
            name: 'managerName',
            type: 'list',
            message: `Which manager best fits the employee?`,
            choices: managerArr,
        },
    ];

    inquirer.prompt(questions).then((answers) => {
        const { employeeName, managerName } = answers;

        let employeeFirstName = employeeName.split(' ').slice(0, 1).join();
        let employeeLastName = employeeName.split(' ').slice(1).join();

        let managerFirstName = managerName.split(' ').slice(0, 1).join();
        let managerLastName = managerName.split(' ').slice(1).join();

        let query = `UPDATE employee 
                     SET manager_id = (
                     SELECT role_id
                     FROM (SELECT role_id 
                         FROM employee
                         WHERE first_name = '${managerFirstName}' AND
                         last_name = '${managerLastName}'
                         ) AS e
                     )
                    WHERE first_name = '${employeeFirstName}' AND last_name = '${employeeLastName}';`;

        connection.query(query, (err, results, field) => {
            if (err) throw err;
            console.table(results);
            console.log('Employee successfully updated!');
        });

        const viewUpdate = `SELECT e.id, e.first_name, e.last_name, r.title, r.id AS role_id, e.manager_id
                            FROM employee e
                            JOIN role r
                            ON e.role_id = r.id;`;

        connection.query(viewUpdate, (err, results, field) => {
            if (err) throw err;
            console.table(results);
        });
    });
};

// REMOVE EMPLOYEES
// =========================================================================================
const removeEmployee = () => {
    if (employeeArr) {
        let questions = [
            {
                name: 'removeName',
                type: 'list',
                message: `Which employee would you like to remove?`,
                choices: employeeArr,
            },
        ];

        inquirer.prompt(questions).then((answers) => {
            const { removeName } = answers;

            let firstName = removeName.split(' ').slice(0, 1).join();
            let lastName = removeName.split(' ').slice(1).join();
            let query = `DELETE FROM employee
                         WHERE first_name = '${firstName}' AND last_name = '${lastName}';`;

            connection.query(query, (err, results, field) => {
                if (err) throw err;
                console.table(results);
                console.log('Employee successfully removed!');
            });

            const viewUpdate = `SELECT e.first_name, e.last_name, r.title, d.name AS department
                                FROM employee e
                                JOIN role r
                                ON e.role_id = r.id
                                JOIN department d
                                ON r.department_id = d.id;`;

            connection.query(viewUpdate, (err, results, field) => {
                if (err) throw err;
                console.table(results);
            });
        });
    }

    console.log('Please add an employee before removing');
};

// VALIDATION FUNCTIONS
// =========================================================================================
const validateLetters = (name) => {
    let pass = name.match(/^[A-Za-z]+$/);
    if (pass) {
        return true;
    }
    return 'Please enter a valid name which contains only letters.';
};

const validateSalary = (salary) => {
    let pass = salary.match(/^\d*\.?\d+$/);
    if (pass) {
        return true;
    }
    return 'Please do not enter any commas.';
};

// SEED DATABASE
// =========================================================================================
const seedDatabase = () => {
    employeeArr.length = 0;
    roleArr.length = 0;
    salaryArr.length = 0;
    departmentArr.length = 0;
    managerArr.length = 0;

    let populateEmployeeArray = 'SELECT first_name, last_name FROM employee';
    let populateManagerArray =
        'SELECT first_name, last_name FROM employee WHERE manager_id IS NULL';
    let populateRoleArray = 'SELECT title FROM role';
    let populateSalaryArray = 'SELECT salary FROM role';
    let populateDepartmentArray = 'SELECT name FROM department';

    connection.query(populateEmployeeArray, (err, res) => {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            employeeArr.push(res[i].first_name + ' ' + res[i].last_name);
        }
        // console.table(employeeArr);
    });

    connection.query(populateManagerArray, (err, res) => {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            managerArr.push(res[i].first_name + ' ' + res[i].last_name);
        }
        // console.table(managerArr);
    });

    connection.query(populateRoleArray, (err, res) => {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            roleArr.push(res[i].title);
        }
        // console.table(roleArr);
    });

    connection.query(populateSalaryArray, (err, res) => {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            salaryArr.push(res[i].salary);
        }
        // console.table(salaryArr);
    });

    connection.query(populateDepartmentArray, (err, res) => {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            departmentArr.push(res[i].name);
        }
        // console.table(departmentArr);
    });
};
