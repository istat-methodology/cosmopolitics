<template>
  <label class="radio">
    <input
      type="radio"
      :dat="dat"
      :value="value"
      :name="name"
      v-model="radioButtonValue" />
    <span>{{ label }}</span>
  </label>
</template>
<script>
export default {
  name: "RadioButton",
  props: ["name", "label", "value", "dat"],
  computed: {
    radioButtonValue: {
      get: function () {
        return this.value
      },
      set: function () {
        // Communicate the change to parent component so that selectedValue can be updated
        this.$emit("change", this.dat)
      }
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
>
