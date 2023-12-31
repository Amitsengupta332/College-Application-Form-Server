const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json())

//CollegeApplicationForm
//ZRvs11LFOhwyDEbx



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wt8oomr.mongodb.net/?retryWrites=true&w=majority`;

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


        const collegeCollection = client.db('CollegeAdmissionForm').collection('Colleges')
        const admissionCollection = client.db('CollegeAdmissionForm').collection('admission')


        app.get('/Colleges', async (req, res) => {
            const cursor = collegeCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/admission', async (req, res) => {
            const admissionForm = req.body;
            try {
                const result = await admissionCollection.insertOne(admissionForm);
                res.status(200).json({ insertedId: result.insertedId });
            } catch (error) {
                console.error('Error inserting form data:', error);
                res.status(500).json({ error: 'Failed to insert form data' });
            }
        });

        app.get('/admission/search', async (req, res) => {
            try {
                console.log('Received request for admission search');
                const result = await admissionCollection.find().toArray();
                // console.log('Found data:', result);
                res.json(result);
            } catch (error) {
                console.error('Error fetching data:', error);
                res.status(500).json({ message: 'Server error' });
            }
        });

        app.get('/admission/:email', async (req, res) => {
            console.log(req.params.email);
            const result = await admissionCollection.find({ email: req.params.email }).toArray();
            res.json(result);
          })


        //Search text
        app.get('/searchColleges', async (req, res) => {
            const { name } = req.query;

            try {

                const colleges = await collegeCollection.find({
                    name: { $regex: name, $options: 'i' },
                }).toArray();

                res.send(colleges);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Server error' });
            }
        });


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('College application form is running')
})

app.listen(port, () => {
    console.log(`College application form is running on port: ${port}`);
})
