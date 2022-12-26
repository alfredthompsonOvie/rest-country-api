import { ref } from "vue";

const getCountries = () => {
  
  const restCountries = ref([]);
  const error = ref([]);

  const load = async () => {
    try {
      const res = await fetch('https://restcountries.com/v3.1/all');
  
      if (!res.ok) {
        throw Error("Something went wrong.")
      }
  
      restCountries.value = await res.json();
  
    } catch (err) {
      error.value = err.message
    }
    
  }

  return { restCountries, error, load }
}

export default getCountries;