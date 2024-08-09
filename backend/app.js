const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/images', express.static('images'));

app.use('/api', routes);

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
