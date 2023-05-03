const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../../models/User');

router.get("/test", (req, res) => res.json({ msg: "This is the users route" }));

router.post('/register', (req, res) => {
    //Check for duplicate emails
    User.findOne({ email: req.body.email })
    .then(user => {
        if (user) {
            //Throw a 400 error if the email address already exists
            return res.status(400).json({email: "A user has already registered with this address"})
        } else {
            //Otherwise create a new user
            const newUser = new User({
                handle: req.body.handle,
                email: req.body.email,
                password: req.body.password
            })
            //Salt and hash the password, then save the user
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
                })
            })
        }
    })
})

//A route to allow users to login 
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
    .then(user => {
        if(!user) {
            return res.status(404).json({email: 'This user does not exist'})
        }

        bcrypt.compare(password, user.password)
        .then(isMatch => {
            if(isMatch) {
                res.json({msg: 'Succcess'});
            } else {
                return res.status(400).json({password: 'Incorrect password'});
            }
        })
    })
})

module.exports = router;