<template>
  <div :class="['object-renderer', localMode]" @click.stop="editInline">
    <!-- simple -->
    <div v-if="isSimple" class="field simple">
      <div class="field-label">{{simpleLabel}}</div>
      <div class="field-content">
        <component :is="simpleRenderer" :object="object" :mode="localMode" :assoc-def="assocDef"></component>
        <el-button class="save-button" v-if="inlineEdit" @click.stop="submitInline">Save</el-button>
      </div>
    </div>
    <!-- composite -->
    <template v-else v-for="assocDef in assocDefs">
      <!-- one -->
      <template v-if="isOne(assocDef)">
        <child-topic v-if="childs(assocDef)" :object="childs(assocDef)" :mode="mode" :level="level+1"
          :assoc-def="assocDef" :key="assocDef.assocDefUri">
        </child-topic>
      </template>
      <!-- many -->
      <template v-else>
        <child-topic v-for="child in childs(assocDef)" :object="child" :mode="mode" :level="level+1"
          :assoc-def="assocDef" :key="child.id">
        </child-topic>
        <el-button v-if="formMode" class="add-button" icon="el-icon-plus" :title="addButtonTitle(assocDef)"
          @click="addChild(assocDef)">
        </el-button>
      </template>
    </template>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  mixins: [
    require('./mixins/object').default,
    require('./mixins/mode').default,
    require('./mixins/level').default,
    require('./mixins/infoMode').default
  ],

  props: {
    assocDef: dm5.AssocDef    // undefined for top-level renderers
  },

  computed: {

    type () {
      return this.object.getType()
    },

    isSimple () {
      return this.type.isSimple()
    },

    simpleLabel () {
      const customAssocType = this.assocDef && this.assocDef.getCustomAssocType()
      return customAssocType && customAssocType.isSimple() ? customAssocType.value : this.type.value
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
    },

    assocDefs () {
      return this.type.assocDefs
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

    // add value

    addButtonTitle (assocDef) {
      const type = assocDef.getCustomAssocType()
      return `Enter another ${type ? type.value : assocDef.getChildType().value}`
    },

    addChild (assocDef) {
      this.childs(assocDef).push(assocDef.emptyChildInstance())
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
  background-color: white;
}

.object-renderer .field .field-content {
  display: flex;
  align-items: center;
}

.object-renderer .field .field-content .save-button {
  margin-left: 1em;
}

.object-renderer .add-button {
  font-size: var(--label-font-size) !important;
  padding: 3px;
  position: absolute;
  right: 0;
}
</style>
