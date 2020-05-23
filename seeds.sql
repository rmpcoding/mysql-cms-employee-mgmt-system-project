USE cms_db;

INSERT INTO department (id, name)
  VALUES (DEFAULT, 'Software'),
         (DEFAULT, 'Executive'),
         (DEFAULT, 'Administration'),
         (DEFAULT, 'Accounting'),
         (DEFAULT, 'Sales');


INSERT INTO role (id, title, salary, department_id)
  VALUES (DEFAULT, 'Software Developer', 65000, 1),
         (DEFAULT, 'Senior Software Developer', 110000, 1),
         (DEFAULT, 'CEO', 220000, 2),
         (DEFAULT, 'CTO', 210000, 2),
         (DEFAULT, 'Web Developer', 65000, 1),
         (DEFAULT, 'Accountant', 75000, 4),
         (DEFAULT, 'Sales Person', 50000, 5),
         (DEFAULT, 'CFO', 210000, 2),
         (DEFAULT, 'Junior Web Developer', 55000, 1),
         (DEFAULT, 'Manager', 110000, 3);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
  VALUES (DEFAULT, 'John', 'Smith', 3, NULL),
         (DEFAULT, 'Kristine', 'Wong', 2, 10),
         (DEFAULT, 'Chris', 'Richardson', 4, 3),
         (DEFAULT, 'Andy', 'Smithers', 6, 10),
         (DEFAULT, 'Andrew', 'McMannus', 10, NULL),
         (DEFAULT, 'Robert', 'Johnson', 5, 10),
         (DEFAULT, 'Chris', 'Albertson', 8, 3),
         (DEFAULT, 'Aaron', 'Smith', 7, 10),
         (DEFAULT, 'Borris', 'Jonson', 7, 10),
         (DEFAULT, 'Margarita', 'Lopez', 1, 10),
         (DEFAULT, 'Amy', 'Coldwater', 1, 10),
         (DEFAULT, 'Shannon', 'Cheng', 9, 10),
         (DEFAULT, 'Alfonso', 'Gonzalez', 9, 10),
         (DEFAULT, 'Elizabeth', 'McGuire', 1, 10),
         (DEFAULT, 'Jennifer', 'Chang', 1, 10),
         (DEFAULT, 'Jonny', 'Abe', 5, 10);




