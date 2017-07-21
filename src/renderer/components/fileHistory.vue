<template>
	<v-list two-line subheader>
		<v-subheader inset>{{title}}</v-subheader>
		<v-list-tile @click="emit(file)" v-for="file in files" :key="file.dir+file.base">
			<v-list-tile-avatar>
				<v-icon :class="">insert_drive_file</v-icon>
			</v-list-tile-avatar>
			<v-list-tile-content>
				<v-list-tile-title>{{ file.base }}</v-list-tile-title>
				<v-list-tile-sub-title>{{ file.dir | shortPath(maxPathLength) }}</v-list-tile-sub-title>
			</v-list-tile-content>
			<v-list-tile-action>
				<v-btn icon ripple>
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
				return this.$store.getters[`RecentFiles/${this.type}`].map(doc => path.parse(doc.filePath))
			},
		},
		methods: {
			emit (file) {
				this.$emit('input', file.dir + '/' + file.base)
			},
		},
		filters: {
			shortPath (str, maxPathLength) {
				if (str.length <= maxPathLength) return str
				const cutSymbols = str.length - maxPathLength + 1
				const startPosition = Math.floor((str.length - cutSymbols) / 2)
				return str.split('').splice(startPosition, cutSymbols, '…').join('')
			},
		},
	}
</script>
