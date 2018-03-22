<template>
  <dm5-topic-list :topics="relTopics" @topic-click="topicClick"></dm5-topic-list>
</template>

<script>
export default {

  created () {
    // console.log('dm5-related-tab created')
    this.fetchRelatedTopics()
  },

  destroyed () {
    // console.log('dm5-related-tab destroyed')
  },

  mixins: [
    require('./mixins/object').default
  ],

  props: {
    tab: {    // The selected tab: 'info', 'related', ...
      type: String,
      required: true
    }
  },

  data () {
    return {
      relTopics: undefined
    }
  },

  watch: {

    object () {
      // console.log('Object watcher', this.object.id)
      this.fetchRelatedTopics()
    },

    tab () {
      // TODO: suppress unnecessary refetching when browsing between tabs and revisit the "Related" tab
      // console.log('Detail watcher', this.tab)
      this.fetchRelatedTopics()
    }
  },

  methods: {

    fetchRelatedTopics () {
      // console.log('fetchRelatedTopics', this.object.id, this.tab === 'related')
      // fetch only if the "Related" tab is selected
      if (this.tab === 'related') {
        this.object.getRelatedTopics().then(relTopics => {
          this.relTopics = relTopics
        })
      }
    },

    topicClick (relTopic) {
      this.$emit('related-topic-click', relTopic)
    }
  },

  components: {
    'dm5-topic-list': require('dm5-topic-list').default
  }
}
</script>
