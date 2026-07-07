<template>
  <div class="index">
    <a :href="url">百度</a>
    <h1>{{ text }}</h1>
  </div>
</template>
<script setup lang="ts">
    import {ref} from 'vue'

    defineOptions({
        name:"Index"
    })

    const text = ref("hello")
    const url = ref("https://www.baidu.com")
</script>
