export const tables = new Map();

tables.set("team",
  [
      { col: "name" ,str:true},
      { col: "base_location" ,str:true},
      { col: "owner" ,str:true},
      { col: "first_team_entry" ,str:true},
      { col: "fastest_laps" ,str:false},
      { col: "world_championships",str:false}
  ]);

tables.set("driver",
  [
      { col: "id" ,str:false},
      { col: "name" ,str:true},
      { col: "nationality" ,str:true},
      { col: "dob" ,str:true},
      { col: "place_of_birth" ,str:true},
      { col: "world_championships" ,str:false},
      { col: "fastest_laps" ,str:false},
      { col: "races_won" ,str:false},
      { col: "podiums",str:false}
  ]);

tables.set("car",
  [
      { col: "number" ,str:false},
      { col: "team_name" ,str:true},
      { col: "power_unit" ,str:true},
      { col: "chassis_model" ,str:true},
      { col: "to_date" ,str:true},
      { col: "from_date" ,str:true},
      { col: "driver_id",str:false}
  ]);
tables.set("pit_crew",
  [
      { col: "id" ,str:false},
      { col: "name" ,str:true},
      { col: "nationality" ,str:true},
      { col: "dob" ,str:true},
      { col: "place_of_birth" ,str:true},
      { col: "position" ,str:true},
      { col: "best_time",str:true}
  ]);

tables.set("engineer",
  [
      { col: "id" ,str:false},
      { col: "name" ,str:true},
      { col: "nationality" ,str:true},
      { col: "dob" ,str:true},
      { col: "place_of_birth" ,str:true},
      { col: "education_level",str:true}
  ]);

tables.set("manager",
  [
      { col: "id" ,str:false},
      { col: "name" ,str:true},
      { col: "nationality" ,str:true},
      { col: "place_of_birth" ,str:true},
      { col: "dob" ,str:true},
      { col: "role",str:true}
  ]);

tables.set("season",
  [
      { col: "year" ,str:false},
      { col: "races",str:false}
  ]);

tables.set("grand_prix",
  [
      { col: "title" ,str:true},
      { col: "country",str:true}
  ]);

tables.set("safety_car",
  [
      { col: "model" ,str:true},
      { col: "top_speed",str:false}
  ]);

tables.set("investor",
  [
      { col: "name",str:true}
  ]);

tables.set("invests_in_amounts",
  [
      { col: "amount" ,str:false},
      { col: "level",str:true}
  ]);

tables.set("works_on",
  [
      { col: "car_number" ,str:false},
      { col: "team_name" ,str:true},
      { col: "engineer_id",str:false}
  ]);

tables.set("maintains",
  [
      { col: "car_number" ,str:false},
      { col: "team_name" ,str:true},
      { col: "pit_crew_id",str:false}
  ]);

tables.set("maintains_cars_for",
  [
      { col: "team_name" ,str:true},
      { col: "pit_crew_id" ,str:false},
      { col: "from_date" ,str:true},
      { col: "to_date",str:true}
  ]);

tables.set("drives_on",
  [
      { col: "team_name" ,str:true},
      { col: "driver_id" ,str:false},
      { col: "from_date" ,str:true},
      { col: "to_date",str:true}
  ]);

tables.set("manages",
  [
      { col: "manager_id" ,str:false},
      { col: "team_name" ,str:true},
      { col: "from_date" ,str:true},
      { col: "to_date",str:true}
  ]);

tables.set("engineers_for",
  [
      { col: "team_name" ,str:true},
      { col: "engineer_id" ,str:false},
      { col: "from_date" ,str:true},
      { col: "to_date",str:true}
  ]);

tables.set("participated_in",
  [
      { col: "team_name" ,str:true},
      { col: "season_year" ,str:false},
      { col: "constructor_rank",str:false}
  ]);

tables.set("drove_during",
  [
      { col: "driver_id" ,str:false},
      { col: "season_year" ,str:false},
      { col: "driver_rank",str:false}
  ]);

tables.set("circuit",
  [
      { col: "name" ,str:true},
      { col: "map_url" ,str:true},
      { col: "last_length_used" ,str:false},
      { col: "direction" ,str:true},
      { col: "type" ,str:true},
      { col: "change_in_elevation" ,str:false},
      { col: "grand_prix_title",str:true}
  ]);

tables.set("invests_in",
  [
      { col: "investor_name" ,str:true},
      { col: "team_name" ,str:true},
      { col: "start_date" ,str:true},
      { col: "end_date" ,str:true},
      { col: "amount",str:false}
  ]);

tables.set("race",
  [
      { col: "id" ,str:false},
      { col: "date" ,str:true},
      { col: "temperature" ,str:false},
      { col: "fastest_lap" ,str:true},
      { col: "safety_car_model" ,str:true},
      { col: "dnf_count" ,str:false},
      { col: "pole_sitter_id" ,str:false},
      { col: "season_year" ,str:false},
      { col: "circuit_name" ,str:true},
      { col: "red_flag_count",str:false}
  ]);

tables.set("raced",
  [
      { col: "race_id" ,str:false},
      { col: "driver_id" ,str:false},
      { col: "placement",str:false}
  ]);
