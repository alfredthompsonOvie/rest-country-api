import { ref } from "vue";

const getCountry = () => {
  const country = ref([]);

  const loadCountry = async (countryName) => {
    const res = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    country.value = await res.json()
    console.log(country.value);
  }

  return { country, loadCountry }
}

export default getCountry


// https://restcountries.com/v3.1/region/{region}