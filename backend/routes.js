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
    const countriesData = data.countries
    const countries = countriesData.map(country => ({ id: country.id, name: country.name }));
    res.json(countries);
});

router.get('/country/:id', (req, res) => {
    const data = readData();
    const countriesData = data.countries
    const country = countriesData.find(c => c.id === parseInt(req.params.id));
    if (country) {
        res.json(country);
    } else {
        res.status(404).send('Country not found');
    }
});

router.post('/country', upload.single('image'), (req, res) => {
    const data = readData();
    const countriesData = data.countries
    const { name, continent, rank } = req.body;
    
    if (countriesData.some(c => c.name === name)) {
        return res.status(400).json({ error: 'Country name must be unique' });
    }

    if (countriesData.some(c => c.rank === parseInt(rank))) {
        return res.status(400).json({ error: 'Rank must be unique' });
    }

    const newCountry = {
        id: countriesData.length + 1,
        name,
        continent,
        flag: req.file ? `images/${req.file.filename}` : null,
        rank: parseInt(rank)
    };

    countriesData.push(newCountry);
    writeData(data);

    res.status(201).json(newCountry);
});

module.exports = router;
