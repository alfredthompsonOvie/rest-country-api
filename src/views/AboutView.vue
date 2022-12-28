<template>
	<main :class="isDarkTheme ? 'main__dark' : 'main__light'">
		<section class="search__wrapper">
			<form @submit.prevent="handleSearch">
				<label for=""></label>
				<!-- v-model.lazy="searchInputField" -->
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
			<div class="error" v-if="error">
				{{ error }}
				error
			</div>

			<template v-if="countries.length">
				<div
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
								<span
									class="card__content--result"
									>{{ country.capital }}</span
									>
									<!-- v-for="capital in country.capital"
									:key="capital" -->
							</p>
						</div>
					</router-link>
				</div>
			</template>

			<!-- spinner -->
			<div v-else class="loadingData">
				<p>Loading...</p>
			</div>
		</section>
	</main>
</template>

<script>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { gsap } from "gsap";

import getCountries from "@/composables/getCountries";
import getCountry from "@/composables/getCountry";
// import getRegion from "@/composables/getRegion";

export default {
	name: "AboutView",
	props: {
		isDarkTheme: {
			type: Boolean,
		},
	},
	setup() {
		const showOptions = ref(false);
		const filterOptions = ref([
			"Africa",
			"America",
			"Asia",
			"Europe",
			"Oceania",
		]);
		const countries__container = ref(null);
		const filterBy = ref("");
		const searchInputField = ref("");

		// countries to render
		const countries = ref([]);
		const error = ref(null);

		// restCountries
		const { restCountries, ApiError, loadAllCountries } = getCountries();

		const { country, apiCountryError, loadCountry } = getCountry()

		onMounted(() => {
			loadAllCountries();
			window.addEventListener("scroll", handleScroll);
		});
		onUnmounted(() => {
			window.removeEventListener("scroll", handleScroll);
		});
		const handleScroll = () => {
			const containerHeight = countries__container.value;

			if (containerHeight.getBoundingClientRect().bottom < window.innerHeight) {
				console.log("rock bottom");
				//call a function to load more data
				countriesToRender(countries.value.length, 8, restCountries.value);
			}
		};


		// fill up countries array with some restCountries data
		const countriesToRender = (skip, limit, array) => {
			skip = countries.value.length;
			limit = limit + skip;
			// console.log("limit: ", limit);
			// countries.value = array.filter((el, idx, arr)=> arr[idx])

			for (let i = skip; i < limit; i++) {
				countries.value.push(array[i]);
				// countries.value.push(restCountries.value[i]);
			}
		};

		// INITIAL RENDER 
		watch(restCountries, (newSearch) => {
			if (newSearch) {
				countriesToRender(countries.value.length, 8, restCountries.value);
				console.log("watch countries array ", countries.value.length);
			}
		});
		watch(ApiError, (newSearch) => {
			if (newSearch) {
				error.value = ApiError.value;
			}
		});
		// watch(apiCountryError, (newSearch) => {
		// 	if (newSearch) {
		// 		error.value = apiCountryError.value;
		// 	}
		// });

		// const renderCountry = async (search) => {
		// 	await loadCountry(search);
		// 	return countries.value = country.value
		// }
		//!todo => search field and filterBy functionality
		// watch(searchInputField, (newSearch) => {
		// 	if (newSearch === "") {
		// 		loadAllCountries();
		// 	} else {
		// 		// loadCountry(newSearch);
		// 		// countries.value = country.value
		// 		renderCountry(newSearch)
		// 	}
		// });

		// watch(filterBy, (newFilter) => {
		// 	loadRegion(newFilter);
		// });

		const handleSearch = async (countryName) => {
			// console.log(searchInputField.value);
			// const restCountry = ref([]);
			// try {
			// 	const res = await fetch(
			// 		`https://restcountries.com/v3.1/name/${countryName}`
			// 	);
			// 	if (!res.ok) {
			// 		throw Error("Something went wrong");
			// 	}
			// 	return restCountry.value = await res.json();
			// } catch (err) {
			// 	ApiError.value = err.message;
			// 	console.log(err);
			// }
			console.log(searchInputField.value);
		}

		watch(searchInputField, async (newVal) => {
			if (newVal === '') {
				countries.value = [];
				countriesToRender(countries.value.length, 8, restCountries.value);
			} else {
				countries.value = [];
				await loadCountry(searchInputField.value);
				countriesToRender(countries.value.length, 8, country.value);
				// // const searchCountry = ref([])
				console.log("country: ", country.value);
				console.log("countries: ", countries.value);
				console.log(newVal);
				console.log(searchInputField.value);
	
				// searchCountry.value = restCountries.value.filter(country => {
				// 	return country.name.common.toLowerCase() === newVal
				// })
				// console.log(searchCountry.value);
				// countries.value = searchCountry.value;
				// countriesToRender(countries.value.length, 8, searchCountry.value);
				
				// countriesToRender(countries.value.length, 8, handleSearch(newVal));
			}
		})



		function handleFilter(opt) {
			filterBy.value = opt;
			showOptions.value = false;
		}

		// change the name to a more descriptive name
		const handleClick = () => {
			showOptions.value = !showOptions.value;

			const tl = gsap.timeline({
				paused: true,
			});

			tl.fromTo(
				"options",
				{
					clipPath: "circle(0% at 100% 0)",
				},
				{
					clipPath: "circle(141.5% at 100% 0)",
					duration: 1.2,
					ease: "bounce",
				}
			).from("options__item", {
				y: 10,
				autoAlpha: 0.01,
				stagger: 0.2,
				ease: "back",
			});

			if (showOptions.value) {
				tl.play();
			} else {
				tl.reverse(0);
			}
		};

		// const loadCountries = async () => {
		// 	try {
		// 		const res = await fetch("https://restcountries.com/v3.1/all");

		// 		if (!res.ok) {
		// 			throw Error("Something went wrong.");
		// 		}

		// 		countries.value = await res.json();
		// 	} catch (err) {
		// 		error.value = err.message;
		// 	}
		// };
		// loadCountries();

		// const loadCountry = async (countryName) => {
		// 	const res = await fetch(
		// 		`https://restcountries.com/v3.1/name/${countryName}`
		// 	);
		// 	countries.value = await res.json();
		// 	// console.log(countries.value);
		// };

		// const loadRegion = async (region) => {
		// 	const res = await fetch(
		// 		`https://restcountries.com/v3.1/region/${region}`
		// 	);
		// 	countries.value = await res.json();
		// 	// console.log(region.value);
		// };

		// function handleSearch() {}
		// function handleFilter(opt) {
		// 	filterBy.value = opt;
		// 	showOptions.value = false;
		// }

		// const handleClick = () => {
		// 	showOptions.value = !showOptions.value;

		// 	const tl = gsap.timeline({
		// 		paused: true,
		// 	});

		// 	tl.fromTo(
		// 		"options",
		// 		{
		// 			clipPath: "circle(0% at 100% 0)",
		// 		},
		// 		{
		// 			clipPath: "circle(141.5% at 100% 0)",
		// 			duration: 1.2,
		// 			ease: "bounce",
		// 		}
		// 	).from("options__item", {
		// 		y: 10,
		// 		autoAlpha: 0.01,
		// 		stagger: 0.2,
		// 		ease: "back",
		// 	});

		// 	if (showOptions.value) {
		// 		tl.play();
		// 	} else {
		// 		tl.reverse(0);
		// 	}
		// };

		// watch(searchInputField, (newSearch) => {
		// 	if (newSearch === "") {
		// 		loadCountries();
		// 	} else {
		// 		console.log(newSearch);
		// 		loadCountry(newSearch);
		// 	}
		// });

		// watch(filterBy, (newFilter) => {
		// 	if (newFilter === "") {
		// 		loadCountries();
		// 	} else {
		// 		console.log(newFilter);
		// 		loadRegion(newFilter);
		// 	}
		// });

		return {
			showOptions,
			filterOptions,
			filterBy,
			searchInputField,
			countries,

			// allCountries,
			error,
			// countriesArray
			// getImageUrl,
			// displayCountries
			handleSearch,
			handleFilter,
			handleClick,
			countries__container,
		};
	},
};
</script>
