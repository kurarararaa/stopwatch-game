import Vue from 'vue'

var Vector = {
  x: 0,
  y: 0,
  getX: function() {
    return this.x;
  },
  getY: function() {
    return this.y;
  },
  setX: function(x) {
    this.x = x;
  },
  setY: function(y) {
    this.y = y;
  },
  setAngle: function(angle) {
    var length = this.getLength();
    this.x = Math.cos(angle) * length;
    this.y = Math.sin(angle) * length;
  },
  setLength: function(length) {
    var angle = this.getAngle();
    this.x = Math.cos(angle) * length;
    this.y = Math.sin(angle) * length;
  },
  getAngle: function() {
    return Math.atan2(this.y, this.x);
  },
  getLength: function() {
    return (Math.sqrt(this.x * this.x + this.y * this.y));
  },
  create: function(x, y) {
    var obj = Object.create(this);

    obj.setX(x);
    obj.setY(y);

    return obj;
  },
  add: function(v2) {
    var x = this.x + v2.x;
    var y = this.y + v2.y;

    return this.create(x, y);
  },
  addTo: function(v2) {
    v2.x += this.getX();
    v2.y += this.getY();
  },
  subtract: function(v2) {
    var x = this.x - v2.x,
      y = this.y - v2.y;

    var o = this.create(x, y);
    return o;
  },
  subtractFrom: function(v2) {
    v2.setX(v2.getX() - this.getX());
    v2.setY(v2.getY() - this.getY());
  },
  multiply: function(val) {
    this.x *= val;
    this.y *= val;
  }
}

var Particle = {
  position: null,
  velocity: null,
  gravity: null,
  create: function(x, y, speed, angle, grav) {
    var obj = Object.create(this);

    obj.position = Vector.create(x, y),
      obj.velocity = Vector.create(0, 0);
    obj.gravity = Vector.create(0, grav || 0);

    obj.velocity.setLength(speed);
    obj.velocity.setAngle(angle);

    return obj;
  },
  update: function() {
    this.velocity.addTo(this.position);
    this.gravity.addTo(this.velocity);
  }
}

const foo = (interval) => {
  console.log('外部メソッド呼び出し成功' + interval)
}

const CrackerDirective = {
  bind: function(el, binding, vnode) {
    let context = el.getContext('2d'),
    w = el.width = window.innerWidth,
    h = el.height = window.innerHeight;

    context.fillStyle = 'rgb(5,10,25)';
    context.fillRect(0, 0, w, h);

    Vue.nextTick(function() {
      const testBtn = document.getElementById("testBtn")
      testBtn.onclick = function() {

        var x = 559,
          y = 150;

        var particles = [],
          colors = [],
          numParticles = 500;
        for (var i = 0; i < numParticles; i++) {
          particles.push(Particle.create(0, 0, Math.random() * 7, Math.random() * 2 * Math.PI, 0.1));

          var r = Math.round(Math.random() * 256),
            g = Math.round(Math.random() * 256),
            b = Math.round(Math.random() * 256);

          colors[i] = 'rgba(' + r + ',' + g + ',' + b + ',1)';
        }

        update();
        context.fillStyle = 'rgb(5,10,25)';
        context.fillRect(0, 0, w, h);
        var r = 1.5;

        function update() {
          context.clearRect(0, 0, w, h);
          context.save();
          context.fillStyle = 'rgb(5,10,25)';
          context.fillRect(0, 0, w, h);

          context.translate(x, y);
          for (var i = 0; i < particles.length; i++) {

            context.fillStyle = colors[i];
            context.beginPath();
            context.arc(particles[i].position.getX(), particles[i].position.getY(), Math.round(r), 0, Math.PI * 2);
            context.fill();

            particles[i].update();
          }

          context.restore();

          removeExtra();
          window.requestAnimationFrame(update);
        }

        function removeExtra() {
          for (var i = 0; i < particles.length; i++) {
            if (particles[i].position.x - 50 > w || particles[i].position.x + 50 < -w / 2 || particles[i].position.y - 50 > h || particles[i].position.y + 50 < -h / 2) {
              particles.splice(i, 1);
              colors.splice(i, 1);
            }
          }
        }
      }
    })
  }
}

const testMethod = () => {
  
  var x = 559,
    y = 150;

  console.log(event.clientX);
  var particles = [],
    colors = [],
    numParticles = 500;
  for (var i = 0; i < numParticles; i++) {
    particles.push(Particle.create(0, 0, Math.random() * 7, Math.random() * 2 * Math.PI, 0.1));

    var r = Math.round(Math.random() * 256),
      g = Math.round(Math.random() * 256),
      b = Math.round(Math.random() * 256);

    colors[i] = 'rgba(' + r + ',' + g + ',' + b + ',1)';
  }

  update();
  context.fillStyle = 'rgb(5,10,25)';
  context.fillRect(0, 0, w, h);
  var r = 1.5;

  function update() {
    context.clearRect(0, 0, w, h);
    context.save();
    context.fillStyle = 'rgb(5,10,25)';
    context.fillRect(0, 0, w, h);

    context.translate(x, y);
    for (var i = 0; i < particles.length; i++) {

      context.fillStyle = colors[i];
      context.beginPath();
      context.arc(particles[i].position.getX(), particles[i].position.getY(), Math.round(r), 0, Math.PI * 2);
      context.fill();

      particles[i].update();
    }

    context.restore();

    removeExtra();
    window.requestAnimationFrame(update);
  }

  function removeExtra() {
    for (var i = 0; i < particles.length; i++) {
      if (particles[i].position.x - 50 > w || particles[i].position.x + 50 < -w / 2 || particles[i].position.y - 50 > h || particles[i].position.y + 50 < -h / 2) {
        particles.splice(i, 1);
        colors.splice(i, 1);
      }
    }
  }
}

Vue.directive('cracker', CrackerDirective)

export default ({}, inject) => {
  inject('foo', foo)
}