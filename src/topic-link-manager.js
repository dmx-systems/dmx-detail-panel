class TopicLinkManager {

  constructor (quill) {
    this.quill = quill
    quill.getModule('toolbar').addHandler('topic-link', this.topicLinkHandler)
  }

  topicLinkHandler (value) {
    // console.log('topicLinkHandler', value, this.quill, this.quill.getModule('toolbar'))
    // this.$store.dispatch('openSearchWidget')
    this.quill.format('topic-link', {
      topicId: 1234,
      linkId: 2456
    })
  }
}

export default TopicLinkManager

// Define 'topic-link' format

import Quill from 'quill'
const Inline = Quill.import('blots/inline')

class TopicLink extends Inline {

  static create (value) {
    // console.log('TopicLink create()', value)
    const node = super.create()
    node.setAttribute('data-topic-id', value.topicId)
    node.setAttribute('data-link-id', value.linkId)
    return node
  }

  static formats (node) {
    // console.log('TopicLink formats()', node)
    return {
      topicId: node.getAttribute('data-topic-id'),    // FIXME: convert to Number?
      linkId:  node.getAttribute('data-link-id')      // FIXME: convert to Number?
    }
  }
}

TopicLink.blotName = "topic-link"
TopicLink.tagName = 'A'

Quill.register(TopicLink)
