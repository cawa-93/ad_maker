<template>
	<div>
		<dropdown-zone @input="loadDirect"></dropdown-zone>
		<file-history @input="loadDirect" type="direct" title="Последние файлы"></file-history>
	</div>
</template>

<script>
import fileHistory from '@/components/fileHistory'
import dropdownZone from '@/components/dropdownZone'

export default {
	name: 'Page_LoadDirect',
	components: {fileHistory, dropdownZone},
	methods: {
		async loadDirect (filePath) {
			try {
				await this.$store.dispatch('Direct/initStack', {filePath})
				if (this.$store.getters['Direct/isLoaded']) {
					this.$router.push('editor')
				}
			} catch (e) {
				console.error(e)
			}
		},
	},
}
</script>
