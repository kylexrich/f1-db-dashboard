ALTER SESSION SET NLS_DATE_FORMAT = 'YYYY-MM-DD';

CREATE TABLE team
  (
     teamName                VARCHAR(255),
     base_location       VARCHAR(255),
     owner               VARCHAR(255),
     first_team_entry    DATE,
     fastest_laps        INT,
     world_championships INT,
     PRIMARY KEY (teamName)
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
      carNumber        INT,
      team_name     VARCHAR(255),
      power_unit    VARCHAR(255),
      chassis_model VARCHAR(255),
      to_date       DATE,
      from_date     DATE NOT NULL,
      driver_id     INT NOT NULL,
      PRIMARY KEY (carNumber, team_name),
      FOREIGN KEY (team_name) REFERENCES team(teamName) ON DELETE CASCADE,
      FOREIGN KEY (driver_id) REFERENCES driver(id) ON DELETE CASCADE
  );

CREATE TABLE pit_crew
  (
     id             INT,
     name           VARCHAR(255),
     nationality    VARCHAR(255),
     dob            DATE,
     place_of_birth VARCHAR(255),
     position       VARCHAR(255),
     best_time      VARCHAR(255),
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
     investorName VARCHAR(255),
     PRIMARY KEY (investorName)
  );

CREATE TABLE invests_in_amounts
  (  amount INT,
     investLevel  VARCHAR(255),
     PRIMARY KEY (amount)
  );

CREATE TABLE works_on
  (  car_number  INT,
     team_name   VARCHAR(255),
     engineer_id INT,
     PRIMARY KEY (team_name, engineer_id, car_number),
     FOREIGN KEY (team_name) REFERENCES team(teamName) ON DELETE CASCADE,
     FOREIGN KEY (engineer_id) REFERENCES engineer(id) ON DELETE CASCADE,
     FOREIGN KEY (car_number, team_name) REFERENCES car(carNumber, team_name) ON DELETE CASCADE
  );

CREATE TABLE maintains
  (  car_number  INT,
     team_name   VARCHAR(255),
     pit_crew_id INT,
     PRIMARY KEY (team_name, pit_crew_id, car_number),
     FOREIGN KEY (team_name) REFERENCES team(teamName) ON DELETE CASCADE,
     FOREIGN KEY (pit_crew_id) REFERENCES pit_crew(id) ON DELETE CASCADE,
     FOREIGN KEY (car_number, team_name) REFERENCES car(carNumber, team_name) ON DELETE CASCADE
  );

CREATE TABLE maintains_cars_for
  (  team_name   VARCHAR(255),
     pit_crew_id INT,
     from_date   DATE,
     to_date     DATE,
     PRIMARY KEY (team_name, pit_crew_id),
     FOREIGN KEY (team_name) REFERENCES team(teamName) ON DELETE CASCADE,
     FOREIGN KEY (pit_crew_id) REFERENCES pit_crew(id) ON DELETE CASCADE
  );

CREATE TABLE drives_on
  (  team_name VARCHAR(255),
     driver_id INT,
     from_date DATE,
     to_date   DATE,
     PRIMARY KEY (team_name, driver_id),
     FOREIGN KEY (team_name) REFERENCES team(teamName) ON DELETE CASCADE,
     FOREIGN KEY (driver_id) REFERENCES driver(id) ON DELETE CASCADE
  );

CREATE TABLE manages
  (  manager_id INT,
     team_name  VARCHAR(255),
     from_date  DATE,
     to_date    DATE,
     PRIMARY KEY (team_name, manager_id),
     FOREIGN KEY (team_name) REFERENCES team(teamName) ON DELETE CASCADE,
     FOREIGN KEY (manager_id) REFERENCES manager(id) ON DELETE CASCADE
  );

CREATE TABLE engineers_for
  (  team_name   VARCHAR(255),
     engineer_id INT,
     from_date   DATE,
     to_date     DATE,
     PRIMARY KEY (team_name, engineer_id),
     FOREIGN KEY (team_name) REFERENCES team(teamName) ON DELETE CASCADE,
     FOREIGN KEY (engineer_id) REFERENCES engineer(id) ON DELETE CASCADE
  );

