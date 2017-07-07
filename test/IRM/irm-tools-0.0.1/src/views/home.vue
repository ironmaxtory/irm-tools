<template lang="html">
  <div class="container">
    <irm-header></irm-header>
    <irm-sidebar></irm-sidebar>
    <irm-section>
      <router-view></router-view>
    </irm-section>
  </div>
</template>

<script>
import IrmHeader from 'COMPONENTS/header.vue';
import IrmSidebar from 'COMPONENTS/sidebar.vue';
import IrmSection from 'COMPONENTS/section.vue';

export default {
  components: {
    IrmHeader, IrmSidebar, IrmSection,
  },
  data () {
    return {};
  },
}
</script>

<style lang="less">


</style>
