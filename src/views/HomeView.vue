<template>
	<main :class="isDarkTheme ? 'main__dark' : 'main__light'">
		<!-- <h1>Home page</h1> -->
		<section class="search__wrapper">
			<form>
				<label for=""></label>
				<input
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
					<font-awesome-icon icon="fa-solid fa-angle-down" />
				</button>
				<ul
					class="options"
					:class="isDarkTheme ? ['el__dark'] : ['el__light']"
					v-if="showOptions"
				>
					<li
						v-for="option in filterOptions"
						:key="option"
						@click.prevent="filterBy = option"
						class="options__item"
					>
						{{ option }}
					</li>
				</ul>
			</div>
		</section>

		<section class="countries__wrapper">
      <!-- error -->
			<div class="error" v-if="error.length">
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
      <div
      v-else> Loading...</div>
		</section>
	</main>
</template>

<script>
import { ref } from "vue";
// import { ref, watchEffect, computed } from "vue";
import getCountries from "@/composables/getCountries";
// import { countries, getCountries } from "@/composables/getCountries";

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

    const { countries, error, load } = getCountries();
    // fetch countries
		load();
    
    // const allCountries = countries;

    // an array of countries
		const countriesArray = ref([])

    // computed display's that array
    // const displayCountries = computed(() => {
    //   // just return an array of countries,
    //   // watchEffect will populate that array
    //   return countries
    // })

    // watchEffect watches filterBy for changes,
    //  if there is any change to filterBy watchEffect fires a function
    // to fetch data and populate the array of countries


		// function getImageUrl(name) {
		//   return new URL(`./dir/${name}.png`, import.meta.url).href
		// }
		
		// watchEffect(() => {
		// 	console.log(filterBy.value);
		// 	console.log(allCountries.value);
		// });
		return {
			showOptions,
			filterOptions,
			filterBy,
			searchInputField,
			// allCountries,
			error,
			countries,
			// getImageUrl,
		};
	},
};
</script>
