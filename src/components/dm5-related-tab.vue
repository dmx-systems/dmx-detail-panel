<template>
  <div class="dm5-related-tab">
    <dm5-topic-list :topics="relTopics" :sort-mode="sortMode" :marker-ids="markerIds"
      @topic-click="topicClick" @icon-click="iconClick" @sort-change="sortChange">
    </dm5-topic-list>
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
    sortMode: String,                       // topic list sort mode: 'topic', 'type', 'assoc'
    markerIds: Array                        // IDs of topics to render as "marked"
  },

  data () {
    return {
      relTopics: []
    }
  },

  watch: {

    object () {
      // console.log('object watcher', this.object.id)
      this.fetchRelatedTopics()
    },

    tab () {
      // TODO: suppress unnecessary refetching when browsing between tabs and revisit the "Related" tab
      // console.log('tab watcher', this.tab)
      this.fetchRelatedTopics()
    }
  },

  methods: {

    fetchRelatedTopics () {
      // console.log('fetchRelatedTopics', this.object.id, this.tab === 'related')
      // fetch only if the "Related" tab is selected
      if (this.tab === 'related') {
        this.object.getRelatedTopicsWithoutChilds().then(relTopics => {
          this.relTopics = relTopics
        })
      }
    },

    topicClick (relTopic) {
      this.$emit('related-topic-click', relTopic)
    },

    iconClick (relTopic) {
      this.$emit('related-icon-click', relTopic)
    },

    sortChange (sortMode) {
      this.$emit('sort-change', sortMode)
    }
  },

  components: {
    'dm5-topic-list': require('dm5-topic-list').default
  }
}
</script>

<style>
.dm5-related-tab {
  overflow: auto;
  padding: var(--detail-panel-padding-all);
}
</style>
