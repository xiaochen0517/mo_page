<template>
  <top-box/>
  <search-box/>
  <Settings/>
</template>

<script>
import Settings from "@/components/Settings";
import SearchBox from "@/components/SearchBox";
import TopBox from "@/components/TopBox";

export default {
  name: 'App',
  components: {
    Settings,
    SearchBox,
    TopBox
  }
}
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
