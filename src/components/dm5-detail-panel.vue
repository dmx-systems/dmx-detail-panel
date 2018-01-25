<template>
  <div class="dm5-detail-panel">
    <el-tabs v-if="object">
      <el-tab-pane :label="object.typeName">
        <h3>{{object.value}}</h3>
        <dm5-assoc v-if="isAssoc" :assoc="object"></dm5-assoc>
        <dm5-object-renderer v-else></dm5-object-renderer>
        <el-button class="button" v-if="buttonVisibility" @click="buttonAction">{{buttonLabel}}</el-button>
      </el-tab-pane>
      <el-tab-pane label="Related">
        <dm5-topic-list :topics="relTopics" @click-topic="revealTopic"></dm5-topic-list>
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
    this.$store.watch(
      state => state.object,
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
      return this.$store.state.object
    },

    writable () {
      return this.$store.state.writable
    },

    isAssoc () {
      return this.object instanceof dm5.Assoc
    },

    buttonLabel () {
      return this.infoMode ? 'Edit' : 'Save'
    },

    buttonVisibility () {
      return this.writable && !this.inlineEdit
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

  components: {
    'dm5-object-renderer': require('dm5-object-renderer'),
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
</style>
