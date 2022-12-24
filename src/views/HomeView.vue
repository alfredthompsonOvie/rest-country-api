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

		<section class="countries__wrapper">
			<!-- error -->
			<div class="error" v-if="error">
				{{ error }}
			</div>

			<template v-if="countries.length">
				<div
					class="card"
					:class="isDarkTheme ? 'el__dark' : 'el__light'"
					v-for="country in countries"
					:key="country.name"
				>
					<div class="flag">
						<img :src="country.flags.svg" alt="" />
					</div>
					<div class="card__contents">
						<h3 class="card__title">{{ country.name.common }}</h3>
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
								v-for="capital in country.capital"
								:key="capital"
								>{{ capital }}</span
							>
						</p>
					</div>
				</div>
			</template>

			<!-- spinner -->
			<div v-else>Loading...</div>
		</section>
	</main>
</template>

<script>
import { ref, watch } from "vue";
import { gsap } from "gsap";
// import getCountries from "@/composables/getCountries";
// import getCountry from "@/composables/getCountry";
// import getRegion from "@/composables/getRegion";

export default {
	name: "HomeView",
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
		const filterBy = ref("");
		const searchInputField = ref("");
		const countries = ref([]);
		const error = ref(null);

		const loadCountries = async () => {
			try {
				const res = await fetch("https://restcountries.com/v3.1/all");

				if (!res.ok) {
					throw Error("Something went wrong.");
				}

				countries.value = await res.json();
			} catch (err) {
				error.value = err.message;
			}
		};
		loadCountries();

		const loadCountry = async (countryName) => {
			const res = await fetch(
				`https://restcountries.com/v3.1/name/${countryName}`
			);
			countries.value = await res.json();
			// console.log(countries.value);
		};

		const loadRegion = async (region) => {
			const res = await fetch(
				`https://restcountries.com/v3.1/region/${region}`
			);
			countries.value = await res.json();
			// console.log(region.value);
		};

		watch(searchInputField, (newSearch) => {
			if (newSearch === "") {
				loadCountries();
			} else {
				console.log(newSearch);
				loadCountry(newSearch);
			}
		});

		watch(filterBy, (newFilter) => {
			if (newFilter === "") {
				loadCountries();
			} else {
				console.log(newFilter);
				loadRegion(newFilter);
			}
		});

		function handleSearch() {}
		function handleFilter(opt) {
			filterBy.value = opt;
			showOptions.value = false;
		}

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
		};
	},
};
</script>
