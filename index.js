import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import { MongoClient } from 'mongodb';
const app = express();
const port = process.env.PORT || 5000;

//middlewere

app.use(express.json());
app.use(cors());


const client = new MongoClient(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.oc3n5pn.mongodb.net/`);

export async function connectToMongoDB() {
          try {
          await client.connect();
          console.log("You successfully connected to MongoDB!");
          return client;
          } catch (err) {
                    console.dir(err);
          }
}

const connectedClient = await connectToMongoDB();
const database = connectedClient.db("hireloopdb");
const users = database.collection("user");
const jobs = database.collections('jobs')

app.get('/', (req, res) => {
          res.send('hire loop is looping')
})

app.get('/users', async(req, res) => {
          const cursor = users.find({});
          const result = await cursor.toArray();
          res.send(result)
})

app.listen(port, ()=>{

          console.log(`hire loop is running on port ${port}`)
})