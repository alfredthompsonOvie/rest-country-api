<template>
	<div class="filter__dropdown">
		<button
			class="btn__filter"
			:class="isDarkTheme ? ['el__dark'] : ['el__light']"
			@click.prevent="showOptions = !showOptions"
		>
			<span>Filter by Region</span>
			<font-awesome-icon
				icon="fa-solid fa-angle-down"
				:class="{ animateAngleIcon: showOptions }"
			/>
		</button>

		<Transition
			appear
			@before-enter="onBeforeEnter"
			@enter="onEnter"
			@leave="onLeave"
			:css="false"
		>
			<ul
				class="options"
				:class="isDarkTheme ? ['el__dark'] : ['el__light']"
				v-if="showOptions"
			>
				<li
					v-for="option in filterOptions"
					:key="option"
					@click.prevent="sendEvent(option.searchTerm)"
					class="options__item"
          >
					<!-- @click.prevent="handleFilter(option)" -->
					{{ option.displayName }}
				</li>
			</ul>
		</Transition>
	</div>
</template>

<script>
import { ref } from "vue";
import { gsap } from "gsap";
export default {
  props: {
		isDarkTheme: {
			type: Boolean,
		},
  },
  emits: ["option"],
  setup(props, { emit }) {
    const showOptions = ref(false);
		const filterOptions = ref([
      {
        displayName: "Africa",
				searchTerm: "Africa"
			},
			{
        displayName: "America",
				searchTerm: "Americas"
			},
			{
				displayName: "Asia",
				searchTerm: "Asia"
			},
			{
				displayName: "Europe",
				searchTerm: "Europe"
			},
			{
				displayName: "Oceania",
				searchTerm: "Oceania"
			},
    ]);
    const filterBy = ref("");

    const sendEvent = (opt) => {
      emit("option", opt);
      showOptions.value = !showOptions.value
    }

		const onBeforeEnter = (el) => {
			const items = [...el.children];

			gsap.set(el, {
				opacity: 0,
				rotateY: "90deg"
			})
			gsap.set(items, {
				opacity: 0,
				scale: 0,
				y: 10,
			})
		};

		const onEnter = (el, done) => {
      const listItem = [...el.children];
			const tl = gsap.timeline({
				defaults: {
					ease: "power4.out",
					duration: 1,
				},
			});

			tl.fromTo(el, {
				opacity: 0,
				rotateY: "90deg"
			},{
				opacity: 1,
        rotateY: "0deg",
        ease: "bounce",
				onComplete: () =>
					gsap.to(el, {
						clearProps: "all",
					}),
			}).fromTo(
				listItem, {
					opacity: 0,
					scale: 1,
					y: 10,
				},
				{
					opacity: 1,
					y: 0,
					stagger: 0.2,
				// 	onComplete: () =>
				// 		gsap.to(".options__item", {
				// 			clearProps: "all",
				// 		}),
				},
				"-=0.9"
			);

			done();
		};

		const onLeave = (el, done) => {
			const items = [...el.children];
      const tl = gsap.timeline()

			tl.to(items, {
				opacity: 0,
        stagger: 0.1,
        ease: "back"
			})
			.to(el, {
				opacity: 0,
        rotateY: "90deg",
        ease: "bounce",
				onComplete: done
			})
      tl.timeScale(1.8)
		};
    return {
      showOptions,
      filterOptions,
      filterBy,
      onBeforeEnter,
      onEnter,
      onLeave,

      sendEvent
    };
	},
};
</script>
