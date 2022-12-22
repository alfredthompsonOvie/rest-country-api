import { ref } from "vue";

const countries = ref([]);


const getCountries = async () => {

  const res = await fetch('https://restcountries.com/v3.1/all');

  const data = await res.json();

  // countries.value = [ ...data]
  countries.value = data

  console.log(countries.value);

  // return countries
}

export { countries, getCountries }