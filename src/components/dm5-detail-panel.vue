<template>
  <div class="dm5-detail-panel">
    <el-tabs v-if="object" v-model="detail"><!-- TODO: sync display, then drop v-if? -->
      <el-tab-pane :label="object.typeName" name="edit">
        <dm5-info-tab :object="object" :writable="writable" :mode="mode"></dm5-info-tab>
      </el-tab-pane>
      <el-tab-pane label="Related" name="related">
        <dm5-related-tab></dm5-related-tab>
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

  inject: ['context'],

  mixins: [
    require('./mixins/object').default,
    require('./mixins/writable').default,
    require('./mixins/mode-prop').default
  ],

  computed: {
    detail: {
      get () {
        return this.context.detail
      },
      set (detail) {
        // console.log('set detail', detail)
        this.$store.dispatch('callRoute', {
          params: {detail}
        })
      }
    }
  },

  methods: {
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
.dm5-detail-panel .field {
  margin-top: 1.2em;
}

.dm5-detail-panel .close-button {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0;
}
</style>
