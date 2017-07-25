<template>
	<v-list two-line subheader v-if="files.length" class="pb-0">
		<v-divider/>
		<v-subheader inset>{{title}}</v-subheader>
		<v-list-tile @click="emit(file.path)" v-for="file in files" :key="file.path">
			<v-list-tile-avatar>
				<v-icon dark :class="iconColor">insert_drive_file</v-icon>
			</v-list-tile-avatar>
			<v-list-tile-content>
				<v-list-tile-title>{{ file.base }}<span class="pl-3 grey--text text--lighten-1 caption">{{file.createdAt}}</span></v-list-tile-title>
				<v-list-tile-sub-title>{{ file.dir }}</v-list-tile-sub-title>
			</v-list-tile-content>
			<v-list-tile-action>
				<v-btn icon ripple @click.stop="remove(file.path)">
					<v-icon class="grey--text text--lighten-1">delete</v-icon>
				</v-btn>
			</v-list-tile-action>
		</v-list-tile>
	</v-list>
</template>

<script>
	import path from 'path'
	export default {
		name: 'fileHistory',
		props: {
			title: {
				type: String,
				default: 'Последние файлы',
			},
			type: {
				type: String,
				required: true,
			},
			maxPathLength: {
				type: Number,
				default: 30,
			},
		},
		data () {
			return {}
		},
		computed: {
			files () {
				return this.$store.getters[`RecentFiles/${this.type}`].map(({createdAt, filePath}) => {
					const fileData = path.parse(filePath)
					createdAt = new Date(createdAt).toLocaleString()
					return {
						createdAt,
						path: filePath,
						base: fileData.base,
						dir: this.getShortPath(fileData.dir),
					}
				})
			},
			iconColor () {
				switch (this.type) {
				case 'direct' : return 'purple'
				case 'keywords' : return 'indigo'
				case 'fastLinks' : return 'green'
				}
			},
		},
		methods: {
			emit (filePath) {
				this.$emit('input', filePath)
			},
			getShortPath (dir) {
				if (dir.length <= this.maxPathLength) return dir
				const cutSymbols = dir.length - this.maxPathLength + 1
				const startPosition = Math.floor((dir.length - cutSymbols) / 2)
				return dir.split('').splice(startPosition, cutSymbols, '…').join('')
			},

			remove (filePath) {
				this.$store.commit('RecentFiles/REMOVE', {type: this.type, filePath})
			},
		},
	}
</script>
