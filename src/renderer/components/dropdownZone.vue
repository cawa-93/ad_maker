<template>
	<v-card>
		<div 
			class="dropdown-zone-root"
			:class="{'primary white--text': isDrag}"
			@click="openFile"
			@drop.prevent="loadFiles"
			@dragover.prevent="isDrag = true"
			@dragleave.prevent="isDrag = false"
		>
			<div class="dashed">
				<v-icon x-large>file_upload</v-icon>
				<p class="dropdown-zone-content">Перетащите файл сюда</p>
			</div>
		</div>
	</v-card>
</template>

<script>
	export default {
		name: 'dropdownZone',
		data () {
			return {
				isDrag: false,
			}
		},
		methods: {
			loadFiles (e) {
				this.isDrag = false
				this.$emit('input', e.dataTransfer.files[0].path)
			},
			openFile () {
				const path = this.$electron.remote.dialog.showOpenDialog()
				if (path && path[0]) {
					this.$emit('input', path[0])
				}
			},
		},
	}

	   //  dropZone.ondragover = function() {
    //     this.className = 'upload-drop-zone drop';
    //     return false;
    // }

    // dropZone.ondragleave = function() {
    //     this.className = 'upload-drop-zone';
    //     return false;
    // }
</script>

<style scoped>
	.dropdown-zone-root {
		padding: 10px;
		opacity: 0.8;
	}
	.dropdown-zone-root, .dashed {
		min-height: 150px;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}
	.dashed {
		border: 3px dashed;
		pointer-events: none !important;
	}
	
	.icon {
    box-sizing: content-box;
    border-radius: 5px;
		margin: 0;
		pointer-events: none !important;
	}
	.dropdown-zone-content {
		pointer-events: none !important;
		margin: 0;
	}
</style>
