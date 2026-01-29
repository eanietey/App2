<script setup>
import {ref, onMounted} from 'vue'
import Curry from '../components/curry.jpg'
import Goat from '../components/goat.jpg'
import Einstein from '../components/einstein.jpg'

const mainFrame = ref(null)
const boxes = ref([])


const defaultShapes = [
  { c: 2, r: 2 }, // slot 2
  { c: 2, r: 2 }, // slot 1
  { c: 1, r: 2 }, // slot 3
  { c: 1, r: 1 }, // slot 4
  { c: 1, r: 1 }, // slot 5
  { c: 2, r: 1 }, // slot 6
  { c: 1, r: 1 }, // slot 7
]

function sizeRotation(){

  const shuffledShapes = [...defaultShapes].sort(() => Math.random() - 0.5)


  applyShapes(shuffledShapes)
}

const images = [Goat]

const currentImage = ref(0)

function getImage() {
  return images[currentImage.value]
}

const originalPositions = [
  { x: 0,   y: 0 },      // slot 1
  { x: 40,  y: 0 },      // slot 2
  { x: 80,  y: 0 },      // slot 3
  { x: 0,   y: 66.666 }, // slot 4
  { x: 20,  y: 66.666 }, // slot 5
  { x: 40,  y: 66.666 }, // slot 6
  { x: 80,  y: 66.666 }, // slot 7
]

let activePositions = [...originalPositions]


function applyShapes(shapes) {

  boxes.value.forEach((elm, i) => {

     const colSpan = shapes[i].c
    const rowSpan = shapes[i].r
    elm.style.gridColumn = `span ${colSpan}`
    elm.style.gridRow = `span ${rowSpan}`

    elm.style.backgroundImage = `url(${getImage()})`
    elm.style.backgroundRepeat = 'no-repeat'

    const totalCols = 5
    const totalRows = 3
    const colWidth = 100 / totalCols
    const rowHeight = 100 / totalRows

    let x = activePositions[i].x + (colSpan * colWidth - colWidth) / 2
    let y = activePositions[i].y + (rowSpan * rowHeight - rowHeight) / 2


    if (i === 2 || i === 6) {
      x = activePositions[i].x + colWidth / 2
    }

    elm.style.backgroundSize = '350% 300%'
    elm.style.backgroundPosition = `${x}% ${y}%`

  })

}

function identifyLayout() {
  //  activePositions = [...originalPositions]
  applyShapes(defaultShapes)
}

onMounted(() => {

  boxes.value = mainFrame.value.querySelectorAll('.gridSegment')

  sizeRotation()

})

</script>


<template>
  <section>
   <nav class="nav">
        <!-- <button class="button move"><</button> -->
        <button class="button topButtons" @click="sizeRotation">SCRAMBLE</button>
        <button class="button topButtons" @click="identifyLayout">IDENTIFY</button>
        <!-- <button class="button move">></button> -->
    </nav>
    <main>

        <div class="mainFrame" ref="mainFrame">
          <div class="gridSegment">
            <slot name="space1"></slot>
          </div>
          <div class="gridSegment">
            <slot name="space2"></slot>
          </div>
          <div class="gridSegment">
            <slot name="space3"></slot>
          </div>
          <div class="gridSegment">
            <slot name="space4"></slot>
          </div>
          <div class="gridSegment">
            <slot name="space5"></slot>
          </div>
          <div class="gridSegment">
            <slot name="space6"></slot>
          </div>
          <div class="gridSegment">
            <slot name="space7"></slot>
          </div>
        </div>

      </main>
    </section>

</template>


<style scoped>
section{
  width: 100%;
  height: 100vh;
}

/* :deep(.picBox){
  background-color: green;
  border: 1px black solid;
  width: 100px;
  height: 80px;

} */

html, body, #app{
  margin: 0;
  padding: 0;
}

.nav{
  width: 100%;
  height: 10%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: burlywood;
}

main{
  width: 100%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  border: 1px grey dotted;
  background: #faf0e6;
}

.mainFrame{
  height: 90%;
  width: 100%;
  border: 1px black solid;
  background-color: rgb(223, 221, 217);
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-auto-flow: dense;
  gap: 1px;
  padding: 10px;
  border-radius: 20px;
}

.mainFrame > div {
  transition: all 1s ease;
  border: 1px black solid;
}

button{
  padding: 20px;
  width: 100px;
  cursor: pointer;
  margin: 5px;
  display: flex;
  justify-content: center;
}

.move{
  font-size: 2em;
  border: none;
  padding: 10px;
  background: none;
  transition: all 2s ease;
}

.move:hover{
  border-radius: 20%;
  background-color: rgb(189, 142, 81);
}

.move:active{
  background-color: beige;
}

.topButtons{
  border-radius: 20px;
  border: none;
  font-weight: bold;
  transition: all 0.2s ease-in-out;
}

.topButtons:hover{
  padding: 12px;
  background-color: rgb(189, 142, 81);
}

.topButtons:active{
  padding: 18px;
}

.playground{
  border: 2px dashed black;
  min-width: 50px;
  min-height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(105, 52, 52, 0.05);
}

.gridSegment{
  border-radius: 5px;
  overflow: hidden;
}

.solved {
  background-image: url('/app3/App3/src/components/curry.jpg'); /* or getImage() */
  background-size: cover;
  background-position: center;
}

.mainFrame.solved .gridSegment {
  background-image: none !important;
  border: none;
}

</style>
