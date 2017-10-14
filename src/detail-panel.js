const state = {

  object: undefined,    // The displayed Topic/Assoc/TopicType/AssocType.
                        // If undefined nothing is displayed.

  mode: undefined,      // 'info' or 'form'

  objectRenderers: {},  // Registered page renderers:
                        //   {
                        //     typeUri: component
                        //   }

  quill: undefined      // The Quill instance deployed in form mode.
                        // FIXME: support more than one Quill instance per form.
}

const actions = {

  displayObject (_, object) {
    state.object = object.isType() ? object.asType() : object
    state.mode = 'info'
  },

  emptyDisplay () {
    console.log('emptyDisplay')
    state.object = undefined
  },

  edit () {
    state.object.fillChilds()
    state.mode = 'form'
  },

  // TODO: move to webclient.js
  submit ({dispatch}) {
    state.object.update().then(object => {
      dispatch('_processDirectives', object.directives)
    })
    state.mode = 'info'
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
  }
}

export default {
  state,
  actions
}
