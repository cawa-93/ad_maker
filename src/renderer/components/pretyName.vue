<template>
	<span>
		<span v-for="(component, index) in nameComponents" :key="index"
			:class="{'caption grey--text': component === 'gp137ek' || component === 'search'}"
		>
			{{component}}
		</span>
	</span>
</template>

<script>
	export default {
		name: 'pretyName',
		props: {
			text: {
				type: String,
				require: true,
			},
		},
		computed: {
			nameComponents () {
				return this.text.split('_')
			},
		},
	}
</script>