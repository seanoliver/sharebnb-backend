
// import passport from 'passport';
// import LocalStrategy from 'passport-local';



// // Define the verify callback for the local strategy
// const verifyCallback = function(username, password, done) {
//   // Find the user in the database based on the provided username
//   User.getUser({ username: username }, function(err, user) {
//     if (err) { return done(err); } // An error occurred
//     if (!user) {
//       // No user found with the given username
//       return done(null, false, { message: 'Incorrect username.' });
//     }
//     if (!user.validPassword(password)) {
//       // Password is incorrect
//       return done(null, false, { message: 'Incorrect password.' });
//     }
//     // Authentication was successful
//     return done(null, user);
//   });
// };

// // Create an instance of the local strategy
// const localStrategy = new LocalStrategy(verifyCallback);

// // Pass the strategy instance to passport.use
// passport.use(localStrategy);

// export default passport;

