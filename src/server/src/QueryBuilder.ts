import { DeleteQuery, FilterQuery, InsertQuery, JoinQuery, UpdateQuery } from './rest/interfaces';

export class QueryBuilder {
  // for any query that is invalid (meaning the query interface is malformed, or the operation itself is invalid.
  // Example: a FilterQuery with "driver" as the table name, and a filter that specifies the driver.id == "john"
  // throw an error with a descriptive error message (caught by the caller)

  static buildFilterQuery(filterQuery: FilterQuery): string {
    let query = 'SELECT ';
    for (let i = 0; i < filterQuery.selectedColumns.length; i++) {
      query += filterQuery.selectedColumns[i];
      if (i != filterQuery.selectedColumns.length - 1) query += ', ';
    }
    if (filterQuery.selectedColumns.length === 0) {
      throw new Error('Please select at least one column');
    }
    query += ' FROM ';
    query += filterQuery.tableName;
    if (filterQuery.filter) {
      query += ' WHERE ';
      const logicalOperator = filterQuery.filter.type === 'and' ? ' AND ' : ' OR ';
      const filterItems = filterQuery.filter.filterItems;
      for (let i = 0; i < filterItems.length; i++) {
        if(!filterItems[i].value) {
          throw new Error("filter items are invalid")
        }
        query += filterItems[i].column + ' ' + filterItems[i].compareOperator + ' ' + filterItems[i].value;
        if (i != filterItems.length - 1) query += logicalOperator;
      }
    }

    return query;
  }

  static buildJoinQuery(joinQuery: JoinQuery): string {

    let query = 'SELECT ';
    for (let i = 0; i < joinQuery.selectedColumns.length; i++) {
      query += joinQuery.selectedColumns[i];
      if (i != joinQuery.selectedColumns.length - 1) query += ', ';
    }
    if (joinQuery.selectedColumns.length === 0) {
      throw new Error('Please select at least one column');
    }
    query += ' FROM ' + joinQuery.tableName1 + ', ' + joinQuery.tableName2 + ', ' + joinQuery.tableName3;
    query += ' WHERE ' + joinQuery.tableName1 + '.id = ' + joinQuery.tableName3 + '.' + joinQuery.tableName1 + '_id';
    query += ' AND ' + joinQuery.tableName3 + '.' + joinQuery.tableName2 + '_id = ' + joinQuery.tableName2 + '.id';
    if (joinQuery.filter && joinQuery.filter.filterItems.length > 0) {
      query += ' AND (';
    }
    if (joinQuery.filter && joinQuery.filter.filterItems.length > 0) {
      const logicalOperator = joinQuery.filter.type === 'and' ? ' AND ' : ' OR ';
      const filterItems = joinQuery.filter.filterItems;
      for (let i = 0; i < filterItems.length; i++) {
        if(!filterItems[i].value) {
          throw new Error("filter items are invalid")
        }
        query += filterItems[i].column + ' ' + filterItems[i].compareOperator + ' ' + filterItems[i].value;
        if (i != filterItems.length - 1) query += logicalOperator;
      }
    }
    if (joinQuery.filter && joinQuery.filter.filterItems.length > 0) {
      query += ')';
    }

    return query;
  }

  static buildInsertQuery(insertQuery: InsertQuery): string {
    let query = "INSERT INTO circuit VALUES (" + "'" + insertQuery.columnValues.name + "'";
    insertQuery.columnValues.map_url ? query += ",'" + insertQuery.columnValues.map_url + "'" : query += "," + "Null";
    insertQuery.columnValues.last_length_used ? query += "," + insertQuery.columnValues.last_length_used : query += "," + "Null"
    insertQuery.columnValues.direction ? query += ",'" + insertQuery.columnValues.direction + "'" : query += "," + "Null";
    insertQuery.columnValues.type ? query += ",'" + insertQuery.columnValues.type + "'" : query += "," + "Null";
    insertQuery.columnValues.change_in_elevation ? query += "," + insertQuery.columnValues.change_in_elevation : query += "," +"Null";
    query += ",'" + insertQuery.columnValues.grand_prix_title + "')"
    return query;
  }

