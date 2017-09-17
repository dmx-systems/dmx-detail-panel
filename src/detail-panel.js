import dm5 from 'dm5'

const state = {

  object: undefined,    // the Topic/Assoc to display; if undefined the detail panel is empty

  mode: undefined,      // 'info' or 'form'

  quill: undefined      // The Quill instance deployed in form mode.
                        // FIXME: support more than Quill instance per form.
}

const actions = {

  displayTopic (_, topic) {
    state.object = topic
    state.mode = 'info'
  },

  displayAssoc (_, assoc) {
    state.object = assoc
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
    state.mode = 'info'
    state.object.update().then(object => {
      dispatch('_processDirectives', object.directives)
    })
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

  // WebSocket message processing

  _processDirectives ({dispatch}, directives) {
    console.log(`DetailPanel: processing ${directives.length} directives`)
    directives.forEach(dir => {
      switch (dir.type) {
      case "UPDATE_TOPIC":
        setObjectIf(new dm5.Topic(dir.arg))
        break
      case "DELETE_TOPIC":
        dispatch('unselectIf', dir.arg.id)
        break
      case "UPDATE_ASSOCIATION":
        setObjectIf(new dm5.Assoc(dir.arg))
        break
      case "DELETE_ASSOCIATION":
        dispatch('unselectIf', dir.arg.id)
        break
      case "UPDATE_TOPIC_TYPE":
        // TODO
        console.warn('Directive UPDATE_TOPIC_TYPE not yet implemented')
        break
      case "DELETE_TOPIC_TYPE":
        // TODO
        console.warn('Directive DELETE_TOPIC_TYPE not yet implemented')
        break
      case "UPDATE_ASSOCIATION_TYPE":
        // TODO
        console.warn('Directive UPDATE_ASSOCIATION_TYPE not yet implemented')
        break
      case "DELETE_ASSOCIATION_TYPE":
        // TODO
        console.warn('Directive DELETE_ASSOCIATION_TYPE not yet implemented')
        break
      default:
        throw Error(`"${dir.type}" is an unsupported directive`)
      }
    })
  }
}

export default {
  state,
  actions
}

// ---

function setObjectIf (object) {
  if (isSelected(object.id)) {
    state.object = object
  }
}

function isSelected (id) {
  return state.object && state.object.id === id
}
