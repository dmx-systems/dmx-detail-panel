<template>
  <div class="dm5-topic">
    <div class="label">{{topic.typeName}}</div>
    <div class="topic">
      <div class="icon">{{topic.getIcon()}}</div>
      <div>
        {{topic.value}}
        <div class="label">{{assoc}}</div>
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
}

.dm5-topic .icon {
  font-family: FontAwesome;
  color: var(--color-topic-icon);
  margin-right: 0.5em;
}

.dm5-topic .label {
  font-size: var(--label-font-size);
  color: var(--label-color);
}
</style>
