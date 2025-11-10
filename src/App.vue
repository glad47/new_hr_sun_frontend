<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
    <theme-picker />
  </div>
</template>

<script>
import ThemePicker from "@/components/ThemePicker"

export default {
  name: "App",
  components: { ThemePicker }
}
</script>
<style scoped>
#app .theme-picker {
  display: none;
}
</style>
