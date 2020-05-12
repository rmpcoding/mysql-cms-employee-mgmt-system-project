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
                    viewAllEmployees();
                    break;

                case 'View all Employees by Department':
                    viewAllEmployeesByDepartment();
                    break;

                case 'View all Employees by Manager':
                    break;

                case 'Add Employee':
                    addEmployee();
                    break;

                case 'Add Role':
                    addRole();
                    break;

                case 'Add Department':
                    addDepartment();
                    break;

                case 'Remove Employee':
                    break;

                case 'Update Employee Role':
                    break;

                case 'Update Employee Manager':
                    break;

                case 'View all Roles':
                    viewAllRoles(); //DONE
                    break;

                case 'View all Departments':
                    viewAllDepartments(); //DONE (extra)
                    break;

                case 'Terminate':
                    break;
            }
        });
};

// COMPLETE
const viewAllEmployees = () => {
    let query = `SELECT e.first_name, e.last_name, r.title, d.name AS department
                 FROM employee e
                 JOIN role r
                 ON e.role_id = r.id
                 JOIN department d
                 ON r.department_id = d.id;`

    connection.query(query, (err, results, field) => {
        if (err) throw err;
        console.table(results);
    });
};

const viewAllRoles = () => {
    connection.query('SELECT * FROM `role`', (err, results, field) => {
        if (err) throw err;
        console.table(results);
    });
};

const viewAllEmployeesByDepartment = () => {
    let query = `SELECT d.name, e.first_name, e.last_name, r.title, r.salary FROM employee e 
                 JOIN role r ON e.role_id = r.id 
                 JOIN department d 
                 ON r.department_id = d.id;`
    connection.query(query, (err, results, field) => {
        if (err) throw err;
        console.table(results);
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
    ];

    let questionsForFirstTimeUser = [
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
            type: 'input',
            message: `What's the employee's role?`,
        },
        {
            name: 'salary',
            type: 'input',
            message: `What's the employee's salary associated with this role?`,
        },
    ];

    // If the database already has employees, use global employee array for their choice
    if (roleArr) {
        inquirer.prompt(questions).then((answers) => {
            connection.query(
                `INSERT INTO employee 
                 VALUES (DEFAULT, '${answers.firstName}', '${answers.lastName}', DEFAULT, DEFAULT);`,
                (err, results, field) => {
                    if (err) throw err;
                    employeeArr.push(
                        `${answers.firstName} ${answers.lastName}`
                    );
                    console.table(results);
                    console.log(employeeArr);
                }
            );
        });
    }

    // If there is nothing in the global employee array (first time user), then use this
    inquirer.prompt(questionsForFirstTimeUser).then((answers) => {
        connection.query(
            `INSERT INTO employee 
             VALUES (DEFAULT, '${answers.firstName}', '${answers.lastName}', DEFAULT, DEFAULT);
             INSERT INTO role 
             VALUES (DEFAULT, '${answers.role}', '${answers.salary}', DEFAULT);`,
            (err, results, field) => {
                if (err) throw err;
                employeeArr.push(`${answers.firstName} ${answers.lastName}`);
                roleArr.push(answers.role);
                console.table(results);
                console.log(employeeArr);
                console.log(roleArr);
            }
        );
    });
};

// ADD ROLE
// =========================================================================================
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

// REMOVE EMPLOYEES
// =========================================================================================
const removeEmployee = () => {
    if (employeeArr) {
        let questions = [
            {
                name: 'remove',
                type: 'list',
                message: `Which employee would you like to remove?`,
                choices: employeeArr,
            },
        ];

        inquirer.prompt(questions).then((answers) => {
            connection.query(
                `DELETE FROM employee
                 WHERE  `,
                (err, results, field) => {
                    if (err) throw err;
                    console.table(results);
                    console.log(employeeArr);
                }
            );
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

    let seedEmployees = 'SELECT first_name, last_name FROM employee';
    let seedManagers =
        'SELECT first_name, last_name FROM employee WHERE manager_id IS NOT NULL';
    let seedRoles = 'SELECT title FROM role';
    let seedSalaries = 'SELECT salary FROM role';
    let seedDepartments = 'SELECT name FROM department';

    connection.query(seedEmployees, (err, res) => {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            employeeArr.push(res[i].first_name + ' ' + res[i].last_name);
        }
        console.table(employeeArr);
    });

    connection.query(seedManagers, (err, res) => {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            managerArr.push(res[i].first_name + ' ' + res[i].last_name);
        }
        console.table(managerArr);
    });

    connection.query(seedRoles, (err, res) => {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            roleArr.push(res[i].title);
        }
        console.table(roleArr);
    });

    connection.query(seedSalaries, (err, res) => {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            salaryArr.push(res[i].salary);
        }
        console.table(salaryArr);
    });

    connection.query(seedDepartments, (err, res) => {
        if (err) throw err;

        for (var i = 0; i < res.length; i++) {
            departmentArr.push(res[i].name);
        }
        console.table(departmentArr);
    });
};
