const express = require('express')
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
// socket implementation


require('dotenv').config();
app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.eb4ikxd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const userCollection = client.db('socialMedia').collection('users')
        const userMessageCollection = client.db('socialMedia').collection('userMessage')
        const userImgMessageCollection = client.db('socialMedia').collection('userImgMessage')

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user)
            res.send(result)
        })
        app.post('/message', async (req, res) => {
            const message = req.body;
            const result = await userMessageCollection.insertOne(message)
            res.send(result)
        })

        app.get('/users', async (req, res) => {
            const users = {};
            const result = await userCollection.find(users).toArray()
            res.send(result)
        })

        app.get('/getMessages/:myId/:ChatId', async (req, res) => {
            const myId = req.params.myId;
            const chatId = req.params.ChatId;
            const AllMessage = await userMessageCollection.find({}).toArray();
            const filterMessage = AllMessage.filter(m => m.sender === myId && m.reciever === chatId || m.sender === chatId && m.reciever === myId)
            // console.log(filterMessage)
            res.send(filterMessage)
        })

        app.post('/images', async (req, res) => {
            const image = req.body;
            const result = await userMessageCollection.insertOne(image)
            res.send(result)
        })


    }
    finally {

    }
}
run().catch(err => console.log(err))


app.get('/', (req, res) => {
    res.send('my api is running')
})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});