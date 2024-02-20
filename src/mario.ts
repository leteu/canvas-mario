import map from './assets/map/1-1.json'
import mapTile from './assets/tileset/tiles.png'
import itemTile from './assets/tileset/items-objects.png'

const TILE_SIZE = 16
const PRINT_SIZE = 16

enum TileSet {
  Main = 'main',
  Items = 'items',
  Char = 'character',
}

enum TileType {
  Cloud = 0,
  Item = 1,
  Grass = 2,
  hCoin = 3,
  hStar = 4,
  sMush = 5,
}

export function initMario(
  layer0: HTMLCanvasElement,
  layer1: HTMLCanvasElement
) {
  let bgCtx: CanvasRenderingContext2D | null = null
  let unitCtx: CanvasRenderingContext2D | null = null
  let pos = 1700
  let tile = {} as {
    [k in TileSet]: HTMLImageElement
  }
  let fpsInterval: number, now, then: number, elapsed
  let cnt = 0
  let startCnt = 0

  function startAnimation(fps: number) {
    fpsInterval = 1000 / fps
    then = Date.now()
    animate()
  }

  function animate() {
    requestAnimationFrame(animate)

    now = Date.now()
    elapsed = now - then

    if (elapsed > fpsInterval) {
      then = now - (elapsed % fpsInterval)

      draw()
    }
  }

  async function init() {
    layer0.width = 256
    layer0.height = 240
    layer1.width = 256
    layer1.height = 240
    bgCtx = layer0.getContext('2d')
    unitCtx = layer1.getContext('2d')
    ;[tile[TileSet.Main], tile[TileSet.Items]] = await Promise.all([
      initTile(),
      initItemTile(),
    ])

    initEvent()
    startAnimation(240)

    setInterval(() => (cnt = cnt > 1 ? 0 : cnt + 1), 300)
    setInterval(() => (startCnt = startCnt > 2 ? 0 : startCnt + 1), 100)
  }

  function initTile() {
    return new Promise<HTMLImageElement>((res) => {
      const tileImg = new Image()
      tileImg.src = mapTile
      tileImg.onload = () => {
        res(tileImg)
      }
    })
  }

  function initItemTile() {
    return new Promise<HTMLImageElement>((res) => {
      const tileImg = new Image()
      tileImg.src = itemTile
      tileImg.onload = () => {
        res(tileImg)
      }
    })
  }

  function drawTile(
    sx: number,
    sy: number,
    dx: number,
    dy: number,
    option?: {
      tileset?: TileSet
      gap?: boolean
      dx?: number
      dy?: number
    }
  ) {
    option = {
      tileset: TileSet.Main,
      gap: true,
      dx: undefined,
      dy: undefined,
      ...option,
    }

    bgCtx?.drawImage(
      tile[option.tileset!],
      sx * TILE_SIZE + (option.gap! ? sx : 0),
      sy * TILE_SIZE + (option.gap! ? sy : 0),
      TILE_SIZE,
      TILE_SIZE,
      !!option.dx ? option.dx : dx * PRINT_SIZE - pos,
      !!option.dy ? option.dy : dy * PRINT_SIZE,
      PRINT_SIZE,
      PRINT_SIZE
    )
  }

  function draw() {
    bgCtx!.rect(0, 0, 256, 240)
    bgCtx!.fillStyle = '#5c94fc'
    bgCtx!.fill()

    map.bg.forEach((row, xi) => {
      row.forEach((col, yi) => {
        const [x, y, type] = col.split(',').map((el) => Number(el))

        drawTile(x, y, xi, yi)

        if (type !== undefined) {
          if ([TileType.Cloud, TileType.Grass].includes(type)) {
            drawTile(12, 6, xi, yi)
            drawTile(x, y, xi, yi, {
              dx: xi * PRINT_SIZE - pos - PRINT_SIZE / 2,
            })
          }

          if (type === TileType.Item) {
            drawTile(8 + cnt, 10, xi, yi)
          }

          if (type === TileType.hCoin) {
            drawTile(8 + cnt, 9, xi, yi)
          }

          if (type === TileType.hStar) {
            drawTile(startCnt, 3, xi, yi, { tileset: TileSet.Items, gap: false })
          }

          if (type === TileType.sMush) {
            drawTile(8 + cnt, 10, xi, yi)
            drawTile(0, 0, xi, yi, { tileset: TileSet.Items, gap: false })
          }
        }
      })
    })
  }

  init()

  function initEvent() {
    window.addEventListener('keydown', (el) => {
      if (el.key === 'ArrowLeft' && pos > 0) {
        pos -= 5
      }
      if (el.key === 'ArrowRight') {
        pos += 5
      }
    })
  }
}
