<template>
  <el-select class="dmx-workspace-select" v-model="workspace_">
    <el-option v-for="workspace in workspaces" :label="workspace.value" :value="workspace"
        :disabled="!workspace.writable" :key="workspace.id">
      <span class="fa icon">{{workspace.icon}}</span><span>{{workspace.value}}</span>
    </el-option>
  </el-select>
</template>

<script>
import dmx from 'dmx-api'
import Vue from 'vue'

export default {

  created () {
    this.initWorkspaces()
  },

  props: {
    workspace: {type: Object, required: true}
  },

  data () {
    return {
      workspaces: [],               // all workspaces (array of dmx.Topic)
      workspace_: this.workspace    // selected workspace (dmx.Topic)
    }
  },

  methods: {
    initWorkspaces () {
      dmx.rpc.getTopicsByType('dmx.workspaces.workspace').then(workspaces => {
        this.workspaces = workspaces.sort((w1, w2) => w1.value.localeCompare(w2.value))
        // set writable flags
        workspaces.forEach(workspace => {
          workspace.isWritable().then(writable => {
            Vue.set(workspace, 'writable', writable)
          })
        })
      })
    }
  }
}
</script>

<style>
</style>
