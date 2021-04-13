<template>
  <div class="dmx-detail-panel" v-if="visible_">
    <el-button v-if="!noPinButton" :class="['pin', {unpinned: !pinned_}, 'fa', 'fa-thumb-tack']" type="text"
      :title="pinTitle" @click="togglePinned">
    </el-button>
    <el-tabs v-if="object_" :value="tab_" @tab-click="tabClick"><!-- tabs are shown once object arrives -->
      <el-tab-pane :label="object_.typeName" name="info">
        <dmx-info-tab :object="object_" :writable="writable_" :mode="mode_" :detail-renderers="detailRenderers"
          :extra-buttons="extraButtons" :types="types_" :quill-config="quillConfig" @edit="edit" @submit="submit"
          @submit-inline="submitInline" @child-topic-reveal="revealChildTopic" ref="infoTab">
        </dmx-info-tab>
      </el-tab-pane>
      <el-tab-pane label="Related" name="related">
        <dmx-related-tab :object="object_" :tab="tab_" :sort-mode="sortMode" :marker-topic-ids="markerTopicIds_"
          @related-topic-click="relatedTopicClick" @related-icon-click="relatedIconClick" @sort-change="sortChange">
        </dmx-related-tab>
      </el-tab-pane>
      <el-tab-pane label="Meta" name="meta">
        <dmx-meta-tab :object="object_" :writable="writable_" :tab="tab_" :marker-topic-ids="markerTopicIds_"
          @related-topic-click="relatedTopicClick" @related-icon-click="relatedIconClick"
          @object-id-click="objectIdClick">
        </dmx-meta-tab>
      </el-tab-pane>
      <el-tab-pane label="Config" name="config" :disabled="configTabDisabled">
        <dmx-config-tab :object="object_" :writable="writable_" :tab="tab_" :view-config-topic="viewConfigTopic"
          :config-type-uris="configTypeUris" :detail-renderers="detailRenderers"
          @submit-view-config="submitViewConfig" @submit-config-topic="submitConfigTopic">
        </dmx-config-tab>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import dmx from 'dmx-api'

export default {

  created () {
    // console.log('dmx-detail-panel created', this.types)
  },

  destroyed () {
    // console.log('dmx-detail-panel destroyed')
  },

  mixins: [
    require('./mixins/writable').default,
    require('./mixins/mode-default').default,
    require('./mixins/detail-renderers').default,
    require('./mixins/extra-buttons').default
  ],

  props: {
    visible: {type: Boolean, default: true},    // Trueish if the detail panel is visible. Optional. Default is true.
    pinned: {type: Boolean, default: false},    // Pin toggle state
    tab: {type: String, default: 'info'},       // The selected tab: 'info', 'related', ... Optional. Default is 'info'.
    object: dmx.DMXObject,                      // The topic/assoc to display. Undefined if data not yet available.
    configDefs: Object,                         // As received from BE's ConfigService
    markerTopicIds: Array,                      // Optional: IDs of topics to render as "marked" in related-tab.
    types: Object,                              // Optional: "assocTypes" and "roleTypes" (arrays)
    quillConfig: Object,
    noPinButton: Boolean
  },

  data () {
    return {
      sortMode: 'type',                         // Related tab sort mode: 'topic', 'type', 'assoc'
      // mirror props ### FIXME: add remaining props?
      visible_:        this.visible,
      pinned_:         this.pinned,
      tab_:            this.tab,
      object_:         this.object,
      writable_:       this.writable,
      mode_:           this.mode,
      configDefs_:     this.configDefs,
      markerTopicIds_: this.markerTopicIds,
      types_:          this.types
    }
  },

  computed: {

    pinTitle () {
      return this.pinned_ ? 'Unpin Detail Panel\n\nIf unpinned, the detail panel closes if nothing is selected' :
        'Pin Detail Panel\n\nIf pinned, the detail panel remains open even if nothing is selected'
    },

    viewConfigTopic () {
      // console.log('viewConfigTopic', this.object_)
      if (this.object_ && (this.object_.isType || this.object_.isCompDef)) {
        const viewConfig = this.object_.viewConfig
        if (!viewConfig) {
          console.warn('Type or comp def has no view config', this.object_)
          return
        }
        const viewConfigTopic = viewConfig['dmx.webclient.view_config']
        if (!viewConfigTopic) {
          console.warn('Type or comp def has no view config topic', this.object_)
          return
        }
        return viewConfigTopic
      }
    },

    /**
     * @return  String array, never empty. Undefined if current `object` has no config.
     */
    configTypeUris () {
      const hashKey = Object.keys(this.configDefs_).find(hashKey => this.matches(hashKey))
      if (hashKey) {
        return this.configDefs_[hashKey]
      }
    },

    configTabDisabled () {
      return !this.viewConfigTopic && !this.configTypeUris
    }
  },

  watch: {
    // needed when instantiated via template
    object   () {this.object_   = this.object},                                        /* eslint block-spacing: "off" */
    writable () {this.writable_ = this.writable},
    tab      () {this.tab_      = this.tab},
    mode     () {this.mode_     = this.mode}
    // FIXME: add watchers for the remaining props?
  },

  methods: {

    matches (hashKey) {
      const s = hashKey.split(':')
      if (s[0] === 'typeUri') {
        return this.object_.typeUri === s[1]
      } else if (s[0] === 'topicUri') {
        return this.object_.uri === s[1]
      }
      throw Error(`Unexpected hash key: "${hashKey}"`)
    },

    tabClick (tabPane) {
      this.$emit('tab-click', tabPane.name)
    },

    edit () {
      this.$emit('edit')
    },

    submit (object) {
      this.$emit('submit', object)
    },

    submitInline (object) {
      this.$emit('submit-inline', object)
    },

    submitViewConfig (viewConfigTopic) {
      this.$emit('submit-view-config', viewConfigTopic)
    },

    submitConfigTopic (configTopic) {
      this.$emit('submit-config-topic', configTopic)
    },

    revealChildTopic (relTopic) {
      this.$emit('child-topic-reveal', relTopic)
    },

    relatedTopicClick (relTopic) {
      this.$emit('related-topic-click', relTopic)
    },

    relatedIconClick (relTopic) {
      this.$emit('related-icon-click', relTopic)
    },

    objectIdClick (object) {
      this.$emit('object-id-click', object)
    },

    togglePinned () {
      this.$emit('pin', !this.pinned_)
    },

    sortChange (sortMode) {
      this.sortMode = sortMode
    },

    // Public API

    isDirty () {
      return this.$refs.infoTab.isDirty()
    },

    save () {
      this.$refs.infoTab.submitInline()
    }
  },

  components: {
    'dmx-info-tab':    require('./dmx-info-tab').default,
    'dmx-related-tab': require('./dmx-related-tab').default,
    'dmx-meta-tab':    require('./dmx-meta-tab').default,
    'dmx-config-tab':  require('./dmx-config-tab').default
  }
}
</script>

