<template>
  <div class="object-renderer" @click.stop="edit">
    <!-- simple -->
    <div v-if="isSimple" class="field">
      <div class="field-label">{{label}}</div>
      <component :is="simpleRenderer" :object="object" :mode="localMode" :assoc-def="assocDef"></component>
      <el-button v-if="inlineEdit" @click.stop="submit">OK</el-button>
    </div>
    <!-- composite -->
    <template v-else v-for="assocDef in assocDefs">
      <!-- one -->
      <template v-if="isOne(assocDef)">
        <child-topic v-if="childs(assocDef)" :object="childs(assocDef)" :mode="mode" :assoc-def="assocDef"
          :key="assocDef.assocDefUri">
        </child-topic>
      </template>
      <!-- many -->
      <child-topic v-else v-for="child in childs(assocDef)" :object="child" :mode="mode" :assoc-def="assocDef"
        :key="child.id">
      </child-topic>
    </template>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  props: {
    assocDef: dm5.AssocDef    // undefined for top-level renderers
  },

  computed: {

    type () {
      return this.object.getType()
    },

    label () {
      const customAssocType = this.assocDef && this.assocDef.getCustomAssocType()
      return customAssocType && customAssocType.isSimple() ? customAssocType.value : this.type.value
    },

    isSimple () {
      return this.type.isSimple()
    },

    assocDefs () {
      return this.type.assocDefs
    },

    simpleRenderer () {
      const widget = this.assocDef && this.assocDef._getViewConfig('dm4.webclient.widget')
      return widget && widget.uri || this.type.dataTypeUri.substr('dm4.core.'.length) + '-field'
    },

    inlineEdit () {
      return this.mode !== this.localMode
    }
  },

  methods: {

    // inline editing

    edit () {
      if (this.isSimple) {
        console.log('inline edit', this.object.typeUri, this.object.value)
        this.localMode = 'form'
      } else {
        console.log('non-simple', this.object.typeUri, this.object.value)
      }
    },

    submit () {
      this.$store.dispatch('submit')
      this.localMode = 'info'
    },

    //

    isOne (assocDef) {
      return assocDef.isOne()
    },

    childs (assocDef) {
      return this.object.childs[assocDef.assocDefUri]
    }
  },

  mixins: [
    require('./mixins/object').default,
    require('./mixins/mode').default,
    require('./mixins/localMode').default
  ],

  components: {
    'child-topic':   require('./ChildTopic'),
    // simple default renderers
    'text-field':    require('./TextField'),
    'number-field':  require('./NumberField'),
    'boolean-field': require('./BooleanField'),
    'html-field':    require('./HtmlField'),
    // simple widgets
    'dm4.webclient.select': require('./dm4.webclient.select')
  }
}
</script>

<style>
</style>
