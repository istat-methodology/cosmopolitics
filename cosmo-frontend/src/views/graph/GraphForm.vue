<template>
  <CCard>
    <CCardHeader>
      <span class="float-left">{{ $t("graph.form.title") }}</span>
      <span class="float-right">
        <button
          class="btn sm-2 btn-sm btn-square"
          role="button"
          @click="showInfo">
          i
        </button>
      </span>
    </CCardHeader>
    <CCardBody>
      <label class="card-label">{{ $t("graph.form.fields.period") }}</label>
      <div v-if="displayRadio">
        <label class="radio">
          <input
            type="radio"
            name="radioPeriod"
            value="Monthly"
            v-model="radioValue" />
          <span>{{ $t("graph.form.fields.monthly") }}</span>
        </label>
        <label class="radio">
          <input
            type="radio"
            name="radioPeriod"
            value="Trimester"
            v-model="radioValue" />
          <span>{{ $t("graph.form.fields.trimester") }}</span>
        </label>
      </div>
      <v-select
        v-if="graphPeriod"
        label="selectName"
        :options="graphPeriod"
        :placeholder="$t('graph.form.fields.period_placeholder')"
        v-model="selectedPeriod"
        :class="{
          'is-invalid': $v.selectedPeriod.$error
        }" />
      <label class="card-label mt-3">{{
        $t("graph.form.fields.percentage")
      }}</label>
      <CInput
        :placeholder="$t('graph.form.fields.percentage_placeholder')"
        v-model="percentage"
        :class="{
          'is-invalid': $v.percentage.$error
        }" />
      <label class="card-label mt-3" v-if="displayTransport">{{
        $t("graph.form.fields.transport")
      }}</label>
      <v-select
        v-if="displayTransport"
        label="descr"
        multiple
        :options="transports"
        :placeholder="$t('graph.form.fields.transport_placeholder')"
        v-model="transport"
        :class="{
          'is-invalid': $v.transport.$error
        }" />
      <label class="card-label mt-3" v-if="displayTransport">{{
        $t("graph.form.fields.product_nstr")
      }}</label>
      <label class="card-label mt-3" v-else>{{
        $t("graph.form.fields.product_cpa3")
      }}</label>
      <v-select
        label="descr"
        :options="products"
        :placeholder="$t('graph.form.fields.product_placeholder')"
        v-model="product"
        :class="{
          'is-invalid': $v.product.$error
        }" />
      <label class="card-label mt-3">{{ $t("graph.form.fields.flow") }}</label>
      <v-select
        label="descr"
        :options="flows"
        :placeholder="$t('graph.form.fields.flow_placeholder')"
        v-model="flow"
        :class="{
          'is-invalid': $v.flow.$error
        }" />
      <CButton
        color="primary"
        shape="square"
        size="sm"
        @click="handleSubmit"
        class="mt-3"
        >{{ $t("common.submit") }}</CButton
      >
    </CCardBody>
  </CCard>
</template>
<script>
import { getCleanTransports, getTransportIds, restoreAllProdId } from "@/common"
import { required, numeric } from "vuelidate/lib/validators"

export default {
  name: "GraphForm",
  data: () => ({
    //Form fields
    percentage: 90,
    transport: null,
    product: null,
    flow: null
  }),
  props: {
    displayRadio: {
      type: Boolean,
      default: true
    },
    displayTransport: {
      type: Boolean,
      default: true
    },
    currentRadio: {
      type: String,
      default: "Monthly"
    },
    graphPeriod: {
      type: Array,
      default: () => null
    },
    currentTime: {
      type: Object,
      default: () => ({ id: "202003", selectName: "Mar 2020" })
    },
    transports: {
      type: Array,
      default: () => null
    },
    products: {
      type: Array,
      default: () => null
    },
    flows: {
      type: Array,
      default: () => null
    }
  },
  computed: {
    selectedPeriod: {
      get() {
        return this.currentTime
      },
      set(value) {
        this.$emit("updatePeriod", value)
      }
    },
    radioValue: {
      get() {
        return this.currentRadio
      },
      set(value) {
        this.$emit("updateRadio", value)
      }
    }
  },
  validations: {
    selectedPeriod: {
      required
    },
    percentage: {
      required,
      numeric
    },
    transport: {
      validationRule(tr) {
        return this.displayTransport ? tr !== null : true
      }
    },
    product: {
      required
    },
    flow: {
      required
    }
  },
  methods: {
    showInfo() {
      this.$emit("showinfo")
    },
    handleSubmit() {
      this.$v.$touch() //validate form data
      if (
        !this.$v.percentage.$invalid &&
        !this.$v.transport.$invalid &&
        !this.$v.product.$invalid &&
        !this.$v.flow.$invalid
      ) {
        //Manage "all" transports in the select (if select is displayed)
        var cleanTransports = []
        var cleanTransportIds = []
        if (this.displayTransport) {
          cleanTransports = getCleanTransports(this.transport, this.transports)
          cleanTransportIds = getTransportIds(cleanTransports)
        }
        this.$emit("submit", {
          period: this.selectedPeriod.id,
          percentage: this.percentage,
          transportIds: cleanTransportIds,
          transports: cleanTransports,
          product: restoreAllProdId(this.product),
          flow: this.flow.id
        })
        this.$emit("updateFilter", this.getSearchFilter())
      }
    },
    getSearchFilter() {
      let data = []
      data.push({
        field: this.$t("graph.form.fields.period"),
        value: this.selectedPeriod.selectName
          ? this.selectedPeriod.selectName
          : ""
      })
      data.push({
        field: this.$t("graph.form.fields.percentage"),
        value: this.percentage ? this.percentage : ""
      })
      if (this.displayTransport) {
        data.push({
          field: this.$t("graph.form.fields.transport"),
          value: this.transport
            ? this.transport
                .map((transp) => {
                  return transp.descr
                })
                .join("#")
            : ""
        })
        data.push({
          field: this.$t("graph.form.fields.product_nstr"),
          value: this.product.descr
        })
      } else {
        data.push({
          field: this.$t("graph.form.fields.product_cpa3"),
          value: this.product.descr
        })
      }
      data.push({
        field: this.$t("graph.form.fields.flow"),
        value: this.flow.descr ? this.flow.descr : ""
      })
      return data
    }
  }
}
</script>

<style scoped>
label.radio {
  margin-right: 20px;
}
span {
  padding-left: 5px;
}
label.radio {
  margin-right: 20px;
}
.result {
  margin-top: 15px;
  border-top: 1px solid #ddd;
  padding-top: 15px;
}
</style>
