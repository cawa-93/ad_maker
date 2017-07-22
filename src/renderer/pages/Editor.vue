<template><div>

<v-layout row wrap>
	<v-flex sm9 xs12>
		<v-text-field
			name="search"
			label="Поиск"
			id="search"
			v-model="search"
			prepend-icon="search"
		></v-text-field>
	</v-flex>
	<v-flex sm3 xs12>
		<v-select
			:items="types"
			v-model="type"
			label="Показать"
			bottom
		></v-select>
	</v-flex>
</v-layout>
<v-card class="mb-5">
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

<v-speed-dial
	fixed
	bottom
	right
	hover
	v-model="speedDeal"
>
	<v-btn
		v-tooltip:left="{ html: 'Добавить' }"
		slot="activator"
		class="blue darken-2"
		fab
		hover
		v-model="speedDeal"
	>
		<v-icon>add</v-icon>
		<v-icon>close</v-icon>
	</v-btn>
	<v-btn
		v-tooltip:left="{ html: 'Кампании' }"
		fab
		small
		class="purple"
	>
		<v-icon>attach_file</v-icon>
	</v-btn>
	<v-btn
		v-tooltip:left="{ html: 'Ключевые слова' }"
		fab
		small
		class="green"
	>
		<v-icon>attach_file</v-icon>
	</v-btn>
	<v-btn
		v-tooltip:left="{ html: 'Быстрые ссылки' }"
		fab
		small
		class="indigo"
	>
		<v-icon>attach_file</v-icon>
	</v-btn>			
	<v-btn
		v-tooltip:left="{ html: 'Пометка ссылок' }"
		fab
		small
		class="red"
	>
		<v-icon>local_offer</v-icon>
	</v-btn>
</v-speed-dial>

</div></template>

<script>
	export default {
		name: 'Page_Editor',
		beforeRouteEnter (to, from, next) {
			next(vm => {
				if (!vm.$store.getters['Direct/isLoaded']) {
					next('/')
				}
			})
		},
		data () {
			return {
				speedDeal: false,
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
				this.$store.getters['Direct/directMap'].forEach(campaign => {
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
		},
	}
</script>

<style scoped>
	td {
		text-align: right;
		/*text-decoration: underline;*/
		cursor: pointer;
	}
</style>
