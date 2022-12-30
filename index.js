const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express')
const cors = require('cors')
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('This is the connected port')
})

const user = process.env.BD_user
const password = process.env.BD_Password

const uri = `mongodb+srv://${user}:${password}@cluster0.5rnuhbi.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const DataCollection = client.db('JobTaskData').collection('userData');

        app.post('/userData', async (req, res) => {
            const query = req.body;
            const result = await DataCollection.insertOne(query)
            res.send(result)
        })

        app.get('/userData', async (req, res) => {
            const query = {};
            const allDAta = await DataCollection.find(query).toArray();
            res.send(allDAta);
        })

        app.get('/userDatas', async (req, res) => {
            const email = req.query.email;
            const query = { email }
            const AllDAta = await DataCollection.find(query).toArray();
            res.send(AllDAta)
        })

        app.put('https://job-task-server-site-shawonislam1109.vercel.app/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const updateDAta = req.body;
            const option = { upsert: true }
            const updateDoc = {
                $set: {
                    name: updateDAta.name,
                    select: updateDAta.select,
                    terms_condition: updateDAta.terms_condition,
                    email: updateDAta.email
                }
            }
            const result = await DataCollection.updateOne(query, updateDoc, option)
            res.send(result)
        })

    }
    finally {

    }
}
run().catch(error => console.log(error))



app.listen(port, () => {
    console.log(`this is port is connected port ${port}`)
})