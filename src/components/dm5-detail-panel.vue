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
    <el-button class="close-button fa fa-close" type="text" @click="close"></el-button>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  mixins: [
    require('./mixins/mode').default
  ],

  data () {
    return {
      relTopics: undefined
    }
  },

  computed: {

    object () {
      return this.context.object
    },

    writable () {
      return this.context.writable
    },

    inlineEdit () {
      return this.context.inlineCompId
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

  watch: {
    object () {
      if (this.object) {    // Note: on unselect object becomes undefined
        // TODO: lazy retrieval
        // console.log('Retrieving related topics of object', this.object.id)
        this.object.getRelatedTopics().then(relTopics => {
          this.relTopics = relTopics
        })
      }
    }
  },

  methods: {

    // TODO: component reusability => emit events instead of dispatching actions

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

    close () {
      this.$store.dispatch('closeDetailPanel')
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

.dm5-detail-panel .close-button {
  position: absolute;
  top: 0;
  right: 0;
  padding: 0;
}
</style>
