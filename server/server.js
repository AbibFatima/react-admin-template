const express = require('express');
const app = express();
const { pool } = require('./dbConfig');
const bcrypt = require('bcrypt');
//const cors = require('cors');
const session = require('express-session');
const flash = require('express-flash');
const passport = require('passport');
const initializePassport = require('./passportConfig');
initializePassport(passport);


app.use(express.json());
//app.use(cors());
// app.use(express.urlencoded({extended: false}));

app.use(session({
    secret : 'secret',
    resave : false,
    saveUninitialized:  false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// app.get('/api/login', (req,res) => {
//     res.render('login');
// });

// app.get('/api/register',checkAuthenticated, (req,res) => {
//     res.render('register');
// });

// app.get('/api/login',checkAuthenticated, (req,res) => {
//     res.render('login');
// });

// app.get('/api/dashboard/default', checkNotAuthenticated, (req,res) => {
//     res.render('dashboard/default', { user: req.user.name });
// });

// function checkAuthenticated(req, res,next){
//     if(req.isAuthenticated()){
//         return res.redirect('/dashboard/default');
//     }
//     next();
// }

// function checkNotAuthenticated( req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }


//____________________________________________________________
//              TEST
//____________________________________________________________
// app.get("/api", (req,res) =>{
//   res.json({"users" : ["Fatima", "Sarra","Soumia", "Maria"]});
// })
//____________________________________________________________

//____________________________________________________________
//              there s errors with throw err 
//____________________________________________________________
// app.post('/api/register', async (req,res) => {
//   let { firstname, lastname , email, password } = req.body;

//   console.log({
//       firstname,
//       lastname,
//       email,
//       password
//   });

//   let errors = [];

//   if ( password.length < 4 ){
//       errors.push({ message: "Password should be at least 4 characters" });
//       res.json({ message: 'Invalid email or password' }); 
//   }

//   if(errors.length > 0){
//       res.render('/register',{ errors });
//   } else {
//       // form validation has passed
//       let hashedPassword = await bcrypt.hash(password, 10);
//       console.log(hashedPassword);

//       pool.query(
//           `SELECT * FROM usersDjezzy
//           WHERE email = $1 `,
//           [email], 
//           (err, results) => {
//               if (err){
//                   throw err;
//               } 
//               // the existing email 
//               console.log(results.rows);

//               if(results.rows.length > 0){
//                   errors.push({message : 'Email already registered'});
//                   res.render('/register', {errors});
//               } else {
//                   pool
//                   .query(
//                       `INSERT INTO usersDjezzy (firstname, lastname, email, password) 
//                       VALUES ($1, $2, $3, $4)
//                       RETURNING id, password`, 
//                       [firstname, lastname, email, hashedPassword], 
//                       (err, results) => {
//                           if (err){
//                               throw err;
//                           }
//                           console.log(results.rows);
//                           req.flash('success_msg', 'You are now registered. Please log in');
//                           res.redirect('/api/login');
//                       }
//                   )
//               }
//           }
//       );
//   }
// });


app.post('/api/register', async (req, res) => {
  
  let { firstname, lastname, email, password } = req.body;

  console.log({
    firstname,
    lastname,
    email,
    password
  });

  //let errors = [];

  // form validation has passed
  let hashedPassword = await bcrypt.hash(password, 10);

  pool.query(
    `SELECT * FROM usersDjezzy WHERE email = $1`,
    [email],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Internal server error' });
      }

      if (results.rows.length > 0) {
        //errors.push({ message: 'Email already registered' });
        res.status(400).json({ message: 'Email already registered' });
      } else {
        pool.query(
          `INSERT INTO usersDjezzy (firstname, lastname, email, password) 
            VALUES ($1, $2, $3, $4)
            RETURNING id, password`,
          [firstname, lastname, email, hashedPassword],
          (err, results) => {
            if (err) {
              res.status(500).json({ error: 'Internal server error' });
            }
            console.log(results.rows);
            //req.flash('success_msg', 'You are now registered. Please log in');
            res.status(201).json({ message: 'User registered successfully' });
          }
        );
      }
    }
  );
});

//______________________________________________________________________________
// Registration endpoint : 
//          it works but not all the functionalities needed
//______________________________________________________________________________
// app.post('/api/register', async (req, res) => {
//   try {
//     const { firstname, lastname, email, password } = req.body;

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Save user data to the database
//     await pool.query(
//       `INSERT INTO usersDjezzy (firstname, lastname, email, password) 
//       VALUES ($1, $2, $3, $4)`,
//       [firstname, lastname, email, hashedPassword]
//     );

//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     console.error('Error registering user:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });
//______________________________________________________________________________

//============================IT CAUSES PROBLEMS============================
// app.post('/api/login', passport.authenticate('local',{
//     successRedirect: '/dashboard/default',
//     failureRedirect: '/login',
//     failureFlash: true
// }))
//==========================================================================

//______________________________________________________________________________
// Login endpoint
//          it works ( forgot about passportConfig )
//______________________________________________________________________________
// app.post('/api/login', passport.authenticate('local'), async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Retrieve user from the database by email
//     const user = await pool.query(`SELECT * FROM usersDjezzy WHERE email = $1`, [email]);

//     // Check if user exists and verify password
//     if (user.rows.length === 0 || !(await bcrypt.compare(password, user.rows[0].password))) {
//       res.status(401).json({ message: 'Invalid email or password' }); 
//     } else {
//       res.status(200).json({ message: 'Login successful', user: user.rows[0] }); 
//     }
//   } catch (error) {
//     console.error('Error logging in:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

app.post('/api/login', passport.authenticate('local', {
    successRedirect : 'dashboard/default',
    failureRedirect : 'login',
    failureFlash : true
  })
);

// app.get('/api/logout', (req,res) => {
//   req.logout((err) => {
//       if (err) {
//           console.error(err);
//           return res.redirect('/api/login'); 
//       }
//       //req.flash('success_msg', 'You have logged out');
//       res.redirect('/api/login');
//   });
// });

// Logout route handler
app.get('/api/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err); 
        }
    //req.flash('success_msg', 'You have logged out');
    res.status(200).json({ message: 'Logout successful' });
  });
});


// Dashboard endpoint
app.get('/api/dashboard/default', checkAuthenticated, (req, res) => {
  const { firstname } = req.user;
  res.json({ user : firstname });
});

// Middleware to check if the user is authenticated
function checkAuthenticated(req, res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
}


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

