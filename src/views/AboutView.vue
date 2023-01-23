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
				<TransitionGroup 
				tag="ul" 
				appear
				@before-enter="onBeforeCardEnter"
				@enter="onCardEnter"
				:css="false" 
				class="countries__wrapper"
				>
					<li
						v-for="(country, idx) in dataToRender"
						:key="country.name"
						:data-index="idx"
					>
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
						</section>
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
import { ref, watch, onMounted } from "vue";
import FilterBy from "../components/FilterBy.vue";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default {
	components: {
		FilterBy,
	},
	props: ["isDarkTheme"],
	setup() {
		const container = ref(null);
		const allData = ref([]);
		const error = ref(null);
		const dataToRender = ref([]);
		const searchValue = ref("");
		const filterBy = ref("");
		const cardAnimationDelay = ref(0);

		// let skip = ref(dataToRender.value.length);
		const maxContent = ref(8);

		watch(allData, () => {
			// loadData();
			// handleScroll();
			dataToRender.value = getData(allData.value, dataToRender.value.length, maxContent.value);
		});

		watch(searchValue, (val) => {
			dataToRender.value = [];

			if (!val) {
				dataToRender.value = getData(allData.value, dataToRender.value.length, maxContent.value);
				return;
			}
			// dataToRender.value = [];
			filterBy.value = "";
			dataToRender.value = getData(sFn(allData.value, val), dataToRender.value.Length, maxContent.value)

			console.log(val);
		});

		watch(filterBy, (FilterVal) => {
			if (FilterVal) {
				dataToRender.value = [];

				console.log(FilterVal);

				dataToRender.value = getData(fFn(allData.value, FilterVal), dataToRender.value.Length, maxContent.value)

				// return dataToRender.value;
				return;
			}
			// dataToRender.value = allData.value.filter((d) => d.region === val);
			// loadData('all', val);
			
			
		});


		const getAPIData = async () => {
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
		getAPIData();

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

		// const displayData = computed(() => dataToRender.value);
		// console.log(displayData);





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
			searchValue.value = "";
			filterBy.value = opt;
		};
		

		
		// 1. fetch all data into an array allData/ resources
		// (watch allData) if allData has data then
		// =====initial render===== //
		// 2. use a fn to get data to render
		// gd(arr, s, e)=>arr.slice(s,e);
		// dataToRender.value = gd(arr, s, e)
		// add more
		// amd(arr1, arr2)=> arr1.concat(arr2) ||arr2 is a fn
		// =====on scroll render===== //
		// amd(arr1, gd(arr, s,e))
		// 3. call the same fn again to load more data
		// 2. store in an arr and  display only 8 at a time
		// loadData(search)=> if(search)

		// f(g(x))  f(arr,s,e) =>arr.slice(s,e)
		// initial data load || load more data
		// where s = startIndex, e = endIndex
		// f(arr, s, e) =>arr.slice(s,e)
		const getData = (arr, s, e) => {
			s = dataToRender.value.length;
			e += s;
			if (!arr.length) {
				error.value = "Sorry could not find country"
			} else {
				error.value = null
				return arr.slice(s, e)
			}
		};
			// add more
		// amd(arr1, arr2)=> arr1.concat(arr2) ||arr2 is a fn
		// where amd means add more data
		const addMoreData = (arr1, arr2) => arr1.concat(arr2) 

		// these are the g(x) | g(x) returns an arr
		// sFn(arr, st)=> arr.filter(d=>d.name.includes(st))
		// where st = search term, sFn = search function
		// d.name.toLowerCase().includes(val.toLowerCase()
		const sFn = (arr,st) => arr.filter(d=>d.name.toLowerCase().includes(st.toLowerCase()))

		// filter function 
		// where ft = filter term, fFn = filter function
		// fFn(arr,ft)=>arr.filter(d=>d.region===ft)
		const fFn = (arr, ft) => arr.filter(d => d.region === ft);

		//compose
		// check if dataToRender is empty
		// check height of dataToRender to load more
		const handleScroll = () => {
			const cHeight = container.value
			// skip = dataToRender.value.length;
			// console.log(.value);
			// let maxContent = maxContent + skip;
			// maxContent.value += skip.value;

			let newArr = []; 
			// console.log("window.innerHeight: ",window.innerHeight);
			// console.log("cHeight: ",cHeight.getBoundingClientRect().bottom);
			
			//check for search
			if (cHeight.getBoundingClientRect().bottom < window.innerHeight
				&& searchValue.value) {
				// concat add to the existing data
				
				//  getData(sFn(allData.value), dataToRender.value.Length, maxContent.value)
				newArr = getData(sFn(allData.value, searchValue.value), dataToRender.value.length, maxContent.value);

				dataToRender.value = addMoreData(dataToRender.value, newArr);
				
				console.log("skip value: ", dataToRender.value.length);
				console.log("maxContent value: ", maxContent.value);
				// dataToRender.value = dataToRender.value.concat(newArr);
				return;
			}

			//check for filterBy
			if (cHeight.getBoundingClientRect().bottom < window.innerHeight
				&& filterBy.value) {
				// concat add to the existing data
				// dataToRender.value = [];
				newArr = getData(fFn(allData.value, filterBy.value), dataToRender.value.length, maxContent.value);

				dataToRender.value = addMoreData(dataToRender.value, newArr);

				
				console.log("skip value: ", dataToRender.value.length);
				console.log("maxContent value: ", maxContent.value);
				// dataToRender.value = dataToRender.value.concat(newArr);
				return;
			}

			if (cHeight.getBoundingClientRect().bottom < window.innerHeight
				&& !searchValue.value && !filterBy.value
			) {
				// concat add to the existing data
				// dataToRender.value = [];
				// amd(arr1, arr2)=> arr1.concat(arr2) ||arr2 is a fn
				newArr = getData(allData.value, dataToRender.value.length, maxContent.value)
				dataToRender.value = addMoreData(dataToRender.value, newArr);
				console.log("skip value: ", dataToRender.value.length);
				console.log("maxContent value: ", maxContent.value);
				// setDelay(".countries__wrapper li", 0)
				return;
			}

			console.log("outside the if blocks");

			// return dataToRender.value = [ ...newArr ];
			// dataToRender.value = dataToRender.value.concat(newArr);
			return;
		}




		onMounted(() => {
			window.addEventListener("scroll", handleScroll);
		});


		const onBeforeCardEnter = (el) => {
			gsap.set(el, {
				opacity: 0,
				y: 20,
			}) 

		};
		const onCardEnter = (el, done) => {
			// console.log(el);
			gsap.to(el, {
				opacity: 1,
				y: 0,
				ease: "back",
				// delay: setDelay(el),
				scrollTrigger: ".card",
				onComplete: done
			})
		};

		return {
			container,
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
