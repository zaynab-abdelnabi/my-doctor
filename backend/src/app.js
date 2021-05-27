import express from 'express';
import router from './routes';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';
import expressValidator from 'express-validator';

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// request info
app.use(morgan('dev'));

// validators
app.use(expressValidator());

// routers
app.use('/', router);

app.use((req, res, next) => {
    const err = new Error('not found');
    err.status = 404;
    next(err);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        message: error.message
    });
});


export default app;