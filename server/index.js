'use strict';

const express = require('express');
const body = require('body-parser');
const cookie = require('cookie-parser');
const morgan = require('morgan');
const uuid = require('uuid/v4');
const path = require('path');
const app = express();

app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(body.json());
app.use(cookie());

const ad = {
  href: '',
  src: './static/img/2spooky4me.jpg',
  name: 'Картина',
  productPrice: '100$',
  location: 'Москва',
};

const ad1 = {
    href: '',
    src: "./static/img/shpicz.jpg",
    name: 'Кек',
    productPrice: "100500$",
    location: "Ракетный завод"
}

const users = {
    'd.dorofeev@corp.mail.ru': {
        email: 'kek@mail.ru',
        password: 'password',
        name : 'dmitry',
        profilePic : 'static/img/2spooky4me.jpg',
        rating : 4,
        ads : [
            ad1,
            ad1,
        ]
    },
    'akek@mail.ru': {
        email: 'akek@mail.ru',
        password: 'password123',
        name : 'kekek',
        profilePic : 'static/img/avatar.jpeg',
        rating : 5,
        ads : [
            ad,
            ad,
            ad1,
            ad,
            ad1,
        ]
    },
};

const ids = {};

app.post('/signup', function (req, res) {
    const password = req.body.password;
    const email = req.body.email;
    const name = req.body.name;
    const rating = req.body.rating;
    const profilePic = req.body.profilePic;
    if (
        !password || !email || !name ||
        !password.match(/^\S{4,}$/) ||
        !email.match(/@/) ||
        !(name.length > 4)
    ) {
        console.log('kel')
        return res.status(400).json({error: 'Не валидные данные пользователя'});
    }
    if (users[email]) {
        console.log('kek')
        return res.status(400).json({error: 'Пользователь уже существует'});
    }

    const id = uuid();
    const user = {password, email, name, rating, profilePic};
    ids[id] = email;
    users[email] = user;

    res.status(201).json({id});
});

app.post('/login', function(req, res) {
    const password = req.body.password;
    const email = req.body.email;
    if (!password || !email) {
        return res.status(400).json({error: 'Не указан E-Mail или пароль'});
    }
    if (!users[email] || users[email].password !== password) {
        return res.status(400).json({error: 'Не верный E-Mail и/или пароль'});
    }

    const id = uuid();
    ids[id] = email;

    res.cookie('podvorot', id, {
        secure: true,
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 10),
    });
    res.status(200).json({id});
});

app.get('/logout', function(req, res) {
    res.clearCookie('podvorot');
    res.status(200).end();
});

app.get('/me', function(req, res) {
    const id = req.cookies['podvorot'];
    const email = ids[id];
    if (!email || !users[email]) {
        return res.status(401).end();
    }
    res.json(users[email]);
});

const port = process.env.PORT || 5001;

app.listen(port, function() {
    console.log(`Server listening port ${port}`);
});