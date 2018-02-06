<template>
  <div class="dm5-detail-panel">
    <el-tabs v-if="object" v-model="detail"><!-- TODO: sync display, then drop v-if? -->
      <el-tab-pane :label="object.typeName" name="edit">
        <dm5-tab-edit></dm5-tab-edit>
      </el-tab-pane>
      <el-tab-pane label="Related" name="related">
        <dm5-tab-related></dm5-tab-related>
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

  computed: {

    object () {
      return this.context.object
    },

    detail: {
      get () {
        return this.context.detail
      },
      set (detail) {
        console.log('set detail', detail)
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
    'dm5-tab-edit':    require('./dm5-tab-edit'),
    'dm5-tab-related': require('./dm5-tab-related')
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
