const express = require('express');
const fs = require('fs');
const multer = require('multer');
const router = express.Router();

const dataFilePath = './api/countries.json';
const upload = multer({ dest: 'images/' });

function readData() {
    return JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
}

function writeData(data) {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

router.get('/countries', (req, res) => {
    const data = readData();
    const countries = data.map(country => ({ id: country.id, name: country.name }));
    res.json(countries);
});

router.get('/country/:id', (req, res) => {
    const data = readData();
    const country = data.find(c => c.id === parseInt(req.params.id));
    if (country) {
        res.json(country);
    } else {
        res.status(404).send('Country not found');
    }
});

router.post('/country', upload.single('image'), (req, res) => {
    const data = readData();
    const { name, continent, rank } = req.body;
    
    if (data.some(c => c.name === name)) {
        return res.status(400).json({ error: 'Country name must be unique' });
    }

    if (data.some(c => c.rank === parseInt(rank))) {
        return res.status(400).json({ error: 'Rank must be unique' });
    }

    const newCountry = {
        id: data.length + 1,
        name,
        continent,
        rank: parseInt(rank),
        imageUrl: req.file ? `/images/${req.file.filename}` : null
    };

    data.push(newCountry);
    writeData(data);

    res.status(201).json(newCountry);
});

module.exports = router;
