const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
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
        const bookingCollection = database.collection('booking');

        // GET API
        app.get('/trips', async (req, res) => {
            const cursor = tripCollection.find({});
            const trips = await cursor.toArray();
            res.json(trips);
            // console.log(trips);
        })

        // GET Single Service
        app.get('/trips/:id', async (req, res) => {
            const id = req.params.id;
            // console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const trips = await tripCollection.findOne(query);
            console.log(trips);
            res.json(trips);
        })

        // POST API
        app.post('/booking', async (req, res) => {
            const customer = req.body;
            console.log('hit the post api', customer);

            const result = await bookingCollection.insertOne(customer);
            console.log(result);
            res.json('result')
        });

        // GET API
        app.get('/booking', async (req, res) => {
            const cursor = bookingCollection.find({});
            const packages = await cursor.toArray();
            res.json(packages);

        })

        // DELETE API
        app.delete('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookingCollection.deleteOne(query);
            res.json(result);
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