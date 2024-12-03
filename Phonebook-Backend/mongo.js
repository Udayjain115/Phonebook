const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Give Password as arg');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://udayrajveerjain:${password}@cluster0.qrrmw.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set('strictQuery', false);
mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Phonebook = mongoose.model('PhoneBook', phonebookSchema);

if (process.argv.length === 3) {
  console.log('Phonebook:');

  Phonebook.find({}).then((result) => {
    result.forEach((note) => {
      console.log(`${note.name} ${note.number}`);
    });
    mongoose.connection.close();
  });
}

if (process.argv.length === 5) {
  const phonebook = new Phonebook({
    name: process.argv[3],
    number: process.argv[4],
  });

  phonebook.save().then((result) => {
    console.log(`${phonebook} saved!`);
    mongoose.connection.close();
  });
}
