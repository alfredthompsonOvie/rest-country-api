<template>
	<nav :class="isDarkTheme ? 'nav__dark' : 'nav__light'">
		<h1 class="nav__title title">Where in the world?</h1>
		<div class="theme">
      <transition name="fade" mode="out-in">
        <!-- emit false -->
        <button
        @click="$emit('changeTheme', false)"
        class=btn
        v-if="isDarkTheme"
        >
          <font-awesome-icon icon="fa-regular fa-sun" />
          <span>Light Mode</span>
        </button>
  
        <!-- emit true -->
        <button
        @click="$emit('changeTheme', true)"
        class=btn
        v-else
        >
          <font-awesome-icon icon="fa-regular fa-moon" />
          <span>Dark Mode</span>
        </button>
      
      </transition>
      
      
		</div>
	</nav>
</template>

<script>
export default {
  name: "AppNav",
  props: {
    isDarkTheme: {
      type: Boolean,
      
    }
  },
  emits: ['changeTheme'],
	setup() {
		return {};
	},
};
</script>

<style scoped>
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateX(-7px);
}
.fade-enter-active, .fade-leave-active {
  transition: all .3s linear;
}
</style>
