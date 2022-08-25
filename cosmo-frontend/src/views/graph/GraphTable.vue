<template>
  <CDataTable
    v-if="data"
    :items="data"
    :fields="fields"
    :sorterValue="sorterValue"
    table-filter
    column-filter
    items-per-page-select
    :items-per-page="10"
    sorter
    hover
    pagination />
</template>
<script>
export default {
  name: "GraphTable",
  props: {
    data: {
      type: Array,
      default: () => null
    },
    fields: {
      type: Array,
      default: () => []
    },
    sorterValue: {
      type: Object,
      default: () => ({ column: null, asc: true })
    }
  }
}
</script>
