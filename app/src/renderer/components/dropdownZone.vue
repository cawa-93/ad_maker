<template>
	<div 
		class="dropdown-zone dropdown-zone-root" :class="{'md-accent': isDragover}"
		@click="openFile"
		@drop.prevent="loadFiles"
		@dragover.prevent="isDragover = true"
		@dragleave.prevent="isDragover = false"
	>
		<div class="dashed">
			<md-icon class="md-size-4x">file_upload</md-icon>
			<slot class="dropdown-zone-content"></slot>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'dropdownZone',
		data () {
			return {
				isDragover: false
			}
		},
		methods: {
			loadFiles (e) {
				this.isDragover = false
				this.$emit('drop', e.dataTransfer.files[0].path)
			},
			openFile () {
				const path = this.$electron.remote.dialog.showOpenDialog()
				if (path && path[0]) { this.$emit('drop', path[0]) }
			}
		}
	}
</script>

<style scoped>
	.dropdown-zone-root {
		padding: 10px;
	}
	.dropdown-zone-root, .dashed {
		width: 100%;
		height:100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		cursor: pointer;
	}
	.dashed {
		border: 5px dashed transparent;
	}
	.dropdown-zone-root.md-accent {
		background: #3f51b5;
		color: #fff;
	}
	.dropdown-zone-root.md-accent .dashed {
		border-color: #fff;
	}
	
	.md-icon {
		border: 5px dashed;
    padding: 19px;
    box-sizing: content-box;
    border-radius: 5px;
		margin: 0;
	}
	.dropdown-zone-content {
		pointer-events: none !important;
	}
</style>
