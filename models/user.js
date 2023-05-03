"use strict";
import { LicenseManagerUserSubscriptions } from "aws-sdk";
import db from "../db";
import bcrpyt from "bcrypt";
import { BCRYPT_WORK_FACTOR } from "../config";
import { BadRequestError, UnauthorizedError } from "../expressError";

class User {
  constructor({ username, password, firstName, lastName, email }) {
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
      `
        SELECT username,
               password,
               first_name AS "firstName",
               last_name  AS "lastName",
               email,
               is_admin   AS "isAdmin"
        FROM users
        WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (user) {
      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      if (isValid === true) {
        delete user.password;
        return user;
      }
    }

    throw new UnauthorizedError("Invalid username/password");
  }

  static async getUser({ username }) {
    const result = await db.query(
      `
    select username,
          password,
          first_name as firstName,
          last_name as lastName,
          email
    from users
    where username = $1`,
      [username]
    );
    validUser = new User(result.rows[0]);

    return validUser;
  }

  static async getAll() {
    const result = await db.query(
      `
    select username,
          password,
          first_name as firstName,
          last_name as lastName,
          email
    from users
    `
    );
    return result.rows;
  }
}
export default User;