const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const express = require('express');
const app = express();

// app.use(express.static('public'));

app.use(express.static('public'));

const es6Renderer = require('express-es6-template-engine');
app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');





const server = http.createServer(app);

const db = require('./db');

const fetch = require('node-fetch');

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

async function dogPic() {
    const response = await fetch(`https://dog.ceo/api/breed/labrador/images/random`)
    const dogImage = await response.json()
    console.log(dogImage)
    
}

dogPic();


app.get('/dogs/:breed', (req, res) => {
    
    let {breed} = req.params;
    console.log(breed);
    let dog = db.find(thisDog => thisDog.breed === breed);
    if(dog) {
        console.log(dog);

       

        // fetch(`https://dog.ceo/api/breed/ + ${dog.breed} + /images/random`)
        // .then(res => res.json())
        // .then(json => console.log(json));

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