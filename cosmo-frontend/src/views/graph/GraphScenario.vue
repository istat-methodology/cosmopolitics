<template>
  <CModal
    title="Change graph constraints?"
    :show="showModal"
    :closeOnBackdrop="false"
    @update:show="closeModal"
  >
    <CDataTable :items="items" hover sorter />
    <div class="row">
      <div class="col-5">
        <ul>
          <li v-for="transport in transports" :key="transport.id">
            {{ transport.descr }}
          </li>
        </ul>
      </div>
      <div class="col-2">
        <!-- Nothing -->
      </div>
      <div class="col-5">
        <!-- Scenario-->
      </div>
    </div>
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
  data: () => ({
    scenarioTransports: []
  }),
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default: () => null
    },
    transports: {
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
