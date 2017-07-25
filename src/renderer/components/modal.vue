<template>
	<v-dialog lazy :value="value" @input="input" persistent :width="width">
		<v-card>
			<v-card-title :class="[color, {'white--text': color}]">
				<span>
					{{title}}
				</span>
				<v-btn icon class="mt-0 mb-0 mr-0 close" :class="{'white--text': color}" @click="input(false)">
					<v-icon>close</v-icon>
				</v-btn>
				</v-card-title>
				<v-divider  :class="color"/>
			<v-card-text class="pa-0">
				<slot></slot>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
	export default {
		name: 'modal',
		props: {
			title: {
				type: String,
			},
			value: {
				type: Boolean,
				required: true,
			},
			width: {
				type: [String, Number],
				default: 600,
			},
			color: String,
		},
		methods: {
			input (value) {
				return this.$emit('input', value)
			},
		},
	}
</script>

<style scoped>
	.close {
		margin-left: auto;
	}
</style>