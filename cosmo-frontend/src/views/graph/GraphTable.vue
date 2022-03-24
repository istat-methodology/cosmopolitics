<template>
  <CCard>
    <CCardBody>
      <CDataTable
        v-if="data"
        :items="data"
        :fields="fields"
        column-filter
        items-per-page-select
        :items-per-page="5"
        sorter
        hover
        pagination
      />
    </CCardBody>
  </CCard>
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
    }
  }
};
</script>
