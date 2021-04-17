const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const express = require('express');
const app = express();

app.use(express.static('public'));

const es6Renderer = require('express-es6-template-engine');
app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

const server = http.createServer(app);

const db = require('./db');

app.get('/', (req, res) => {
    res.render('home', {
        locals: {
            title: "Express Dog App"
        },
        partials: {
            head: '/partials/head'
        }
    });
});


app.get('/dogs', (req, res) => {
    res.render('dogs', {
        locals: {
            dogs: db,
            path: req.path,
            title: "Table of Dogtents"
        },
        partials: {
            head: '/partials/head'
        }
    });
});


app.get('/dogs/:breed', (req, res) => {
    let {breed} = req.params;
    console.log(breed);
    let dog = db.find(thisDog => thisDog.breed === breed);
    if(dog) {
        console.log(dog);

        res.render('dog', {
            locals: {
                dog,
                title: 'Dogtails'
            },
            partials: {
                head: '/partials/head'
            }
        });
    }else {
        res.status(404)
        .send("No friend with that name found");
    }
});




server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});