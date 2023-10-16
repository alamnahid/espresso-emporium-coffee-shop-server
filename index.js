const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000
//middle ware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.o19wwr0.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const database = client.db("coffeeStoreDB");
    const coffeeCollection = database.collection("coffees");
    app.post('/coffees',async (req, res)=>{
        const coffee = req.body;
        console.log('new coffee', coffee)
        const result = await coffeeCollection.insertOne(coffee);
        res.send(result)
    })

    app.get('/coffees', async(req, res)=>{
        const cursor = coffeeCollection.find(); 
        const result = await cursor.toArray();
        res.send(result)
    })
    // for update data

    app.get('/coffees/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const coffee = await coffeeCollection.findOne(query)
        
        res.send(coffee)
    })

    app.put('/coffees/:id', async(req, res)=>{
        const id = req.params.id;
        const coffee = req.body;
        // console.log(id, coffee)
        const filter = {_id: new ObjectId(id)}
        const options = { upsert: true };
        const updateCoffee = {
            $set: {
                name: coffee.name,
                chef: coffee.chef,
                supplier: coffee.supplier,
                taste: coffee.taste,
                price: coffee.price,
                details: coffee.details,
                photo: coffee.photo,
            }
        }
        const result = await coffeeCollection.updateOne(filter, updateCoffee, options)
        res.send(result);
    })

    app.delete('/coffees/:id', async (req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await coffeeCollection.deleteOne(query)
        res.send(result)
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('user management server running')
})

app.listen(port, ()=>{
    console.log(`server is running on PORT: ${port}`)
})

