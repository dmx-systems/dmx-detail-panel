<template>
  <div class="dm5-info-tab">
    <dm5-object-renderer :object="objectToRender" :writable="writable" :mode="mode"
      :renderers="detailRenderers" :types="types" :quill-config="_quillConfig"
      @inline="setInlineId" @submit="submit" @child-topic-reveal="revealChildTopic">
    </dm5-object-renderer>
    <el-button class="button" v-if="buttonVisibility" :disabled="buttonDisabled" :title="buttonTitle"
      @click="buttonAction">{{buttonLabel}}
    </el-button>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  created () {
    // console.log('dm5-info-tab created')
  },

  destroyed () {
    // console.log('dm5-info-tab destroyed')
  },

  mixins: [
    require('./mixins/object').default,
    require('./mixins/writable').default,
    require('./mixins/mode').default,
    require('./mixins/info-mode').default,
    require('./mixins/detail-renderers').default
  ],

  props: {
    types: Object,              // Optional: "assocTypes" and "roleTypes" (arrays)
    quillConfig: Object
  },

  data () {
    return {
      objectToEdit: undefined,
      inlineId: undefined       // trueish if inline edit is active in this object or in *any* child topic (recursively)
    }
  },

  computed: {

    objectToRender () {
      if (this.infoMode) {
        return this.object
      } else {
        // console.log('Preparing', this.object.id)
        // if (!this.objectToEdit) {      // TODO: needed?
        // console.log('fillChilds')
        this.objectToEdit = this.object.clone().fillChilds()
        // }
        return this.objectToEdit
      }
    },

    buttonLabel () {
      return this.infoMode ? 'Edit' : 'Save'
    },

    buttonVisibility () {
      return this.writable && !this.inlineId
    },

    buttonDisabled () {
      // only identity topics are enabled; assocs and types are always enabled
      return this.object.isTopic() && !this.object.isType() && !this.object.getType().isIdentity()
    },

    buttonTitle () {
      const typeName = this.object.typeName
      return this.buttonDisabled && `A ${typeName} is immutable as "${typeName}" is a value type. ` +
        'Edit the parent context instead.'
    },

    // principle copy in dm5-detail.vue (dm5-topicmap-panel)
    _quillConfig () {
      const _quillConfig = dm5.utils.clone(this.quillConfig)
      _quillConfig.options.bounds = '.dm5-detail-panel'
      return _quillConfig
    }
  },

  methods: {

    buttonAction () {
      if (this.infoMode) {
        this.$emit('edit')
      } else {
        this.submit()
      }
    },

    setInlineId (id) {
      this.inlineId = id
      if (!id) {
        // TODO: introduce edit buffer also for inline editing
        this.$emit('submit-inline', this.object)
      }
    },

    submit () {
      this.$emit('submit', this.objectToEdit)
    },

    revealChildTopic (relTopic) {
      this.$emit('child-topic-reveal', relTopic)
    }
  },

  components: {
    'dm5-object-renderer': require('dm5-object-renderer').default
  }
}
</script>

<style>
.dm5-info-tab .dm5-object-renderer {
  margin-top: 1em;
}

.dm5-info-tab .button {
  margin-top: 1.2em;
}
</style>
