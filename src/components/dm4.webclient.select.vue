<template>
  <div v-if="infoMode">{{object.value}}</div>
  <el-select v-else v-model="selection" :clearable="clearable" :filterable="customizable" :allow-create="customizable"
      placeholder="" size="small">
    <el-option v-for="topic in topics" :label="topic.value" :value="topic.id" :key="topic.id"></el-option>
  </el-select>
</template>

<script>
import dm5 from 'dm5'

export default {

  data () {
    return {
      topics: undefined,
      selection: this.object.id === -1 ? '' : this.object.id
      // Note: apparently in <el-select> and empty string represents "no selection"
    }
  },

  computed: {

    clearable () {
      return this.assocDef.getViewConfig('dm4.webclient.clearable')
    },

    customizable () {
      return this.assocDef.getViewConfig('dm4.webclient.customizable')
    }
  },

  // When switching from info to form mode Vue *reuses* this component in a non-uniform fashion (I don't know why):
  //   1) Workspace: yes    ("Sharing Mode")
  //   2) Assoc Def: yes    ("Custom Association Type")
  //   3) View Config: no   ("Widget")
  //   4) Person: no        ("Phone Label")
  // "yes": component is created in info mode, mode watcher triggers when switched to form mode.
  // "no": component is re-created in form mode, mode watcher does *not* trigger.
  // The solution is to call updateValue() in both places, created() and the mode watcher.
  created () {
    console.log('created', this._uid, this.mode, this.selection, typeof this.selection)
    this.updateValue()
  },

  watch: {

    mode () {
      console.log('mode', this._uid, this.mode, this.selection, typeof this.selection)
      this.updateValue()
    },

    selection () {
      console.log('selection', this._uid, this.mode, this.selection, typeof this.selection)
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
      // sanity check
      if (!['number', 'string'].includes(typeof this.selection)) {
        throw Error(`Unexpected selection: ${this.selection} ${typeof this.selection}`)
      }
      // Note: a custom value entered in a allow-create <el-select> is a string
      this.object.value = typeof this.selection == 'number' ? `ref_id:${this.selection}` : this.selection
    }
  },

  mixins: [
    require('./mixins/object').default,     // object to render
    require('./mixins/assocDef').default,   // assoc def leading to object
    require('./mixins/mode').default,
    require('./mixins/infoMode').default
  ]
}
</script>
