<template>
  <div class="dm5-detail-panel" v-if="visible"><!-- background is already shown for the sake of feedback -->
    <el-tabs v-if="object" :value="tab" @tab-click="tabClick"><!-- tabs are shown once object arrives -->
      <el-tab-pane :label="object.typeName" name="info">
        <dm5-info-tab :object="object" :writable="writable" :mode="mode" :object-renderers="objectRenderers"
          @edit="edit" @submit="submit">
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
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  created () {
    // console.log('dm5-detail-panel created', this.visible)
  },

  destroyed () {
    // console.log('dm5-detail-panel destroyed')
  },

  props: {
    visible: {                      // Trueish if the detail panel is visible. Optional. Default is true.
      type: Boolean,
      default: true
    },
    object: dm5.DeepaMehtaObject,   // The topic/assoc to display. Undefined if data not yet arrived.
    tab: {                          // The selected tab: 'info', 'related', ... Optional. Default is 'info'.
      type: String,
      default: 'info'
    }
  },

  mixins: [
    require('./mixins/writable').default,
    require('./mixins/mode-default').default,
    require('./mixins/object-renderers').default
  ],

  methods: {

    tabClick (tabPane) {
      this.$emit('tab-click', tabPane.name)
    },

    edit () {
      this.$emit('edit')
    },

    submit (object) {
      this.$emit('submit', object)
    }
  },

  components: {
    'dm5-info-tab':    require('./dm5-info-tab'),
    'dm5-related-tab': require('./dm5-related-tab')
  }
}
</script>

<style>
</style>
