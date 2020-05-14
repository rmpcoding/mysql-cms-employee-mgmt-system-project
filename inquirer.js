const inquirer = require('inquirer');

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
          console.log(data)
          console.log('=============================================')
          console.log(data.action)


            switch (data.action) {
                case 'View all Employees':
                    // run function here
                    break;

                case 'View all Employees by Department':
                    // viewAllEmployeesByDept();
                    break;

                case 'View all Employees by Manager':
                    // viewAllEmployeesByDept();
                    break;

                case 'Add Employee':
                    // viewAllEmployeesByDept();
                    break;

                case 'Add Role':
                    // viewAllEmployeesByDept();
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
prompt();

module.exports = prompt;




// BELOW IS EXTRANEOUS BUT USEABLE CODE FOR FUTURE VERSIONS DO NOT DELETE

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