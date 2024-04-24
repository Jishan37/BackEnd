//require

const express =require('express');
const cors = require('cors');
const {ObjectId,MongoClient,ServerApiVersion} = require('mongodb');
require('dotenv').config();
//port
const app = express();
const port = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());

//mongodb



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.si6lvvj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run(){
    try{
        //DB Collection
        const userCollection = client.db('FullStackDemo').collection('users');
        const carCollection = client.db('FullStackDemo').collection('cars');
        const carOrderCollection = client.db('FullStackDemo').collection('orders');

        //Read(get)
        app.get('/users',async(req,res)=>{
            let query = {};
            const cursor =userCollection.find(query);
            const a = await cursor.toArray();
            res.send(a);
        });

        //Create(post)
        app.post('/users',async(req,res)=>{
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        //singleUser
        app.get('/users/:id',async(req, res)=>{
            try{
                const id=req.params.id;
                const query ={_id: new ObjectId(id)};
                const a= await userCollection.findOne(query);
                if(a){
                    res.status(200).send(a);
                }else{
                    res.status(404).send('Details not found')
                }
            }catch(error){
                console.error(error);
                res.status(5000).send('Internal Server Error' + error.massage);
            }
        });

        //deleteuser
        app.delete('/deleteuser/:id',async(req,res)=>{
            const id=req.params.id;
            const query ={_id: new ObjectId(id)};
            try{
                const result = await userCollection.deleteOne(query);
                if(result.deletedCount===1){
                    res.status(200).json({massage: 'DEleted Successfully'})
                }else{
                    res.status(404).json({error: "Car not Found"})
                }
            }catch(error){
                console.error(error);
                res.status(5000).send('Internal Server Error');
            }
        })

        //Read(get)-->car
        app.get('/allCars',async(req,res)=>{
            let a= {};
            const b=carCollection.find(a);
            const c=await b.toArray();
            res.send(c)
        })

        app.post('/postCar',async(req,res)=>{
            const a = req.body;
            const b = await carCollection.insertOne(a);
            res.send(b);
        })

        //singleCar
        app.get('/allCars/:id',async(req, res)=>{
            try{
                const id=req.params.id;
                const query ={_id: new ObjectId(id)};
                const a= await carCollection.findOne(query);
                if(a){
                    res.status(200).send(a);
                }else{
                    res.status(404).send('Details not found')
                }
            }catch(error){
                console.error(error);
                res.status(5000).send('Internal Server Error' + error.massage);
            }
        });

        //Deletecar
        app.delete('/deleteCars/:id',async(req,res)=>{
            const id=req.params.id;
            const query ={_id: new ObjectId(id)};
            try{
                const result = await carCollection.deleteOne(query);
                if(result.deletedCount===1){
                    res.status(200).json({massage: 'DEleted Successfully'})
                }else{
                    res.status(404).json({error: "Car not Found"})
                }
            }catch(error){
                console.error(error);
                res.status(5000).send('Internal Server Error');
            }
        })


        app.get('/alloders',async(req,res)=>{
            let a= {};
            const b=carOrderCollection.find(a);
            const c=await b.toArray();
            res.send(c)
        })

        app.post('/postoder',async(req,res)=>{
            const a = req.body;
            const b = await carOrderCollection.insertOne(a);
            res.send(b);
        })

        app.get('/userWishOrderList', async(req,res)=>{
            let query = {};

            if(req.query.email){
                query={
                    email: req.query.email
                }
            }
            const cursor = carOrderCollection.find(query);
            const a = await cursor.toArray();
            res.send(a);
        })
    } 
    finally{

    }

}
run().catch(err=>console.error(err))

//runing
app.get('/',(req,res)=>{
    res.send('Demon Backend Running')
})
app.listen(port, ()=>{
    console.log(`Demo Project is Running in ${port}`);
})