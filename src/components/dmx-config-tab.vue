<template>
  <div class="dmx-config-tab">
    <div v-if="viewConfigTopic" class="view-config">
      <dmx-object-renderer :object="objectToRender" :writable="writable" :mode="mode" :renderers="detailRenderers"
        @inline="setInlineId" @submit="submit" @child-topic-reveal="revealChildTopic">
      </dmx-object-renderer>
      <el-button v-if="buttonVisibility" @click="buttonAction">{{buttonLabel}}</el-button>
    </div>
    <div v-if="configTypeUris" class="config-topics">
      <template v-for="(topic, i) in configTopics">
        <dmx-object-renderer :object="topic" :mode="configTopicMode[i]" :renderers="detailRenderers" :key="topic.id">
        </dmx-object-renderer>
        <div>
          <el-button v-if="configButtonVisibility[i]" @click="configButtonAction(topic)">
            {{configButtonLabel[i]}}
          </el-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import dmx from 'dmx-api'

export default {

  created () {
    // console.log('dmx-config-tab created', this.object, this.viewConfigTopic)
    this.initConfigTopics()
  },

  destroyed () {
    // console.log('dmx-config-tab destroyed')
  },

  mixins: [
    require('./mixins/object').default,
    require('./mixins/writable').default,
    require('./mixins/tab').default,
    require('./mixins/info-mode').default,
    require('./mixins/detail-renderers').default
  ],

  props: {
    viewConfigTopic: dmx.Topic,     // The view config topic to display. Undefined if not (yet) available.
    configTypeUris: Array           // String array, never empty. Undefined if current `object` has no config.
  },

  data () {
    return {
      // view config
      objectToEdit: undefined,  // TODO: unsaved changes check (`objectToCompare`). Compare to dmx-info-tab.vue
      inlineId: undefined,      // trueish if inline edit is active in this object or in *any* child topic (recursively)
      mode: 'info',
      // config service
      configTopics: [],               // inited by initConfigTopics() method
      configTopicToEdit: undefined    // undefined if no config topic is in edit mode
    }
  },

  computed: {

    // View Config

    type () {
      return this.viewConfigTopic.type
    },

    objectToRender () {
      if (this.infoMode) {
        return this.viewConfigTopic
      } else {
        this.objectToEdit = this.type.newFormModel(this.viewConfigTopic)
        return this.objectToEdit
      }
    },

    buttonLabel () {
      return this.infoMode ? 'Edit' : 'Save'
    },

    buttonVisibility () {
      return this.writable && !this.inlineId
    },

    // Config Service

    configTopicMode () {
      return this.configTopics.map(topic => topic === this.configTopicToEdit ? 'form' : 'info')
    },

    configButtonLabel () {
      return this.configTopics.map(topic => topic === this.configTopicToEdit ? 'Save' : 'Edit')
    },

    configButtonVisibility () {
      return this.configTopics.map(topic => !this.configTopicToEdit || topic === this.configTopicToEdit)
    }
  },

  watch: {

    object () {
      // console.log('object watcher', this.object.id)
      this.initConfigTopics()
    },

    tab () {
      // console.log('tab watcher', this.tab)
      this.initConfigTopics()
    }
  },

  methods: {

    // View Config

    buttonAction () {
      if (this.infoMode) {
        this.mode = 'form'
      } else {
        this.submit()
      }
    },

    setInlineId (id) {
      this.inlineId = id
      if (!id) {
        // TODO: introduce edit buffer also for inline editing
        this.$emit('submit-view-config', this.viewConfigTopic)
      }
    },

    submit () {
      this.$emit('submit-view-config', this.objectToEdit)
      this.mode = 'info'
    },

    revealChildTopic (relTopic) {
      this.$emit('child-topic-reveal', relTopic)
    },

    // Config Service

    initConfigTopics () {
      // Optimization: don't fetch if "Config" tab is not selected or current `object` has no config
      if (this.tab !== 'config' || !this.configTypeUris) {
        return
      }
      // TODO: suppress unnecessary refetching when browsing between tabs and revisit the "Config" tab
      //
      // console.log('initConfigTopics')
      this.configTopics = []
      this.configTypeUris.forEach(uri => {
        dmx.rpc.getConfigTopic(uri, this.object.id, true).then(topic => {
          this.configTopics.push(topic)
        })
      })
    },

    configButtonAction (topic) {
      if (!this.configTopicToEdit) {
        this.configTopicToEdit = topic
      } else {
        this.submitConfigTopic()
        this.configTopicToEdit = undefined
      }
    },

    submitConfigTopic () {
      this.$emit('submit-config-topic', this.configTopicToEdit)
    }
  },

  //

  components: {
    'dmx-object-renderer': require('dmx-object-renderer').default
  }
}
</script>

<style>
.dmx-config-tab {
  overflow: auto;
  padding: var(--detail-panel-padding-all);
}

.dmx-config-tab .view-config .dmx-object-renderer {
  padding-right: 18px;
}

.dmx-config-tab .view-config > .el-button {
  margin-top: 24px;
}

.dmx-config-tab .config-topics {
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 24px;
  align-items: start;
}
</style>
