<template>
  <canvas class="cracker-background" v-cracker:[trigger]></canvas>
</template>
<script>
export default {
  props: {
    showCracker: Boolean,
  },
  data() {
    return {
      trigger: false,
    }
  },
  mounted() {
    this.trigger = this.showCracker
  },
  watch: {
    showCracker: function(val, oldVal) {
      this.trigger = val
    }
  },
}
</script>
<style scoped>
.cracker-background {
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
