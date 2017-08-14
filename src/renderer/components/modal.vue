<template>
	<v-dialog lazy :value="value" @input="input" :persistent="!closable" :width="width">
		<v-card>
			<v-card-title :class="[color, {'white--text': color}]">
				<span class="modal-title">
					{{title}}
				</span>
				<v-btn icon class="mt-0 mb-0 mr-0 close" 
					v-if="closable"
					:class="{'white--text': color}"
					@click="input(false)"
				>
					<v-icon>close</v-icon>
				</v-btn>
			</v-card-title>
			<v-divider :class="color"/>
			<v-progress-linear indeterminate 
				v-if="loader"
				:color-front="`${color} lighten-1`"
				:color-back="`${color} lighten-3`"
			/>
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
			loader: {
				type: Boolean,
				default: false,
			},
			closable: {
				type: Boolean,
				default: true,
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
	.progress-linear {
		margin-top: -7px;
		margin-bottom: 0;
	}
	.modal-title {
		line-height: 36px
	}
</style>
