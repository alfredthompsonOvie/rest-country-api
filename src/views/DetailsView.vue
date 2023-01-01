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
			<transition
			@before-enter="onBeforeEnter"
			@enter="onEnter"
			@before-leave="onBeforeLeave"
			@leave="onLeave"
			:css="false"
			>
			
			</transition>
			<div class="countryDetails--flag">
				<img :src="country[0].flags.svg" alt="" />
			</div>

			<section class="countryDetails__contents">
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
		</section>
	</main>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import getCountry from "@/composables/getCountry";

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


		const onBeforeEnter = () => {
			
		}
		const onEnter = () => {
			
		}
		const onBeforeLeave = () => {
			
		}
		const onLeave = () => {
			
		}
		return {
			country,
			back,
			onBeforeEnter,
			onEnter,
			onBeforeLeave,
			onLeave,

		};
	},
};
</script>

<style lang="scss" scoped></style>
