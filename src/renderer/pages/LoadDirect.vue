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
		loadDirect (filePath) {
			this.$store.dispatch('Direct/initStack', {filePath})
		},
	},
}
</script>
