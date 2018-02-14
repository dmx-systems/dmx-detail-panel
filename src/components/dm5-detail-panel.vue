<template>
  <div class="dm5-detail-panel"><!-- background is already shown for the sake of feedback -->
    <el-tabs v-if="object" :value="tab" @tab-click="tabClick"><!-- tabs are shown once object arrives -->
      <el-tab-pane :label="object.typeName" name="info">
        <dm5-info-tab :object="object" :writable="writable" :mode="mode" :object-renderers="objectRenderers">
        </dm5-info-tab>
      </el-tab-pane>
      <el-tab-pane label="Related" name="related">
        <dm5-related-tab :object="object" :tab="tab"></dm5-related-tab>
      </el-tab-pane>
      <el-tab-pane label="Meta" name="meta">
      </el-tab-pane>
      <el-tab-pane label="View" name="view">
      </el-tab-pane>
    </el-tabs>
    <el-button class="close-button fa fa-close" type="text" @click="close"></el-button>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  props: {
    object: dm5.DeepaMehtaObject    // The topic/assoc to display. Undefined if data not yet arrived.
  },

  mixins: [
    require('./mixins/writable').default,
    require('./mixins/tab').default,
    require('./mixins/mode-default').default,
    require('./mixins/object-renderers').default
  ],

  methods: {

    tabClick (tabPane) {
      this.$emit('tab-click', tabPane.name)
    },

    // TODO: component reusability => emit events instead of dispatching actions
    close () {
      this.$store.dispatch('stripDetailFromRoute')
    }
  },

  components: {
    'dm5-info-tab':    require('./dm5-info-tab'),
    'dm5-related-tab': require('./dm5-related-tab')
  }
}
</script>

<style>
.dm5-detail-panel .close-button {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0;
}
</style>
