import { ref } from "vue";

const getCountry = () => {
  const region = ref([]);

  const loadCountry = async (countryName) => {
    const res = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    region.value = await res.json()
    console.log(region.value);
  }

  return { region, loadCountry }
}

export default getCountry


// https://restcountries.com/v3.1/region/{region}