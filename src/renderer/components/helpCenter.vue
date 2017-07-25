<template><div class="helpCenter">
	<v-data-table
		hide-actions
		:items="shortCuts"
		>
		<template slot="items" scope="props">
      <td class="text-xs-right"><code>{{ props.item.key }}</code></td>
      <td >{{ props.item.label }}</td>
    </template></v-data-table>
</div></template>

<script>
	export default {
		name: 'helpCenter',
		data() {
			return {
				headers:[''],
				shortCuts: [{
					key: 'Ctrl+O',
					label: 'Загрузить кампании'
				},{
					key: 'Ctrl+S',
					label: 'Сохранить кампании'
				},{
					key: 'F1',
					label: 'Открыть справку'
				},]
			}
		}
	}
</script>

<style>
	.helpCenter .table > thead {
		display: none !important
	}
</style>