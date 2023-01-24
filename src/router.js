const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password } = req.body

    const saltRound = 10
    const salt = bcrypt.genSaltSync(saltRound)

    const hash = bcrypt.hashSync(password, salt)

    res.json({ username, passsword: hash })
});

router.post('/login', async (req, res) => {

});

module.exports = router;
