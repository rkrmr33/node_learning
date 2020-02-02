const { MongoClient } = require('mongodb');

const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const clientURL = `mongodb://${MONGO_HOST}:${MONGO_PORT}`;

const client = new MongoClient(clientURL);

client.connect()
    .then(() => {
        console.log(`connected to mongodb instance on: ${clientURL}`);
    })
    .catch((err) => {
        console.error(`could not connect to mongodb: ${clientURL}`);
        console.error(err);
    });
