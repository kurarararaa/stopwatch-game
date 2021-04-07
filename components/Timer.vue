<template>
  <p>{{interval.toFixed(3)}}</p> <!-- 小数3桁まで表示 -->
</template>

<script>
export default {
  props: {
    isStart: Boolean,
  },
  data(){
    return {
      start : 0, // startを押した時刻
      timer : 0, // setInterval()の格納用
      interval : 0, // 計測用
      diffSecconds : 9999999, // 基準値との差
      score : 0, // 絶対値で取得
      settingSeconds: 1.000, // 設定値
      
    }
  },
  mounted() {
    if (this.isStart) {
      this.startTimer()
    }
  },
  watch: {
    // この関数は question が変わるごとに実行されます。
    isStart: function (newVal, oldVal) {
      if (newVal) {
        this.startTimer()
      }else {
        this.stopTimer();
      }
    }
  },
  methods:{
    conponentTest() {
      this.$refs.child.childEvent()
    },
    startTimer(){
      console.log(this.timer);
      this.start = Date.now();
      this.timer = setInterval(()=>{ this.interval =(Date.now() - this.start) * 0.001;}, 1); // 10msごとに現在時刻とstartを押した時刻の差を足す
    },
    stopTimer(){
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