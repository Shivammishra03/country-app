<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

const countries = ref([]);
const selectedCountryId = ref(null);
const countryDetails = ref(null);
const newCountry = ref({
  name: '',
  continent: '',
  rank: '',
});
const uniqueContinents = ref([
  'Asia', 
  'Africa',
  'Europe', 
  'Australia/Oceania',
  'Antartica', 
  'South America', 
  'North America'
]);
const file = ref('');

const fetchCountries = async () => {
  await axios.get('http://localhost:8080/api/countries').then(response => {
    countries.value = response.data;
  }).catch(error => console.error(error));
};
const fetchCountryDetails = async () => {
  if (!selectedCountryId.value) return;
  await axios.get(`http://localhost:8080/api/country/${selectedCountryId.value}`).then(response => {
    countryDetails.value = response.data;
  }).catch(error => console.error(error));
};
const addCountry = async () => {
  const formData = new FormData();
  formData.append('name', newCountry.value.name);
  formData.append('continent', newCountry.value.continent);
  formData.append('rank', newCountry.value.rank);
  if (file.value) {
    formData.append('image', file.value);
  }
  await axios.post('http://localhost:8080/api/country', formData).then(response => {
    countries.value.push(response.data);
    newCountry.value = { name: '', continent: '', rank: '' };
    file.value = '';
    fetchCountries();
  }).catch(error => {
    if (error.response && error.response.data) {
      alert(error.response.data.error);
    }
    console.error(error);
  });
};
const onFileChange = (event) =>{
  const imageFile = event.target.files[0];
  let imageValues = document.getElementById('imageValue');
  if (imageFile && (imageFile.type === 'image/jpeg' || imageFile.type === 'image/png') && imageFile.size <= 4 * 1024 * 1024) {
    file.value = imageFile;
  } else {
    alert("Please upload maximum 4mb of image! ")
    file.value = '';
    imageValues.value = '';
  }
};
const getFlagUrl = (imagePath) => {
  return `http://localhost:8080/${imagePath}`;
};

onMounted(()=> {
  fetchCountries();
});

</script>

<template>
  <div id="app">
    <h1>Country Management</h1>
    <form @submit.prevent="addCountry">
      <label>
        Country Name:
        <input type="text" v-model="newCountry.name" minlength="3" maxlength="20"/>
      </label>
      <label>
        Continent:
        <select v-model="newCountry.continent">
          <option v-for="continent in uniqueContinents" :key="continent" :value="continent">
            {{ continent }}
          </option>
        </select>
      </label>
      <label>
        Rank:
        <input type="number" v-model="newCountry.rank" />
      </label>
      <label>
        Image:
        <input id="imageValue" type="file" @change="onFileChange" />
      </label>
      <button type="submit">Add Country</button>
    </form>

    <h2>Select Country</h2>
    <select v-model="selectedCountryId" @change="fetchCountryDetails">
      <option v-for="country in countries" :key="country.id" :value="country.id">
        {{ country.name }}
      </option>
    </select>

    <div v-if="countryDetails">
      <h3>{{ countryDetails.name }}</h3>
      <p>Continent: {{ countryDetails.continent }}</p>
      <p>Rank: {{ countryDetails.rank }}</p>
      <img :src="getFlagUrl(countryDetails.flag)" alt="Country Image" v-if="countryDetails.flag" />
    </div>
  </div>
</template>

<style scoped>
  form {
    margin-bottom: 20px;
  }
  label {
    display: block;
    margin-bottom: 10px;
  }
  input, select {
    margin-right: 10px;
  }
  img {
    max-width: 200px;
    margin-top: 10px;
  }
</style>
