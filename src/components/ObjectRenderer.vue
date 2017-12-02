<template>
  <div :class="['object-renderer', localMode]" @click.stop="editInline">
    <!-- simple -->
    <div v-if="isSimple" class="field simple">
      <div class="field-label">{{label}}</div>
      <div class="field-content">
        <component :is="simpleRenderer" :object="object" :mode="localMode" :assoc-def="assocDef"></component>
        <el-button class="save-button" v-if="inlineEdit" @click.stop="submitInline">Save</el-button>
      </div>
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

  mixins: [
    require('./mixins/object').default,
    require('./mixins/mode').default,
    require('./mixins/infoMode').default
  ],

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

    localMode () {
      return this.inlineEdit ? 'form' : this.mode
    },

    inlineEdit () {
      return this.$store.state.detailPanel.inlineCompId === this._uid   // FIXME: _uid is Vue internal
    }
  },

  methods: {

    // inline editing

    editInline () {
      // inline editing can only be started in info mode
      if (this.infoMode) {
        // inline editing is only supported for simple objects
        if (this.isSimple) {
          console.log('inline edit', this.object.typeUri, this.object.value)
          this.$store.dispatch('editInline', this._uid)                 // FIXME: _uid is Vue internal
        } else {
          console.log('non-simple', this.object.typeUri, this.object.value)
        }
      }
    },

    submitInline () {
      this.$store.dispatch('submitInline')
    },

    //

    isOne (assocDef) {
      return assocDef.isOne()
    },

    childs (assocDef) {
      return this.object.childs[assocDef.assocDefUri]
    }
  },

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
.object-renderer.info > .field.simple:hover {
  box-shadow: inset 0px 0px 1px var(--highlight-color);
}

.object-renderer .field .field-content {
  display: flex;
  align-items: center;
}

.object-renderer .field .field-content .save-button {
  margin-left: 1em;
}
</style>
