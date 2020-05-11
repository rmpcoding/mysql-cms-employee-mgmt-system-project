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