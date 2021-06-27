<template>
  <div class="container">
    <link
      href="https://unpkg.com/nes.css@latest/css/nes.min.css"
      rel="stylesheet"
    />
    <cracker-background />
    <CrackerBackground :show-cracker="showCracker" />
      <div class="stop-watch">
        <div class="game-boy">
          <div class="game-boy-screen">
            <p v-show="mode.easy" class="timer">{{ interval.toFixed(3) }}</p>
            <p v-show="!mode.easy && !hard" class="timer">
              {{ interval.toFixed(5) }}
            </p>
          </div>
          <button v-show="!isStart" class="btn" @click="startTimer()">Start</button>
          <button v-show="isStart" class="btn" @click="stopTimer()">Stop</button>
          <button v-show="mode.easy" @click="modeChange()">Easy</button>
          <button v-show="mode.normal" @click="modeChange()">Nomal</button>
          <button v-show="mode.hard" @click="modeChange()">Hard</button>
          <button v-show="!isAuth" @click="login()">ログイン</button>
          <button v-show="isAuth" @click="logout()">ログイン済み</button>
        </div>
      </div>
    <div class="ranking-area">
      <div v-show="mode.easy" v-for="(data) in easyTop3" :key="data.insertDate">
        {{ data.time }}<br>
      </div>
      <div v-show="mode.easy" v-for="(data) in worldTop3">
        {{ data }}<br>
      </div>
      <div v-show="mode.normal" v-for="(data) in normalTop3" :key="data.insertDate">
        {{ data.time }}<br>
      </div>
      <div v-show="mode.hard" v-for="(data) in hardTop3" :key="data.insertDate">
        {{ data.time }}<br>
      </div>
    </div>
  </div>
</template>

<script>
import sortBy from 'lodash/sortBy'
import moment from 'moment'
import { mapState, mapActions, mapGetters } from 'vuex'
import CrackerBackground from '~/components/CrackerBackground.vue'
import firebase from '~/plugins/firebase'
import auth from '~/plugins/auth'
export default {
  components: {
    CrackerBackground,
  },
  computed: {
    ...mapState('ranking', ['ranking', 'worldTop3']),
    ...mapGetters('localRanking', ['easyTop3', 'normalTop3', 'hardTop3']),
  },
  data() {
    return {
      isAuth: false, // 認証の有無
      isStart: false, // 実行状態
      start: 0, // スタートの時間を記録
      timer: 0, // setInterval()の格納用
      interval: 0, // タイマー表示用
      score: 0, // 絶対値で取得
      settingSeconds: 1.0, // 設定値
      showCracker: false, // クラッカーの発火条件
      // 難易度設定
      mode: {
        easy: true,
        normal: false,
        hard: false,
      },
      data: 0, // 日付
      hard: false,
      getterList: []
    }
  },
  watch: {
    isAuth(val, oldVal) {
      // 認証がありの場合のみFirestoreのスナップショットを開始する
      if (val) {
        this.onSnapshot()
      } else {
        this.stopSnapshot()
      }
    },
  },
  mounted() {
    auth().then((user) => {
      this.isAuth = !!user
    })
  },
  methods: {
    startTimer() {
      if (this.mode.hard) {
        this.hard = true
      }
      this.showCracker = false
      console.log(this.mode.easy)
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
        this.score = (this.settingSeconds - this.interval).toFixed(5)
        this.score = Math.abs(this.score)
        if (this.score < 0.1) {
          this.showCracker = true
        }
      } else {
        this.score = (this.settingSeconds - this.interval).toFixed(5)
        this.score = Math.abs(this.score)
        if (this.score < 0.01) {
          this.showCracker = true
        }
      }
      console.log('絶対値：' + this.score)

      // ローカルストレージ
      this.date = moment().format('YYYY/MM/DD')
      // 個人ランキングの登録
      this.addLocalRanking({
        playMode: (this.mode.easy) ? 'easy' : (this.mode.normal) ? 'normal' : 'hard',
        insertDate: this.date,
        time: this.interval.toFixed(5),
        score: this.score,
      })
      this.insert({
        // ★登録する内容
        time: this.interval.toFixed(5),
        mode: this.mode.easy ? 'easy' : this.mode.normal ? 'normal' : 'hard',
      })
      .then((docRef) => {
        // 保存成功時
        console.log('DB登録成功')
        console.log(this.ranking[0].time)
      })
      .catch((error) => {
        // 失敗時
      })
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
      } else if (this.mode.normal) {
        this.mode.normal = false
        this.mode.hard = true
      } else {
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
          console.log('ログイン成功', res, this.isAuth)
          this.isAuth = !this.isAuth
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
          console.log('ログアウト成功', this.isAuth)
          this.isAuth = !this.isAuth
        })
    },
    ...mapActions('ranking', [
      'selectAll',
      'insert',
      'onSnapshot',
      'stopSnapshot',
    ]),
    ...mapActions('localRanking', ['addLocalRanking']),
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

.stop-watch {
  position: absolute;
  top: 10px;
  left: 10px;
}

/* ゲームボーイ */
.game-boy {
  position: absolute;
  width: 242px;
  height: 402px;
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
  background-color: #a9a9a9;
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

/* ランキングエリア */
.ranking-area {
  position: absolute;
  width: 242px;
  height: 150px;
  background-color: #e6e6fa;
  border-radius: 12px 12px 12px 12px;
  color: white;
  top: 450px;
  left: 10px;
}
</style>
