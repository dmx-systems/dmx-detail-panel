const state = {

  object: undefined,        // The displayed Topic/Assoc/TopicType/AssocType.
                            // If undefined nothing is displayed.

  mode: undefined,          // 'info' or 'form'

  inlineCompId: undefined,  // ID of the renderer component that is in inline edit mode

  objectRenderers: {},      // Registered page renderers:
                            //   {
                            //     typeUri: component
                            //   }

  quill: undefined          // The Quill instance deployed in form mode.
                            // FIXME: support more than one Quill instance per form.
}

const actions = {

  displayObject (_, object) {
    // console.log('displayObject')
    state.object = object.isType() ? object.asType() : object
    state.mode = 'info'
    // Note: inline state is still set when inline editing was left without saving
    state.inlineCompId = undefined
  },

  emptyDisplay () {
    // console.log('emptyDisplay')
    state.object = undefined
  },

  edit () {
    state.object.fillChilds()
    state.mode = 'form'
    console.log('edit', state.object)
  },

  // TODO: move to webclient.js?
  submit ({dispatch}) {
    dispatch('_updateObject')
    // Note: updating causes a displayObject() call. Info mode is set there.
    // state.mode = 'info'
  },

  editInline (_, compId) {
    state.inlineCompId = compId
  },

  // TODO: drop it? Call submit() instead?
  submitInline ({dispatch}) {
    dispatch('_updateObject')
    // Note: updating causes a displayObject() call. Inline state is cleared there.
    // state.inlineCompId = undefined
  },

  registerObjectRenderer (_, {typeUri, component}) {
    state.objectRenderers[typeUri] = component
  },

  setQuill (_, quill) {
    state.quill = quill
  },

  createTopicLink (_, topic) {
    console.log('createTopicLink', topic)
    state.quill.format('topic-link', {
      topicId: topic.id,
      linkId: undefined   // TODO
    })
  },

  _updateObject ({dispatch}) {
    state.object.update().then(object => {
      dispatch('_processDirectives', object.directives)
    })
  }
}

export default {
  state,
  actions
}
