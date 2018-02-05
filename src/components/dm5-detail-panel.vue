<template>
  <div class="dm5-detail-panel">
    <el-tabs v-if="object">
      <el-tab-pane :label="object.typeName">
        <router-view></router-view>
      </el-tab-pane>
      <el-tab-pane label="Related">
        <router-view></router-view>
      </el-tab-pane>
      <el-tab-pane label="Meta">
      </el-tab-pane>
      <el-tab-pane label="View">
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
    }
  },

  methods: {
    // TODO: component reusability => emit events instead of dispatching actions
    close () {
      this.$store.dispatch('closeDetailPanel')
    }
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
