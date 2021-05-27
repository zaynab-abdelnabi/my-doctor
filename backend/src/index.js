import 'dotenv/config';
import models, { sequelize } from './models/index.js';
import app from './app';

sequelize.sync().then(() => {
    app.listen(process.env.PORT, () => {
        console.log("express running");
    });
});


