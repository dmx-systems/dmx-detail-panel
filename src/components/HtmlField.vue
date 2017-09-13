<template>
  <div v-if="infoMode" class="html-field" v-html="value" ref="html"></div>
  <div v-else>
    <!-- Without this wrapper <div> the Quill toolbar remains visible when switching to info mode.           -->
    <!-- This is because the Quill toolbar element becomes a *sibling* (not a child) of the <quill> element. -->
    <quill :value="value" :options="quillOptions" @quillReady="quillReady" @input="updateValue"></quill>
  </div>
</template>

<script>
import TopicLinkManager from '../topic-link-manager'

export default {

  props: ['value', 'mode'],

  data () {
    return {
      quillOptions: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'code'],
            ['blockquote', 'code-block'],
            [{'list': 'ordered'}, {'list': 'bullet'}],
            [{'header': [1, 2, 3, false]}],
            ['topic-link', 'link', 'image', 'video']    // TODO: let TopicLinkManager add topic-link button dynamically?
          ]
        },
        theme: 'snow'
      }
    }
  },

  created () {
    // console.log('HTMLField created()', this.mode)
  },

  mounted () {
    // console.log('HTMLField mounted()', this.mode, this.$refs.html)
    // Note: if a topic is edited for the first time the HtmlField component is mounted in "form" mode
    this.addLinkHandlers()
  },

  updated () {
    // console.log('HTMLField updated()', this.mode)
    this.addLinkHandlers()
  },

  methods: {

    quillReady (quill) {
      new TopicLinkManager(quill, this.$store.dispatch)
    },

    updateValue (html) {
      this.$emit("input", html)
    },

    addLinkHandlers () {
      if (this.infoMode) {
        TopicLinkManager.addLinkHandlers(this.$refs.html, topicId => {
          this.$store.dispatch('revealTopicById', topicId)
        })
      }
    }
  },

  mixins: [
    require('./mixins/infoMode').default
  ],

  components: {
    'quill': require('vue-quill-minimum')
  }
}
</script>

<style>
.html-field {
  line-height: var(--line-height);
}

.html-field p {
  margin: 0;
}

.html-field p + p {
  margin-top: var(--paragraph-spacing);
}

.ql-container {
  font-family: var(--main-font-family);
  font-size:   var(--main-font-size);
}

.ql-editor {
  line-height: var(--line-height);
  padding-left: 8px !important;
  padding-right: 8px !important;
  background-color: white;
}

.ql-editor p + p {
  margin-top: var(--paragraph-spacing);
}

.ql-toolbar.ql-snow {
  padding: 4px 0 !important;
}

.ql-snow.ql-toolbar button:hover,
.ql-snow .ql-toolbar button:hover,
.ql-snow.ql-toolbar button.ql-active,
.ql-snow .ql-toolbar button.ql-active,
.ql-snow.ql-toolbar .ql-picker-label:hover,
.ql-snow .ql-toolbar .ql-picker-label:hover,
.ql-snow.ql-toolbar .ql-picker-label.ql-active,
.ql-snow .ql-toolbar .ql-picker-label.ql-active,
.ql-snow.ql-toolbar .ql-picker-item:hover,
.ql-snow .ql-toolbar .ql-picker-item:hover,
.ql-snow.ql-toolbar .ql-picker-item.ql-selected,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected {
  color: var(--highlight-color);
}

.ql-snow.ql-toolbar button:hover .ql-fill,
.ql-snow .ql-toolbar button:hover .ql-fill,
.ql-snow.ql-toolbar button.ql-active .ql-fill,
.ql-snow .ql-toolbar button.ql-active .ql-fill,
.ql-snow.ql-toolbar .ql-picker-label:hover .ql-fill,
.ql-snow .ql-toolbar .ql-picker-label:hover .ql-fill,
.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-fill,
.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-fill,
.ql-snow.ql-toolbar .ql-picker-item:hover .ql-fill,
.ql-snow .ql-toolbar .ql-picker-item:hover .ql-fill,
.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-fill,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-fill,
.ql-snow.ql-toolbar button:hover .ql-stroke.ql-fill,
.ql-snow .ql-toolbar button:hover .ql-stroke.ql-fill,
.ql-snow.ql-toolbar button.ql-active .ql-stroke.ql-fill,
.ql-snow .ql-toolbar button.ql-active .ql-stroke.ql-fill,
.ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
.ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke.ql-fill,
.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke.ql-fill,
.ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
.ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke.ql-fill,
.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke.ql-fill {
  fill: var(--highlight-color);
}

.ql-snow.ql-toolbar button:hover .ql-stroke,
.ql-snow .ql-toolbar button:hover .ql-stroke,
.ql-snow.ql-toolbar button.ql-active .ql-stroke,
.ql-snow .ql-toolbar button.ql-active .ql-stroke,
.ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,
.ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke,
.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke,
.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke,
.ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke,
.ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke,
.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke,
.ql-snow.ql-toolbar button:hover .ql-stroke-miter,
.ql-snow .ql-toolbar button:hover .ql-stroke-miter,
.ql-snow.ql-toolbar button.ql-active .ql-stroke-miter,
.ql-snow .ql-toolbar button.ql-active .ql-stroke-miter,
.ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
.ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke-miter,
.ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
.ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter,
.ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
.ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke-miter,
.ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter,
.ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter {
  stroke: var(--highlight-color);
}
</style>
