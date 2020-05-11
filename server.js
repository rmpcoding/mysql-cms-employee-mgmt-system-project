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
    connection.query('SELECT * FROM `employee`', (err, results, field) => {
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

const viewAllDepartments = () => {
    connection.query('SELECT * FROM `department`', (err, results, field) => {
        if (err) throw err;
        console.table(results);
    });
};

// const viewAllEmployeesByDept = () => {connection.query('', (err, results, field) => {
//     if (err) throw err;
//     console.table(results);
// }
// )};

// const viewAllEmployeesByMngr = () => {connection.query('', (err, results, field) => {
//     if (err) throw err;
//     console.table(results);
// }
// )};

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

    inquirer.prompt(questions).then((answers) => {
        connection.query(
            `INSERT INTO employee 
             VALUES (DEFAULT, '${answers.firstName}', '${answers.lastName}', DEFAULT, DEFAULT);`,
            (err, results, field) => {
                if (err) throw err;
                console.table(results);
            }
        );
    });
};

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

// // connection.end();

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
