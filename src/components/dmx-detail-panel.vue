<template>
  <transition @before-enter="beforeEnter" @after-enter="afterEnter" @before-leave="beforeLeave"
      @after-leave="afterLeave">
    <div class="dmx-detail-panel" v-if="visible">
      <el-button v-if="!noPinButton" :class="['pin', {unpinned: !pinned}, 'fa', 'fa-thumb-tack']" type="text"
        :title="pinTitle" @click="togglePinned">
      </el-button>
      <el-tabs v-if="object" :value="tab" @tab-click="tabClick"><!-- tabs are shown once object arrives -->
        <el-tab-pane :label="object.typeName" name="info">
          <dmx-info-tab :object :writable :mode :detail-renderers :extra-buttons :types :quill-config @edit="edit"
            @submit="submit" @submit-inline="submitInline" @child-topic-reveal="revealChildTopic" ref="infoTab">
          </dmx-info-tab>
        </el-tab-pane>
        <el-tab-pane label="Related" name="related">
          <dmx-related-tab :object :tab :sort-mode :marker-topic-ids @related-topic-click="relatedTopicClick"
            @related-icon-click="relatedIconClick" @sort-change="sortChange">
          </dmx-related-tab>
        </el-tab-pane>
        <el-tab-pane label="Meta" name="meta">
          <dmx-meta-tab :object :writable :tab :marker-topic-ids @related-topic-click="relatedTopicClick"
            @related-icon-click="relatedIconClick" @object-id-click="objectIdClick">
          </dmx-meta-tab>
        </el-tab-pane>
        <el-tab-pane label="Config" name="config" :disabled="configTabDisabled">
          <dmx-config-tab :object :writable :tab :view-config-topic :config-type-uris :detail-renderers
            @submit-view-config="submitViewConfig" @submit-config-topic="submitConfigTopic">
          </dmx-config-tab>
        </el-tab-pane>
      </el-tabs>
    </div>
  </transition>
</template>

<script>
import dmx from 'dmx-api'

export default {

  created () {
    // console.log('dmx-detail-panel created', this)
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
    noPinButton: Boolean,
    transX: {type: Number}                      // absolute x coordinate for show/hide transition (number)
  },

  data () {
    return {
      sortMode: 'type',                         // Related tab sort mode: 'topic', 'type', 'assoc'
    }
  },

  computed: {

    pinTitle () {
      return this.pinned ? 'Unpin Detail Panel\n\nIf unpinned, the detail panel closes if nothing is selected' :
        'Pin Detail Panel\n\nIf pinned, the detail panel remains open even if nothing is selected'
    },

    viewConfigTopic () {
      if (this.object && (this.object.isType || this.object.isRoleType || this.object.isCompDef)) {
        const viewConfig = this.object.viewConfig
        if (!viewConfig) {
          console.warn('Type, or role type, or comp def is missing a view config', this.object)
          return
        }
        const viewConfigTopic = viewConfig['dmx.webclient.view_config']
        if (!viewConfigTopic) {
          console.warn('Type, or role type, or comp def is missing a view config topic', this.object)
          return
        }
        return viewConfigTopic
      }
    },

    /**
     * @return  String array, never empty. Undefined if current `object` has no config.
     */
    configTypeUris () {
      const hashKey = Object.keys(this.configDefs).find(hashKey => this.matches(hashKey))
      if (hashKey) {
        return this.configDefs[hashKey]
      }
    },

    configTabDisabled () {
      return !this.viewConfigTopic && !this.configTypeUris
    }
  },

  watch: {
    transX (transX) {
      // console.log('watch transX', transX)
      document.body.style.setProperty('--detail-panel-trans-x', transX + 'px')
    }
  },

  methods: {

    matches (hashKey) {
      const s = hashKey.split(':')
      if (s[0] === 'typeUri') {
        return this.object.typeUri === s[1]
      } else if (s[0] === 'topicUri') {
        return this.object.uri === s[1]
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
      this.$emit('pin', !this.pinned)
    },

    sortChange (sortMode) {
      this.sortMode = sortMode
    },

    // Show/hide transition

    beforeEnter (el) {
      // console.log('beforeEnter')
      el.style.position = 'absolute'
      el.style.height = '100%'
    },

    afterEnter (el) {
      // console.log('afterEnter', document.querySelector('.dmx-detail-panel').__vue__.$parent)
      el.style.position = 'unset'
      el.style.height = 'unset'
    },

    beforeLeave (el) {
      // console.log('beforeLeave', document.querySelector('.dmx-detail-panel').__vue__)
      el.style.position = 'absolute'
      el.style.height = '100%'
    },

    afterLeave (el) {
      // console.log('afterLeave')
      el.style.position = 'unset'
      el.style.height = 'unset'
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
  z-index: 3;                         /* stack above el-tabs__nav */
}

.dmx-detail-panel button.pin.unpinned {
  color: transparent;
  font-size: 15px !important;
  -webkit-text-stroke: 1px var(--highlight-color);
}

/* Show/hide transition */

:root {
  --detail-panel-trans-x: 70vw;       /* synced with app state; initial value must match "resizerPos" webclient state */
}

.dmx-detail-panel.v-enter-active,
.dmx-detail-panel.v-leave-active {
  transition: left 0.3s;
}

.dmx-detail-panel.v-enter,
.dmx-detail-panel.v-leave-to {
  left: 100%;
}

.dmx-detail-panel.v-enter-to,
.dmx-detail-panel.v-leave {
  left: var(--detail-panel-trans-x);
}
</style>
