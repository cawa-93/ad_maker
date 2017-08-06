<template>
	<span>
		<span v-for="(component, index) in nameComponents" :key="index" :class="{'caption grey--text':component === 'gp137ek'}">
			{{component}}
		</span>
	</span>
</template>

<script>
	export default {
		name: 'pretyName',
		computed: {
			nameComponents () {
				return this.$slots.default[0].text.split('_')
			},
		},
	}
</script>