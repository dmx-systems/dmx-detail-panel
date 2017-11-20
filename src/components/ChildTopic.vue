<template>
  <div class="child-topic">
    <!-- Note: object.assoc is undefined when rendering a relating assoc -->
    <object-renderer v-if="object.assoc" :object="object.assoc" :mode="mode" :assoc-def="assocDef">
    </object-renderer>
    <object-renderer :object="object" :mode="mode" :assoc-def="assocDef">
    </object-renderer>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  beforeCreate () {
    // Note: postponed loading resolves cyclic dependency between <object-renderer> and <child-topics>
    this.$options.components.objectRenderer = require('./ObjectRenderer')
  },

  props: {
    assocDef: {
      type: dm5.AssocDef,
      required: true
    }
  },

  mixins: [
    require('./mixins/object').default,   // parent object
    require('./mixins/mode').default
  ]
}
</script>

<style>
</style>
