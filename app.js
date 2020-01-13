const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 4000;

app.use(cors());

mongoose.connect(
    `mongodb+srv://Corehalla:${process.env.MATLAS_KEY}@corehalla-xtv6m.mongodb.net/test?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
mongoose.connection.once('open', () => {
    console.log('App Connected to Database');
});

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(PORT, () => {
    console.log(`App Listening on port ${PORT}`);
});