CREATE TABLE participated_in
  (  team_name        VARCHAR(255),
     season_year      INT,
     constructor_rank INT NOT NULL,
     PRIMARY KEY (season_year, team_name),
     FOREIGN KEY (season_year) REFERENCES season(year) ON DELETE CASCADE,
     FOREIGN KEY (team_name) REFERENCES team(teamName) ON DELETE CASCADE,
     UNIQUE(constructor_rank, season_year)
  );

CREATE TABLE drove_during
  (  driver_id   INT,
     season_year INT,
     driver_rank INT NOT NULL,
     PRIMARY KEY (season_year, driver_id),
     FOREIGN KEY (season_year) REFERENCES season(year) ON DELETE CASCADE,
     FOREIGN KEY (driver_id) REFERENCES driver(id) ON DELETE CASCADE,
     UNIQUE(driver_rank, season_year)
  );

CREATE TABLE circuit
  (  circuitName                VARCHAR(255),
     map_url             VARCHAR(255),
     last_length_used    INT,
     direction           VARCHAR(255),
     type1                VARCHAR(255),
     change_in_elevation INT,
     grand_prix_title    VARCHAR(255),
     PRIMARY KEY (circuitName),
     FOREIGN KEY (grand_prix_title) REFERENCES grand_prix(title) ON DELETE CASCADE,
     UNIQUE(map_url)
  );

CREATE TABLE invests_in
  (  investor_name VARCHAR(255),
     team_name     VARCHAR(255),
     start_date1    DATE,
     end_date      DATE,
     amount        INT,
     PRIMARY KEY (investor_name, team_name),
     FOREIGN KEY (investor_name) REFERENCES investor(investorName)
      ON DELETE CASCADE,
     FOREIGN KEY (team_name) REFERENCES team(teamName) ON DELETE CASCADE,
     FOREIGN KEY (amount) REFERENCES invests_in_amounts(amount) ON DELETE CASCADE
  );

CREATE TABLE race
  (  id               INT,
     raceDate         DATE,
     temperature      INT,
     fastest_lap      VARCHAR(255),
     safety_car_model VARCHAR(255),
     dnf_count        INT,
     pole_sitter_id   INT NOT NULL,
     season_year      INT NOT NULL,
     circuit_name     VARCHAR(255) NOT NULL,
     red_flag_count   INT,
     PRIMARY KEY (id),
     FOREIGN KEY (circuit_name) REFERENCES circuit(circuitName) ON DELETE CASCADE,
     FOREIGN KEY (season_year) REFERENCES season(year) ON DELETE CASCADE,
     FOREIGN KEY (pole_sitter_id) REFERENCES driver(id) ON DELETE CASCADE,
     FOREIGN KEY (safety_car_model) REFERENCES safety_car(model) ON DELETE CASCADE
  );

CREATE TABLE raced
  (  race_id   INT,
     driver_id INT,
     placement INT NOT NULL,
     PRIMARY KEY (driver_id, race_id),
     FOREIGN KEY (race_id) REFERENCES race(id) ON DELETE CASCADE,
     FOREIGN KEY (driver_id) REFERENCES driver(id) ON DELETE CASCADE,
     UNIQUE(placement, race_id)
  );

Insert INTO team VALUES ('Red Bull Racing', 'German', 'Williams','1999-01-01', 9, 11);

Insert INTO team VALUES ('Mercedes-AMG Petronas Formula 1 Team',	'British', 'Johnson', '1991-06-19', 7, 7);

Insert INTO team VALUES ('Scuderia Ferrari','British', 'Brown' , '1982-08-11',	12, 2);

Insert INTO team VALUES ('McLaren F1 Team',	'French',	'Jones' , '1994-02-17', 7, 5);

Insert INTO team VALUES ('Alpine F1 Team', 'Italian', 'Miller', '1988-11-27',	4, 12);

