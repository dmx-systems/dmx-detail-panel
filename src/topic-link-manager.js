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
const Link = Quill.import('formats/link')

class TopicLink extends Link {

  static create (value) {
    const node = super.create()
    // console.log('TopicLink create()', value)
    node.removeAttribute('target')    // target attribute was added by Link class
    node.setAttribute('href', '#')    // href attribute required to render in link style
    node.dataset.topicId = value.topicId
    node.dataset.linkId  = value.linkId
    return node
  }

  static formats (node) {
    // console.log('TopicLink formats()', node)
    return {
      topicId: node.dataset.topicId,  // FIXME: convert to Number?
      linkId:  node.dataset.linkId    // FIXME: convert to Number?
    }
  }
}

TopicLink.blotName = 'topic-link'
TopicLink.tagName = 'A'
TopicLink.className = 'topic-link'

Quill.register(TopicLink)
