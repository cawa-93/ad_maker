<template>
	<div class="wrap">
		<md-layout md-gutter md-flex class="root dropdown-zone-container" v-if="!isDirectLoaded">
			<md-layout md-flex>
				<md-whiteframe>
					<dropdown-zone @drop="set" >
						<p class="md-title">Кликните или бросьте сюда файл<br>экспортированный из Коммандера</p>
					</dropdown-zone>
				</md-whiteframe>
			</md-layout>
			<md-layout v-if="pathHistory.length" class="right-sidebar" md-flex>
				<md-whiteframe>
					<md-list>
						<md-subheader>Последние файлы</md-subheader>
						<md-list-item v-for="path_obj in pathHistory" @click.native="set(path_obj.path)">{{path_obj.path | basename}}</md-list-item>
					</md-list>
				</md-whiteframe>
			</md-layout>
		</md-layout>
		<div v-else>
			<md-toolbar class="md-primary">
				<md-layout>
					<md-layout md-flex="66">
						<md-input-container>
							<label>Поиск</label>
							<md-input v-model.lazy.trim="query.search"></md-input>
						</md-input-container>
					</md-layout>
					<md-layout md-flex="33">

						<md-input-container>
							<label for="type">Показать</label>
							<md-select name="type" id="type" v-model="query.type">
								<md-option value="ads">Объявления</md-option>
								<md-option value="keywords" :disabled="!isKeywordsOpen">Ключевые слова</md-option>
								<md-option value="bs">Быстрые ссылки</md-option>
							</md-select>
						</md-input-container>
					</md-layout>
				</md-layout>
			</md-toolbar>

			<md-table-card>
				<md-table md-sort="group" md-sort-type="asc" @sort="onSort">
					<md-table-header>
						<md-table-row>
							<md-table-head md-sort-by="campain">Кампания</md-table-head>
							<md-table-head md-sort-by="group">Група</md-table-head>

							<md-table-head v-if="query.type === 'ads'" md-sort-by="ad_title">Заголовок</md-table-head>
							<md-table-head v-if="query.type === 'ads'" md-sort-by="ad_desc">Описание</md-table-head>
							<md-table-head v-if="query.type === 'ads'" md-sort-by="ad_ancor">Текст</md-table-head>
							<md-table-head v-if="query.type === 'ads'" md-sort-by="ad_url">Ссылка</md-table-head>

							<md-table-head v-if="query.type === 'keywords'" md-sort-by="keyword">Фраза</md-table-head>

							<md-table-head v-if="query.type === 'bs'" md-sort-by="fastLink_title">Заголовок</md-table-head>
							<md-table-head v-if="query.type === 'bs'" md-sort-by="fastLink_url">Ссылка</md-table-head>
							<md-table-head v-if="query.type === 'bs'" md-sort-by="fastLink_desc">Описание</md-table-head>
							
						</md-table-row>
					</md-table-header>

					<md-table-body>
						<md-table-row v-for="(row, rowIndex) in sortableData" :key="rowIndex" :md-item="row">
							<md-table-cell><a href="" @click.prevent="query.search = row.campain">{{ cutSuffix(row.campain) }}</a></md-table-cell>
							<md-table-cell><a href="" @click.prevent="query.search = row.group">{{ row.group | underlineToSpace }}</a></md-table-cell>

							<md-table-cell v-if="query.type === 'ads'">{{ row.ad_title }}</md-table-cell>
							<md-table-cell v-if="query.type === 'ads'" class="break-word">{{ row.ad_desc }}</md-table-cell>
							<md-table-cell v-if="query.type === 'ads'">{{ row.ad_ancor }}</md-table-cell>
							<md-table-cell v-if="query.type === 'ads'" class="break-word">{{ row.ad_url }}</md-table-cell>

							<md-table-cell v-if="query.type === 'keywords'">{{ row.keyword }}</md-table-cell>

							<md-table-cell v-if="query.type === 'bs'">{{ row.fastLink_title }}</md-table-cell>
							<md-table-cell v-if="query.type === 'bs'" class="break-word">{{ row.fastLink_url }}</md-table-cell>
							<md-table-cell v-if="query.type === 'bs'" class="break-word">{{ row.fastLink_desc }}</md-table-cell>
							
						</md-table-row>
					</md-table-body>
				</md-table>
			</md-table-card>
		</div>
	</div>
