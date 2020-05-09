DROP DATABASE IF EXISTS cms_db;

CREATE DATABASE cms_db;
USE cms_db;

DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS employee;


CREATE TABLE IF NOT EXISTS department 
(
  id INT AUTO_INCREMENT,
  name VARCHAR(55),
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS role
(
  id INT AUTO_INCREMENT,
  title VARCHAR(55) NOT NULL,
  salary DECIMAL,
  department_id INT,
  FOREIGN KEY fk_role_department (department_id)
	REFERENCES department (id)
    ON UPDATE CASCADE
    ON DELETE NO ACTION,
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS employee
(
  id INT AUTO_INCREMENT,
  first_name VARCHAR(55) NOT NULL,
  last_name VARCHAR(55) NOT NULL,
  role_id INT,
  manager_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY fk_employee_role (role_id)
	REFERENCES role (id)
    ON UPDATE CASCADE
    ON DELETE NO ACTION,
  FOREIGN KEY fk_employee_role_manager (role_id)
	REFERENCES role (id)
    ON UPDATE CASCADE
    ON DELETE NO ACTION
);