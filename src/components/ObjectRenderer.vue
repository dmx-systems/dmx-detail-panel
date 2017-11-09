<template>
  <div class="object-renderer">
    <!-- simple -->
    <div v-if="isSimple" class="field">
      <div class="field-label">{{label}}</div>
      <component :is="simpleComp" :object="object" :mode="mode"></component>
    </div>
    <!-- composite -->
    <template v-else v-for="assocDef in assocDefs">
      <!-- one -->
      <template v-if="isOne(assocDef)">
        <object-renderer v-if="childs(assocDef)" :object="childs(assocDef)" :mode="mode" :assoc-def="assocDef">
        </object-renderer>
      </template>
      <!-- many -->
      <object-renderer v-else v-for="object in childs(assocDef)" :object="object" :mode="mode" :assoc-def="assocDef"
        :key="object.id">
      </object-renderer>
    </template>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  name: 'object-renderer',

  props: {
    assocDef: dm5.AssocDef    // undefined for simple top-level object renderers
  },

  computed: {

    type () {
      return this.object.getType()
    },

    label () {
      return this.type.value
    },

    isSimple () {
      return this.type.isSimple()
    },

    assocDefs () {
      return this.type.assocDefs
    },

    simpleComp () {
      const widget = this.assocDef && this.assocDef._getViewConfig('dm4.webclient.widget')
      return widget && widget.uri || this.type.dataTypeUri.substr('dm4.core.'.length) + '-field'
    }
  },

  methods: {

    isOne (assocDef) {
      return assocDef.isOne()
    },

    childs (assocDef) {
      return this.object.childs[assocDef.assocDefUri]
    }
  },

  mixins: [
    require('./mixins/object').default,
    require('./mixins/mode').default
  ],

  components: {
    'text-field':    require('./TextField'),
    'number-field':  require('./NumberField'),
    'boolean-field': require('./BooleanField'),
    'html-field':    require('./HtmlField'),
    // widgets
    'dm4.webclient.select_empty': require('./dm4.webclient.select_empty')
  }
}
</script>

<style>
</style>