</template>

<script>
	import dropdownZone from './dropdownZone.vue'
	import { mapGetters, mapState } from 'vuex'
	import path from 'path'

	export default {
		name:  'View',
		props: ['defaultQueryType'],
		data () {
			return {
				query: {
					search: '',
					type:   this.defaultQueryType || 'ads',
					sortBy: 'campain',
					sort:   'desc'
				}
			}
		},
		components: {
			dropdownZone
		},
		computed: {
			...mapGetters(['isDirectLoaded', 'campainNamesSuffix']),
			...mapState({
				pathHistory: state => state.direct.directPathHistory
			}),
			isKeywordsOpen () {
				return (this.$store.getters.directCounters.keywords || 0) > 0
			},
			// isFastLinksOpen() {
			// 	return (this.$store.getters.fastLinksCount || 0) > 0
			// },
			sortableData () {
				return this.filteredData
			.sort((itemA, itemB) => {
				if (itemA[this.query.sortBy] > itemB[this.query.sortBy]) {
					return this.query.sort === 'asc' ? 1 : -1
				} else if (itemA[this.query.sortBy] < itemB[this.query.sortBy]) {
					return this.query.sort === 'asc' ? -1 : 1
				}
				return 0
			})
			},
			filteredData () {
				return this.$store.getters.directViewTableData
			.filter((item) => {
				const search = this.query.search
				if (this.query.type === 'ads' && (!item.ad_title || !item.ad_url)) return false
				if (this.query.type === 'keywords' && !item.keyword) return false
				if (this.query.type === 'bs' && !item.fastLink_url) return false

				if (search) {
					if (item.campain.indexOf(search) !== -1 || item.group.indexOf(search) !== -1) return true

					if (this.query.type === 'ads' && (
								item.ad_title.indexOf(search) !== -1 ||
								item.ad_url.indexOf(search) !== -1 ||
								item.ad_desc.indexOf(search) !== -1 ||
								item.ad_ancor.indexOf(search) !== -1
								)) return true

					if (this.query.type === 'keywords' && (
								item.keyword.indexOf(search) !== -1
								)) return true

					if (this.query.type === 'bs' && (
								item.fastLink_title.indexOf(search) !== -1 ||
								item.fastLink_url.indexOf(search) !== -1 ||
								item.fastLink_desc.indexOf(search) !== -1
								)) return true

					return false
				}
				return true
			})
			}
		},
		methods: {
			set (path) {
				this.$store.dispatch('INIT_DIRECT', {path})
			},
			onSort (sort) {
				this.query.sortBy = sort.name
				this.query.sort = sort.type
			},
			cutSuffix (campainName) {
				campainName = campainName.split('_')
				if (this.campainNamesSuffix && this.campainNamesSuffix.length) {
					campainName.splice(0 - this.campainNamesSuffix.length)
				}
				return campainName.join(' ')
			}
		},
		filters: {
			basename (fullPath) {
				return path.basename(fullPath)
			},
			underlineToSpace (str) {
				return str.replace(/_/g, ' ')
			}
		}
	}
</script>

<style scoped>
	.dropdown-zone-container {
		height: calc(100vh - 64px);
	}
	.loadDirectMessage {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		cursor: pointer
	}

	.dropdown-zone p {
		text-align: center;
	}
	.md-table {
		max-height: calc(100vh - 140px);
	}
	td {
		word-break: break-word;
	}
	.md-table .md-table-cell .md-table-cell-container {
		padding: 6px;
	}
	.md-whiteframe {
		width: 100%;
	}
</style>
