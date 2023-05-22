export interface FilterQuery {
  tableName: TableName;
  selectedColumns: ColumnName[];
  filter?: Filter;
}

export interface JoinQuery {
  tableName1: 'driver';
  tableName2: 'race';
  tableName3: 'raced';
  filter?: Filter;
  selectedColumns: ColumnName[];
  // automatic filter should be applied for this query -- (driver.id = raced.driver_id AND raced.race_id = race.id)
}

export interface InsertQuery {
  tableName: 'circuit';
  columnValues: {
    name: string;
    map_url?: string;
    last_length_used?: number;
    direction?: string;
    type?: string;
    change_in_elevation?: string;
    grand_prix_title: string;
  };
}

export interface UpdateQuery {
  tableName: 'driver';
  filter?: Filter;
  newColumnValues: {
    name?: string;
    nationality?: string;
    dob?: string;
    place_of_birth?: string;
    world_championships?: number;
    fastest_laps?: number;
    races_won?: number;
    podiums?: number;
  };
}

export interface DeleteQuery {
  tableName: 'season';
  filter?: Filter;
}

interface Filter {
  type: 'and' | 'or';
  filterItems: FilterItem[];
}

interface FilterItem {
  column: ColumnName;
  compareOperator: '>' | '<' | '>=' | '<=' | '=' | '!=';
  value: Value;
}

export type TableName = string;
export type ColumnName = string;
export type Value = string;
