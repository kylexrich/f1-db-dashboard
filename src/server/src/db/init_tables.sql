DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO public;

CREATE TABLE team
  (
     name                VARCHAR(255),
     base_location       VARCHAR(255),
     owner               VARCHAR(255),
     first_team_entry    DATE,
     fastest_laps        INT,
     world_championships INT,
     PRIMARY KEY (name)
  );

CREATE TABLE driver
  (
     id                  INT,
     name                VARCHAR(255),
     nationality         VARCHAR(255),
     dob                 DATE,
     place_of_birth      VARCHAR(255),
     world_championships INT,
     fastest_laps        INT,
     races_won           INT,
     podiums             INT,
     PRIMARY KEY (id)
  );

CREATE TABLE car
  (
      number        INT,
      team_name     VARCHAR(255),
      power_unit    VARCHAR(255),
      chassis_model VARCHAR(255),
      to_date       DATE,
      from_date     DATE NOT NULL,
      driver_id     INT NOT NULL,
      PRIMARY KEY (number, team_name),
      FOREIGN KEY (team_name) REFERENCES team(name) ON UPDATE CASCADE ON DELETE CASCADE,
      FOREIGN KEY (driver_id) REFERENCES driver(id) ON UPDATE CASCADE ON DELETE CASCADE
  );

CREATE TABLE pit_crew
  (
     id             INT,
     name           VARCHAR(255),
     nationality    VARCHAR(255),
     dob            DATE,
     place_of_birth VARCHAR(255),
     position       VARCHAR(255),
     best_time      TIME,
     PRIMARY KEY (id)
  );

CREATE TABLE engineer
  (
     id              INT,
     name            VARCHAR(255),
     nationality     VARCHAR(255),
     dob             DATE,
     place_of_birth  VARCHAR(255),
     education_level VARCHAR(255),
     PRIMARY KEY (id)
  );

CREATE TABLE manager
  (  id             INT,
     name           VARCHAR(255),
     nationality    VARCHAR(255),
     place_of_birth VARCHAR(255),
     dob            DATE,
     role           VARCHAR(255),
     PRIMARY KEY (id)
  );

CREATE TABLE season
  (
     year INT,
     races  INT,
     PRIMARY KEY (year)
  );

CREATE TABLE grand_prix
  (
     title   VARCHAR(255),
     country VARCHAR(255),
     PRIMARY KEY (title)
  );

CREATE TABLE safety_car
  (
     model VARCHAR(255),
     top_speed  INT,
     PRIMARY KEY (model)
  );

CREATE TABLE investor
  (
     name VARCHAR(255),
     PRIMARY KEY (name)
  );

CREATE TABLE invests_in_amounts
  (  amount INT,
     level  VARCHAR(255),
     PRIMARY KEY (amount)
  );

CREATE TABLE works_on
  (  car_number  INT,
     team_name   VARCHAR(255),
     engineer_id INT,
     PRIMARY KEY (team_name, engineer_id, car_number),
     FOREIGN KEY (team_name) REFERENCES team(name) ON DELETE CASCADE ON UPDATE CASCADE,
     FOREIGN KEY (engineer_id) REFERENCES engineer(id) ON DELETE CASCADE ON UPDATE CASCADE,
     FOREIGN KEY (car_number, team_name) REFERENCES car(number, team_name) ON DELETE CASCADE ON UPDATE CASCADE
  );

CREATE TABLE maintains
  (  car_number  INT,
     team_name   VARCHAR(255),
     pit_crew_id INT,
     PRIMARY KEY (team_name, pit_crew_id, car_number),
     FOREIGN KEY (team_name) REFERENCES team(name) ON DELETE CASCADE ON UPDATE CASCADE,
     FOREIGN KEY (pit_crew_id) REFERENCES pit_crew(id) ON DELETE CASCADE ON UPDATE CASCADE,
     FOREIGN KEY (car_number, team_name) REFERENCES car(number, team_name) ON DELETE CASCADE ON UPDATE CASCADE
  );

CREATE TABLE maintains_cars_for
  (  team_name   VARCHAR(255),
     pit_crew_id INT,
     from_date   DATE,
     to_date     DATE,
     PRIMARY KEY (team_name, pit_crew_id),
     FOREIGN KEY (team_name) REFERENCES team(name) ON DELETE RESTRICT ON UPDATE CASCADE,
     FOREIGN KEY (pit_crew_id) REFERENCES pit_crew(id) ON DELETE RESTRICT ON UPDATE CASCADE
  );

CREATE TABLE drives_on
  (  team_name VARCHAR(255),
     driver_id INT,
     from_date DATE,
     to_date   DATE,
     PRIMARY KEY (team_name, driver_id),
     FOREIGN KEY (team_name) REFERENCES team(name) ON DELETE RESTRICT ON UPDATE CASCADE,
     FOREIGN KEY (driver_id) REFERENCES driver(id) ON DELETE CASCADE ON UPDATE CASCADE
  );

