const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
.then(()=>console.log("Mongodb Connected")).catch((err)=>console.log("Mongodb Connection failed",err))
