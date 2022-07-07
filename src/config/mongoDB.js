require('dotenv').config();
const env = require('dotenv')
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('Conected'))
.catch(error => console.error(error))



