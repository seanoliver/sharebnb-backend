"use strict";

/** Database setup for sharebnb */

const { Client } = require("pg");
import {Client} from 'pg';

import { getDatabaseUri } from "./config";

const db = new Client({
  connectionString: getDatabaseUri(),
});

db.connect();

module.exports = db;
