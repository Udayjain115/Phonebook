require('dotenv').config();
const Person = require('./models/details');
const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

let persons = [
  {
    id: '1',
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: '2',
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: '3',
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: '4',
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};
morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan('tiny'));
app.use(morgan(':body'));

app.get('/info', (request, response) => {
  const date = new Date();

  Person.countDocuments({})
    .then((count) => {
      response.send(
        `<p>There are ${count} people in the database.</p><p>${date}<p>`
      );
    })
    .catch((error) => {
      console.error('Error counting documents:', error);
    });
});

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then((note) => {
    response.json(note);
  });
});
app.post('/api/persons', (request, response, next) => {
  const body = request.body;
  if (body.name === undefined) {
    return response.status(400).json({ error: 'Name Missing' });
  } else if (body.number === undefined) {
    return response.status(400).json({ error: 'Number Missing' });
  }

  const checkDuplicateName = persons.find((n) => n.name === body.name);

  if (checkDuplicateName) {
    return response
      .status(400)
      .json({ error: `Name ${body.name} already exists` });
  }

  const person = new Person({
    id: generateId(),
    name: body.name,
    number: body.number,
  });
  person
    .save()
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body;

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  Person.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
