import { ref } from "vue";

const getRegion = () => {
  const region = ref([]);

  const loadRegion = async (regionName) => {
    const res = await fetch(`https://restcountries.com/v3.1/region/${regionName}`);
    region.value = await res.json()
    console.log(region.value);
  }

  return { region, loadRegion }
}

export default getRegion


// https://restcountries.com/v3.1/region/{region}