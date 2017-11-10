<template>
  <div v-if="infoMode">{{object.value}}</div>
  <el-select v-else v-model="selection" clearable placeholder="Default" size="small">
    <el-option v-for="topic in topics" :label="topic.value" :value="topic.uri" :key="topic.id"></el-option>
  </el-select>
</template>

<script>
import dm5 from 'dm5'

export default {

  data () {
    return {
      topics: [],
      selection: this.object.uri
    }
  },

  created () {
    // console.log('created', this.mode, this.selection, typeof this.selection, this.selection.length)
    if (this.formMode) {
      this.updateValue()
    }
    dm5.restClient.getTopicsByType(this.object.typeUri).then(topics => {
      this.topics = topics
    })
  },

  watch: {
    selection () {
      // console.log('selection', this.selection, typeof this.selection, this.selection.length)
      this.updateValue()
    }
  },

  methods: {
    updateValue () {
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
