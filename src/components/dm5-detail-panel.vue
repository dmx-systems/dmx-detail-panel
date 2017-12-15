<template>
  <div class="dm5-detail-panel">
    <el-tabs v-if="object">
      <el-tab-pane :label="object.typeName">
        <h3>{{object.value}}</h3>
        <dm5-assoc v-if="isAssoc" :assoc="object"></dm5-assoc>
        <component v-else :is="objectRenderer" :object="object" :level="0"></component>
        <el-button class="button" v-if="buttonVisibility" @click="buttonAction">{{buttonLabel}}</el-button>
      </el-tab-pane>
      <el-tab-pane label="Related">
        <div class="rel-count">{{relCount}} Topics</div>
        <dm5-topic-list :topics="relTopics" @topic-click="revealTopic"></dm5-topic-list>
        <el-table :data="relTopics" :default-sort="{prop: 'typeName'}" :span-method="span" @row-click="revealTopic">
          <el-table-column prop="value" label="Topic" sortable>
            <dm5-topic slot-scope="table" :topic="table.row"></dm5-topic>
          </el-table-column>
          <el-table-column prop="typeName" label="Type" sortable></el-table-column>
          <el-table-column prop="assoc.typeName" label="Assoc" sortable></el-table-column>
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

  mixins: [
    require('./mixins/mode').default,
    require('./mixins/info-mode').default,
    require('./mixins/inline-edit').default
  ],

  data () {
    return {
      relTopics: undefined
    }
  },

  computed: {

    object () {
      return this.$store.state.detailPanel.object
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
    },

    relCount () {
      return this.relTopics && this.relTopics.length
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
    },

    span ({columnIndex}) {  // TODO: drop
      return {
        rowspan: 1,
        colspan: columnIndex === 0 ? 3 : 0
      }
    }
  },

  components: {
    'dm5-object':     require('./dm5-object'),
    'dm5-topic':      require('./dm5-topic'),   // TODO: drop
    'dm5-assoc':      require('./dm5-assoc'),
    'dm5-topic-list': require('./dm5-topic-list')
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

.dm5-detail-panel .rel-count {
  font-size: var(--label-font-size);
  color: var(--label-color);
  margin-top: 1em;
  margin-bottom: 1.5em;
}
</style>
