<template >
  <AppNav @changeTheme="changeTheme" :isDarkTheme="isDarkTheme"/>

  <router-view 
  :isDarkTheme="isDarkTheme"
  v-slot="{ Component }"
  >
  <Transition name="slide" mode="out-in">
    <component :is="Component" /> 
  </Transition>
  </router-view>

</template>

<script>
import AppNav from "@/components/AppNav.vue";
import { ref, watch } from "vue";
export default {
  components: {
    AppNav
  },
  setup() {
    const isDarkTheme = ref(true);

    const changeTheme = (value) => {
      isDarkTheme.value = value
    }
    watch(isDarkTheme, () => {
      localStorage.setItem("themeState", isDarkTheme.value)
    })
    // onCreated
    isDarkTheme.value = JSON.parse(localStorage.getItem('themeState'));

    return {
      isDarkTheme,
      changeTheme
    }
  }
}
</script>

<style scoped>
/* .slide-enter-from  section, .slide-leave-to section {
  opacity: 0;
  transform: translateY(10px);
}
.slide-enter-active, .slide-leave-active {
  transition: all 3s linear;
} */
</style>