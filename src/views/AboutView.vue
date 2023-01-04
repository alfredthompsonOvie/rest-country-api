<template>
	<main :class="isDarkTheme ? 'main__dark' : 'main__light'">
		<section class="search__wrapper">
			<div class="form__control">
				<label for=""></label>
				<input
					v-model="searchValue"
					type="search"
					:class="
						isDarkTheme
							? ['el__dark', 'input__dark']
							: ['el__light', 'input__light']
					"
					placeholder="Search for a country..."
				/>
				<font-awesome-icon icon="fa-solid fa-magnifying-glass" />
			</div>
			<FilterBy :isDarkTheme="isDarkTheme" @option="handleFilter" />
		</section>

		<section class="" ref="container">
			<div class="error loadingData" v-if="error">
				{{ error }}
			</div>

			<template v-if="allData.length">
				<!-- appear
				@before-enter="onBeforeCardEnter"
				@enter="onCardEnter" -->
				<TransitionGroup :css="false" tag="ul" class="countries__wrapper">
					<li
						v-for="(country, idx) in dataToRender"
						:key="country.name"
						:data-index="idx"
					>
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
										<span class="card__content--result">{{
											country.region
										}}</span>
									</p>
									<p class="card__details">
										Capital:
										<span class="card__content--result">{{
											country.capital
										}}</span>
									</p>
								</div>
							</router-link>
						</Tilt>
					</li>
				</TransitionGroup>
			</template>

			<!-- spinner -->
			<!-- <div v-if="spinner" class="loadingData">
				<p :class="isDarkTheme ? 'el__dark' : 'el__light'">Loading...</p>
			</div> -->
		</section>
	</main>
</template>

<script>
import { ref, watch, computed } from "vue";
import { useInfiniteScroll } from "@vueuse/core";
import FilterBy from "../components/FilterBy.vue";
import Tilt from "vanilla-tilt-vue";

export default {
	components: {
		FilterBy,
		Tilt,
	},
	props: ["isDarkTheme"],
	setup() {
		const container = ref(null);
		const allData = ref([]);
		const error = ref(null);
		const dataToRender = ref([]);
		const totalNumberOfDataToRender = ref(0);
		const searchValue = ref("");
		const filterBy = ref("");
		const cardAnimationDelay = ref(0);

		watch(allData, () => {
			loadData();
		});
		watch(filterBy, (val) => {
			dataToRender.value = allData.value.filter((d) => d.region === val);
			// loadData('all', val);

			console.log(val);
		});
		watch(searchValue, (val) => {
			dataToRender.value = allData.value.filter((d) =>
				d.name.toLowerCase().includes(val.toLowerCase())
			);
			// loadData('all', val);
			console.log(val);
		});

		const getData = async () => {
			try {
				error.value = null;
				const res = await fetch("https://restcountries.com/v2/all");

				if (!res.ok) {
					// console.log("something fucked up");
					throw new Error("Something went wrong!");
				}
				allData.value = await res.json();
			} catch (err) {
				error.value = err.message;
			}
		};
		getData();

		const loadData = () => {
			// skip += limit/maxContent,  limit/maxContent = 8
			let skip = dataToRender.value.length;
			let maxContent = 8;

			//ArrayToRender,
			let moreData = allData.value.slice(skip, maxContent);
			maxContent += skip;
			dataToRender.value.concat(moreData);
			// return arr
			// load data to render
			// for (let i = skip; i < maxContent; i++) {
			// 	if (load === "all") {
			// 		dataToRender.value.push(allData.value[i]);
			// 	}
			// 	if (load === "search") {
			// 		dataToRender.value = allData.value.filter((d) =>
			// 			d.name.toLowerCase().includes(content.toLowerCase())
			// 		);
			// 	}
			// 	if (load === "filterBy") {
			// 		dataToRender.value = allData.value.filter((d) => d.region === content);
			// 	}
			// }


			console.log(dataToRender.value);
		};

		const displayData = computed(() => dataToRender.value);
		console.log(displayData);




		// useInfiniteScroll(container, loadData, { distance: 10 });

		// from vueuse
		// 		useInfiniteScroll(
		//   el,
		//   () => {
		//     // load more
		//     data.value.push(...moreData)
		//   },
		//   { distance: 10 }
		// )

		// loadData();
		// async function loadData() {
		// 	if (data.value.length !== 0 && data.value.length >= total.value) return;
		// 	const res = await fetch();
		// 	const d = await res.json();
		// 	// sets the length
		// 	total.value = d.total;
		// 	// add data to the array
		// 	data.value = data.value.concat(d.products);
		// }

		const handleFilter = (opt) => {
			filterBy.value = opt;
		};
		const onBeforeCardEnter = (el) => {};
		const onCardEnter = (el, done) => { };

		
		// 1. fetch all data into an array allData/ resources
		// if allData has data then
		// =====initial render===== //
		// 2. use a fn to get data to render
		// 3. call the same fn again to load more data
		// 2. store in an arr and  display only 8 at a time
		// loadData(search)=> if(search)

		// f(g(x))  f(arr,s,e) =>arr.slice(s,e)
		// initial data load || load more data
		// where s = startIndex, e = endIndex
		// f(arr, s, e) =>arr.slice(s,e)
		const noFilter = (arr, s, e) => arr.slice(s, e);

		// these are the g(x) | g(x) returns an arr
		// sFn(arr, st)=> arr.filter(d=>d.name.includes(st))
		// fFn(arr,ft)=>arr.filter(d=>d.region===ft)

		//compose
		// check if dataToRender is empty
		// check height of dataToRender to load more
		const composeScroll = () => {
			let cHeight = container.value.getBoundingClientRect().bottom
			let skip = dataToRender.value.length;
			let maxContent = 8;
			if (cHeight < window.innerHeight) {
				dataToRender.value = noFilter(allData.value, skip, maxContent)
			}
			console.log("skip value: ", skip);
			maxContent += skip
			return dataToRender.value;
		}






		return {
			searchValue,
			// filterBy,
			dataToRender,
			error,

			handleFilter,

			onBeforeCardEnter,
			onCardEnter,

			allData,
		};
	},
};
</script>

<style scoped>
.form__control {
	max-width: 450px;
	width: 100%;
	position: relative;
}
.error {
	padding: 2em;
	font-size: 2rem;
	color: rgb(253, 72, 103);
	font-weight: 600;
}
</style>
