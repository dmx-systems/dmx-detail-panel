<template>
  <div class="dm5-info-tab">
    <h3>{{object.value}}</h3>
    <dm5-object-renderer :object="objectToRender" :mode="mode" :renderers="objectRenderers"></dm5-object-renderer>
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

  mixins: [
    require('./mixins/mode').default
  ],

  data () {
    return {
      objectToEdit: undefined
    }
  },

  computed: {

    object () {
      return this.context.object
    },

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

    writable () {
      return this.context.writable
    },

    inlineEdit () {
      return false  // this.context.inlineCompId ### TODO
    },

    buttonLabel () {
      return this.infoMode ? 'Edit' : 'Save'
    },

    buttonVisibility () {
      return this.writable && !this.inlineEdit
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
