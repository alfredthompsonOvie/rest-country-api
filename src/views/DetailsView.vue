<template>
	<main :class="isDarkTheme ? 'main__dark' : 'main__light'">
		<button
			class="btn btn--Btn btn--back"
			:class="isDarkTheme ? 'el__dark' : 'el__light'"
			@click.prevent="back"
		>
			<font-awesome-icon icon="fa-solid fa-arrow-left" />
			<span>Back</span>
		</button>

		<section class="countryDetails" v-if="country.length">
			<Transition @enter="onFlagEnter" :css="false" appear>
				<div class="countryDetails--flag" key="0">
					<img :src="country[0].flags.svg" alt="" />
				</div>
			</Transition>
			<Transition appear @enter="onEnter" :css="false">
				<section class="countryDetails__contents" key="1">
					<h1 class="card__title">{{ country[0].name }}</h1>
					<div class="details">
						<ul class="contents__list">
							<li class="card__details">
								Native Name:
								<span class="card__content--result">
									{{ country[0].nativeName }}
								</span>
							</li>

							<li class="card__details">
								Population:
								<span class="card__content--result">
									{{ country[0].population.toLocaleString("en-US") }}
								</span>
							</li>
							<li class="card__details">
								Region:
								<span class="card__content--result">
									{{ country[0].region }}
								</span>
							</li>
							<li class="card__details">
								Sub Region:
								<span class="card__content--result">
									{{ country[0].subregion }}
								</span>
							</li>
							<li class="card__details">
								Capital:
								<span class="card__content--result">
									{{ country[0].capital }}
								</span>
							</li>
						</ul>
						<ul class="contents__list">
							<li class="card__details">
								Top Level Domain:
								<span class="card__content--result">
									{{ country[0].topLevelDomain[0] }}
								</span>
							</li>
							<li class="card__details">
								Currencies:
								<span class="card__content--result">
									{{ country[0].currencies[0].code }}
								</span>
							</li>
							<li class="card__details lang">
								<!-- for loop -->
								Languages:
								<span
									class="card__content--result"
									v-for="lang in country[0].languages"
									:key="lang"
								>
									{{ lang.name }}
								</span>
							</li>
						</ul>
					</div>
					<div class="country__borders" v-if="country[0].borders">
						<p>Border Countries:</p>
						<ul class="country__borders--lists">
							<!-- for loop -->
							<li
								class="btn--Btn border--btn"
								:class="isDarkTheme ? 'el__dark' : 'el__light'"
								v-for="borders in country[0].borders"
								:key="borders"
							>
								{{ borders }}
							</li>
						</ul>
					</div>
				</section>
			</Transition>
		</section>
	</main>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import getCountry from "@/composables/getCountry";
import { gsap } from "gsap";

export default {
	name: "detailsView",
	props: {
		id: {
			type: String,
			required: true,
		},
		isDarkTheme: {
			type: Boolean,
		},
	},
	setup(props) {
		const countryName = ref(props.id);
		const router = useRouter();
		const back = () => router.go(-1);

		const { country, loadCountry } = getCountry();
		loadCountry(countryName.value);

		const tl = gsap.timeline({
			defaults: {
				duration: 1
			}
		});
		const onFlagEnter = () => {
			tl.from(".countryDetails--flag", {
				autoAlpha: 0.01,
				scale: 0.8,
				ease: "back"
			});
		};
		const onEnter = () => {
			tl.from(
				[
					".countryDetails__contents .card__title",
					".card__details",
					".country__borders p",
					".country__borders--lists li",
				],
				{
					autoAlpha: 0.01,
					y: 10,
					stagger: {
						each: 0.2,
						from: "start"
					},
				}, "<0.5"
			);
		};

		return {
			country,
			back,
			onEnter,
			onFlagEnter,
		};
	},
};
</script>

<style lang="scss" scoped></style>
