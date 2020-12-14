<template>
  <div class="dmx-view-tab">
    <dmx-object-renderer :object="objectToRender" :writable="writable" :mode="mode" :renderers="detailRenderers"
      @inline="setInlineId" @submit="submit" @child-topic-reveal="revealChildTopic">
    </dmx-object-renderer>
    <div>
      <!-- Wrapper div fixes button height. Somehow an el-button does not like to be a flex item. -->
      <el-button class="button" v-if="buttonVisibility" @click="buttonAction">{{buttonLabel}}</el-button>
    </div>
  </div>
</template>

<script>
import dmx from 'dmx-api'

export default {

  created () {
    // console.log('dmx-view-tab created', this.viewConfigTopic)
  },

  destroyed () {
    // console.log('dmx-view-tab destroyed')
  },

  mixins: [
    require('./mixins/writable').default,
    require('./mixins/info-mode').default,
    require('./mixins/detail-renderers').default
  ],

  props: {
    viewConfigTopic: {          // The view config topic to display
      type: dmx.Topic,
      required: true
    }
  },

  data () {
    return {
      objectToEdit: undefined,  // TODO: unsaved changes check (`objectToCompare`). Compare to dmx-info-tab.vue
      inlineId: undefined,      // trueish if inline edit is active in this object or in *any* child topic (recursively)
      mode: 'info'
    }
  },

  computed: {

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
    }
  },

  methods: {

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
    }
  },

  components: {
    'dmx-object-renderer': require('dmx-object-renderer').default
  }
}
</script>

<style>
.dmx-view-tab {
  display: flex;
  flex-direction: column;
  min-height: 0; /* Needed for children of a column-oriented flex container. Otherwise dmx-view-tab exceeds viewport. */
                 /* http://stackoverflow.com/questions/26895349/how-can-i-get-ff-33-x-flexbox-behavior-in-ff-34-x     */
                 /* https://www.w3.org/TR/css-flexbox-1/#min-size-auto                                                */
}

.dmx-view-tab .dmx-object-renderer {
  overflow: auto;
  padding: var(--detail-panel-padding-all);
}

.dmx-view-tab .button {
  margin: var(--detail-panel-padding);
}
</style>
