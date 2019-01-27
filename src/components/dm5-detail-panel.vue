<template>
  <div class="dm5-detail-panel" v-if="visible_"><!-- background is already shown for the sake of feedback -->
    <el-tabs v-if="object_" :value="tab_" @tab-click="tabClick"><!-- tabs are shown once object arrives -->
      <el-tab-pane :label="object_.typeName" name="info">
        <dm5-info-tab :object="object_" :writable="writable_" :mode="mode_" :detail-renderers="detailRenderers"
          :types="types_" :quill-config="quillConfig" @edit="edit" @submit="submit" @submit-inline="submitInline"
          @child-topic-reveal="revealChildTopic">
        </dm5-info-tab>
      </el-tab-pane>
      <el-tab-pane label="Related" name="related">
        <dm5-related-tab :object="object_" :tab="tab_" :marker-ids="markerIds_"
          @related-topic-click="relatedTopicClick">
        </dm5-related-tab>
      </el-tab-pane>
      <el-tab-pane label="Meta" name="meta">
      </el-tab-pane>
      <el-tab-pane label="View" name="view" :disabled="!viewConfigTopic">
        <dm5-view-tab :view-config-topic="viewConfigTopic" :writable="writable_" :detail-renderers="detailRenderers"
          v-if="viewConfigTopic" @submit-view-config="submitViewConfig">
        </dm5-view-tab>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  created () {
    // console.log('dm5-detail-panel created', this.types)
  },

  destroyed () {
    // console.log('dm5-detail-panel destroyed')
  },

  mixins: [
    require('./mixins/writable').default,
    require('./mixins/mode-default').default,
    require('./mixins/detail-renderers').default
  ],

  props: {
    visible: {type: Boolean, default: true},    // Trueish if the detail panel is visible. Optional. Default is true.
    tab: {type: String, default: 'info'},       // The selected tab: 'info', 'related', ... Optional. Default is 'info'.
    object: dm5.DMXObject,                      // The topic/assoc to display. Undefined if data not yet available.
    markerIds: Array,                           // Optional: IDs of topics to render as "marked" in related-tab.
    types: Object,                              // Optional: "assocTypes" and "roleTypes" (arrays)
    quillConfig: Object
  },

  data () {
    return {
      // mirror props ### FIXME: add remaining props?
      visible_:   this.visible,
      tab_:       this.tab,
      object_:    this.object,
      writable_:  this.writable,
      mode_:      this.mode,
      markerIds_: this.markerIds,
      types_:     this.types
    }
  },

  computed: {
    viewConfigTopic () {
      // console.log('viewConfigTopic', this.object_)
      if (this.object_ && (this.object_.isType() || this.object_.isAssocDef())) {
        const viewConfig = this.object_.viewConfig
        if (!viewConfig) {
          console.warn('Type or assoc def has no view config', this.object_)
          return
        }
        const viewConfigTopic = viewConfig['dmx.webclient.view_config']
        if (!viewConfigTopic) {
          console.warn('Type or assoc def has no view config topic', this.object_)
          return
        }
        return viewConfigTopic
      }
    }
  },

  methods: {

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

    revealChildTopic (relTopic) {
      this.$emit('child-topic-reveal', relTopic)
    },

    relatedTopicClick (relTopic) {
      this.$emit('related-topic-click', relTopic)
    }
  },

  components: {
    'dm5-info-tab':    require('./dm5-info-tab').default,
    'dm5-related-tab': require('./dm5-related-tab').default,
    'dm5-view-tab':    require('./dm5-view-tab').default
  }
}
</script>

<style>
.dm5-detail-panel .el-tabs__item {
  font-size: var(--label-font-size);    /* was 14px */
  color: var(--label-color);            /* was #303133 (Element UI --color-text-primary) */
  height: 36px;                         /* was 40px */
  line-height: 36px;                    /* was 40px */
  padding: 0 12px;                      /* was 0 20px */
}

.dm5-detail-panel .el-tabs__item.is-active {
  color: var(--highlight-color);        /* restore original Element UI active color as accidentally */
                                        /* overridden by previous rule due to higher specificity    */
}

.dm5-detail-panel .el-tabs__item.is-disabled {
  color: var(--label-color-disabled);   /* restore original Element UI disabled color as accidentally */
                                        /* overridden by previous rule due to higher specificity    */
}

.dm5-detail-panel .el-tabs__content {
  overflow: visible;                    /* don't crop quill toolbar (was "hidden") */
}
</style>
