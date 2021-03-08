<template>
  <div v-if="isAuthenticated">
    <CDropdown
      inNav
      class="c-header-nav-items"
      placement="bottom-end"
      add-menu-classes="pt-0"
    >
      <template #toggler>
        <CHeaderNavLink>
          <div class="c-avatar">
            <img src="/img/avatars/user.png" class="c-avatar-img" />
          </div>
        </CHeaderNavLink>
      </template>
      <CDropdownHeader tag="div" class="text-center" color="light">
        <strong>Settings</strong>
      </CDropdownHeader>
      <CDropdownItem> <user-icon />Profile </CDropdownItem>
      <CDropdownItem> <settings-icon />Settings </CDropdownItem>
      <CDropdownDivider />
      <CDropdownItem @click="logout"> <logout-icon />Logout </CDropdownItem>
    </CDropdown>
  </div>
  <div v-else>
    <CHeaderNavLink>
      <router-link tag="a" to="/login">
        <span><user-icon /> Login</span>
      </router-link>
    </CHeaderNavLink>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("auth", ["isAuthenticated"])
  },
  methods: {
    logout() {
      this.$store.dispatch("auth/logout");
    }
  }
};
</script>

<style scoped>
.c-icon {
  margin-right: 0.3rem;
}
a {
  color: #4f5d73;
}
</style>
