<template>
  <div class="legend">
    <div class="px-1 text-center ">{{ legend.title }}</div>
    <div class="px-1 text-center">{{ legend.subTitle }}</div>
    <ul class="px-2">
      <li v-for="(row, r) in legend.series" v-bind:key="r">
        <div class="row px-0">
          <span
            class="px-1"
            v-bind:style="{
              height: '15px',
              width: '15px',
              backgroundColor: row.color
            }"
          >
          </span>

          <div class="px-1 text-right">
            {{ row.fromNumber }}
          </div>
          <div v-show="row.toNumber" class="px-0">
            <b>:</b>
          </div>
          <div class="px-1 text-left">
            {{ row.toNumber }}
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    legend: {
      type: Object,
      default: () => null
    }
  }
};
</script>
