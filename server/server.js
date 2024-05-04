// const express = require('express');
// const app = express();
// const { pool } = require('./dbConfig');
// const bcrypt= require('bcrypt');
// const session = require('express-session');
// const flash = require('express-flash');
// const passport = require('passport');
// const cors = require('cors');
// const initializePassport = require('./passportConfig');
// //const path = require('../src/pages/authentication/');
// initializePassport(passport);

// const PORT = process.env.PORT || 3000;

// app.set('view engine', 'ejs');
// //app.set('views', path.join(__dirname, 'views'));
// app.use(express.urlencoded({extended: false}));

// app.use(session({
//     secret : 'secret',
//     resave : false,
//     saveUninitialized:  false
// }));

// app.use(passport.initialize());
// app.use(passport.session());

// app.use(flash());
// app.use(cors());

// app.get('/free/login', (req,res) => {
//     res.render('auth/login');
// });

// app.get('/free/register',checkAuthenticated, (req,res) => {
//     res.render('src/pages/authentication/auth-forms/AuthRegister');
// });

// app.get('/free/login',checkAuthenticated, (req,res) => {
//     res.render('auth/login');
// });

// app.get('/free/dashboard/default', checkNotAuthenticated, (req,res) => {
//     res.render('dashboard/default', { user: req.user.name });
// });





// app.post('/free/login', passport.authenticate('local',{
//     successRedirect: '/free/dashboard/default',
//     failureRedirect: '/free/login',
//     failureFlash: true
// }))

// function checkAuthenticated(req, res,next){
//     if(req.isAuthenticated()){
//         return res.redirect('/free/dashboard/default');
//     }
//     next();
// }

// function checkNotAuthenticated( req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/free/login");
// }


// app.listen(PORT, () => {
//     console.log(`Server running on Port ${PORT}`);
// });


const express = require('express');
const app = express();
const { pool } = require('./dbConfig');
const bcrypt = require('bcrypt');
//const cors = require('cors');

app.use(express.json());
//app.use(cors());

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


// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Retrieve user from the database by email
    const user = await pool.query(`SELECT * FROM usersDjezzy WHERE email = $1`, [email]);

    // Check if user exists and verify password
    if (user.rows.length === 0 || !(await bcrypt.compare(password, user.rows[0].password))) {
      res.status(401).json({ message: 'Invalid email or password' }); 
    } else {
      res.status(200).json({ message: 'Login successful', user: user.rows[0] }); 
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.get('/api/logout', (req,res) => {
  req.logout((err) => {
      if (err) {
          console.error(err);
          return res.redirect('/api/login'); 
      }
      //req.flash('success_msg', 'You have logged out');
      res.redirect('/api/login');
  });
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

