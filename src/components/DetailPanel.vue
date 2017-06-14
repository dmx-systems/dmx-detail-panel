<template>
  <div class="dm5-detail-panel">
    <el-tabs v-if="object">
      <el-tab-pane :label="object.typeName">
        <h3>{{object.value}}</h3>
        <field-renderer :object="object" :mode="mode"></field-renderer>
        <el-button class="button" size="small" @click="buttonAction">{{buttonLabel}}</el-button>
      </el-tab-pane>
      <el-tab-pane label="Related">
      </el-tab-pane>
      <el-tab-pane label="Meta">
      </el-tab-pane>
      <el-tab-pane label="Config">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {

  props: [
    'object',   // the Topic/Association to display; if undefined an empty detail panel is rendered
    'mode'      // 'info' or 'form'
  ],

  computed: {
    buttonLabel () {
      return this.infoMode ? 'Edit' : 'OK'
    }
  },

  methods: {
    buttonAction () {
      var action = this.infoMode ? 'edit' : 'submit'
      this.$store.dispatch(action)
    }
  },

  mixins: [
    require('./mixins/infoMode').default
  ],

  components: {
    'field-renderer': require('./FieldRenderer')
  }
}
</script>

<style>
.dm5-detail-panel .button {
  margin-top: 1em;
}

.dm5-detail-panel .el-tabs__item {
  font-size: var(--label-font-size);  /* was 14px */
  height: 40px;                       /* was 42px */
  padding: 0 14px;                    /* was 16px */
}
</style>
