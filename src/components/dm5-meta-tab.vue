<template>
  <div class="dm5-meta-tab">
    <div class="field-label">Created</div>
    <div>{{created}}</div>
    <div class="field-label">Modified</div>
    <div>{{modified}}</div>
  </div>
</template>

<script>
export default {

  created () {
    // console.log('dm5-meta-tab created', this.markerIds)
    this.fetchMetaData()
  },

  destroyed () {
    // console.log('dm5-meta-tab destroyed')
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
      created: undefined,
      modified: undefined,
      creator: undefined,
      modifier: undefined
    }
  },

  watch: {

    object () {
      // console.log('Object watcher', this.object.id)
      this.fetchMetaData()
    },

    tab () {
      // TODO: suppress unnecessary refetching when browsing between tabs and revisit the "Meta" tab
      // console.log('Detail watcher', this.tab)
      this.fetchMetaData()
    }
  },

  methods: {

    fetchMetaData () {
      // console.log('fetchMetaData', this.object.id, this.tab === 'meta')
      // fetch only if the "Meta" tab is selected
      if (this.tab === 'meta') {
        this.object.getCreationTime().then(created => {
          this.created = new Date(created).toLocaleString()
        })
        this.object.getModificationTime().then(modified => {
          this.modified = new Date(modified).toLocaleString()
        })
      }
    }
  },

  components: {
    'dm5-topic-list': require('dm5-topic-list').default
  }
}
</script>

<style>
.dm5-meta-tab .field-label {
  margin-top: var(--field-spacing);
}
</style>
