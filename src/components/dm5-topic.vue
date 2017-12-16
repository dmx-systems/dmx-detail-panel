<template>
  <div class="dm5-topic">
    <div class="label type">{{topic.typeName}}</div>
    <div class="topic">
      <div class="icon">{{topic.getIcon()}}</div>
      <div>
        <div class="value">{{topic.value}}</div>
        <div class="label assoc">{{assoc}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import dm5 from 'dm5'

export default {

  props: {
    topic: {
      type: dm5.Topic,
      required: true
    }
  },

  computed: {
    assoc () {
      const _value = this.topic.assoc.value
      const value = _value && `: ${_value}`
      return `${this.topic.assoc.typeName}${value}`
    }
  }
}
</script>

<style>
.dm5-topic .topic {
  display: flex;
  align-items: baseline;
}

.dm5-topic .icon {
  font-family: FontAwesome;
  color: var(--color-topic-icon);
  margin-right: 6px;
}

.dm5-topic .value {
  line-height: var(--line-height);
}

.dm5-topic .type {
  margin-bottom: 8px;
}

.dm5-topic .assoc {
  margin-top: 8px;
}
</style>
