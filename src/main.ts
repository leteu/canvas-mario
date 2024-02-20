import { initMario } from './mario'
import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div id="container">
    <canvas id="layer0"></canvas>
    <canvas id="layer1"></canvas>
  </div>
`

initMario(
  document.querySelector<HTMLCanvasElement>('#layer0')!,
  document.querySelector<HTMLCanvasElement>('#layer1')!,
)
