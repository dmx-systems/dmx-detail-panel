<template>
  <div class="dm5-topic">
    <div class="icon" style="font-family: FontAwesome;">{{topic.getIcon()}}</div>
    <div>{{topic.value}}</div>
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
  }
}
</script>

<style>
.dm5-topic {
  display: flex;
}

.dm5-topic .icon {
  color: var(--color-topic-icon);
  margin-right: 0.5em;
}
</style>
