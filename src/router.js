const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const secret = process.env.JWT_SECRET



router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const saltRounds = 10;

    bcrypt.hash(password, saltRounds, async (err, hashed_pw) => {
        try {
            const new_user = await prisma.user.create({
                data: {
                    username,
                    password: hashed_pw
                }
            })
            delete new_user.password;

            res.status(201).json({ user: new_user })
        } catch (error) {
            if (error.code === "P2002") {
                res.status(403).json({ error: `The username ${username} is already taken!` })
            } else {
                res.status(500).json({ error })
            }
        }
    })
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({
        where: {
            username
        }
    });

    if (!user) {
        return res.status(401).json({ error: "Invalid username or password!" })
    }

    bcrypt.compare(password, user.password, (err, result) => {
        if (!result) {
            return res.status(401).json({ error: "Invalid username or password!" })
        } else {
            const secret = process.env.JWT_SECRET;
            const access_token = jwt.sign({ sub: user.id, username: user.username }, secret);

            res.status(201).json({ access_token })
        }
    })
});

module.exports = router;