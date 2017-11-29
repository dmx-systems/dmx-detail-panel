<template>
  <div v-if="infoMode">{{object.value}}</div>
  <el-select v-else v-model="selection" :clearable="clearable" :filterable="customizable" :allow-create="customizable"
      placeholder="">
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
      // Note: apparently in <el-select> an empty string represents "no selection"
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

  // The component is created in info mode if an object is available. When switched to form mode the mode watcher fires.
  // In contrast it is created only in form mode if *no* object is available yet. The mode watcher does *not* fire.
  // That's why we call updateValue() in both places, the created() hook and the mode watcher.
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
