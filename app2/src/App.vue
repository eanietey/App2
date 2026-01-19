<script setup>
import Container from './components/Container.vue'
import { onMounted } from 'vue'

onMounted(() => {
  const text = document.querySelector('.box p')
  const WordChangeButton = document.querySelector('.buttonA')
  const ColorChangeButton = document.querySelector('.buttonB')

  WordChangeButton.addEventListener('click', () => {
    text.textContent = text.textContent === 'SIGMA' ? 'ALPHA' : 'SIGMA'
  })

  function randomColors() {
    const hex = 'abcdef1234567890'

    let hash = '#'

    for (let i = 0; i < 6; i++) {
      hash += hex[Math.floor(Math.random() * 16)]
    }

    return hash
  }

  const defaultColor = '#dc143c'
  let colorInterval
  ColorChangeButton.addEventListener('click', () => {
    if (colorInterval) {
      clearInterval(colorInterval)
      colorInterval = null

      WordChangeButton.style.backgroundColor = defaultColor
      ColorChangeButton.style.backgroundColor = defaultColor
    } else {
      colorInterval = setInterval(() => {
        const color = randomColors()
        WordChangeButton.style.backgroundColor = color
        ColorChangeButton.style.backgroundColor = color
      }, 500)
    }
  })
})
</script>

<template>
  <Container>
    <template #first>
      <div class="box">
        <p>SIGMA</p>
      </div>
      <div class="box"></div>
      <div class="box">
        <div class="badge"></div>
      </div>
      <div class="box">
        <div class="button-box">
          <button class="triangle buttonA buttons">A</button>
          <button class="triangle buttonB buttons">B</button>
        </div>
      </div>
    </template>
  </Container>
</template>

<style scoped>
html,
body,
body,
#app {
  margin: 0;
}

.box:nth-child(1) {
  background-color: lightgray;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.box:nth-child(2) {
  background-color: lightgray;
  border-radius: 0 100% 0 0;
}

.box:nth-child(3) {
  background-color: lightgray;
  display: flex;
  justify-content: center;
  align-items: center;
}

.badge {
  width: 200px;
  height: 95%;
  background-image: url(./components/mcgregor_crest_coat_of_arms.png);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  transform: rotate();
  /* animation: spin 10s ease-in-out infinite; */
  /* animation-name: spin;
  animation-duration: 8s;
  animation-delay: 0s;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite; */
  animation: spin 8s infinite ease-in-out;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  60% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.box:nth-child(4) {
  background-color: lightgray;
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-box {
  background: none;
  width: 90px;
  height: 180px;
}

.buttonA {
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
  /* animation-name: pulse;
  animation-timing-function: linear;
  animation-duration: 500; */
  animation: pulse 0.6s ease-in-out;
  transition: transform 0.15s ease;
}

.buttonA:active {
  transform: scale(0.95);
  position: relative;
}

.buttonA::after {
  content: '';
  position: absolute;
  bottom: 0.5px;
  left: 15%;
  width: 70%;
  height: 10px;
  background: rgba(0, 0, 0, 0.4);
  filter: blur(15px);
}

.buttonB {
  clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
  transition: transform 0.15s ease;
}

.buttonB:active {
  transform: scale(0.95);
  position: relative;
}

.buttonB::after {
  content: '';
  position: absolute;
  top: 0.5px;
  left: 15%;
  width: 70%;
  height: 10px;
  background: rgba(0, 0, 0, 0.4);
  filter: blur(15px);
}

.triangle {
  cursor: pointer;
  color: white;
  text-align: center;
  font-size: large;
  background: #dc143c;
  width: 100%;
  height: 50%;
  border: none;
  overflow: visible;
}

.box p {
  font-family: 'Exile', system-ui;
  font-weight: 400;
  font-style: normal;
  font-size: 64px;
}
</style>
