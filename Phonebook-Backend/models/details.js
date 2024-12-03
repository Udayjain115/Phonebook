const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { LEGAL_TLS_SOCKET_OPTIONS } = require('mongodb');
dotenv.config();
mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;
console.log('connecting to', url);
mongoose
  .connect(url)
  .then((result) => {
    console.log('Connected');
  })
  .catch((error) => {
    console.log('error connecting to MongoDB: ', error);
  });

const personSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: true },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{2,3}-\d{5,}/.test(v);
      },
    },
  },
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);
