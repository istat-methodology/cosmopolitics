<template>
  <CFooter :fixed="false">
    <div>
      <span class="mr-1 text-dark"
        ><a href="https://www.istat.it" target="_blank"
          >Istituto nazionale di statistica</a
        >
        - {{ $t("common.footer.experimental") }}</span
      >
    </div>
    <div class="ml-auto">
      <span class="mr-1">{{ $t("common.footer.coreui") }}</span>
      <a href="https://coreui.io/vue" target="_blank">CoreUI for Vue</a>
    </div>
  </CFooter>
</template>
