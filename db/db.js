const mongoose=require('mongoose');

const DB='mongodb+srv://anchal29pandey:anchuu21@capstone.frk2d.mongodb.net/?retryWrites=true&w=majority&appName=Capstone';
mongoose.connect(DB,{
    useNewUrlParser: true,
      useUnifiedTopology: true
}).then(()=>{
    console.log('connection successful');
}).catch(_=>{
    console.log('Failed to connect'+_);
})