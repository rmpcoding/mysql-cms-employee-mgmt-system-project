const mysql = require('mysql');
const inquirer = require('inquirer');
require('dotenv').config();

const roleArr = [];

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
                'Terminate',
            ],
        })
        .then((data) => {
            switch (data.action) {
                case 'View all Employees':
                    viewAllEmployees();
                    break;

                case 'View all Employees by Department':
                    console.log(data.action);
                    // viewAllEmployeesByDept();
                    break;

                case 'View all Employees by Manager':
                    console.log(data.action);
                    // viewAllEmployeesByDept();
                    break;

                case 'Add Employee':
                    addEmployee();
                    break;

                case 'Add Role':
                    addRole();
                    break;

                case 'Add Department':
                    // viewAllEmployeesByDept();
                    break;

                case 'Remove Employee':
                    // run function here
                    break;

                case 'Update Employee Role':
                    // run function here
                    break;

                case 'Update Employee Manager':
                    // run function here
                    break;

                case 'View all Roles':
                    // run function here
                    break;

                case 'Terminate':
                    // run function here
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
    ];

    inquirer.prompt(questions).then((answers) => {
        connection.query(
            `INSERT INTO employee 
             VALUES (DEFAULT, '${answers.firstName}', '${answers.lastName}', DEFAULT, DEFAULT);
             INSERT INTO role 
             VALUES (DEFAULT, '${answers.role}', '${answers.salary}' , DEFAULT)`,
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
            message: `What's the employee's job title?`
        },
        {
            name: 'salary',
            type: 'input',
            message: `What's the employee's salary?`,
            validate: validateSalary
        },
    ];

    inquirer.prompt(questions).then((answers) => {
        connection.query(
            `INSERT INTO role 
             VALUES (DEFAULT, '${answers.role}', '${answers.salary}' , DEFAULT)`,
            (err, results, field) => {
                if (err) throw err;
                console.table(results);
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
    let pass = salary.match(/^\d*\.?\d+$/)
    if (pass) {
        return true;
    }
    return 'Please do not enter any commas.'
}