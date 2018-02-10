<template>
  <dm5-topic-list :topics="relTopics" @click-topic="revealTopic"></dm5-topic-list>
</template>

<script>
export default {

  inject: ['context'],

  created () {
    // console.log('dm5-related-tab created')
    this.fetchRelatedTopics()
  },

  mounted () {
    // console.log('dm5-related-tab mounted')
  },

  data () {
    return {
      relTopics: undefined
    }
  },

  computed: {

    object () {
      return this.context.object
    },

    detail () {
      return this.context.detail
    }
  },

  watch: {

    object () {
      // console.log('Object watcher', this.object.id)
      this.fetchRelatedTopics()
    },

    detail () {
      // TODO: suppress unnecessary refetching when browsing between tabs and revisit the "Related" tab
      // console.log('Detail watcher', this.detail)
      this.fetchRelatedTopics()
    }
  },

  methods: {

    fetchRelatedTopics () {
      // console.log('fetchRelatedTopics', this.object.id, this.detail === 'related')
      // fetch only if the "Related" tab is selected
      if (this.detail === 'related') {
        this.object.getRelatedTopics().then(relTopics => {
          this.relTopics = relTopics
        })
      }
    },

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
