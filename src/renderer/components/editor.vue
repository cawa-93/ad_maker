<template><div>

<v-layout row wrap>
	<v-flex xs8>
		<v-text-field
			name="search"
			label="Поиск"
			id="search"
			v-model="search"
			prepend-icon="search"
		></v-text-field>
	</v-flex>
	<v-flex xs4 class="display-flex">
		<v-select
			:items="types"
			v-model="type"
			label="Показать"
		></v-select>

		<v-menu offset-y left>
      <v-btn icon slot="activator">
      	<v-icon>menu</v-icon>
    	</v-btn>
      <slot name="menu"></slot>
    </v-menu>
	</v-flex>
</v-layout>
<v-card>
	<v-data-table
		:headers="tableHeaders"
		:items="filteredData"
		:search="search"
	>
		<template slot="items" scope="props">
			<td @click="search = props.item.campaign">{{ props.item.campaign }}</td>
			<td @click="search = props.item.group">{{ props.item.group }}</td>
			
			<template v-if="type === 'ads'">
				<td @click="search = props.item.ad_title">{{ props.item.ad_title }}</td>
				<td @click="search = props.item.ad_url">{{ props.item.ad_url }}</td>
				<td @click="search = props.item.ad_ancor">{{ props.item.ad_ancor }}</td>
				<td @click="search = props.item.ad_desc">{{ props.item.ad_desc }}</td>
			</template>

			<template v-else-if="type === 'ks'">
				<td @click="search = props.item.keyword">{{ props.item.keyword }}</td>
			</template>

			<template v-else-if="type === 'fs'">
				<td @click="search = props.item.fastLink_title">{{ props.item.fastLink_title }}</td>
				<td @click="search = props.item.fastLink_url">{{ props.item.fastLink_url }}</td>
				<td @click="search = props.item.fastLink_desc">{{ props.item.fastLink_desc }}</td>
			</template>
		</template>
	</v-data-table>
</v-card>

</div></template>

<script>
import { mapGetters } from 'vuex'

export default {
	name: 'editor',
	data () {
		return {
			search: '',
			types: [
				{text: 'Объявления', value: 'ads'},
				{text: 'Ключевые слова', value: 'ks'},
				{text: 'Быстрые ссылки', value: 'fs'},
			],
			type: 'ads',
		}
	},
	computed: {
		tableHeaders () {
			return [{
				text: 'Кампания',
				value: 'campaign',
			},
			{
				text: 'Група',
				value: 'group',
			}]
		},
		filteredData () {
			return this.tableData.filter(row => {
				switch (this.type) {
				case 'ads' : return !!row.ad_url
				case 'ks' : return !!row.keyword
				case 'fs' : return !!row.fastLink_url
				default : return false
				}
			})
		},

		tableData () {
			const rows = []
			this.directMap.forEach(campaign => {
				campaign.groups.forEach(group => {
					group.ads.forEach(ad => {
						rows.push({
							campaign: campaign.name,
							group: group.name,
							ad_title: ad.title,
							ad_desc: ad.desc,
							ad_ancor: ad.ancor,
							ad_url: ad.url,
						})
					})
					group.keywords.forEach(keyword => {
						rows.push({
							campaign: campaign.name,
							group: group.name,
							keyword,
						})
					})
					group.fastLinks.forEach(link => {
						rows.push({
							campaign: campaign.name,
							group: group.name,
							fastLink_title: link.title,
							fastLink_url: link.url,
							fastLink_desc: link.desc,
						})
					})
				})
			})
			return rows
		},
		...mapGetters({
			directMap: 'Direct/directMap',
		}),
	},
}
</script>

<style scoped>
.display-flex {
	display: flex;
}
.menu {
	padding: 18px 0
}
	td {
		text-align: right;
		/*text-decoration: underline;*/
		cursor: pointer;
	}
</style>
