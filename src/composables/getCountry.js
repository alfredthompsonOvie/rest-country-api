import { ref } from "vue";

const getCountry = () => {
  const country = ref([]);
  const apiCountryError = ref([]);

  const loadCountry = async (countryName) => {
    try {
      const res = await fetch(`https://restcountries.com/v2/name/${countryName}`);
      if (!res.ok) {
        throw Error("Something went wrong, couldn't fetch data");
      }
      country.value = await res.json()
      
    } catch (err) {
      apiCountryError.value = err.message
    }
  }

  return { country, apiCountryError, loadCountry }
}

export default getCountry


// https://restcountries.com/v3.1/region/{region}