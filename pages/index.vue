<template>
  <div class="container">
    <div>
      <Logo />
      <h1 class="title">
      </h1>
      <div>
        <p>{{interval.toFixed(3)}}</p> <!-- 小数3桁まで表示 -->
        <button @click="startTimer()" v-show="!isStart">Start</button>
        <button @click="stopTimer()" v-show="isStart">Stop</button>
      </div>
      <div class="links">
        <a
          href="https://nuxtjs.org/"
          target="_blank"
          rel="noopener noreferrer"
          class="button--green"
        >
          Documentation
        </a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          rel="noopener noreferrer"
          class="button--grey"
        >
          GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Timer from '~/components/Timer.vue'
export default {
  components: {
    Timer
  },
  data(){
    return {
      isStart : false, // 実行状態
      start : 0, // startを押した時刻
      timer : 0, // setInterval()の格納用
      interval : 0, // 計測用
      diffSecconds : 9999999, // 基準値との差
      score : 0, // 絶対値で取得
      settingSeconds: 1.000, // 設定値
    }
  },
  methods:{
    conponentTest() {
      this.$refs.child.childEvent()
    },
    startTimer(){
      console.log(this.timer);
      this.isStart = true;
      this.start = Date.now();
      this.timer = setInterval(()=>{ this.interval =(Date.now() - this.start) * 0.001;}, 1); // 10msごとに現在時刻とstartを押した時刻の差を足す
    },
    stopTimer(){
      this.isStart = false;
      clearInterval(this.timer);
      console.log('interval:' + this.interval.toFixed(3));
      console.log('timer:' + this.timer.toFixed(3)); 
      this.resultScore();
    },
    /**
     * 計測時間でスコアを決める
     */
    resultScore() {
      this.diffSecconds = (this.interval - this.settingSeconds).toFixed(3);
      this.score = Math.abs(this.diffSecconds);

      console.log('スコア:' + this.diffSecconds);
      console.log('絶対値：' + this.score);
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

p {
  font-size: 20px;
  font-family: 'Press Start 2P', cursive;
}
</style>
