<template>
	<div class="drop-down" @click="openFile" @drop.prevent="loadFiles" @dragover.prevent><slot></slot></div>
</template>

<script>
	const {dialog} = require('electron').remote
	export default {
		name:    'dropFile',
		methods: {
			loadFiles (e) {
				console.log('ondrop', e.dataTransfer.files)
				this.$emit('select', e.dataTransfer.files[0].path)
			},
			openFile () {
				const path = dialog.showOpenDialog()
				if (path && path[0]) { this.$emit('select', path[0]) }
			}
		}
	}
</script>

<style scoped>
	.drop-down {
		height:calc(100vh - 64px);
	}
</style>
