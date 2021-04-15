<template>
  <canvas id="canvas"></canvas>
</template>

<script>
export default {
  data() {
    return {
      x: 0,
      y: 0,
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
          return Math.sqrt(this.x * this.x + this.y * this.y)
        },
        setAngle(angle) {
          const length = this.getLength()
          this.x = Math.cos(angle) * length
          this.y = Math.sin(angle) * length
        },
        setLength(length) {
          const angle = this.getAngle()
          this.x = Math.cos(angle) * length
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
        },
      },
      Particle: {
        position: null,
        velocity: null,
        gravity: null,
        create(x, y, speed, angle, grav) {
          const obj = Object.create(this)
          obj.position = Vectur.create(x, y)
          obj.velocity = Vectur.create(0, 0)
          obj.gravity = Vectur.create(0, grav || 0)

          obj.velocity.setLength(speed)
          obj.velocity.setAngle(angle)

          return obj
        },
        update() {
          this.velocity.addTo(this.position)
          this.gravity.addTo(this.velocity)
        },
      },
    }
  },
  methods: {
    initFunction() {
      const canvas = document.getElementById('canvas')
      const context = canvas.getContext('2d')
      const w = (canvas.width = window.innerWidth)
      const h = (canvas.height = window.innerHeight)

      context.fillStyle = 'rgb(5, 10, 25)'
      context.fillRect(0, 0, w, h)

      document.body.addEventListener('mousedown', function (event) {
        const x = 100
        const y = 200

        console.log(x)
        const particles = []
        const colors = []
        const numParticles = 500
        for (let i = 0; i < numParticles; i++) {
          particles.push(
            Particle.create(
              0,
              0,
              Math.random() * 7,
              Math.random() * 2 * Math.PI,
              0.1
            )
          )

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
            context.arc(
              particles[i].position.getX(),
              particles[i].position.getY(),
              Math.round(r),
              0,
              Math.PI * 2
            )
            context.fill()

            particles[i].update()
          }

          context.restore()

          removeExtra()
          window.requestAnimationFrame(update)
        }

        function removeExtra() {
          for (let i = 0; i < particles.length; i++) {
            if (
              particles[i].position.x - 50 > w ||
              particles[i].position.x + 50 < -w / 2 ||
              particles[i].position.y - 50 > h ||
              particles[i].position.y + 50 < -h / 2
            ) {
              particles.splice(i, 1)
              colors.splice(i, 1)
            }
          }
        }
      })
    },
  },
}
</script>

<style>
body {
  margin: 0;
}
canvas {
  display: flex;
}
</style>