  static buildDeleteQuery(deleteQuery: DeleteQuery): string {
    let query = 'DELETE FROM ';
    query += deleteQuery.tableName;
    if (deleteQuery.filter) {
      if(deleteQuery.filter.filterItems.length === 0) {throw new Error("Please enter numbers for any filter items")}
      query += ' WHERE ';
      const logicalOperator = deleteQuery.filter.type === 'and' ? ' AND ' : ' OR ';
      const deleteItems = deleteQuery.filter.filterItems;
      for (let i = 0; i < deleteItems.length; i++) {
        if(deleteItems[i].value == "") {throw new Error("filter items are invalid")}
        query += deleteItems[i].column + deleteItems[i].compareOperator + deleteItems[i].value;
        if (i != deleteItems.length - 1) query += logicalOperator;
      }
    }
    return query;
  }

  static buildUpdateQuery(updateQuery: UpdateQuery): string {
    let query = 'UPDATE ';
    query += updateQuery.tableName;
    query += ' SET ';
    if (Object.keys(updateQuery.newColumnValues).length === 0) {
      throw new Error('Please specify at least one column to update');
    }
    let temp_query = '';


    for (const col in updateQuery.newColumnValues) {
      const value = String(updateQuery.newColumnValues[col as keyof typeof updateQuery.newColumnValues]);
      query += col + ' = ' + `'` + value + `'` + ', ';
    }
    temp_query = query.slice(0,-2);

    if (updateQuery.filter) {
      temp_query += ' WHERE ';
      const logicalOperator = updateQuery.filter.type === 'and' ? ' AND ' : ' OR ';
      const filterItems = updateQuery.filter.filterItems;
      for (let i = 0; i < filterItems.length; i++) {
        if(filterItems[i].value == "") {throw new Error("filter items are invalid")}
        query += filterItems[i].column + filterItems[i].compareOperator + filterItems[i].value;
        temp_query += filterItems[i].column + ' ' + filterItems[i].compareOperator + ' ' + filterItems[i].value;
        if (i != filterItems.length - 1) temp_query += logicalOperator;
      }
    }

    return temp_query;
  }



  static getAggregationWithGroupByQuery(): string {
    let query = `SELECT maxpods.tn AS Team_Name,
       d.name            AS Driver_Name,
       dd.season_year    ,
       maxpods.pods AS Podiums    
FROM   driver d,
       drives_on dsd,
       drove_during dd,
       (
                SELECT   dsd.team_name  AS tn,
                         max(d.podiums) AS pods
                FROM     driver d,
                         drives_on dsd,
                         drove_during dd
                WHERE    dd.season_year = 2020
                AND      dd.driver_id = dsd.driver_id
                AND      d.id = dsd.driver_id
                GROUP BY dsd.team_name) maxpods
WHERE  dd.season_year = 2020
AND    dd.driver_id = dsd.driver_id
AND    d.id = dsd.driver_id
AND    d.podiums = maxpods.pods
AND    dsd.team_name = maxpods.tn`;

    return query;
  }

  static getAggregationWithHavingQuery(): string {
    let query = `SELECT ii.team_name, max(te.world_championships) AS world_championships
                FROM invests_in ii, team te
                WHERE te.name = ii.team_name
                GROUP by ii.team_name
                HAVING count(*) < 3`;

    return query;
  }


  static getNestedAggregationWithGroupByQuery(): string {
    let query = `SELECT dsd.team_name
                 FROM driver d, drives_on dsd, drove_during dd 
                 WHERE dd.driver_id = dsd.driver_id AND d.id = dsd.driver_id AND dd.season_year = 2020 
                 GROUP By dsd.team_name 
                 HAVING avg(d.podiums) >= (SELECT avg(d1.podiums) 
                                           FROM driver d1)`;


    return query;
  }

  static getDivisionQuery(): string {
    let query = `SELECT d.name, d.nationality, d.world_championships
                FROM driver d
                WHERE NOT EXISTS ((SELECT name
                                  FROM circuit)
                          EXCEPT  
                                (SELECT ra.circuit_name
                                   FROM raced r, race ra
                                   WHERE d.id = r.driver_id and r.race_id = ra.id))`;

    return query;
  }

}
