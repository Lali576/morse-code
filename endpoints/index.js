'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require("fs");
const url = require('url');
const morse = require('./files/morseTable/morse-code-table');

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
    fs.readFile('pages/form.html', function(err, data) {
        if (err) res.status(500).send({});
        else res.status(200).send(data.toString());
    });
});

app.post('/users', function(req, res) {
    var username = req.body.username;
    var fullname = req.body.name;

    var usersFile = fs.readFileSync('./endpoints/files/databaseFiles/users.json');
    var messageFile = fs.readFileSync('./endpoints/files/databaseFiles/messages.json');
    var users = JSON.parse(usersFile);
    var messages = JSON.parse(messageFile);
    if(users.hasOwnProperty(username)) {
        res.status(400).send("Hiba! Ez a felhasznalo nev mar regisztralva van!");
    } else {
        var token = username + "token";
        var user = {
            [username]: {
                "name": fullname,
                "token": token         
            }
        }
        var message = {
            [username]: {
                "messages": []
            }
        }
        users[username] = user[username];
        messages[username] = message[username];
        var usersJSON = JSON.stringify(users);
        var messageJSON = JSON.stringify(messages)
        fs.writeFileSync('./endpoints/files/databaseFiles/users.json', usersJSON);
        fs.writeFileSync('./endpoints/files/databaseFiles/messages.json', messageJSON);

        res.status(200).json({
            "token": token
        });
    }
});

app.get('/users/:username', function(req,res) {
    var usersFile = fs.readFileSync('./endpoints/files/databaseFiles/users.json');
    var users = JSON.parse(usersFile);
    var url = req.url.toString().split('/');
    var username = url[2];

    if(users.hasOwnProperty(username))
    {
        var token = users[username].token.toString();
        fs.readFile('pages/user.html', function(err, data) {
            if (err) res.status(500).send({});
            else {
                res.status(200).send(data.toString());
            }
            
        });
    } else {
        res.status(400).send("Hiba! Ez a felhasznalo nem letezik!");
    }
});

app.post('/users/:username/messages', function(req, res) {
    var usersFile = fs.readFileSync('./endpoints/files/databaseFiles/users.json');
    var users = JSON.parse(usersFile);
    var url = req.url.toString().split('/');
    var username = url[2];

    if(users.hasOwnProperty(username))
    {
        var messageFile = fs.readFileSync('./endpoints/files/databaseFiles/messages.json');
        var messages = JSON.parse(messageFile);
        var message = req.body.message.trim().toString();
        var from = req.body.from;
        messages[username].messages.push({message, from});
        fs.writeFileSync('./endpoints/files/databaseFiles/messages.json', JSON.stringify(messages));
        var token = users[username].token.toString();
        res.status(200).send();
    } else {
        res.status(404).send("Hiba! Ez a felhasznalo nem letezik!");
    }
});

app.get('/users/:username/messages', function(req, res) {
    var usersFile = fs.readFileSync('./endpoints/files/databaseFiles/users.json');
    var users = JSON.parse(usersFile);
    var url = req.url.toString().split('/');
    var username = url[2];

    if(users.hasOwnProperty(username))
    {
        var ms = "";
        var messageFile = fs.readFileSync('./endpoints/files/databaseFiles/messages.json');
        var messages = JSON.parse(messageFile);
        var userMessages = messages[username].messages;
        userMessages.forEach(function(element) {
            ms += element.from + ": " + (translate(element.message.trim()) + '\n').toString();
        }, this);
        res.type('text/plain').status(200).send(ms);
    } else {
        res.status(404).send("Hiba! Ez a felhasznalo nem letezik!");
    }
});

function translate(string) {
    var codes = string.trim().split(' ');
    var response = "";
    codes.forEach(function(code) {
        response += morse[code].toString();
    }, this);
    return response;
}

app.init = function() {
    fs.writeFileSync('./endpoints/files/databaseFiles/users.json', '{}');
    fs.writeFileSync('./endpoints/files/databaseFiles/messages.json', '{}');
};

module.exports = app;