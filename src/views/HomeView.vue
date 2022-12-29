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
					@click.prevent="handleClick"
				>
					<span>Filter by Region</span>
					<font-awesome-icon
						icon="fa-solid fa-angle-down"
						:class="{ animateAngleIcon: showOptions }"
					/>
				</button>
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
						{{ option }}
					</li>
				</ul>
			</div>
		</section>

		<section class="countries__wrapper" ref="countries__container">
			<!-- error -->
			<div class="error loadingData" v-if="error">
				{{ error }}
				error
			</div>

			<template v-if="countries.length">
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
					v-for="country in countries"
					:key="country.name"
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
								<!-- v-for="capital in country.capital"
										:key="capital" -->
							</p>
						</div>
					</router-link>
				</Tilt>

				<!-- <div
				class="card"
				:class="isDarkTheme ? 'el__dark' : 'el__light'"
				v-for="country in countries"
				:key="country.name"
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
										country.population
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
					</div> -->
			</template>

			<!-- spinner -->
			<!-- <div v-else class="loadingData">
				<p>Loading...</p>
			</div> -->
		</section>
	</main>
</template>

<script>
import { ref, watch, onMounted, onUnmounted } from "vue";
import getCountries from "@/composables/getCountries";

import Tilt from "vanilla-tilt-vue";
// import { gsap } from "gsap";

// import getCountry from "@/composables/getCountry";
// import getRegion from "@/composables/getRegion";

export default {
	name: "HomeView",
	components: {
		Tilt,
	},
	props: {
		isDarkTheme: {
			type: Boolean,
		},
	},
	setup() {
		const showOptions = ref(false);
		const filterOptions = ref([
			"Africa",
			"Americas",
			"Asia",
			"Europe",
			"Oceania",
		]);
		const countries__container = ref(null);
		const searchInputField = ref("");
		const filterBy = ref("");
		const continent = ref([]);

		// countries to render
		const countries = ref([]);
		const error = ref(null);

		// restCountries
		const { restCountries, ApiError, loadAllCountries } = getCountries();

		// const { country, apiCountryError, loadCountry } = getCountry()

		// const { region, loadRegion } = getRegion();

		onMounted(() => {
			loadAllCountries();
			window.addEventListener("scroll", handleScroll);
			// 	fetch(`https://restcountries.com/v2/region/africa`)
			// 		.then((res) => res.json())
			// 		.then(data => console.log(data))
		});
		onUnmounted(() => {
			window.removeEventListener("scroll", handleScroll);
		});

		// LOADS MORE DATA TO THE PAGE ON SCROLL
		const handleScroll = () => {
			const containerHeight = countries__container.value;

			if (
				containerHeight.getBoundingClientRect().bottom < window.innerHeight &&
				searchInputField.value === "" &&
				filterBy.value === ""
			) {
				console.log("rock bottom");
				//load more data
				countriesToRender(countries.value.length, 8, restCountries.value);
			}
			if (
				containerHeight.getBoundingClientRect().bottom < window.innerHeight &&
				searchInputField.value === "" &&
				filterBy.value
			) {
				console.log("rock bottom");
				//load more data
				countriesToRender(countries.value.length, 8, continent.value);
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
				// console.log("watch countries array ", countries.value.length);
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
				countriesToRender(countries.value.length, 8, searchCountry);
			}
		});

		// FILTER BY REGION
		watch(filterBy, (newVal) => {
			// if (newVal === " America") {
			// 	newVal = " Americas"
			// }
			if (newVal) {
				continent.value = [];
				continent.value = restCountries.value.filter((c) => {
					return c.region === newVal;
				});
				// console.log(continent.value);
				countries.value = [];
				countriesToRender(countries.value.length, 8, continent.value);
			}
		});

		function handleFilter(opt) {
			filterBy.value = opt;
			showOptions.value = false;
			searchInputField.value = "";
		}

		// change the name to a more descriptive name
		const handleClick = () => {
			showOptions.value = !showOptions.value;
		};
		const handleSearch = () => {
			// console.log(searchInputField.value);
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
			handleClick,
			countries__container,
		};
	},
};
</script>
