<template>
	<main :class="isDarkTheme ? 'main__dark' : 'main__light'">
		<section class="search__wrapper">
			<form @submit.prevent="handleSearch">
				<label for=""></label>
				<input
					v-model="searchInputField"
					type="search"
					:class="
						isDarkTheme
							? ['el__dark', 'input__dark']
							: ['el__light', 'input__light']
					"
					placeholder="Search for a country..."
				/>
				<font-awesome-icon icon="fa-solid fa-magnifying-glass" />
			</form>
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
				<!-- tag="ul"
				name="fade" -->
				<!-- class="options"
				:class="isDarkTheme ? ['el__dark'] : ['el__light']" -->
				<!-- v-if="showOptions" -->
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
							@click.prevent="handleFilter(option)"
							class="options__item"
							
						>
							{{ option.displayName }}
						</li>
					</ul>
				</Transition>
			</div>
		</section>

		<section class="" ref="countries__container">
			<div class="error loadingData" v-if="error">
				{{ error }}
			</div>

			<template v-if="countries.length">
				<TransitionGroup
				appear
					@before-enter="onBeforeCardEnter"
					@enter="onCardEnter"
					:css="false"
					tag="ul"
					class="countries__wrapper"
				>
				<li
				
						v-for="(country, idx) in countries"
						:key="country.name"
						:data-index="idx">
						<Tilt
							:options="{
								parallax: true,
								glare: true,
								'max-glare': 0.2,
								axis: 'x',
								reverse: true,
							}"
							class="card"
						:class="isDarkTheme ? 'el__dark' : 'el__light'"
							
						>
							<router-link
								:to="{
									name: 'detailsView',
									params: {
										id: country.name,
									},
								}"
							>
								<div class="flag">
									<img :src="country.flags.svg" alt="" />
								</div>
								<div class="card__contents">
									<h3 class="card__title">{{ country.name }}</h3>
									<p class="card__details">
										Population:
										<span class="card__content--result">{{
											country.population.toLocaleString("en-US")
										}}</span>
									</p>
									<p class="card__details">
										Region:
										<span class="card__content--result">{{ country.region }}</span>
									</p>
									<p class="card__details">
										Capital:
										<span class="card__content--result">{{ country.capital }}</span>
									</p>
								</div>
							</router-link>
						</Tilt>
					</li>
				</TransitionGroup>
			</template>

			<!-- spinner -->
			<div v-if="spinner" class="loadingData">
				<p 
				:class="isDarkTheme ? 'el__dark' : 'el__light'"
				>Loading...</p>
			</div>
		</section>
	</main>
</template>

<script>
import { ref, watch, onMounted, onUnmounted, TransitionGroup } from "vue";
import getCountries from "@/composables/getCountries";
import Tilt from "vanilla-tilt-vue";

import { gsap } from "gsap";