<style>
.dmx-detail-panel .el-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.dmx-detail-panel .el-tabs__header {
  margin: 0;                            /* was 0 0 15px */
  padding-left:  12px;
}

.dmx-detail-panel .el-tabs__header .el-tabs__item {
  font-size: var(--label-font-size);    /* was 14px */
  color: var(--label-color);            /* was #303133 (Element UI --color-text-primary) */
  height: 36px;                         /* was 40px */
  line-height: 36px;                    /* was 40px */
  padding: 0 12px;                      /* was 0 20px */
}

.dmx-detail-panel .el-tabs__header .el-tabs__item:hover {
  color: var(--highlight-color);        /* restore original Element UI active color as accidentally */
}                                       /* overridden by previous rule due to higher specificity    */

.dmx-detail-panel .el-tabs__header .el-tabs__item.is-active {
  color: var(--highlight-color);        /* restore original Element UI active color as accidentally */
}                                       /* overridden by previous rule due to higher specificity    */

.dmx-detail-panel .el-tabs__header .el-tabs__item.is-disabled {
  color: var(--label-color-disabled);   /* restore original Element UI disabled color as accidentally */
}                                       /* overridden by previous rule due to higher specificity      */

.dmx-detail-panel .el-tabs__content,
.dmx-detail-panel .el-tabs__content .el-tab-pane {
  display: flex;
  flex-direction: column;
}

.dmx-detail-panel .el-tabs__content .el-tab-pane {
  min-height: 0;  /* Needed for children of a column-oriented flex container. Otherwise el-tab-pane exceeds viewport. */
                  /* http://stackoverflow.com/questions/26895349/how-can-i-get-ff-33-x-flexbox-behavior-in-ff-34-x    */
                  /* https://www.w3.org/TR/css-flexbox-1/#min-size-auto                                               */
}

.dmx-detail-panel button.pin {
  position: absolute;
  top: 10px;
  right: 6px;
  font-size: 16px !important;
  padding: 0 !important;
  z-index: 3;                           /* stack above el-tabs__nav */
}

.dmx-detail-panel button.pin.unpinned {
  color: transparent;
  font-size: 15px !important;
  -webkit-text-stroke: 1px var(--highlight-color);
}
</style>
