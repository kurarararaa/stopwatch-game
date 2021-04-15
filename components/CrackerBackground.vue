<template>
  <canvas v-cracker:[trigger] class="cracker-background"></canvas>
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
  watch: {
    showCracker(val, oldVal) {
      this.trigger = val
    },
  },
  mounted() {
    this.trigger = this.showCracker
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
  background-color: #050a19;
}
</style>
