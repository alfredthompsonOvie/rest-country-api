import { ref } from "vue";

const getCountries = () => {
  
  const countries = ref([]);
  const error = ref([]);

  const load = async () => {
    try {
      const res = await fetch('https://restcountries.com/v3.1/all');
  
      if (!res.ok) {
        throw Error("Something went wrong.")
      }
  
      countries.value = await res.json();
  
    } catch (err) {
      error.value = err.message
    }
    
  }

  return { countries, error, load }
}

export default getCountries;