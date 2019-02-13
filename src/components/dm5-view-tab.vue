<template>
  <div class="dm5-view-tab">
    <dm5-object-renderer :object="objectToRender" :writable="writable" :mode="mode" :renderers="detailRenderers"
      @inline="setInlineId" @submit="submit" @child-topic-reveal="revealChildTopic">
    </dm5-object-renderer>
    <el-button class="button" v-if="buttonVisibility" @click="buttonAction">{{buttonLabel}}</el-button>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  created () {
    // console.log('dm5-view-tab created', this.viewConfigTopic)
  },

  destroyed () {
    // console.log('dm5-view-tab destroyed')
  },

  mixins: [
    require('./mixins/writable').default,
    require('./mixins/info-mode').default,
    require('./mixins/detail-renderers').default
  ],

  props: {
    viewConfigTopic: {          // The view config topic to display
      type: dm5.Topic,
      required: true
    }
  },

  data () {
    return {
      objectToEdit: undefined,
      inlineId: undefined,      // trueish if inline edit is active in this object or in *any* child topic (recursively)
      mode: 'info'
    }
  },

  computed: {

    objectToRender () {
      if (this.infoMode) {
        return this.viewConfigTopic
      } else {
        // console.log('Preparing', this.object.id)
        // if (!this.objectToEdit) {      // TODO: needed?
        // console.log('fillChilds')
        this.objectToEdit = this.viewConfigTopic.clone().fillChilds()
        // }
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
    'dm5-object-renderer': require('dm5-object-renderer').default
  }
}
</script>

<style>
.dm5-view-tab .button {
  margin-top: var(--field-spacing);
}
</style>
