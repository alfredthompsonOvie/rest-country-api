import { ref } from "vue";

const getCountries = () => {
  
  const restCountries = ref([]);
  const ApiError = ref([]);

  const loadAllCountries = async () => {
    try {
      const res = await fetch('https://restcountries.com/v2/all');
  
      if (!res.ok) {
        throw Error("Something went wrong.")
      }
  
      restCountries.value = await res.json();
  
    } catch (err) {
      ApiError.value = err.message
    }
    
  }

  return { restCountries, ApiError, loadAllCountries }
}

export default getCountries;