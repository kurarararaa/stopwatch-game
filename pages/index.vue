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
        <p class="timer" v-show="mode.easy">{{ interval.toFixed(3) }}</p>
        <p class="timer" v-show="!mode.easy && !hard">{{ interval.toFixed(5) }}</p>
      </div>
      <button v-show="!isStart" class="btn" @click="startTimer()">Start</button>
      <button v-show="isStart" id="btn" class="btn" @click="stopTimer()">
        Stop
      </button>
      <button v-show="mode.easy" @click="modeChange()">Normal</button>
      <button v-show="mode.normal" @click="modeChange()">Hard</button>
      <button v-show="mode.hard" @click="modeChange()">Easy</button>
      <button @click="login()">ログイン</button>
    </div>
  </div>
</template>

<script>
import CrackerBackground from '~/components/CrackerBackground.vue'
import sortBy from 'lodash/sortBy'
import firebase from '~/plugins/firebase'
import auth from '~/plugins/auth'
import moment from 'moment'
export default {
  components: {
    CrackerBackground,
  },
  data() {
    return {
      isStart: false, // 実行状態
      start: 0, // スタートの時間を記録
      timer: 0, // setInterval()の格納用
      interval: 0, // タイマー表示用
      diffSecconds: 9999999, // 基準値との差
      score: 0, // 絶対値で取得
      settingSeconds: 1.0, // 設定値
      showCracker: false, // クラッカーの発火条件
      // 難易度設定
      mode: {
        easy: true,
        normal: false,
        hard: false
      },
      dataList: [],
      hard: false
    }
  },
  mounted() {
    auth().then((user) => {
      const isAuth = !!user
    })
  },
  methods: {
    startTimer() {
      if (this.mode.hard) {
        this.hard = true
      }
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
      this.hard = false
      clearInterval(this.timer)
      this.resultScore()
    },
    /**
     * 計測時間でスコアを決める
     */
    resultScore() {
      if (this.mode.easy) {
        this.diffSecconds = (this.interval - this.settingSeconds).toFixed(5)
        this.score = Math.abs(this.diffSecconds)
        if (this.score < 0.1) {
        this.showCracker = true
      }
      }else {
        this.diffSecconds = (this.interval - this.settingSeconds).toFixed(5)
        this.score = Math.abs(this.diffSecconds)
        if (this.score < 0.01) {
        this.showCracker = true
        }
      }

      console.log('スコア:' + this.diffSecconds)
      console.log('絶対値：' + this.score)

      // ローカルストレージ
      const date = moment().format('YYYY/MM/DD');
      this.dataList.push({key:date, time:this.interval.toFixed(5) ,score: this.score})
      localStorage.setItem("dataList", JSON.stringify(sortBy(this.dataList, ['score'])));
      
    },
    /**
     * モードを切り替える
     */
    modeChange() {
      // 切り替えたタイミングで0に戻す？
      this.interval = 0
      if (this.mode.easy) {
        this.mode.easy = false
        this.mode.normal = true
      }else if (this.mode.normal) {
        this.mode.normal = false
        this.mode.hard = true
      }else {
      this.mode.hard = false
      this.mode.easy = true
      }
    },
    login() {
      firebase
      .auth()
      .signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((res) => {
      // 成功
      console.log('ログイン成功', res)
      })
      .catch((error) => {
      // 失敗
      })
  },
  logout() {
    firebase
      .auth()
      .signOut()
      .then((res) => {
      })
  },
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
  background-color: #A9A9A9;
  border: solid 1.5em #000000;
}
.timer {
  font-size: 20px;
  font-family: 'Press Start 2P', cursive;
  margin-top: 35px;
}
.btn {
  margin-top: 250px;
}

.hoge-tarou {
  position: relative;
  /* width: 2492px;
  height: 402px;
  margin: 0 auto; */
  /* background-color: #6362628a; */
  /* border-radius: 12px 12px 12px 12px; */
}

</style>
