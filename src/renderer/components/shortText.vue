<template>
	<span @click="enable = !enable">
		<span class="shortText" v-if="enable && words > length" title="Клиените чтобы развернуть">{{text}}</span>
		<slot v-else></slot>
	</span>
</template>

<script>
	export default {
		name: 'shortText',
		props: {
			length: {
				type: Number,
				default: 3,
			},
		},
		data () {
			return {
				enable: true,
				words: this.$slots.default[0].text.split(' ').length,
			}
		},
		computed: {
			text () {
				return this.$slots.default[0].text.split(' ').slice(0, this.length).join(' ') + '...'
			},
		},
	}
</script>

<style scoped>
	.shortText {
		border-bottom: 1px dashed;
	}
</style>