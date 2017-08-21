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
			:value="type"
			@input="emit('update:type', arguments[0])"
			label="Показать"
		></v-select>

		<v-menu offset-y left :max-height="windowHeight * 0.9">
			<v-btn icon slot="activator" :class="{'shake':animateMenu}" @click="removeAnimation">
				<v-icon>menu</v-icon>
			</v-btn>
			<slot name="menu"></slot>
		</v-menu>
	</v-flex>
</v-layout>

<v-data-table
	:headers="tableHeaders"
	:items="filteredData"
	:search="search"
	no-data-text="Нет данных"
	no-results-text="Не найдено соответствующих записей"
	rows-per-page-text="Строк на страницу"
>
	<template slot="items" scope="props">
		<td @click="search = props.item.campaign"><prety-name :text="props.item.campaign" /></td>
		<td @click="search = props.item.group"><prety-name :text="props.item.group" /></td>
		
		<template v-if="type === 'ads'">
			<td @click="search = props.item.ad_title">{{ props.item.ad_title }}</td>
			<td class="text-xs-left" @click="search = props.item.ad_url" v-html="captionDomain(props.item.ad_url)"></td>
			<td @click="search = props.item.ad_ancor">{{ props.item.ad_ancor }}</td>
			<td><short-text>{{ props.item.ad_desc }}</short-text></td>
		</template>

		<template v-else-if="type === 'ks'">
			<td>
				<span v-for="(keyword, index) in props.item.keywords" :key="index" @click="search = keyword">{{ keyword }}; </span>
			</td>
		</template>

		<template v-else-if="type === 'fs'">
			<td @click="search = props.item.fastLink_title">{{ props.item.fastLink_title }}</td>
			<td class="text-xs-left" @click="search = props.item.fastLink_url" v-html="captionDomain(props.item.fastLink_url)"></td>
			<td><short-text>{{ props.item.fastLink_desc }}</short-text></td>
		</template>
	</template>
</v-data-table>

</div></template>

<script>
import { mapGetters } from 'vuex'
import shortText from '@/components/shortText'
import pretyName from '@/components/pretyName'

export default {
	name: 'editor',
	components: { shortText, pretyName },
	props: {
		type: {
			type: String,
			default: 'ads',
		},
	},
	data () {
		return {
			windowHeight: 0,
			animateMenu: !localStorage.oldUser,
			search: '',
			types: [
				{text: 'Объявления', value: 'ads'},
				{text: 'Ключевые слова', value: 'ks'},
				{text: 'Быстрые ссылки', value: 'fs'},
			],
		}
	},
	computed: {
		tableHeaders () {
			const headers = [{
				text: 'Кампания',
				value: 'campaign',
			},
			{
				text: 'Група',
				value: 'group',
			}]
			switch (this.type) {
			case 'ads' : return headers.concat([{
				text: 'Заголовок',
				value: 'ad_title',
			}, {
				text: 'Ссылка',
				value: 'ad_url',
			}, {
				text: 'Отображаемая ссылка',
				value: 'ad_ancor',
			}, {
				text: 'Текст',
				value: 'ad_desc',
			}])
			case 'ks' : return headers.concat([{
				text: 'Фраза',
				value: 'keyword',
			}])
			case 'fs' : return headers.concat([{
				text: 'Заголовок',
				value: 'fastLink_title',
			}, {
				text: 'Ссылка',
				value: 'fastLink_url',
			}, {
				text: 'Текст',
				value: 'fastLink_desc',
			}])
			}
		},
		filteredData () {
			return this.tableData.filter(row => {
				switch (this.type) {
				case 'ads' : return !!row.ad_url
				case 'ks' : return !!row.keywords
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

					rows.push({
						campaign: campaign.name,
						group: group.name,
						keywords: group.keywords,
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
	methods: {
		emit (event, newType) {
			this.$emit(event, newType)
		},
		removeAnimation () {
			this.animateMenu = false
			localStorage.oldUser = 1
		},
		getWindowHeight (event) {
			this.windowHeight = document.documentElement.clientHeight
		},
		captionDomain (str) {
			return str.replace(new RegExp(`^([a-z]+://[^/]+)`), `<span class="caption grey--text">$1</span>`)
		},
	},
	mounted () {
		window.addEventListener('resize', this.getWindowHeight)

		// Init
		this.getWindowHeight()
	},
}
</script>

<style scoped>
.display-flex {
	display: flex;
}



td {
	cursor: pointer;
}

@keyframes shake {
  0%, 30% {
    transform: rotate(0)
  }
  5% {
    transform: rotate(20deg)
  }
  10% {
    transform: rotate(-16deg)
  }
  15% {
    transform: rotate(12deg)
  }
  20% {
    transform: rotate(-8deg)
  }
  25% {
    transform: rotate(4deg)
  }
}

.shake {
  animation-name: shake;
  animation-duration: 2s;
  animation-fill-mode: both;
  animation-iteration-count: infinite;
}

</style>

<style>
	td .caption {
		font-size: 9px !important;
	}
	th.text-xs-right {
	text-align: left !important;
}
</style>