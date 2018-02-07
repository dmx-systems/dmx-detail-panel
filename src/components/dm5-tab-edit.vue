<template>
  <div class="dm5-tab-edit">
    <h3>{{object.value}}</h3>
    <dm5-assoc v-if="isAssoc" :assoc="object"></dm5-assoc>
    <dm5-object-renderer v-else :mode="mode"></dm5-object-renderer>
    <el-button class="button" v-if="buttonVisibility" @click="buttonAction">{{buttonLabel}}</el-button>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  mixins: [
    require('./mixins/mode').default
  ],

  computed: {

    object () {
      return this.context.object
    },

    writable () {
      return this.context.writable
    },

    inlineEdit () {
      return this.context.inlineCompId
    },

    isAssoc () {
      return this.object instanceof dm5.Assoc
    },

    buttonLabel () {
      return this.infoMode ? 'Edit' : 'Save'
    },

    buttonVisibility () {
      return this.writable && !this.inlineEdit
    }
  },

  methods: {
    // TODO: component reusability => emit events instead of dispatching actions
    buttonAction () {
      const action = this.infoMode ? 'edit' : 'submit'
      this.$store.dispatch(action)
    }
  },

  components: {
    'dm5-object-renderer': require('dm5-object-renderer'),
    'dm5-assoc': require('./dm5-assoc')
  }
}
</script>

<style>
.dm5-tab-edit .button {
  margin-top: 1.2em;
}
</style>
