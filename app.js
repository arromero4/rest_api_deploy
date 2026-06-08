import express, { json } from 'express'; //ES Modules

import { randomUUID } from 'crypto';
import cors from 'cors';
import { validateMovie, validatePartialMovie } from './schemas/movies.js';

import fs from 'node:fs';
// Leer un jscon en ESModules
// const movies = JSON.parse(fs.readFileSync('./movies.json', 'utf-8'))

//Leer un json en ESModules recomendado
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const movies = require('./movies.json');

const PORT = process.env.PORT || 1234;
const app = express();
app.use(json());    
app.disable('x-powered-by');
app.use(cors({
    origin: (origin, callback) => {
        const ACCEPTED_ORIGINS = [
  'http://127.0.0.1:5500',
  'http://localhost:5500'
];
        if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
            callback(null, true);
        }
        if(!origin){
            callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    }
}
))

//OPTIONS CORS preflight request
app.options('/movies/:id', (req, res) => {
        const origin = req.header('origin');

    if(ACCEPTED_ORIGINS.includes(origin) || !origin){
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
    }

    res.send(200)
})

const ACCEPTED_ORIGINS = [
  'http://127.0.0.1:5500',
  'http://localhost:5500'
];

//todos los recursos se identifican por su ruta, y el verbo HTTP que se utiliza para acceder a ellos
app.get('/movies', (req, res) => {
    const origin = req.header('origin');

    if(ACCEPTED_ORIGINS.includes(origin) || !origin){
        res.header('Access-Control-Allow-Origin', origin);
    }


    const { genre } = req.query;
    if (genre) {
        const filteredMovies = movies.filter(movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase()));

        return res.json(filteredMovies);
    }
    res.json(movies);
})


app.get('/movies/:id', (req, res) => {
    const { id } = req.params;
    const movie = movies.find(movie => movie.id === id);

    if (movie) return res.json(movie);
    res.status(404).json({ message: 'Movie not found' });
})


app.post('/movies', (req, res) => {
    
    const result = validateMovie(req.body);

    if(result.error){
        return res.status(400).json({ message: 'Invalid movie data', errors: result.error.errors });
    }

    //base de datos 
    const newMovie = {
        id: randomUUID(),
        ...result.data,

    }
    movies.push(newMovie);
    res.status(201).json(newMovie);
})

app.delete('/movies/:id', (req, res) => {

        const origin = req.header('origin');

    if(ACCEPTED_ORIGINS.includes(origin) || !origin){
        res.header('Access-Control-Allow-Origin', origin);
    }


    const { id } = req.params;
    const movieIndex = movies.findIndex(movie => movie.id === id);
    if(movieIndex === -1) return res.status(404).json({ message: 'Movie not found' });

    movies.splice(movieIndex, 1);
    return res.json({ message: 'Movie deleted successfully' });
})


app.patch('/movies/:id', (req, res) => {
    const { id } = req.params;
    const result = validatePartialMovie(req.body);
    if(!result.success){
        return res.status(400).json({ error: JSON.parse(result.error.message) });
    }
    const movieIndex = findIndex(movie => movie.id === id);
    if(movieIndex === -1) return res.status(404).json({ message: 'Movie not found' });

    const updatedMovie = {
        ...movies[movieIndex],
        ...result.data
    }

    movies[movieIndex] = updatedMovie;
    return res.json(updatedMovie);
})


app.listen(PORT, () => {
    console.log(`Server is running localhost http://localhost:${PORT}`);
});