Insert INTO driver VALUES (149, 'Lewis Hamilton', 'British',	'1985-01-07',	'UK',	7,	15,	5,	285);

Insert INTO driver VALUES (148, 'George Russell', 'British',	'1998-02-15',	'UK',	0,	0,	3,	13);

Insert INTO driver VALUES (240, 'Max Verstappen', 'Dutch', '1977-05-10', 'Netherlands',	1,	39,	7,	289);

Insert INTO driver VALUES (239, 'Sergio Pérez', 'Mexican', '1990-05-10', 'Mexio',	0,	3,	4,	26);

Insert INTO driver VALUES (241,	'Carlos Sainz Jr.',	'Argentine', '1985-06-27', 'Spain',	0,	65,	2,	213);

Insert INTO driver VALUES (242,	'Charles Leclerc',	'Monégasque', '1997-10-16', 'Monaco',	0,	24,	5,	24);

Insert INTO driver VALUES (132, 'Lando Norris', 'British', '1981-07-29', 'UK',	0,	51,	7,	126);

Insert INTO driver VALUES (131,	'Daniel Ricciardo',	'Australian', '1989-07-01', 'Australia',	0,	16,	8,	32);

Insert INTO driver VALUES (164,	'Esteban Ocon','French', '1981-10-19', 	'France',	0,	68,	2,	69);

Insert INTO driver VALUES (163,	'Fernando Alonso','Spanish', '1981-07-29', 	'Spain',	2,	23,	32,	98);

Insert INTO car VALUES (1,'Mercedes-AMG Petronas Formula 1 Team', 'Renault', 'MD34s', '2019-04-10', '2022-10-14', 149);

Insert INTO car VALUES (2, 'Red Bull Racing','Honda', 'RB2d7', '2018-12-11', '2020-10-15', 240);

Insert INTO car VALUES (6, 'Red Bull Racing','Honda', 'RB2d7', '2018-12-11', '2020-10-15', 239);

Insert INTO car VALUES (2,'Mercedes-AMG Petronas Formula 1 Team', 'Renault', 'MD34s', '2019-04-10', '2022-10-14', 148);

Insert INTO car VALUES (3, 'Scuderia Ferrari', 'Ferrari', 'Frh9d', '2013-05-12', '2020-10-16', 241);

Insert INTO car VALUES (8, 'Scuderia Ferrari', 'Ferrari', 'Frh9d', '2013-05-12', '2020-10-16', 242);

Insert INTO car VALUES (4, 'McLaren F1 Team', 'Mercedes', 'MLnw0', '2020-04-13', '2020-10-17', 132);

Insert INTO car VALUES (7, 'McLaren F1 Team', 'Mercedes', 'MLnw0', '2020-04-13', '2020-10-17', 131);

Insert INTO car VALUES (5, 'Alpine F1 Team', 'Renault', 'APjf8', '2021-04-14', '2020-10-18', 164);

Insert INTO car VALUES (9, 'Alpine F1 Team', 'Renault', 'APjf8', '2021-04-14', '2020-10-18', 163);

Insert INTO pit_crew VALUES (22, 'Samantha', 'German', '1989-12-1', 'Germany', 'BR', '00:02.36');

Insert INTO pit_crew VALUES (21, 'Sam', 'Iranian', '1999-7-19', 'Iran', 'BR', '00:00:1.82');

Insert INTO pit_crew VALUES (27, 'Lilly', 'Bulgarian','1990-3-10', 'United States of America', 'FL','00:00:02.2');

Insert INTO pit_crew VALUES (23, 'Alex', 'Spanish', '1986-1-1', 'Spain', 'FR','00:00:01.97');

Insert INTO pit_crew VALUES (35, 'Heikki', 'Swedish', '1984-3-22', 'Sweden'	, 'BL', '00:00:01.88');

Insert INTO engineer VALUES (1, 'David', 'Honduran', '1995-5-22', 'Honduras', 'Bachelors or equivalent level');

Insert INTO engineer VALUES (14, 'Jarno','Thai', '1983-4-13', 'Canada',	'Post-secondary non-tertiary education');

