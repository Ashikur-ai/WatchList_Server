const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


// WatchListMaster
// 5qTdq3ZahsAQEcKv

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bpilnp1.mongodb.net/?retryWrites=true&w=majority`;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bpilnp1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const movieCollection = client.db('watchList').collection('cartoons');

        app.get('/movie', async (req, res) => {
            const cursor = movieCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/movie/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await movieCollection.findOne(query);
            res.send(result);
        })

        app.get('/category/:brand', async (req, res) => {
            const brandName = req.params.brand;
            const query = { brand: brandName }
            const cursor = movieCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
            
        })

        app.post('/movie', async (req, res) => {
            const newMovie = req.body;
            const result = await movieCollection.insertOne(newMovie);
            res.send(result);
        })

        app.put('/movie/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedMovie = req.body;
            const movie = {
                $set: {
                    photo: updatedMovie.photo,
                    photo_bg: updatedMovie.photo_bg,
                    name: updatedMovie.name,
                    brand: updatedMovie.brand,
                    type: updatedMovie.type,
                    price: updatedMovie.price,
                    rating: updatedMovie.rating,
                    description: updatedMovie.description
                }
            }

            const result = await movieCollection.updateOne(filter, movie, options);
            res.send(result);
        })

        

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('WatchList server is running')
})

app.listen(port, () => {
    console.log(`WatchList server is running on port: ${port}`);
})