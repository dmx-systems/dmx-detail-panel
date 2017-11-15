<template>
  <div v-if="infoMode">{{object.value}}</div>
  <el-select v-else v-model="selection" :clearable="clearable" placeholder="Default" size="small">
    <el-option v-for="topic in topics" :label="topic.value" :value="topic.uri" :key="topic.id"></el-option>
  </el-select>
</template>

<script>
import dm5 from 'dm5'

export default {

  props: {
    assocDef: {
      type: dm5.AssocDef,
      required: true
    }
  },

  data () {
    return {
      topics: undefined,
      selection: this.object.uri
    }
  },

  computed: {
    clearable () {
      return this.assocDef.getViewConfig('dm4.webclient.clearable')
    }
  },

  // When switching from info to form mode Vue reuses this component in a non-uniform fashion (I don't know why):
  //   1) Workspace: yes    ("Sharing Mode")
  //   2) Assoc Def: yes    ("Custom Association Type")
  //   3) View Config: no   ("Widget")
  // "yes": component is created in info mode, mode watcher triggers when switched to form mode.
  // "no": component is re-created in form mode, mode watcher does *not* trigger.
  // The solution is to call updateValue() in both places, created() and the mode watcher.
  created () {
    console.log('created', this._uid, this.mode, this.selection, typeof this.selection, this.selection.length)
    this.updateValue()
  },

  watch: {
    mode () {
      console.log('mode', this._uid, this.mode, this.selection, typeof this.selection, this.selection.length)
      this.updateValue()
    },
    selection () {
      console.log('selection', this._uid, this.mode, this.selection, typeof this.selection, this.selection.length)
      this._updateValue()
    }
  },

  methods: {

    updateValue () {
      if (this.formMode) {
        !this.topics && dm5.restClient.getTopicsByType(this.object.typeUri).then(topics => {
          this.topics = topics
        })
        this._updateValue()
      }
    },

    _updateValue () {
      this.object.value = `ref_uri:${this.selection}`
    }
  },

  mixins: [
    require('./mixins/object').default,
    require('./mixins/mode').default,
    require('./mixins/infoMode').default
  ]
}
</script>
