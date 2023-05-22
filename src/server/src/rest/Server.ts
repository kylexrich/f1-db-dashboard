import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import * as http from 'http';
import open from 'open';
import { execute, pgClient } from '../db';
import { QueryBuilder } from '../QueryBuilder';

export default class Server {
  private readonly port: number;
  private express: Application;
  private server: http.Server | undefined;

  constructor(port: number) {
    console.info(`Server::<init>( ${port} )`);
    this.port = port;
    this.express = express();

    this.registerMiddleware();
    this.registerRoutes();
    this.express.use(express.static('../public'));
  }

  public start(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.server !== undefined) {
        console.error('Server already listening');
        reject();
      } else {
        this.server = this.express
          .listen(this.port, () => {
            console.info(`Server listening on port: ${this.port}`);
            open('http://localhost:1337/');
            resolve();
          })
          .on('error', (err: Error) => {
            console.error(`Server start() ERROR: ${err.message}`);
            reject(err);
          });
      }
    });
  }

  public async stop(): Promise<void> {
    await pgClient.end();
    return new Promise((resolve, reject) => {
      if (this.server === undefined) {
        console.error('Server not started');
        reject();
      } else {
        this.server.close(() => {
          console.info('Server closed');
          resolve();
        });
      }
    });
  }

  private registerMiddleware() {
    this.express.use(express.json());
    this.express.use(express.raw({ type: 'application/*', limit: '10mb' }));
    this.express.use(cors());
  }

  private registerRoutes() {
    this.express.post('/filter', this.getFilteredData);
    this.express.post('/join', this.getJoinedRaceDriverData);
    this.express.put('/insert', this.insertCircuit);
    this.express.post('/update', this.updateDriver);
    this.express.delete('/delete', this.deleteSeason);
    this.express.get('/hardcoded/agg/groupby', this.getAggregationWithGroupByData);
    this.express.get('/hardcoded/agg/having', this.getAggregationWithHavingData);
    this.express.get('/hardcoded/agg/nestedgroupby', this.getNestedAggregationWithGroupByData);
    this.express.get('/hardcoded/division', this.getDivisionData);
  }

  // EXAMPLE request handler
  private async getFilteredData(req: Request, res: Response) {
    try {
      const filterQuery = QueryBuilder.buildFilterQuery(req.body);
      const queryResult = await execute(filterQuery);
      try {
        if (!queryResult || !queryResult?.rows || queryResult?.rows.length === 0 || !queryResult?.rows) {
          throw new Error('No data found!');
        }
      } catch (err) {
        throw new Error('No data found!');
      }
      res.status(200).json({ result: queryResult });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  private async getJoinedRaceDriverData(req: Request, res: Response) {
    try {
      const joinQuery = QueryBuilder.buildJoinQuery(req.body);
      const queryResult = await execute(joinQuery);
      if (!queryResult?.rows || queryResult?.rows.length === 0 || !queryResult?.rows) {
        throw new Error('No data found!');
      }
      res.status(200).json({ result: queryResult });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  private async insertCircuit(req: Request, res: Response) {
    try {
      if(!('name' in req.body.columnValues) || !req.body.columnValues.name || req.body.columnValues.name === "") {
        throw new Error('Name is required!');
      }
      const insertQuery = QueryBuilder.buildInsertQuery(req.body);
      const queryResult = await execute(
        insertQuery
      );
      const newTable = await execute("SELECT * FROM circuit");
      if(!queryResult && newTable) {
        for(const row of newTable.rows) {
          if(row[0] === req.body.columnValues.name) {
            throw new Error("Circuit already exists")
          } else  if(row[0] === newTable.rows[newTable.rows.length - 1][0]){
            throw new Error("Url already exists")
          }

        }
      }
      res.status(200).json({ result: newTable});
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  private async deleteSeason(req: Request, res: Response) {
    try {
      const deleteQuery = QueryBuilder.buildDeleteQuery(req.body);
      const oldTable = await execute("SELECT * FROM season");
      await execute(deleteQuery);
      const newTable = await execute("SELECT * FROM season");
      if(oldTable?.rows.length === newTable?.rows.length) {
        throw new Error("No seasons deleted");
      }
      res.status(200).json({ result: newTable});
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  private async updateDriver(req: Request, res: Response) {
    try {
      const updateQuery = QueryBuilder.buildUpdateQuery(req.body);
      const result  = await execute(updateQuery);
      if(!result) {
        throw new Error('No drivers updated. There was an error with your update!');
      }
      const newTable = await execute("SELECT * FROM driver");
      res.status(200).json({ result: newTable});
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }



  private async getAggregationWithGroupByData(req: Request, res: Response) {
    try {
      const groupQuery = QueryBuilder.getAggregationWithGroupByQuery();
      const queryResult = await execute(groupQuery);

      if (!queryResult?.rows || queryResult?.rows.length === 0 || !queryResult?.rows) {
        throw new Error("No data found!");
      }
      res.status(200).json({ result: queryResult});
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  private async getAggregationWithHavingData(req: Request, res: Response) {
    try {
      const havingQuery = QueryBuilder.getAggregationWithHavingQuery();
      const queryResult = await execute(havingQuery);

      if (!queryResult || queryResult?.rows.length === 0 || !queryResult?.rows) {
        throw new Error("No data found!");
      }

      res.status(200).json({ result: queryResult});

    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  private async getNestedAggregationWithGroupByData(req: Request, res: Response) {
    try {
      const nestedQuery = QueryBuilder.getNestedAggregationWithGroupByQuery();
      const queryResult = await execute(nestedQuery);

      if (!queryResult || queryResult?.rows.length === 0 || !queryResult?.rows) {
        throw new Error("No data found!");
      }
      res.status(200).json({ result: queryResult});
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }

  private async getDivisionData(req: Request, res: Response) {
    try {
      const divisonQuery = QueryBuilder.getDivisionQuery();
      const queryResult = await execute(divisonQuery);

      if (!queryResult || queryResult?.rows.length === 0 || !queryResult?.rows) {
        throw new Error("No data found!");
      }

      res.status(200).json({ result: queryResult});

    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }
}