export default {
	name: "HomeView",
	components: {
    Tilt,
    TransitionGroup
},
	props: {
		isDarkTheme: {
			type: Boolean,
		},
	},
	setup() {
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
		const countries__container = ref(null);
		const searchInputField = ref("");
		const filterBy = ref("");
		const continent = ref([]);
		const spinner = ref(false)

		// countries to render
		const countries = ref([]);
		const error = ref(null);

		// restCountries
		const { restCountries, ApiError, loadAllCountries } = getCountries();
		loadAllCountries();

		onMounted(() => {
			window.addEventListener("scroll", handleScroll);
		});
		onUnmounted(() => {
			window.removeEventListener("scroll", handleScroll);
		});

		// LOADS MORE DATA TO THE PAGE ON SCROLL
		const handleScroll = () => {
			const countriesContainer = countries__container.value;

			if (
				countriesContainer.getBoundingClientRect().bottom <
					window.innerHeight &&
				searchInputField.value === "" &&
				filterBy.value === ""
			) {
				//load more data
				countriesToRender(countries.value.length, 8, restCountries.value);
			}
			if (
				countriesContainer.getBoundingClientRect().bottom <
					window.innerHeight &&
				searchInputField.value === "" &&
				filterBy.value
			) {
				//load more data
				countriesToRender(countries.value.length, 8, continent.value);
			}

			if (
				countriesContainer.getBoundingClientRect().bottom <
					window.innerHeight 
			) {
				//show spinner
				spinner.value = true
			}
		};

		// fill up countries array with some restCountries data
		const countriesToRender = (skip, limit, array) => {
			skip = countries.value.length;
			limit += skip;

			for (let i = skip; i < limit; i++) {
				countries.value.push(array[i]);
			}
			// remove every sparce array elements
			countries.value = countries.value.filter((c) => c);
		};

		// INITIAL RENDER ON PAGE LOAD
		watch(restCountries, (newSearch) => {
			if (newSearch) {
				countriesToRender(countries.value.length, 8, restCountries.value);
			}
		});
		watch(ApiError, (newSearch) => {
			if (newSearch) {
				error.value = ApiError.value;
			}
		});

		// FILTER BY SEARCH
		watch(searchInputField, (newSearch) => {
			if (newSearch === "" && !filterBy.value) {
				countries.value = [];
				countriesToRender(countries.value.length, 8, restCountries.value);
			}
			if (newSearch) {
				filterBy.value = "";
				continent.value = [];
				const searchCountry = restCountries.value.filter((c) => {
					return c.name.toLowerCase().includes(searchInputField.value);
				});
				countries.value = [];
				if (!searchCountry.length) {
					error.value = "Country not found";
					console.log("not found");
				}
				if (searchCountry.length) {
					error.value = "";
					countriesToRender(countries.value.length, 8, searchCountry);
				}
			}
		});

		// FILTER BY REGION
		watch(filterBy, (newVal) => {
			if (newVal) {
				continent.value = [];
				continent.value = restCountries.value.filter((c) => {
					return c.region === newVal.searchTerm;
				});
				countries.value = [];
				countriesToRender(countries.value.length, 8, continent.value);
			}
		});

		function handleFilter(opt) {
			filterBy.value = opt;
			showOptions.value = false;
			searchInputField.value = "";
		}
		const handleSearch = () => {};

		//
		const animateDropDown = (el) => {
			const listItem = [...el.children];
			const tl = gsap.timeline({
				defaults: {
					ease: "power4.out",
					duration: 1,
				},
				paused: true,
			});

			tl.fromTo(el, {
				opacity: 0,
				rotateY: "90deg"
			},{
				opacity: 1,
				rotateY: "0deg",
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

			return tl;
		};

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
			animateDropDown(el).play();
			done();
		};
		// fix this
		const onLeave = (el, done) => {
			console.log("leave");
			const items = [...el.children];
			const tl = gsap.timeline()
			// animateDropDown(el).timeScale(0.5).reverse();
			tl.to(items, {
				opacity: 0,
				scale: 0,
				transformOrigin: "left",
				// y: 10,
				stagger: 0.1
			})
			.to(el, {
				opacity: 0,
				rotateY: "90deg",
				onComplete: done
			})
			// done();
		};


		// animating the country info
		const onBeforeCardEnter = (el) => {
			el.style.opacity = 0;
			el.style.transform = "translateY(15px)";
		};
		const onCardEnter = (el, done) => {
			gsap.to(el, {
				opacity: 1, 
				y: 0,
				delay: el.dataset.index * 0.005,
				duration: 1,
				// stagger: 0.2,
				ease: "power4",
			})
			done();
		};

		return {
			showOptions,
			filterOptions,
			filterBy,
			searchInputField,
			countries,

			error,

			handleSearch,
			handleFilter,
			countries__container,

			onBeforeEnter,
			onEnter,
			onLeave,
			onBeforeCardEnter,
			onCardEnter,

			spinner
		};
	},
};
</script>
