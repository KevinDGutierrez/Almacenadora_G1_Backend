'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';

import userRoutes from '../src/users/user.routes.js';
import clientRoutes from '../src/client/client.routes.js';
import supplierRoutes from '../src/suppliers/supplier.routes.js';
import { createAdmin } from '../src/users/user.controller.js';

import informesRoutes from '../src/inventory/informe.routes.js';
import estadisticasRoutes from '../src/estadistic/estadistic.routes.js';
import movimientosRoutes from '../src/movimientos/movimientos.routes.js'

const middlewares = (app) => {
    app.use(express.urlencoded({ extended: false }));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
};

const routes = (app) => {
    app.use('/AlmacendoraG1/vlm/users', userRoutes);
    app.use("/AlmacendoraG1/vlm/client", clientRoutes);
    app.use("/AlmacendoraG1/vlm/suppliers", supplierRoutes);
    app.use("/AlmacenadoraG1/vlm/inventory", informesRoutes);
    app.use("/AlmacenadoraG1/vlm/estadisticas", estadisticasRoutes);
    app.use("/AlmacenadoraG1/vlm/movements", movimientosRoutes);
};

const conectarDB = async () => {
    try {
        await dbConnection();
        console.log('Database connection successful!!');
        await createAdmin();
    } catch (error) {
        console.error('Error connecting to database:', error);
        process.exit(1);
    }
};

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3000;

    try {
        middlewares(app);
        conectarDB();
        routes(app);
        app.listen(port);
        console.log(`Server running on port ${port}`);
    } catch (error) {
        console.log(`Server init failed: ${error}`);
    }
};
