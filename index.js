const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

const cors = require('cors');
require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());

// database connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.p2nrx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send('Bengle tour and trip server running.');
});
app.get('/hello', (req, res) => {
    res.send('hello server');
});

async function run() {
    try {
        await client.connect();

        const database = client.db('bengleTour');
        const tripCollection = database.collection('trips');

        // GET API
        app.get('/trips', async (req, res) => {
            const cursor = tripCollection.find({});
            const trips = await cursor.toArray();
            res.json(trips);
            // console.log(trips);
        })
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log('Server run on port', port);
})