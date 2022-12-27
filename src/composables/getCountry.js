import { ref } from "vue";

const getCountry = () => {
  const country = ref([]);
  const apiError = ref([]);

  const loadCountry = async (countryName) => {
    try {
      const res = await fetch(`https://restcountries.com/v2/name/${countryName}`);
      if (!res.ok) {
        throw Error("Something went wrong");
      }
      country.value = await res.json()
      // console.log(country.value);
      
    } catch (err) {
      apiError.value = err.message
    }
  }

  return { country, loadCountry }
}

export default getCountry


// https://restcountries.com/v3.1/region/{region}