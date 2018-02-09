<template>
  <div class="dm5-tab-info">
    <h3>{{object.value}}</h3>
    <dm5-assoc v-if="isAssoc" :assoc="object"></dm5-assoc>
    <dm5-object-renderer v-else :object="objectToRender" :mode="mode" :renderers="objectRenderers">
    </dm5-object-renderer>
    <el-button class="button" v-if="buttonVisibility" @click="buttonAction">{{buttonLabel}}</el-button>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  created () {
    console.log('dm5-tab-info created')
  },

  destroyed () {
    console.log('dm5-tab-info destroyed')
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
      return this.context.inlineCompId
    },

    isAssoc () {
      return this.object.isAssoc()
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
    'dm5-object-renderer': require('dm5-object-renderer'),
    'dm5-assoc': require('./dm5-assoc')
  }
}
</script>

<style>
.dm5-tab-info .button {
  margin-top: 1.2em;
}
</style>
