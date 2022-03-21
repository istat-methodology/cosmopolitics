<template>
  <CModal
    title="Change graph constraints?"
    :show="showModal"
    :closeOnBackdrop="false"
  >
    <CDataTable :items="items" hover sorter />
    <template #footer>
      <CButton
        color="outline-primary"
        square
        size="sm"
        @click="applyConstraints"
        >Yes</CButton
      >
      <CButton color="outline-primary" square size="sm" @click="closeModal"
        >No</CButton
      >
    </template>
  </CModal>
</template>
<script>
export default {
  name: "GraphScenario",
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default: () => null
    }
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    applyConstraints() {
      this.$emit("applyConstraints", {});
    }
  }
};
</script>
