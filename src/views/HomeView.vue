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
			</form>

			<div class="filter__dropdown">
				<button
					class="btn__filter"
					:class="isDarkTheme ? ['el__dark'] : ['el__light']"
					@click.prevent="showOptions = !showOptions"
				>
					<span>Filter by Region</span>
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
			<div
				class="card"
				:class="isDarkTheme ? 'el__dark' : 'el__light'"
				v-for="country in allCountries"
				:key="country.name"
			>
				<div class="flag">
					<img :src="country.flags.svg" alt="" />
				</div>
				<div class="card__contents">
					<h3 class="card__title">{{ country.name.common }}</h3>
					<p class="card__details">
						Population:
						<span class="card__content--result">{{ country.population }}</span>
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
		</section>
	</main>
</template>

<script>
import { ref, watchEffect } from "vue";
// import getCountries from "@/composables/getCountries"
import { countries, getCountries } from "@/composables/getCountries";

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
		getCountries();
		const allCountries = ref(countries);
		// const allCountries = getCountries()
		// create an array
		// use computed properties to display the contents of the array
		// search input populates that array on search
		// filterBy also filters that array

		// function getImageUrl(name) {
		//   return new URL(`./dir/${name}.png`, import.meta.url).href
		// }
		watchEffect(() => {
			console.log(filterBy.value);
			console.log(allCountries.value);
		});
		return {
			showOptions,
			filterOptions,
			filterBy,
			allCountries,
			// getImageUrl,
		};
	},
};
</script>
