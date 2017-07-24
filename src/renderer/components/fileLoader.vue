<template>
	<div>
		<v-progress-linear indeterminate :active="isProgress" :height="2"></v-progress-linear>
		<dropdown-zone @input="load"></dropdown-zone>
		<file-history @input="load" :type="type" title="Последние файлы"></file-history>
	</div>
</template>

<script>
import fileHistory from '@/components/fileHistory'
import dropdownZone from '@/components/dropdownZone'

export default {
	name: 'fileLoader',
	components: {fileHistory, dropdownZone},
	props: {
		action: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
	},
	data () {
		return {
			isProgress: false,
		}
	},
	methods: {
		async load (filePath) {
			this.isProgress = true
			try {
				await this.$store.dispatch(this.action, {filePath})
				this.$emit('load')
			} catch (e) {
				console.error(e)
			}
			this.isProgress = false
		},
	},
}
</script>
