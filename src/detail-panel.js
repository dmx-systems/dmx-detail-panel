const state = {

  object: undefined,        // The displayed Topic/Assoc/TopicType/AssocType.
                            // If undefined nothing is displayed.

  writable: undefined,      // True if the current user has WRITE permission for the displayed object.

  mode: undefined,          // 'info' or 'form'

  inlineCompId: undefined,  // ID of the dm5-object component that is in inline edit mode

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
    _initWritable()
    state.mode = 'info'
    state.inlineCompId = undefined    // Note: inline state is still set when inline editing was left without saving
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
    state.mode = 'info'
  },

  editInline (_, compId) {
    state.inlineCompId = compId
  },

  submitInline ({dispatch}) {
    dispatch('_updateObject')
    state.inlineCompId = undefined
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
  },

  //

  loggedIn () {
    initWritable()
  },

  loggedOut () {
    initWritable()
  }
}

function initWritable() {
   state.object && _initWritable()
 }

function _initWritable() {
  state.object.isWritable().then(writable => {
    state.writable = writable
  })
}

export default {
  state,
  actions
}
