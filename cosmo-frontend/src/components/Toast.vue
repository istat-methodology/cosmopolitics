<template>
  <div>
    <CToaster :autohide="3000" position="top-center">
      <template v-if="message">
        <CToast :key="message" :show="true" :class="type">
          {{ getMessage }}
        </CToast>
      </template>
    </CToaster>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("message", ["message", "type"]),
    getMessage() {
      return this.message.split("#").pop();
    }
  },
  created() {
    this.$store.dispatch("message/clear");
  }
};
</script>

<style scoped>
.toaster .toast {
  width: 60%;
}

.toast-info {
  background-image: none;
  background-color: #63c2de;
}

.toast-error {
  background-image: none;
  color: #813838;
  background-color: #fee2e1;
  border-color: #fdd6d6;
}

.toast-success {
  background-image: none;
  background-color: #dbf2e3;
  border-color: #cdedd8;
  color: #28623c;
}

.toast-warning {
  background-image: none;
  color: #856404;
  background-color: #fff3cd;
  border-color: #ffeeba;
}
</style>
