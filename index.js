const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.e9oaa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const createCollection = client.db('createData').collection('data')
    const createOrder = client.db('createData').collection('Order')
    //  creat
    app.post('/user', async (req, res) => {
      const USER = req.body;
      console.log(USER);
      const result = await createCollection.insertOne(USER)
      res.send(result)
    })
    // read
    app.get('/user', async (req, res) => {
      const courser = createCollection.find();
      const result = await courser.toArray();
      res.send(result)
    })
    // update first code
    app.get('/user/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await createCollection.findOne(query)
      res.send(result)
    })
    // update second code
    app.put('/user/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const sheam = req.body;
      const updateDoc = {
        $set: {
          name: sheam.name,
          item: sheam.itemname, // Fixed key (use the correct field name)
          email: sheam.email
        }
      };
      const result = await createCollection.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // delete
    app.delete('/user/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await createCollection.deleteOne(query);
      res.send(result);
    })

    // order post
    app.post('/order', async (req, res) => {
      const order = req.body;
      console.log(order);
      const result = await createOrder.insertOne(order)
      res.send(result)
    })

    // order get
    app.get('/order', async (req, res) => {
      const courser = createOrder.find();
      const result = await courser.toArray();
      res.send(result)
    })

  } finally {


  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('server is running')
});

app.listen(port, () => {
  console.log(`server is${port}`);
})



