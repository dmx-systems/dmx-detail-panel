<template>
  <el-select class="dm5-workspace-select" v-model="workspaceId_">
    <el-option v-for="workspace in workspaces" :label="workspace.value" :value="workspace.id" :key="workspace.id">
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
    workspaceId: {type: Number, required: true}
  },

  data () {
    return {
      workspaces: [],
      workspaceId_: this.workspaceId
    }
  }
}
</script>

<style>
</style>
