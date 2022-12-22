<template>
  <AppNav @changeTheme="changeTheme" :isDarkTheme="isDarkTheme"/>
  <router-view :isDarkTheme="isDarkTheme"></router-view>
</template>

<script>
import AppNav from "@/components/AppNav.vue";
import { ref } from "vue";
export default {
  components: {
    AppNav
  },
  setup () {
    const isDarkTheme = ref(true);

    const changeTheme = (value) => {
      isDarkTheme.value = value
    }

    return {
      isDarkTheme,
      changeTheme
    }
  }
}
</script>

<style lang="scss" scoped>

</style>