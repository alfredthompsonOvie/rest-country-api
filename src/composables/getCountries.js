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
      // console.log(restCountries.value);
  
    } catch (err) {
      // console.log(err.message);
      ApiError.value = err.message
		// console.log("ApiError", ApiError.value);

    }
    
  }

  return { restCountries, ApiError, loadAllCountries }
}

export default getCountries;