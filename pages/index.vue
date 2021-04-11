<template>
  <div class="container">
    <div>
      <Logo />
      <h1 class="title">
      </h1>
      <div>
        <button @click="initFunction()">花火のテスト用</button>
        <!-- 花火のテスト -->
        <canvas id="canvas"></canvas>
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
    <div class="game-boy">
      <div class = "game-boy-screen">
        <p class="timer">{{interval.toFixed(3)}}</p>
      </div>
      <button class="btn" @click="startTimer()" v-show="!isStart">Start</button>
      <button class="btn" @click="stopTimer()" v-show="isStart">Stop</button>
    </div>
  </div>
</template>

<script>
import Timer from '~/components/Timer.vue'
import Cracker from '~/components/Cracker.vue'
export default {
  components: {
    Timer,
    Cracker
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
      Vectur: {
        x: 0,
        y: 0,
        getX() {
          return this.x
        },
        getY() {
          return this.y
        },
        setX(x) {
          this.x = x
        },
        setY(y) {
          this.y = y
        },
        getAngle() {
          return Math.atan2(this.y, this.x)
        },
        getLength() {
          return (Math.sqrt(this.x * this.x + this.y * this.y))
        },
        setAngle(angle) {
          const length = this.getLength()
          this.x = Math.cos(angle) * length
          this.y = Math.sin(angle) * length
        },
        setLength(length) {
          const angle = this.getAngle()
          this.x = Math.cos(angle) * length;
          this.y = Math.sin(angle) * length
        },
        create(x, y) {
          const obj = Object.create(this)

          obj.setX(x)
          obj.setY(y)

          return obj
        },
        add(v2) {
          const x = this.x + v2.x
          const y = this.y + v2.y

          return this.create(x, y)
        },
        addTo(v2) {
          v2.x += this.getX()
          v2.y += this.getY()
        },
        subtract(v2) {
          const x = this.x - v2.x
          const y = this.y - v2.y

          const o = this.create(x, y)
          return o
        },
        subtractFrom(v2) {
          v2.setX(v2.getX() - this.getX())
          v2.setY(v2.getY() - this.getY())
        },
        multiply(val) {
          this.x *= val
          this.y *= val
        }
      },
      Particle: {
        position: null,
        velocity: null,
        gravity: null,
        create(x, y, speed, angle, grav) {
          const obj = Object.create(this)
          obj.position = data().Vectur.create(x, y)
          obj.velocity = this.Vectur.create(0, 0)
          obj.gravity = this.Vectur.create(0, grav || 0)

          obj.velocity.setLength(speed)
          obj.velocity.setAngle(angle)

          return obj
        },
        update() {
          this.velocity.addTo(this.position)
          this.gravity.addTo(this.velocity)
        }
      }
    }
  },
  methods:{
    startTimer(){
      console.log(this.timer);
      this.isStart = true;
      this.start = Date.now();
      // 10msごとに現在時刻とstartを押した時刻の差を足す
      this.timer = setInterval(()=>{ this.interval =(Date.now() - this.start) * 0.001;}, 1);
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
    },
    initFunction() {
      const canvas = document.getElementById('canvas')
      const context = canvas.getContext('2d')
      const w = canvas.width = window.innerWidth
      const h = canvas.height = window.innerHeight

      context.fillStyle = 'rgb(5, 10, 25)'
      context.fillRect(0, 0, w, h)

      const x = 788
      const y = 454

      console.log(x)
      const particles = []
      const colors = []
      const numParticles = 500
      for (let i = 0; i < numParticles; i++) {
        particles.push(this.Particle.create(0, 0, Math.random() * 7, Math.random() * 2 * Math.PI, 0.1))

        const r = Math.round(Math.random() * 256)
        const g = Math.round(Math.random() * 256)
        const b = Math.round(Math.random() * 256)

        colors[i] = 'rgba(' + r + ',' + g + ',' + b + ',1)'
        }

        update()
        context.fillStyle = 'rgb(5, 10, 25)'
        context.fillRect(0, 0, w, h)

        const r = 1.5

        function update() {
          context.clearRect(0, 0, w, h)
          context.save()
          context.fillStyle = 'rgb(5, 10, 25)'
          context.fillRect(0, 0, w, h)

          context.translate(x, y)
          for (let i = 0; i < particles.length; i++) {

            context.fillStyle = colors[i]
            context.beginPath()
            context.arc(particles[i].position.getX(), particles[i].position.getY(), Math.round(r), 0, Math.PI * 2)
            context.fill()

            particles[i].update()
          }

          context.restore()

          removeExtra()
          window.requestAnimationFrame(update)
        }

        function removeExtra() {
          for (let i = 0; i < particles.length; i++) {
            if (particles[i].position.x - 50 > w || particles[i].position.x + 50 < -w / 2 ||
            particles[i].position.y - 50 > h || particles[i].position.y + 50 < -h / 2) {
              particles.splice(i, 1)
              colors.splice(i, 1)
            }
          }
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
</style>
