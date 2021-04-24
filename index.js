const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const express = require('express');
const app = express();

const fetch = require('node-fetch');

const es6Renderer = require('express-es6-template-engine');
app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

const server = http.createServer(app);

const db = require('./db');

const morgan = require('morgan');
const logger = morgan('tiny');
app.use(logger);

const helmet = require('helmet');
app.use(helmet({
    contentSecurityPolicy: false,
}));

app.use(express.static('public'));

// app.use((req, res, next) => {
//     console.log(`${req.method} ${req.path}`);
//     next();
// })


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



app.get('/dogs/:breed',  async (req, res) => {
    console.log(req.path);

    const {breed} = req.params;
    console.log(breed);
    const dog = db.find((thisDog) => thisDog.breed === breed);
    if (dog) {
        console.log(dog);
        var pic = await fetch(`https://dog.ceo/api/breed/${dog.breed}/images/random`).then(res => res.json());
        console.log(pic.message);
        
        dog.image = pic.message;
        
        res.render('dog.html', {
            locals: {
                dog,
                // pic,
                title: 'Dogtails'
            },
            partials: {
                head: '/partials/head',
                image: '/partials/images'
            }
        });
    } else {
        res.status(404)
            .send(`No dog found with name '${breed}'`);
    }
});
 
  
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});