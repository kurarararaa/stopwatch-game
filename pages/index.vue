<template>
  <div class="container">
    <link href="https://unpkg.com/nes.css@latest/css/nes.min.css" rel="stylesheet" />
    <cracker-background />
    <CrackerBackground :showCracker="showCracker" />
    <div>
      <Logo />
      <h1 class="title">
      </h1>
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
    <div class="game-boy">
      <div class = "game-boy-screen">
        <p class="timer">{{interval.toFixed(3)}}</p>
      </div>
      <button class="btn" @click="startTimer()" v-show="!isStart">Start</button>
      <button class="btn" id="testBtn" @click="stopTimer()" v-show="isStart">Stop</button>
    </div>
  </div>
</template>

<script>
import CrackerBackground from '~/components/CrackerBackground.vue'
export default {
  components: {
    CrackerBackground,
  },
  data(){
    str: String
    return {
      isStart : false, // 実行状態
      start : 0, // startを押した時刻
      timer : 0, // setInterval()の格納用
      interval : 0, // 計測用
      diffSecconds : 9999999, // 基準値との差
      score : 0, // 絶対値で取得
      settingSeconds: 1.000, // 設定値
      showCracker: false
    }
  },
  methods:{
    startTimer(){
      this.showCracker = false
      console.log(this.timer);
      this.isStart = true;
      this.start = Date.now();
      // 10msごとに現在時刻とstartを押した時刻の差を足す
      this.timer = setInterval(()=>{ this.interval =(Date.now() - this.start) * 0.001;}, 10);
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
      if (this.score < 0.100) {
        this.showCracker = true
      }
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

body {
  margin: 0;
  /* 花火 */
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: black;
}
canvas {
  display: flex;
}

/* ゲームボーイ */
.game-boy {
	position: relative;
	width: 242px;
	height: 402px;
	margin: 0 auto;
	background-color: #6362628a;
  border-radius: 12px 12px 12px 12px;
}
.game-boy-screen {
	position: absolute;
	top: 34px;
	left: 16px;
	width: 206px;
	height: 155px;
	border-radius: 11px 11px 11px 11px;
  background-color: #507947;
}
.timer {
  font-size: 20px;
  font-family: 'Press Start 2P', cursive;
  margin-top: 50px;
}
.btn {
  margin-top: 200px;
}
html, body {
  padding: 0;
  margin: 0;
  height: 100%;
  background: black;
}

canvas {
  display: block;
}
</style>
