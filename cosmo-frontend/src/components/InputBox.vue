<template>
  <div class="col-4">
    <form>
      <div id="InputBox">
        <label for="InputBox">{{ label }}</label>
        <input
          type="number"
          placeholder="0"
          step="0.01"
          min="0"
          max="1"
          class="form-control"
          id="InputBox"
          v-bind:value="value"
          v-on:input="$emit('input', $event.target.value)" />
        {{ value }}
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: ["value", "label"]
}
</script>
