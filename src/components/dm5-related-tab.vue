<template>
  <div class="dm5-related-tab">
    <dm5-topic-list :topics="relTopics" :marker-ids="markerIds" @topic-click="topicClick"></dm5-topic-list>
  </div>
</template>

<script>
export default {

  created () {
    // console.log('dm5-related-tab created', this.markerIds)
    this.fetchRelatedTopics()
  },

  destroyed () {
    // console.log('dm5-related-tab destroyed')
  },

  mixins: [
    require('./mixins/object').default
  ],

  props: {
    tab: {type: String, required: true},    // The selected tab: 'info', 'related', ...
    markerIds: Array                        // IDs of topics to render as "marked"
  },

  data () {
    return {
      relTopics: []
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

<style>
.dm5-related-tab .dm5-topic-list {
  margin-top: 1em;
}
</style>
