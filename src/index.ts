import express from 'express';
import cors from 'cors';
import { schema } from './graphql';
import { migrateTest } from './data/migrate/migrate_rt_to_ft';

const functions = require('firebase-functions');
const { ApolloServer, gpl } = require('apollo-server-express');
// 
async function startApolloServer() {
    const app = express();
    app.use(cors());
    const server = new ApolloServer({
        schema,
        introspection: true,
    });
    await server.start();
    server.applyMiddleware({ app,path:'/' });
    app.listen(5000, () => {
        console.log("Server anime start in: http://localhost:5000");
    });
    //exports.graphql = functions.https.onRequest(app);
}

startApolloServer();