<template>
  <CModal
    title="Change graph constraints?"
    :show="showModal"
    :closeOnBackdrop="false"
    @update:show="closeModal"
  >
    <CDataTable
      v-if="data"
      :items="data"
      :fields="fields"
      column-filter
      :items-per-page="5"
      sorter
      hover
      pagination
    />
    <!-- Drag'n drop -->
    <div class="row drag-container" v-if="displayTransport">
      <div
        class="col-5 drop-zone"
        @drop="onDropTransports($event)"
        @dragenter.prevent
        @dragover.prevent
      >
        <div
          v-for="transport in transports"
          :key="transport.id"
          class="drag-el"
          draggable="true"
          @dragstart="startDrag($event, transport)"
        >
          {{ transport.descr }}
        </div>
      </div>
      <div class="col-2">
        <!-- Nothing -->
      </div>
      <div
        class="col-5 drop-zone"
        @drop="onDropScenario($event)"
        @dragenter.prevent
        @dragover.prevent
      >
        <div
          v-for="scenarioTransport in scenarioTransports"
          :key="scenarioTransport.id"
          class="drag-el"
          draggable="true"
          @dragstart="startDrag($event, scenarioTransport)"
        >
          {{ scenarioTransport.descr }}
        </div>
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
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    displayTransport: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => null
    },
    fields: {
      type: Array,
      default: () => []
    },
    selectedTransports: {
      type: Array,
      default: () => null
    },
    selectedScenarioTransports: {
      type: Array,
      default: () => null
    }
  },
  computed: {
    transports: {
      get() {
        return this.selectedTransports;
      },
      set(value) {
        this.$emit("updateTransports", value);
      }
    },
    scenarioTransports: {
      get() {
        return this.selectedScenarioTransports;
      },
      set(value) {
        this.$emit("updateScenarioTransports", value);
      }
    }
  },
  methods: {
    startDrag(event, item) {
      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("itemID", item.id);
    },
    onDropTransports(event) {
      const itemId = event.dataTransfer.getData("ItemID");
      const transport = this.scenarioTransports.find(tr => tr.id == itemId);
      this.scenarioTransports = this.scenarioTransports.filter(
        tr => tr.id != itemId
      );
      this.transports.push(transport);
    },
    onDropScenario(event) {
      const itemId = event.dataTransfer.getData("ItemID");
      const transport = this.transports.find(tr => tr.id == itemId);
      this.transports = this.transports.filter(tr => tr.id != itemId);
      this.scenarioTransports.push(transport);
    },
    closeModal() {
      this.$emit("closeModal");
    },
    applyConstraints() {
      this.$emit("applyConstraints", {});
    }
  }
};
</script>
<style scoped>
.drag-container {
  margin-right: 0;
  margin-left: 0;
}
.drop-zone {
  background-color: #ebedef;
  padding: 10px;
  min-height: 50px;
}
.drag-el {
  background-color: #321fdb;
  color: white;
  padding: 5px;
  margin-bottom: 10px;
}
.drag-el:nth-last-of-type(1) {
  margin-bottom: 0;
}
</style>
