const mongoose = require('mongoose');
const password = require('./password.js');

const uri = process.env.MONGODB_URI;
const db = `mongodb+srv://Lorenzo-Pachioli:${password}@cluster0.afsld.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(uri ? (uri):(db))
.then(() => console.log('Connected'))
.catch(error => console.error(error))



