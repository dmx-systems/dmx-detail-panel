<template>
  <div class="dm5-detail-panel">
    <el-tabs v-if="object">
      <el-tab-pane :label="object.typeName">
        <h3>{{object.value}}</h3>
        <dm5-assoc v-if="isAssoc" :assoc="object" :mode="mode"></dm5-assoc>
        <component v-else :is="objectRenderer" :object="object" :mode="mode" :level="0"></component>
        <el-button class="button" v-if="buttonVisibility" @click="buttonAction">{{buttonLabel}}</el-button>
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

  // Note: we can't do the store registrations in index.js as we have no access to the store object there,
  // and we can't import the store object either as it is not part of a Node.js module. So we use the
  // component's created() hook to do the registrations.
  created () {
    this.$store.registerModule('detailPanel', require('../detail-panel').default)
    this.$store.watch(
      state => state.detailPanel.object,
      object => {
        if (object) {    // Note: on unselect object becomes undefined
          // TODO: lazy retrieval
          // console.log('Retrieving related topics of object', object.id)
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
      return this.objectRenderers[this.object.typeUri] || 'dm5-object'
    },

    isAssoc () {
      return this.object instanceof dm5.Assoc
    },

    buttonLabel () {
      return this.infoMode ? 'Edit' : 'Save'
    },

    buttonVisibility () {
      return !this.inlineEdit
    }
  },

  methods: {

    buttonAction () {
      const action = this.infoMode ? 'edit' : 'submit'
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
    require('./mixins/info-mode').default,
    require('./mixins/inline-edit').default
  ],

  components: {
    'dm5-object': require('./dm5-object'),
    'dm5-assoc':  require('./dm5-assoc')
  }
}
</script>

<style>
.dm5-detail-panel .field {
  margin-top: 1.2em;
}

.dm5-detail-panel .button {
  margin-top: 1.2em;
}
</style>
