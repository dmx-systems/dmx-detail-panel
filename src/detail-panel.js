const state = {

  object: undefined,    // the displayed Topic/Assoc; if undefined nothing is displayed

  mode: undefined,      // 'info' or 'form'

  quill: undefined      // The Quill instance deployed in form mode.
                        // FIXME: support more than Quill instance per form.
}

const actions = {

  displayObject (_, object) {
    state.object = object
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

  submit ({dispatch}) {
    state.object.update().then(object => {
      dispatch('_processDirectives', object.directives)   // TODO: move to webclient.js?
    })
    state.mode = 'info'
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
