<template>
  <dm5-topic-list :topics="relTopics" @click-topic="revealTopic"></dm5-topic-list>
</template>

<script>
export default {

  inject: ['context'],

  data () {
    return {
      relTopics: undefined
    }
  },

  computed: {
    object () {
      return this.context.object
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
    revealTopic (relTopic) {
      this.$store.dispatch('revealRelatedTopic', {
        relTopic,
        pos: {x: 100, y: 100}   // TODO
      })
    }
  },

  components: {
    'dm5-topic-list': require('./dm5-topic-list')
  }
}
</script>
