<template>
  <div class="dm5-detail-panel">
    <el-tabs v-if="object">
      <el-tab-pane :label="object.typeName">
        <h3>{{object.value}}</h3>
        <field-renderer :object="object" :mode="mode"></field-renderer>
        <el-button class="button" size="small" @click="buttonAction">{{buttonLabel}}</el-button>
      </el-tab-pane>
      <el-tab-pane label="Related">
        <el-table :data="relTopics" :default-sort="{prop: 'typeName'}" @row-click="revealTopic">
          <el-table-column prop="value"    label="Topic" sortable></el-table-column>
          <el-table-column prop="typeName" label="Type"  sortable></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="Meta">
      </el-tab-pane>
      <el-tab-pane label="View">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  created () {
    this.$store.registerModule('detailPanel2', require('../detail-panel').default)
    // TODO: move global "detailPanel" state to this module, then rename registration
  },

  props: [
    'object',   // the Topic/Assoc to display; if undefined the detail panel is empty
    'mode'      // 'info' or 'form'
  ],

  data () {
    return {
      relTopics: undefined
    }
  },

  computed: {
    buttonLabel () {
      return this.infoMode ? 'Edit' : 'OK'
    }
  },

  watch: {
    object: function () {
      if (this.object) {    // Note: on unselect object becomes undefined
        // TODO: retrieve lazy
        console.log('Retrieving related topics of object', this.object.id)
        this.object.getRelatedTopics().then(relTopics => {
          this.relTopics = relTopics
        })
      }
    }
  },

  methods: {

    buttonAction () {
      var action = this.infoMode ? 'edit' : 'submit'
      this.$store.dispatch(action)
    },

    revealTopic (relTopic) {
      this.$store.dispatch('revealRelatedTopic', {
        relTopic,
        pos: {x: 100, y: 100}   // TODO
      })
    }
  },

  mixins: [
    require('./mixins/infoMode').default
  ],

  components: {
    'field-renderer': require('./FieldRenderer')
  }
}
</script>

<style>
.dm5-detail-panel .button {
  margin-top: 1em;
}
</style>
