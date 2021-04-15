<template>
  <div class="container">
    <link
      href="https://unpkg.com/nes.css@latest/css/nes.min.css"
      rel="stylesheet"
    />
    <cracker-background />
    <CrackerBackground :show-cracker="showCracker" />
    <div class="game-boy">
      <div class="game-boy-screen">
        <p class="timer">{{ interval.toFixed(5) }}</p>
      </div>
      <button v-show="!isStart" class="btn" @click="startTimer()">Start</button>
      <button v-show="isStart" id="testBtn" class="btn" @click="stopTimer()">
        Stop
      </button>
    </div>
  </div>
</template>

<script>
import CrackerBackground from '~/components/CrackerBackground.vue'
export default {
  components: {
    CrackerBackground,
  },
  data() {
    str: String
    return {
      isStart: false, // 実行状態
      start: 0, // スタートの時間を記録
      timer: 0, // setInterval()の格納用
      interval: 0, // タイマー表示用
      diffSecconds: 9999999, // 基準値との差
      score: 0, // 絶対値で取得
      settingSeconds: 1.0, // 設定値
      showCracker: false, // クラッカーの発火条件
    }
  },
  methods: {
    startTimer() {
      this.showCracker = false
      console.log(this.timer)
      this.isStart = true
      this.start = performance.now()
      this.timer = setInterval(() => {
        this.interval = (performance.now() - this.start) * 0.001
      }, 1)
    },
    stopTimer() {
      this.isStart = false
      clearInterval(this.timer)
      console.log('interval:' + this.interval.toFixed(5))
      console.log('timer:' + this.timer.toFixed(5))
      this.resultScore()
    },
    /**
     * 計測時間でスコアを決める
     */
    resultScore() {
      this.diffSecconds = (this.interval - this.settingSeconds).toFixed(3)
      this.score = Math.abs(this.diffSecconds)

      console.log('スコア:' + this.diffSecconds)
      console.log('絶対値：' + this.score)
      if (this.score < 0.1) {
        this.showCracker = true
      }
    },
  },
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
html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
}

</style>
