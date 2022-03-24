<template>
  <CModal
    title="$t('graph.scenario.title')"
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
    <div class="row constraint-container">
      <div class="col-left constraint-left">
        {{ $t("graph.scenario.transports_selected") }}
      </div>
      <div class="col-center">
        <!-- nothing -->
      </div>
      <div class="col-right constraint-right">
        {{ $t("graph.scenario.transports_scenario") }}
      </div>
    </div>
    <div class="row drag-container" v-if="displayTransport">
      <div
        class="col-left drop-zone"
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
      <div class="col-center">
        <!-- Nothing -->
      </div>
      <div
        class="col-right drop-zone"
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
        color="primary"
        shape="square"
        size="sm"
        @click="applyConstraints"
        >{{ $t("common.apply") }}</CButton
      >
      <CButton color="primary" shape="square" size="sm" @click="closeModal">
        {{ $t("common.close") }}
      </CButton>
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
      event.dataTransfer.setData("itemId", item.id);
    },
    onDropTransports(event) {
      const itemId = event.dataTransfer.getData("ItemId");
      const transport = this.scenarioTransports.find(tr => tr.id == itemId);
      this.scenarioTransports = this.scenarioTransports.filter(
        tr => tr.id != itemId
      );
      this.transports.push(transport);
    },
    onDropScenario(event) {
      const itemId = event.dataTransfer.getData("ItemId");
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
.constraint-container {
  border-top: 1px solid #d8dbe0;
}
.constraint-left {
  padding: 0.6rem 1.6rem;
  font-weight: 500;
  margin-top: 0.6rem;
}
.constraint-right {
  padding: 0.6rem 0.2rem;
  font-weight: 500;
  margin-top: 0.6rem;
}
.col-left {
  flex: 0 0 47%;
  max-width: 47%;
}
.col-right {
  flex: 0 0 47%;
  max-width: 47%;
}
.col-center {
  flex: 0 0 6%;
  max-width: 6%;
}
.drag-container {
  margin-right: 0;
  margin-left: 0;
}
.drop-zone {
  border: 1px solid #ebedef;
  border-radius: 0.2rem;
  padding: 10px;
  min-height: 120px;
}
.drag-el {
  border-radius: 0.2rem;
  background-color: #ebedef;
  border: 1px solid #9da5b1;
  color: #9da5b1;
  padding: 2px 10px;
  margin-bottom: 4px;
  cursor: grab;
  cursor: -moz-grab;
  cursor: -webkit-grab;
}
.drag-el:active {
  cursor: grabbing;
  cursor: -moz-grabbing;
  cursor: -webkit-grabbing;
}
.drag-el:nth-last-of-type(1) {
  margin-bottom: 0;
}
</style>
