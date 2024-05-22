const express = require('express');
const axios = require('axios');
const uuid = require('uuid');
const moment = require('moment');
const _ = require('lodash');
const chalk = require('chalk');

const app = express();
const PORT = 3000;

let users = [];
let usersGrouped = [];

const printFormattedUsers = (usersGrouped) => {
    const formattedUsers = JSON.stringify(usersGrouped, null, 2);
    console.log(chalk.blue.bgWhite(formattedUsers));
};

app.post('/new-user', async (req, res) => {
    try {
        const response = await axios.get('https://randomuser.me/api/');
        const userData = response.data.results[0];
        const newUser = {
            nombre: userData.name.first,
            apellido: userData.name.last,
            id: uuid.v4().slice(0, 6),
            timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
            gender: (userData.gender === 'female')? 'mujeres' : 'hombres'

        };
        users.push(newUser);
        usersGrouped = _.groupBy(users, 'gender');

        printFormattedUsers(usersGrouped);

        res.status(201).json({ message: 'Usuario agregado con éxito', users: usersGrouped });



    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});


app.get('/users', (req, res) => {
    printFormattedUsers(usersGrouped);
    res.status(200).json({ usuarios: usersGrouped });
});




app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});




