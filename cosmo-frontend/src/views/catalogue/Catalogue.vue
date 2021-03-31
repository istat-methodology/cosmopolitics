<template>
  <div class="row">
    <div class="col-sm-6 col-md-4">
      <div class="card">
        <header class="card-header">
          <span class="card-title"
            >Economic and International Trade Indicators</span
          >
        </header>
        <div class="card-body">
          <p>
            This section provides a map displaying for each country the total
            population and some macro-economic indicators and trade and
            exchanged goods for import and export in 2019 and in 2019 and in
            2019 and 2020.
          </p>
          <p class="mt-2">
            Further the component provides a
            <strong>time-lapse</strong> functionality to represent the
            international trade monthly variations for the last twelve months.
          </p>
          <p class="section-link">
            <router-link tag="a" :to="{ name: 'Map' }"
              ><span
                >Go to trade indicators section <chevron-right-icon
              /></span>
            </router-link>
          </p>
        </div>
      </div>
    </div>
    <div class="col-sm-6 col-md-4">
      <div class="card">
        <header class="card-header">
          <span class="card-title">International Trade Relations</span>
        </header>
        <div class="card-body">
          <p>
            This section shows the graph plot of international trade based on
            <strong>COMEXT transport data</strong>, along with relevant global
            and local measures detailing the structure of countries relations.
            The panel is interactive, providing the possibility to apply several
            filters and to see how the graph structure and measures change
            accordingly.
          </p>
          <p class="mt-2">
            Furthermore an animation is provided showing the
            <strong>evolution of the international trade graph over time</strong
            >, spanning the entire time window of trading data.
          </p>
          <p class="section-link">
            <router-link tag="a" :to="{ name: 'Graph' }"
              ><span>Go to graph section <chevron-right-icon /></span>
            </router-link>
          </p>
        </div>
      </div>
    </div>
    <div class="col-sm-6 col-md-4">
      <div class="card">
        <header class="card-header">
          <span class="card-title">Graph on COMEXT and ITGS integration</span>
        </header>
        <div class="card-body">
          <p>
            This section shows the graph plot of international trade obtained
            <strong>integrating COMEXT and ITGS data on COVID products</strong>,
            along with relevant global and local measures detailing the
            structure of countries relations.
          </p>
          <p class="mt-2">
            Furthermore an animation is provided showing the
            <strong>evolution of the international trade graph over time</strong
            >, spanning the entire time window of trading data.
          </p>
          <p class="section-link">
            <router-link tag="a" :to="{ name: 'GraphPlus' }"
              ><span>Go to graph on COMEXT and ITGS<chevron-right-icon /></span>
            </router-link>
          </p>
        </div>
      </div>
    </div>
    <div class="col-sm-6 col-md-4">
      <div class="card">
        <header class="card-header">
          <span class="card-title"> Mobility Policy Analysis</span>
        </header>
        <div class="card-body">
          This function given the mobility data available from google provide
          two different results:
          <p class="mt-2">
            A descriptive analysis of the main mobility index for the selected
            country: Retail, Grocery and Pharmacy, Parks, Transit Station,
            Workplaces, Residential
          </p>
          <p class="mt-1">
            Provide a daily and a monthly mobility policy indicator whose is 0 –
            1 representing the level of restriction imposed by the selected
            country government.
          </p>
          <p class="section-link">
            <router-link tag="a" :to="{ name: 'Mobility' }"
              ><span>Go to mobility indicator <chevron-right-icon /></span>
            </router-link>
          </p>
        </div>
      </div>
    </div>
    <div class="col-sm-6 col-md-4">
      <div class="card">
        <header class="card-header">
          <span class="card-title"
            >Policy Evaluation (with nowcasting or forecasting upon
            request)</span
          >
        </header>
        <div class="card-body">
          In this section we analyse covid pandemic effect by computing the
          Covid-19 monthly impact on import and export time series in value,
          using the interrupted time series model with a counterfactual
          approach. The selected model is use to get nowcasting and forecasting
          of import and export series as well.
          <br />
          <p class="section-link">
            <router-link tag="a" :to="{ name: 'Bec' }"
              ><span>Go to policy indicator <chevron-right-icon /></span>
            </router-link>
          </p>
        </div>
      </div>
    </div>
    <div class="col-sm-6 col-md-4">
      <div class="card">
        <header class="card-header">
          <span class="card-title"
            >Changes in basket composition of traded products (CPA -
            classification of products by activity) by Member State</span
          >
        </header>
        <div class="card-body">
          This section provides, for each Member State, the 2020 monthly time
          series of year-over-year changes in the basket composition of exported
          and imported goods, classified according to CPA-2 digits.
          <br />
          <p class="section-link">
            <router-link tag="a" :to="{ name: 'Trade' }"
              ><span>Go to trade section <chevron-right-icon /></span>
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Context } from "@/common";
export default {
  name: "Metadata",
  created() {
    this.$store.dispatch("coreui/setContext", Context.Home);
  }
};
</script>

<style scoped>
.material-design-icon > .material-design-icon__svg {
  bottom: -0.17rem;
}
.card-title {
  font-weight: 600;
}
</style>
