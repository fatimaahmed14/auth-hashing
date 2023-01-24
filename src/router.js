const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET

const router = express.Router();
const mockUser = {
    username: 'authguy',
    password: 'mypassword',
    profile: {
        firstName: 'Ben',
        lastName: 'Dover',
    }
}

router.post('/register', async (req, res) => {
    const { username, password } = req.body

    const saltRound = 10
    const salt = bcrypt.genSaltSync(saltRound)

    const hash = bcrypt.hashSync(password, salt)

    res.json({ username, password: hash })
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body

    if (username === mockUser.username) {

        if (password === mockUser.password) {
            const token = jwt.sign(username, secret)
            res.json({ token })
        } else {
            res.status(404).json({ error: "incorrect password" })
        }

    } else {
        res.status(404).json({ error: "username not found" })
    }

});

module.exports = router;

// async function checkUser(username, password) {
//     //... fetch user from a db etc.

//     const match = await bcrypt.compare(password, user.passwordHash);

//     if (match) {
//         //login
//     }

//     //...
// }