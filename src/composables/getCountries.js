import { ref } from "vue";

const getCountries = () => {
  
  const restCountries = ref([]);
  const ApiError = ref([]);

  const load = async () => {
    try {
      const res = await fetch('https://restcountries.com/v3.1/all');
  
      if (!res.ok) {
        throw Error("Something went wrong.")
      }
  
      restCountries.value = await res.json();
  
    } catch (err) {
      console.log(err.message);
      ApiError.value = err.message
		console.log("ApiError", ApiError.value);

    }
    
  }

  return { restCountries, ApiError, load }
}

export default getCountries;