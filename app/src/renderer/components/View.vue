<template>
	<div class="wrap">
		<drop-file @select="set" v-if="!$store.getters.isDirectLoaded">
			<div class="drop-wrap">
				<md-icon class="md-size-4x">attach_file</md-icon>
				<p>Кликните или бросьте сюда файл</p>
				<p>експортированный из Коммандера</p>
			</div>
		</drop-file>

		<md-table-card  v-else>
			<md-toolbar class="md-accent">
				<md-layout>

					<md-layout md-flex="66">
						<md-input-container md-inline>
							<label>Поиск</label>
							<md-input v-model="query.search"></md-input>
						</md-input-container>
					</md-layout>
					<md-layout md-flex="33">

						<md-input-container>
							<label for="type">Показывать</label>
							<md-select name="type" id="type" v-model="query.type">
								<md-option value="ads">Объявления</md-option>
								<md-option value="keywords">Ключевые слова</md-option>
								<md-option value="bs">Быстрые ссылки</md-option>
							</md-select>
						</md-input-container>
					</md-layout>
				</md-layout>
			</md-toolbar>

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
						<md-table-cell><a href="" @click.prevent="query.search = row.campain">{{ row.campain }}</a></md-table-cell>
						<md-table-cell><a href="" @click.prevent="query.search = row.group">{{ row.group }}</a></md-table-cell>

						<md-table-cell v-if="query.type === 'ads'">{{ row.ad_title }}</md-table-cell>
						<md-table-cell v-if="query.type === 'ads'">{{ row.ad_desc }}</md-table-cell>
						<md-table-cell v-if="query.type === 'ads'">{{ row.ad_ancor }}</md-table-cell>
						<md-table-cell v-if="query.type === 'ads'">{{ row.ad_url }}</md-table-cell>

						<md-table-cell v-if="query.type === 'keywords'">{{ row.keyword }}</md-table-cell>

						<md-table-cell v-if="query.type === 'bs'">{{ row.fastLink_title }}</md-table-cell>
						<md-table-cell v-if="query.type === 'bs'">{{ row.fastLink_url }}</md-table-cell>
						<md-table-cell v-if="query.type === 'bs'">{{ row.fastLink_desc }}</md-table-cell>
						
					</md-table-row>
				</md-table-body>
			</md-table>
		</md-table-card>
	</div>
</template>

<script>
	import dropFile from './dropFile.vue';

	export default {
		name: 'View',
		data() {
			return {
				query: {
					search: '',
					type: 'ads',
					sortBy: 'campain',
					sort: 'desc'
				}
			}
		},
		components: {
			dropFile
		},
		computed: {
			sortableData() {
				console.log('sortableData')
				
				return this.filteredData
				.sort((itemA, itemB) => {
					if (itemA[this.query.sortBy] > itemB[this.query.sortBy]) {
						return this.query.sort === 'asc' ? 1 : -1;
					} else if (itemA[this.query.sortBy] < itemB[this.query.sortBy]) {
						return this.query.sort === 'asc' ? -1 : 1;
					} else {
						return 0;
					}
				});
			},
			filteredData() {
				console.log('filteredData')
				return this.tableData

				.filter((item) => {
					const search = this.query.search.trim();
					if (this.query.type === 'ads' && (!item.ad_title || !item.ad_url)) return false;
					if (this.query.type === 'keywords' && !item.keyword) return false;
					if (this.query.type === 'bs' && !item.fastLink_url) return false;

					if (search) {
						if (item.campain.indexOf(search) !== -1 || item.group.indexOf(search) !== -1) return true;

						if (this.query.type === 'ads' && (
							item.ad_title.indexOf(search) !== -1 ||
							item.ad_url.indexOf(search) !== -1 ||
							item.ad_desc.indexOf(search) !== -1 ||
							item.ad_ancor.indexOf(search) !== -1
							)) return true;

						if (this.query.type === 'keywords' && (
							item.keyword.indexOf(search) !== -1
							)) return true;

						if (this.query.type === 'bs' && (
							item.fastLink_title.indexOf(search) !== -1 ||
							item.fastLink_url.indexOf(search) !== -1 ||
							item.fastLink_desc.indexOf(search) !== -1
							)) return true;

						return false;
					} else {
						return true;
					}
				})
			},
			tableData() {
				console.log('tableData')
				const _tableData = [];
				this.$store.getters.directMap.forEach(campain => {
					campain.groups.forEach(group => {
						group.ads.forEach(ad => {
							_tableData.push({
								campain: campain.name,
								group: group.name,
								ad_title: ad.title,
								ad_desc: ad.desc,
								ad_ancor: ad.ancor,
								ad_url: ad.url,
							})
						})
						group.keywords.forEach(keyword => {
							_tableData.push({
								campain: campain.name,
								group: group.name,
								keyword,
							})
						})
						group.fastLinks.forEach(link => {
							_tableData.push({
								campain: campain.name,
								group: group.name,
								fastLink_title: link.title,
								fastLink_url: link.url,
								fastLink_desc: link.desc,
							})
						})
					})
				})

				return _tableData
			}
		},
		methods: {
			set(path) {
				this.$store.dispatch('INIT_DIRECT', path)
			},
			onSort(sort) {
				this.query.sortBy = sort.name;
				this.query.sort = sort.type;
			}
		}
	}
</script>

<style scoped>
	.drop-wrap {
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		cursor: pointer
	}
	.md-icon, p {
		margin: 10px;
	}
	.md-table {
		max-height: calc(100vh - 140px);
	}
</style>
