<template>
  <div class="dm5-info-tab">
    <h3>{{object.value}}</h3>
    <dm5-object-renderer :object="objectToRender" :writable="writable" :mode="mode" :renderers="objectRenderers"
      @inline="inline">
    </dm5-object-renderer>
    <el-button class="button" v-if="buttonVisibility" @click="buttonAction">{{buttonLabel}}</el-button>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  created () {
    console.log('dm5-info-tab created')
  },

  destroyed () {
    console.log('dm5-info-tab destroyed')
  },

  inject: ['context'],

  props: {
    // The topic/assoc to display.
    // May be an "empty" object, without ID, with just type set.
    object: {
      type: dm5.DeepaMehtaObject,
      required: true
    }
  },

  mixins: [
    require('./mixins/writable').default,
    require('./mixins/mode').default,
    require('./mixins/info-mode').default
  ],

  data () {
    return {
      objectToEdit: undefined,
      inlineId: undefined
    }
  },

  computed: {

    objectToRender () {
      if (this.infoMode) {
        return this.object
      } else {
        console.log('Preparing', this.object.id)
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

    objectRenderers () {
      return this.context.objectRenderers
    }
  },

  methods: {

    // TODO: component reusability => emit events instead of dispatching actions
    buttonAction () {
      if (this.infoMode) {
        this.$store.dispatch('edit')
      } else {
        this.$store.dispatch('submit', this.objectToEdit)
      }
    },

    inline (id) {
      this.inlineId = id
    }
  },

  components: {
    'dm5-object-renderer': require('dm5-object-renderer')
  }
}
</script>

<style>
.dm5-info-tab .button {
  margin-top: 1.2em;
}
</style>
