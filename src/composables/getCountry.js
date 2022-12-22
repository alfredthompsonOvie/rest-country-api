// import { ref } from "vue";

const getCountries = async () => {
  // const countries = ref([]);

  const data = await fetch('https://restcountries.com/v3.1/all');

  console.log(data);
}

export default getCountries