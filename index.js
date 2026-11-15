import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import { MongoClient, ObjectId } from 'mongodb';
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
const jobs = database.collection('jobs')

app.get('/', (req, res) => {
          res.send('hire loop is looping')
})

app.get('/users', async(req, res) => {
          const cursor = users.find({});
          const result = await cursor.toArray();
          res.send(result)
})

//jobs related apis
app.get('/jobs', async(req, res)=>{
          const cursor = jobs.find();
          const result = await cursor.toArray();
          res.send(result)
})

app.post('/jobs', async(req, res)=> {
          try {
                    const job = req.body;
                    const result = await jobs.insertOne(job);
                    res.status(201).send(result)
          } catch (err) {
                    console.error('POST /jobs failed:', err);
                    res.status(500).send({ error: 'Failed to create job' })
          }
})
// return JSON (not an HTML page) for unhandled errors
app.use((err, req, res, next) => {
          console.error(err);
          res.status(500).send({ error: 'Internal server error' })
})


app.delete('/jobs/:id', async(req, res)=> {
          const id = req.params.id;
          const query = {_id: new ObjectId(id)};
          const result = await jobs.deleteOne(query);
          res.send(result);
})

app.listen(port, ()=>{

          console.log(`hire loop is running on port ${port}`)
})