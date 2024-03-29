<template>
	<main :class="isDarkTheme ? 'main__dark' : 'main__light'">
		<section class="search__wrapper">
			<form @submit.prevent="">
				<label for=""></label>
				<input
					v-model="searchInputField"
					type="search"
					arial-label="search for a country"
					:class="
						isDarkTheme
							? ['el__dark', 'input__dark']
							: ['el__light', 'input__light']
					"
					placeholder="Search for a country..."
				/>
				<font-awesome-icon icon="fa-solid fa-magnifying-glass" />
			</form>
			<FilterBy :isDarkTheme="isDarkTheme" @option="handleFilter"/>
		</section>

		<section class="" ref="countries__container">
			<p class="error loadingData" v-if="error">
				{{ error }}
			</p>

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
					<section
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
								<h1 class="card__title">{{ country.name }}</h1>
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
						</section>
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

import { gsap } from "gsap";

import FilterBy from "../components/FilterBy.vue";

export default {
	name: "HomeView",
	components: {
		TransitionGroup,
		FilterBy
},
	props: {
		isDarkTheme: {
			type: Boolean,
		},
	},
	setup() {
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
					return c.region === newVal;
				});
				countries.value = [];
				countriesToRender(countries.value.length, 8, continent.value);
			}
		});

		function handleFilter(opt) {
			filterBy.value = opt;
			searchInputField.value = "";
		}
		const handleSearch = () => {};


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
			filterBy,
			searchInputField,
			countries,
			error,

			handleSearch,
			handleFilter,
			countries__container,

			onBeforeCardEnter,
			onCardEnter,

			spinner
		};
	},
};
</script>

<style>
.loadingData {
	color: red;
	margin-top: 3em;
}
</style>