Insert INTO engineer VALUES (11, 'Mellisa', 'Haitian', '1993-10-5', 'United States of America', 'Master''s or equivalent level');

Insert INTO engineer VALUES (16, 'Mark','Mongolian', '1987-8-10', 'Philippines', 'Bachelor''s or equivalent level');

Insert INTO engineer VALUES (7, 'Jenson', 'Cuban', '1994-11-16', 'Canada', 'Bachelor''s or equivalent level');

Insert INTO manager VALUES (320,	'Antônio',	'French', 'France',	'1983-10-15','principal');

Insert INTO manager VALUES (356,	'Cristiano','French', 'France',	'1993-8-16','principal');

Insert INTO manager VALUES (322,	'Olivier',	'British', 'Britan', '1993-12-15','principal');

Insert INTO manager VALUES (341,	'Giorgio',	'Italian', 'Italy',	'1982-12-15','principal');

Insert INTO manager VALUES (275,	'Gianmaria','Italian', 'Italy','1981-12-15','principal');

Insert INTO season VALUES (2016	, 21);

Insert INTO season VALUES (2017, 20);

Insert INTO season VALUES (2018, 21);

Insert INTO season VALUES (2019, 21);

Insert INTO season VALUES (2020, 17);

Insert INTO grand_prix VALUES ('Bahrain Grand Prix',	'Bahrain');

Insert INTO grand_prix VALUES ('Catalunya Grand Prix',	'Spain');

Insert INTO grand_prix VALUES ('Istanbul Grand Prix',	'Turkey');

Insert INTO grand_prix VALUES ('Monaco Grand Prix',		'Monaco');

Insert INTO grand_prix VALUES ('Canadian Grand Prix',	'Canada');

Insert INTO safety_car VALUES ('Porsche 914', 175);

Insert INTO safety_car VALUES ('Lamborghini Countach', 172);

Insert INTO safety_car VALUES ('Mercedes-AMG GT Black Series', 202);

Insert INTO safety_car VALUES ('Lamborghini Diablo', 201);

Insert INTO safety_car VALUES ('Mercedes-AMG GT R', 224);

Insert INTO investor VALUES ('AMD');

Insert INTO investor VALUES ('Hewlett Packard Enterprise');

Insert INTO investor VALUES ('Chrome');

Insert INTO investor VALUES ('Dell');

Insert INTO investor VALUES ('Goldman Sachs');

Insert INTO invests_in_amounts VALUES (23145731, 'platinum');

Insert INTO invests_in_amounts VALUES (17351333, 'silver');

Insert INTO invests_in_amounts VALUES (21050104, 'gold');

Insert INTO invests_in_amounts VALUES (16632288, 'silver');

Insert INTO invests_in_amounts VALUES (8282840, 'bronze');

Insert INTO works_on VALUES (1, 'Mercedes-AMG Petronas Formula 1 Team', 1);

Insert INTO works_on VALUES (2, 'Red Bull Racing', 14);

Insert INTO works_on VALUES (6, 'Red Bull Racing', 14);

Insert INTO works_on VALUES (3, 'Scuderia Ferrari', 11);

Insert INTO works_on VALUES (8, 'Scuderia Ferrari', 11);

Insert INTO works_on VALUES (4, 'McLaren F1 Team', 16);

Insert INTO works_on VALUES (7, 'McLaren F1 Team', 16);

Insert INTO works_on VALUES (5, 'Alpine F1 Team', 7);

Insert INTO works_on VALUES (9, 'Alpine F1 Team', 7);

Insert INTO maintains VALUES (1, 'Mercedes-AMG Petronas Formula 1 Team', 22);

Insert INTO maintains VALUES (2, 'Red Bull Racing', 22);

Insert INTO maintains VALUES (3, 'Scuderia Ferrari', 27);

Insert INTO maintains VALUES (8, 'Scuderia Ferrari', 27);

Insert INTO maintains VALUES (4, 'McLaren F1 Team', 21);

Insert INTO maintains VALUES (7, 'McLaren F1 Team', 21);

