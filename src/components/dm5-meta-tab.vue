<template>
  <div class="dm5-meta-tab">
    <div id="id">
      <div>
        <div class="field-label">ID</div>
        <div>{{object.id}}</div>
      </div>
      <div>
        <div class="field-label">URI</div>
        <div>{{object.uri || 'n/a'}}</div>
      </div>
    </div>
    <div class="field-label">Created</div>
    <div>{{created}} <span class="secondary-text">by</span> {{creator}}</div>
    <div class="field-label">Modified</div>
    <div>{{modified}} <span class="secondary-text">by</span> {{modifier}}</div>
    <!-- Workspace -->
    <div id="workspace">
      <div>
        <div class="field-label">Workspace</div>
        <div>{{workspace && workspace.value || 'n/a'}}</div>
      </div>
      <div>
        <div class="field-label">Owner</div>
        <div>{{owner || 'n/a'}}</div>
      </div>
    </div>
    <!-- Type -->
    <dm5-topic-list :topics="types" no-sort-menu :marker-ids="markerIds" @topic-click="topicClick">
    </dm5-topic-list>
    <!-- Topicmaps -->
    <dm5-topic-list :topics="topicmapTopics" no-sort-menu :marker-ids="markerIds" @topic-click="topicClick">
    </dm5-topic-list>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  created () {
    // console.log('dm5-meta-tab created')
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
      created:   undefined,
      modified:  undefined,
      creator:   undefined,
      modifier:  undefined,
      workspace: undefined,
      owner:     undefined,
      types: [],
      topicmapTopics: []
    }
  },

  watch: {

    object () {
      // console.log('object watcher', this.object.id)
      this.fetchMetaData()
    },

    tab () {
      // TODO: suppress unnecessary refetching when browsing between tabs and revisit the "Meta" tab
      // console.log('tab watcher', this.tab)
      this.fetchMetaData()
    }
  },

  methods: {

    fetchMetaData () {
      // console.log('fetchMetaData', this.object.id, this.tab === 'meta')
      // don't fetch if "Meta" tab is not selected
      if (this.tab !== 'meta') {
        return
      }
      this.object.getCreationTime().then(created      => this.created = new Date(created).toLocaleString())
      this.object.getModificationTime().then(modified => this.modified = new Date(modified).toLocaleString())
      this.object.getCreator().then(creator           => this.creator = creator)
      this.object.getModifier().then(modifier         => this.modifier = modifier)
      this.object.getWorkspace()
        .then(workspace => this.workspace = workspace)
        .then(workspace => {
          if (workspace) {
            dm5.restClient.getWorkspaceOwner(workspace.id).then(owner => this.owner = owner)
          } else {
            this.owner = undefined
          }
        })
      this.object.getRelatedTopics({
        assocTypeUri: 'dmx.core.instantiation',
        myRoleTypeUri: 'dmx.core.instance',
        othersRoleTypeUri: 'dmx.core.type'
      }).then(types => this.types = types)
      this.object.getTopicmapTopics().then(topicmapTopics => this.topicmapTopics = topicmapTopics)
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
.dm5-meta-tab #id,
.dm5-meta-tab #workspace {
  display: flex;
}

.dm5-meta-tab #id        > div + div,
.dm5-meta-tab #workspace > div + div {
  margin-left: 2.5em;
}

.dm5-meta-tab .field-label {
  margin-top: var(--field-spacing);
}

.dm5-meta-tab .secondary-text {
  color: var(--label-color)
}
</style>
