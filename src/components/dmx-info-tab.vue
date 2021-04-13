<template>
  <div class="dmx-info-tab">
    <dmx-object-renderer :object="objectToRender" :writable="writable" :mode="mode"
      :renderers="detailRenderers" :types="types" :quill-config="_quillConfig"
      @inline="setInlineId" @submit="submit" @child-topic-reveal="revealChildTopic">
    </dmx-object-renderer>
    <div class="button-panel" v-if="showButtons">
      <el-button v-if="showButton" :disabled="buttonDisabled" :title="buttonTitle" @click="buttonHandler">
        {{buttonLabel}}
      </el-button>
      <template v-if="infoMode">
        <el-button v-for="button in _extraButtons" :key="button.label" @click="button.handler">
          {{button.label}}
        </el-button>
      </template>
    </div>
  </div>
</template>

<script>
import dmx from 'dmx-api'

export default {

  mixins: [
    require('./mixins/object').default,
    require('./mixins/writable').default,
    require('./mixins/mode').default,
    require('./mixins/info-mode').default,
    require('./mixins/detail-renderers').default,
    require('./mixins/extra-buttons').default
  ],

  props: {
    types: Object,              // Optional: "assocTypes" and "roleTypes" (arrays)
    quillConfig: Object
  },

  data () {
    return {
      objectToEdit: undefined,      // the edit buffer
      objectToCompare: undefined,   // used for dirty check
      inlineId: undefined   // trueish if inline edit is active in this object or in *any* child topic (recursively)
    }
  },

  computed: {

    type () {
      return this.object.type
    },

    objectToRender () {
      if (this.infoMode) {
        this.objectToEdit = undefined     // reset dirty state, see isDirty()
        return this.object
      } else {
        this.objectToCompare = this.type.newFormModel(this.object.clone())
        this.objectToEdit = this.objectToCompare.clone()
        return this.objectToEdit
      }
    },

    buttonLabel () {
      return this.infoMode ? 'Edit' : 'Save'
    },

    showButtons () {
      return this.writable && !this.inlineId
    },

    showButton () {
      return !this.type.isNoneditable
    },

    buttonDisabled () {
      return !this.object.isEditable
    },

    buttonTitle () {
      const typeName = this.object.typeName
      return this.buttonDisabled && `A ${typeName} is immutable as "${typeName}" is a value type. ` +
        'Edit the parent context instead.'
    },

    _extraButtons () {
      return this.extraButtons[this.object.typeUri]
    },

    // principle copy in dmx-detail.vue (dmx-topicmap-panel)
    _quillConfig () {
      const _quillConfig = dmx.utils.clone(this.quillConfig)
      _quillConfig.options.bounds = '.dmx-detail-panel'
      return _quillConfig
    }
  },

  methods: {

    buttonHandler () {
      if (this.infoMode) {
        this.$emit('edit')
      } else {
        this.submit()
      }
    },

    setInlineId (id) {
      this.inlineId = id
      if (!id) {
        // TODO: introduce edit buffer also for inline editing?
        this.$emit('submit-inline', this.object)
      }
    },

    submit () {
      this.$emit('submit', this.objectToEdit)
    },

    submitInline () {
      this.$emit('submit-inline', this.objectToEdit)
    },

    revealChildTopic (relTopic) {
      this.$emit('child-topic-reveal', relTopic)
    },

    // Public API

    isDirty () {
      return this.objectToEdit && !this.objectToEdit.equals(this.objectToCompare)
    }
  },

  components: {
    'dmx-object-renderer': require('dmx-object-renderer').default
  }
}
</script>

<style>
.dmx-info-tab {
  display: flex;
  flex-direction: column;
  min-height: 0; /* Needed for children of a column-oriented flex container. Otherwise dmx-info-tab exceeds viewport. */
                 /* http://stackoverflow.com/questions/26895349/how-can-i-get-ff-33-x-flexbox-behavior-in-ff-34-x     */
                 /* https://www.w3.org/TR/css-flexbox-1/#min-size-auto                                                */
}

.dmx-info-tab .dmx-object-renderer {
  padding: 29px 18px 12px 12px;
  overflow: auto;
}

.dmx-info-tab .button-panel {
  padding: var(--detail-panel-padding);
}
</style>
