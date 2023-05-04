"use strict";

/** Routes for Users */
const bcrypt = require('bcrypt');
const jsonschema = require("jsonschema");
const express = require("express");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

/** POST: register new user
 *
 */
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  // Hash the password before storing it in the database
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) { return res.status(500).json({ error: err.message }); }
    const newUser = new User({ username, password: hashedPassword });
    newUser.register((err) => {
      if (err) { return res.status(500).json({ error: err.message }); }
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// User login route
app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
  res.status(200).json({ message: 'Logged in successfully' });
});


/** GET / => { users: [ {username, firstName, lastName, email }, ... ] }
 *
 * Returns list of all users.
 *
 **/

router.get("/", async function (req, res, next) {
  const users = await User.getAll();
  return res.json({ users });
});


/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, jobs }
 *   where jobs is { id, title, companyHandle, companyName, state }
 *
 **/

router.get("/:username", ensureCorrectUser, async function (req, res, next) {
  const user = await User.get(req.params.username);
  return res.json({ user });
});


/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email }
 *
 * Returns { username, firstName, lastName, email, isAdmin }
 *
 * Authorization required: same-user-as-:username
 **/

router.patch("/:username", ensureCorrectUser, async function (req, res, next) {
  const validator = jsonschema.validate(
      req.body,
      userUpdateSchema,
      { required: true },
  );
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const user = await User.update(req.params.username, req.body);
  return res.json({ user });
});


/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: same-user-as-:username
 **/

router.delete("/:username", ensureCorrectUser, async function (req, res, next) {
  await User.remove(req.params.username);
  return res.json({ deleted: req.params.username });
});


/** POST /[username]/jobs/[id]  { state } => { application }
 *
 * Returns {"applied": jobId}
 *
 * Authorization required: admin or same-user-as-:username
 * */

router.post("/:username/jobs/:id", ensureCorrectUser, async function (req, res, next) {
  const jobId = +req.params.id;
  await User.applyToJob(req.params.username, jobId);
  return res.json({ applied: jobId });
});



// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

module.exports = router;
