const  mongoose=require('mongoose');
require('dotenv').config();
const mongoURI=process.env.MONGO_DB;
mongoose.connect(mongoURI).then(()=>{
    console.log('Connected to MongoDB');
    
}).catch(e=>{
    console.log(`Error connecting to database ${e}`)
});