Insert INTO maintains VALUES (5, 'Alpine F1 Team', 35);

Insert INTO maintains VALUES (9, 'Alpine F1 Team', 35);

Insert INTO maintains VALUES (6, 'Red Bull Racing', 22);

Insert INTO maintains_cars_for VALUES ('Mercedes-AMG Petronas Formula 1 Team', 	22, '2016-11-23', null);

Insert INTO maintains_cars_for VALUES ('Red Bull Racing', 21,	'2020-3-25',	null);

Insert INTO maintains_cars_for VALUES ('Scuderia Ferrari',	27,	'2019-1-10',	null);

Insert INTO maintains_cars_for VALUES ('McLaren F1 Team',	21,	'2016-12-17',	null);

Insert INTO maintains_cars_for VALUES ('Alpine F1 Team',	35,	'2019-6-26',	null);

Insert INTO drives_on VALUES ('Mercedes-AMG Petronas Formula 1 Team',	149,	'2015-6-15',	null);

Insert INTO drives_on VALUES ('Mercedes-AMG Petronas Formula 1 Team',	148,	'2019-6-15',	null);

Insert INTO drives_on VALUES ('Red Bull Racing',	240,	'2019-4-13',	null);

Insert INTO drives_on VALUES ('Red Bull Racing',	239,	'2018-7-4',	null);

Insert INTO drives_on VALUES ('Scuderia Ferrari', 241, '2019-9-28',	null);

Insert INTO drives_on VALUES ('Scuderia Ferrari', 242, '2018-9-28',	null);

Insert INTO drives_on VALUES ('McLaren F1 Team',	132,	'2014-7-1',	null);

Insert INTO drives_on VALUES ('McLaren F1 Team',	131,	'2018-7-1',	null);

Insert INTO drives_on VALUES ('Alpine F1 Team', 164, '2018-12-15', null);

Insert INTO drives_on VALUES ('Alpine F1 Team', 163, '2019-12-15', null);

Insert INTO manages VALUES (320, 'Mercedes-AMG Petronas Formula 1 Team','2020-10-15',null);

Insert INTO manages VALUES (356, 'Red Bull Racing', '2013-8-16',null);

Insert INTO manages VALUES (322, 'Scuderia Ferrari','2018-12-15',null);

Insert INTO manages VALUES (341, 'McLaren F1 Team', '2019-12-15',null);

Insert INTO manages VALUES (275, 'Alpine F1 Team', '2018-12-15',null);

Insert INTO engineers_for VALUES ('Mercedes-AMG Petronas Formula 1 Team',	1, '2016-10-28',	null);

Insert INTO engineers_for VALUES ('Red Bull Racing', 14,	'2019-11-5',	null);

Insert INTO engineers_for VALUES ('Scuderia Ferrari',11,	'2017-6-12',	null);

Insert INTO engineers_for VALUES ('McLaren F1 Team',16,	'2020-1-29',	null);

Insert INTO engineers_for VALUES ('Alpine F1 Team',	7,	'2017-7-14',	null);

Insert INTO participated_in VALUES ('Mercedes-AMG Petronas Formula 1 Team', 2020,	2);

Insert INTO participated_in VALUES ('Red Bull Racing',	2020,	1);

Insert INTO participated_in VALUES ('Scuderia Ferrari',	2020, 7);

Insert INTO participated_in VALUES ('McLaren F1 Team',	2020, 4);

Insert INTO participated_in VALUES ('Alpine F1 Team', 2020,	9);

Insert INTO drove_during VALUES (149,	2020, 1);

Insert INTO drove_during VALUES (148,	2020, 9);

Insert INTO drove_during VALUES (240,	2020,	2);

Insert INTO drove_during VALUES (239,	2020,	14);

Insert INTO drove_during VALUES (241,	2020,	6);

Insert INTO drove_during VALUES (242,	2020,	5);

Insert INTO drove_during VALUES (132,	2020,	4);

Insert INTO drove_during VALUES (131,	2020,	7);

