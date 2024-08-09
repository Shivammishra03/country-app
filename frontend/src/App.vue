<template>
  <div id="app">
    <h1>Country Management</h1>
    <form @submit.prevent="addCountry">
      <label>
        Country Name:
        <input type="text" v-model="newCountry.name" />
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
        <input type="file" @change="onFileChange" />
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
      <img :src="getImageUrl(countryDetails.imageUrl)" alt="Country Image" v-if="countryDetails.imageUrl" />
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      countries: [],
      selectedCountryId: null,
      countryDetails: null,
      newCountry: {
        name: '',
        continent: '',
        rank: '',
      },
      uniqueContinents: [],
      file: null,
    };
  },
  methods: {
    fetchCountries() {
      axios.get('http://localhost:8080/api/countries')
        .then(response => {
          this.countries = response.data;
          this.uniqueContinents = [...new Set(this.countries.map(c => c.continent))];
        })
        .catch(error => console.error(error));
    },
    fetchCountryDetails() {
      if (!this.selectedCountryId) return;

      axios.get(`http://localhost:8080/api/country/${this.selectedCountryId}`)
        .then(response => {
          this.countryDetails = response.data;
        })
        .catch(error => console.error(error));
    },
    addCountry() {
      const formData = new FormData();
      formData.append('name', this.newCountry.name);
      formData.append('continent', this.newCountry.continent);
      formData.append('rank', this.newCountry.rank);
      if (this.file) {
        formData.append('image', this.file);
      }

      axios.post('http://localhost:8080/api/country', formData)
        .then(response => {
          this.countries.push(response.data);
          this.newCountry = { name: '', continent: '', rank: '' };
          this.file = "";
          this.fetchCountries();
        })
        .catch(error => {
          if (error.response && error.response.data) {
            alert(error.response.data.error);
          }
          console.error(error);
        });
    },
    onFileChange(event) {
      this.file = event.target.files[0];
    },
    getImageUrl(imagePath) {
      // Adjust this function if your frontend is on a different port
      return `http://localhost:8080${imagePath}`;
    }
  },
  mounted() {
    this.fetchCountries();
  },
};
</script>

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
