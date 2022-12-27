<template>
  <div 
  :class="isDarkTheme ? 'main__dark' : 'main__light'"
  v-if="country.length"
  >
    {{ country[0].name.common }}
    <!-- <img :src="country[0].flags.svg" alt="" /> -->
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import getCountry from "@/composables/getCountry";

export default {
  name: "detailsView",
  props: {
    id: {
      type: String,
      required: true
    },
    isDarkTheme: {
      type: Boolean,
    },
  },
  setup(props) {
    const countryName = ref(props.id);
    console.log(countryName.value);

    const { country, loadCountry } = getCountry();
    loadCountry(countryName.value)
    console.log(country.value);

    watch(country, () => {
      // console.log(country);
    console.log(country.value);
    console.log(country.value.length);

    } )
    return {
      country
    }
  }
}
</script>

<style lang="scss" scoped>

</style>