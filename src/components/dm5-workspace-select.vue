<template>
  <el-select class="dm5-workspace-select" v-model="workspace_">
    <el-option v-for="workspace in workspaces" :label="workspace.value" :value="workspace" :key="workspace.id">
    </el-option>
  </el-select>
</template>

<script>
import dm5 from 'dm5'

export default {

  created () {
    dm5.restClient.getTopicsByType('dmx.workspaces.workspace').then(workspaces =>
      this.workspaces = workspaces
    )
  },

  props: {
    workspace: {type: Object, required: true}
  },

  data () {
    return {
      workspaces: [],
      workspace_: this.workspace
    }
  }
}
</script>

<style>
</style>
