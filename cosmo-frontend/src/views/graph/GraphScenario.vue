<template>
  <CModal
    :show="showModal"
    :closeOnBackdrop="false"
    @update:show="closeModal"
    size="lg">
    <template #header>
      <span class="float-left">{{ modalTitle }}</span>
      <span class="float-right">
        <exporter
          filename="cosmopolitics_scenario"
          :data="getData(csvTable, 'table')"
          :options="['csv']"
          source="table"
          :header="csvHeader">
        </exporter>
      </span>
    </template>
    <CDataTable
      v-if="nodesTable"
      :items="nodesTable"
      :fields="fields"
      column-filter
      :column-filter-value.sync="columnFilterValue"
      :items-per-page="5"
      :sorterValue="sorterValue"
      sorter
      hover
      pagination>
      <template #show_delete="{ item }">
        <td>
          <span class="icon-link" @click="deleteRow(item)">
            <delete-icon />
          </span>
        </td>
      </template>
    </CDataTable>
    <div class="scenario-analysis">
      {{ scenarioTitle }}
      <span class="float-right">
        <CSwitch
          color="primary"
          size="sm"
          labelOn="✓"
          labelOff="X"
          :checked="showScenario"
          @update:checked="toggleScenario" />
      </span>
    </div>
    <!-- Drag'n drop -->
    <div v-if="showScenario && displayTransport">
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
      <div class="row drag-container">
        <div
          class="col-left drop-zone"
          @drop="onDropTransports($event)"
          @dragenter.prevent
          @dragover.prevent>
          <div
            v-for="transport in transports"
            :key="transport.id"
            class="drag-el"
            draggable="true"
            @dragstart="startDrag($event, transport)">
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
          @dragover.prevent>
          <div
            v-for="scenarioTransport in scenarioTransports"
            :key="scenarioTransport.id"
            class="drag-el"
            draggable="true"
            @dragstart="startDrag($event, scenarioTransport)">
            {{ scenarioTransport.descr }}
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <CButton
        v-if="showScenario"
        color="danger"
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
import exporter from "@/components/Exporter"
export default {
  name: "GraphScenario",
  components: {
    exporter
  },
  data: () => ({
    showScenario: false,
    columnFilterValue: {}
  }),
  props: {
    showModal: {
      type: Boolean,
      default: false
    },
    displayTransport: {
      type: Boolean,
      default: false
    },
    selectedNodesTable: {
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
    },
    selectedNode: {
      type: Object,
      default: () => ({ id: -1, name: "" })
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
    nodesTable: {
      get() {
        return this.selectedNodesTable
      },
      set(value) {
        this.$emit("updateNodesTable", value)
      }
    },

    csvTable: {
      get() {
        return this.selectedNodesTable.map((field) => {
          return {
            source: field.source,
            destination: field.destination,
            percentage: field.percentage,
            flow: field.flow
          }
        })
      },
      set(value) {
        this.$emit("updateNodesTable", value)
      }
    },
    csvHeader: {
      get() {
        return this.fields.map((field) => field.label)
      },
      set(value) {
        this.$emit("fields", value)
      }
    },
    transports: {
      get() {
        return this.selectedTransports
      },
      set(value) {
        this.$emit("updateTransports", value)
      }
    },
    scenarioTransports: {
      get() {
        return this.selectedScenarioTransports
      },
      set(value) {
        this.$emit("updateScenarioTransports", value)
      }
    },
    modalTitle() {
      return this.selectedNode.id > 0
        ? this.$t("graph.scenario.main", { country: this.selectedNode.name })
        : this.$t("graph.scenario.mainEdge")
    },
    scenarioTitle() {
      return this.selectedNode.id > 0
        ? this.displayTransport
          ? this.$t("graph.scenario.title_extra_node")
          : this.$t("graph.scenario.title_world_node")
        : this.displayTransport
        ? this.$t("graph.scenario.title_extra_edge")
        : this.$t("graph.scenario.title_world_edge")
    }
  },
  methods: {
    toggleScenario() {
      this.showScenario = !this.showScenario
    },
    startDrag(event, item) {
      event.dataTransfer.dropEffect = "move"
      event.dataTransfer.effectAllowed = "move"
      event.dataTransfer.setData("itemId", item.id)
    },
    onDropTransports(event) {
      const itemId = event.dataTransfer.getData("ItemId")
      this.scenarioTransports = this.scenarioTransports.filter(
        (tr) => tr.id != itemId
      )
    },
    onDropScenario(event) {
      const itemId = event.dataTransfer.getData("ItemId")
      const transport = this.transports.find((tr) => tr.id == itemId)
      if (!this.scenarioTransports.find((tr) => tr.id == transport.id))
        this.scenarioTransports.push(transport)
    },
    deleteRow(row) {
      var updatedTable = this.nodesTable.filter((rw) => rw != row)
      console.log(updatedTable.length)
      this.$emit("updateNodesTable", updatedTable)
    },
    closeModal() {
      this.$emit("closeModal")
      this.columnFilterValue = {}
    },
    applyConstraints() {
      this.showScenario = false
      this.$emit("applyConstraints")
    },
    getData(data, id) {
      if (data != null) {
        return [data, id]
      }
      return null
    }
  }
}
</script>
<style scoped>
.scenario-analysis {
  font-weight: 500;
  font-size: 16px;
  padding: 1rem 0.4rem 0rem 0.4rem;
  color: #321fdb;
  border-top: 1px solid #d8dbe0;
}
.constraint-left {
  padding: 0.8rem 0rem 0.4rem 0.2rem;
  font-weight: 500;
  margin-top: 0.6rem;
}
.constraint-right {
  padding: 0.8rem 0rem 0.4rem 1.4rem;
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
  color: #4f5d73;
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
