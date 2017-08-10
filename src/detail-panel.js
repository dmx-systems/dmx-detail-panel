const state = {
  quill: undefined    // The Quill instance deployed in form mode.
                      // FIXME: support more than Quill instance per form.
}

const actions = {

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