CREATE TABLE manages
  (  manager_id INT,
     team_name  VARCHAR(255),
     from_date  DATE,
     to_date    DATE,
     PRIMARY KEY (team_name, manager_id),
     FOREIGN KEY (team_name) REFERENCES team(name) ON DELETE RESTRICT ON UPDATE CASCADE,
     FOREIGN KEY (manager_id) REFERENCES manager(id) ON DELETE CASCADE ON UPDATE CASCADE
  );

CREATE TABLE engineers_for
  (  team_name   VARCHAR(255),
     engineer_id INT,
     from_date   DATE,
     to_date     DATE,
     PRIMARY KEY (team_name, engineer_id),
     FOREIGN KEY (team_name) REFERENCES team(name) ON DELETE RESTRICT ON UPDATE CASCADE,
     FOREIGN KEY (engineer_id) REFERENCES engineer(id) ON DELETE CASCADE ON UPDATE CASCADE
  );

CREATE TABLE participated_in
  (  team_name        VARCHAR(255),
     season_year      INT,
     constructor_rank INT NOT NULL,
     PRIMARY KEY (season_year, team_name),
     FOREIGN KEY (season_year) REFERENCES season(year) ON DELETE CASCADE ON UPDATE CASCADE,
     FOREIGN KEY (team_name) REFERENCES team(name) ON DELETE CASCADE ON UPDATE CASCADE,
     UNIQUE(constructor_rank, season_year)
  );

CREATE TABLE drove_during
  (  driver_id   INT,
     season_year INT,
     driver_rank INT NOT NULL,
     PRIMARY KEY (season_year, driver_id),
     FOREIGN KEY (season_year) REFERENCES season(year) ON DELETE CASCADE ON UPDATE CASCADE,
     FOREIGN KEY (driver_id) REFERENCES driver(id) ON DELETE CASCADE ON UPDATE CASCADE,
     UNIQUE(driver_rank, season_year)
  );

CREATE TABLE circuit
  (  name                VARCHAR(255),
     map_url             VARCHAR(255),
     last_length_used    INT,
     direction           VARCHAR(255),
     type                VARCHAR(255),
     change_in_elevation INT,
     grand_prix_title    VARCHAR(255),
     PRIMARY KEY (name),
     FOREIGN KEY (grand_prix_title) REFERENCES grand_prix(title) ON DELETE CASCADE ON UPDATE CASCADE,
     UNIQUE(map_url)
  );

CREATE TABLE invests_in
  (  investor_name VARCHAR(255),
     team_name     VARCHAR(255),
     start_date    DATE,
     end_date      DATE,
     amount        INT,
     PRIMARY KEY (investor_name, team_name),
     FOREIGN KEY (investor_name) REFERENCES investor(name) ON DELETE CASCADE ON UPDATE CASCADE,
     FOREIGN KEY (team_name) REFERENCES team(name) ON DELETE CASCADE ON UPDATE CASCADE,
     FOREIGN KEY (amount) REFERENCES invests_in_amounts(amount) ON DELETE CASCADE ON UPDATE CASCADE
  );

CREATE TABLE race
  (  id               INT,
     date             DATE,
     temperature      INT,
     fastest_lap      TIME,
     safety_car_model VARCHAR(255),
     dnf_count        INT,
     pole_sitter_id   INT NOT NULL,
     season_year      INT NOT NULL,
     circuit_name     VARCHAR(255) NOT NULL,
     red_flag_count   INT,
     PRIMARY KEY (id),
     FOREIGN KEY (circuit_name) REFERENCES circuit(name) ON DELETE CASCADE ON UPDATE CASCADE,
     FOREIGN KEY (season_year) REFERENCES season(year) ON DELETE CASCADE ON UPDATE CASCADE,
     FOREIGN KEY (pole_sitter_id) REFERENCES driver(id) ON DELETE RESTRICT ON UPDATE CASCADE,
     FOREIGN KEY (safety_car_model) REFERENCES safety_car(model) ON DELETE RESTRICT ON UPDATE CASCADE
  );

CREATE TABLE raced
  (  race_id   INT,
     driver_id INT,
     placement INT NOT NULL,
     PRIMARY KEY (driver_id, race_id),
     FOREIGN KEY (race_id) REFERENCES race(id) ON DELETE CASCADE ON UPDATE CASCADE,
     FOREIGN KEY (driver_id) REFERENCES driver(id) ON DELETE CASCADE ON UPDATE CASCADE,
     UNIQUE(placement, race_id)
  );

