<template>
  <div class="dm5-detail-panel">
    <el-tabs v-if="object">
      <el-tab-pane :label="object.typeName">
        <h3>{{object.value}}</h3>
        <component :is="objectRenderer" :object="object" :mode="mode"></component>
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
export default {

  // Note: we can't do the registrations in index.js as we have no access to the store object there, and we can't import
  // the store there as it originates from another repo. So we use the component's created() to do the registrations.
  created () {
    this.$store.registerModule('detailPanel', require('../detail-panel').default)
    this.$store.watch(
      state => state.detailPanel.object,
      object => {
        if (object) {    // Note: on unselect object becomes undefined
          // TODO: retrieve lazy
          console.log('Retrieving related topics of object', object.id)
          object.getRelatedTopics().then(relTopics => {
            this.relTopics = relTopics
          })
        }
      }
    )
  },

  data () {
    return {
      relTopics: undefined
    }
  },

  computed: {

    object () {
      return this.$store.state.detailPanel.object
    },

    mode () {
      return this.$store.state.detailPanel.mode
    },

    objectRenderers () {
      return this.$store.state.detailPanel.objectRenderers
    },

    objectRenderer () {
      return this.objectRenderers[this.object.typeUri] || 'field-renderer'
    },

    buttonLabel () {
      return this.infoMode ? 'Edit' : 'OK'
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