Insert INTO drove_during VALUES (164,	2020,	16);

Insert INTO drove_during VALUES (163,	2020,	12);

Insert INTO circuit VALUES ('Bahrain International Circuit',	'http://en.wikipedia.org/wiki/Bahrain_International_Circuit',	4.3,	'cw',	'race track',	63.4,	'Bahrain Grand Prix');

Insert INTO circuit VALUES ('Circuit de Barcelona-Catalunya',	'http://en.wikipedia.org/wiki/Circuit_de_Barcelona-Catalunya',	5.2,	'clockwise',	'race track',	45.2,	'Catalunya Grand Prix');

Insert INTO circuit VALUES ('Istanbul Park',	'http://en.wikipedia.org/wiki/Istanbul_Park', 4.5	, 'clockwise', 'race track', 30.5,	'Istanbul Grand Prix');

Insert INTO circuit VALUES ('Circuit de Monaco',	'http://en.wikipedia.org/wiki/Circuit_de_Monaco',	5.5,	'counterclockwise',	'street track',	42,	'Monaco Grand Prix');

Insert INTO circuit VALUES ('Circuit Gilles Villeneuve', 	'http://en.wikipedia.org/wiki/Circuit_Gilles_Villeneuve',	5.6,	'counterclockwise', 'race track',	20.3, 'Canadian Grand Prix');

Insert INTO invests_in VALUES ('AMD',	'Mercedes-AMG Petronas Formula 1 Team' , '2015-6-15',	Null, 23145731);

Insert INTO invests_in VALUES ('Hewlett Packard Enterprise', 'Mercedes-AMG Petronas Formula 1 Team', '2020-4-13',	Null, 17351333);

Insert INTO invests_in VALUES ('Chrome',	'McLaren F1 Team',	'2020-9-28',	Null, 21050104);

Insert INTO invests_in VALUES ('Dell',	'McLaren F1 Team', '2014-7-1', Null,	16632288);

Insert INTO invests_in VALUES ('Goldman Sachs', 'McLaren F1 Team', '2018-12-15', Null,	8282840);

Insert INTO race VALUES (400, '2020-7-21', 10, '00:00:1.4',	'Porsche 914', 	                        2,	149,	2020, 'Bahrain International Circuit',1);

Insert INTO race VALUES (401, '2022-10-18', 10,  '00:00:2.3',	'Lamborghini Countach',         	6,	149,	2020,	'Circuit de Barcelona-Catalunya',6);

Insert INTO race VALUES (402,	'2020-12-17',	17,	'00:00:1.5',	'Mercedes-AMG GT Black Series', 3, 241, 2020, 'Istanbul Park',2);

Insert INTO race VALUES (403,	'2020-10-15', 27,	'00:00:1.9',	'Lamborghini Diablo',           7,  149,	2020, 'Circuit de Monaco',4);

Insert INTO race VALUES (404, '2020-7-25', 	21,	'00:00:3.4',	'Mercedes-AMG GT R', 	            4,	164,	2020,	 'Circuit Gilles Villeneuve',3);


Insert INTO raced VALUES (400,	149,	1);

Insert INTO raced VALUES (401,	149,	2);

Insert INTO raced VALUES (402,	149,	4);

Insert INTO raced VALUES (403,	149,	1);

Insert INTO raced VALUES (404,	149,	3);


Insert INTO raced VALUES (400,	240,	2);

Insert INTO raced VALUES (401,	240,	1);

Insert INTO raced VALUES (402,	240,	5);

Insert INTO raced VALUES (403,	240,	2);

Insert INTO raced VALUES (404,	240,	9);




Insert INTO raced VALUES (401,	148,	3);

Insert INTO raced VALUES (401,	239,	10);

Insert INTO raced VALUES (402,	241,	3);

Insert INTO raced VALUES (402,	242,	1);

Insert INTO raced VALUES (403,	132,	5);

Insert INTO raced VALUES (403,	131,	4);

Insert INTO raced VALUES (404,	164,	8);

Insert INTO raced VALUES (404,	163,	7);
