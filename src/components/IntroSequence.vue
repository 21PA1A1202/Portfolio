<template>
  <div
    class="fixed inset-0 z-[80] flex h-screen w-full items-center justify-center overflow-hidden intro-shell text-cyan-300"
    :class="{ 'intro-shell-exit': handoff }"
  >
    <!-- Typewriter Intro -->
<!-- Typewriter Intro Above the Circle -->
<div class="absolute top-10 z-50 text-center w-full flex justify-center">
  <h1 class="text-2xl sm:text-2xl whitespace-nowrap font-mono text-cyan-200">
    <span
      ref="typeTarget"
      class="inline-block overflow-hidden border-r-2 border-cyan-300"
      :style="typedStyle"
    >
      {{ sentence }}
    </span>
  </h1>
</div>



    <!-- Robotic Loader -->
    <div class="absolute inset-0 z-10 flex items-center justify-center intro-stage">
      <!-- Laser Lines -->
      <div class="absolute top-1/2 left-0 w-full z-10">
        <div
          ref="laserLine1"
          class="h-6 bg-cyan-400 laser-line-1 knife-line mx-auto w-[1px] max-w-[60vw] block"
        ></div>
        <div
          ref="laserLine2"
          class="h-6 bg-cyan-300 laser-line-2 knife-line mx-auto w-[1px] max-w-[53vw] mt-1 block"
        ></div>
        <div
          ref="laserLine3"
          class="h-6 bg-cyan-200 laser-line-3 knife-line mx-auto w-[1px] max-w-[46vw] mt-1 block"
        ></div>
      </div>

      <!-- Rings & Triangles -->
      <div
        class="intro-core relative z-50 flex h-56 w-56 items-center justify-center overflow-hidden rounded-full"
        :class="{ 'intro-core-enter': handoff }"
      >
        <div
          class="absolute inset-[8%] z-0 overflow-hidden rounded-full intro-portal"
          :class="{ 'intro-portal-open': doorsOpen, 'intro-portal-enter': handoff }"
        >
          <iframe
            :src="heroSceneUrl"
            frameborder="0"
            loading="eager"
            class="intro-portal-frame"
            :class="{ 'intro-portal-frame-enter': handoff }"
          ></iframe>
          <div class="absolute inset-0 bg-gradient-to-b from-cyan-300/10 via-transparent to-black/20"></div>
        </div>

        <!-- Glowing Spinning Rings -->
        <div class="absolute w-[14rem] h-[14rem] border-[2px] border-dashed z-0 rounded-full border-white animate-spin-medium ring-glow-white"></div>
        <div class="absolute w-[14rem] h-[13rem] border-[1.5px] border-double rounded-full border-cyan-300 animate-spin-fast"></div>
        <div class="absolute w-[13rem] h-[14rem] border-[1.5px] border-double rounded-full border-cyan-300 animate-spin-fast1"></div>

        <!-- Robotic Doors -->
        <div
          class="intro-door-shell absolute z-10 h-full w-full overflow-hidden rounded-full bg-black"
          :class="{ 'intro-door-shell-clear': handoff }"
        >
          <!-- Inner Ring Shadow Overlay -->
          <div class="absolute inset-0 z-10 ring-inner-shadow pointer-events-none"></div>

          <!-- Triangle Doors -->
          <div
            v-for="(angle, i) in [0, 120, 240]"
            :key="i"
            class="absolute w-full h-full flex items-center justify-center"
          >
            <div
              class="triangle"
              :class="{ 'triangle-exit': handoff }"
              :style="{
                transform: 'rotate(' + angle + 'deg)' + (doorsOpen ? ' translateY(-120%)' : '')
              }"
            ></div>
          </div>
        </div>

        <!-- Border -->
        <div class="absolute w-full h-full rounded-full border-4 border-cyan-300 z-10 pointer-events-none"></div>
      </div>
    </div>

    <!-- AUDIO -->
    <audio ref="doorSound" src="/sci-fi-sfx16-350847.mp3" preload="auto"></audio>
    <audio ref="typeSound" src="/keyboard-typing-one-short-1-292590.mp3" preload="auto"></audio>
    <audio ref="lineSound" src="/mixkit-metallic-sword-strike-2160.wav" preload="auto"></audio>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const emit = defineEmits(['completed'])

const sentence = 'welcome to my portfolio.'
const heroSceneUrl = 'https://my.spline.design/thresholddarkambientui-gwvaPilEOywrJqpAK5XxoaTi/'
const TYPEWRITER_START_MS = 1000
const TYPEWRITER_DURATION_MS = 3000
const LASER_SOUND_TIMES = [4660, 5050, 5550]
const typeTarget = ref<HTMLElement | null>(null)
const typedStyle = ref<Record<string, string>>({})
const doorsOpen = ref(false)
const handoff = ref(false)

const doorSound = ref<HTMLAudioElement | null>(null)
const typeSound = ref<HTMLAudioElement | null>(null)
const lineSound = ref<HTMLAudioElement | null>(null)

const laserLine1 = ref<HTMLElement | null>(null)
const laserLine2 = ref<HTMLElement | null>(null)
const laserLine3 = ref<HTMLElement | null>(null)

let dynamicStyleTag: HTMLStyleElement | null = null
const timeouts: number[] = []
const linePlayers: HTMLAudioElement[] = []
const typePlayers: HTMLAudioElement[] = []
let linePlayerIndex = 0
let typePlayerIndex = 0

function schedule(callback: () => void, delay: number) {
  const id = window.setTimeout(callback, delay)
  timeouts.push(id)
}

function playLineSound() {
  if (!linePlayers.length) return

  const player = linePlayers[linePlayerIndex % linePlayers.length]
  linePlayerIndex += 1
  player.currentTime = 0
  player.play().catch(() => {
    player.addEventListener('canplaythrough', () => {
      player.currentTime = 0
      player.play()
    }, { once: true })
  })
}

function playTypeSound() {
  if (!typePlayers.length) return

  const player = typePlayers[typePlayerIndex % typePlayers.length]
  typePlayerIndex += 1
  player.currentTime = 0
  player.play().catch(() => {
    player.addEventListener('canplaythrough', () => {
      player.currentTime = 0
      player.play()
    }, { once: true })
  })
}

onMounted(() => {
  // // Required to unlock autoplay
  // document.body.addEventListener(
  //   'click',
  //   () => {
  //     lineSound.value?.play().catch(() => {})
  //     typeSound.value?.play().catch(() => {})
  //     doorSound.value?.play().catch(() => {})
  //   },
  //   { once: true }
  // )

  requestAnimationFrame(() => {
    if (lineSound.value) {
      for (let i = 0; i < 3; i += 1) {
        const player = lineSound.value.cloneNode(true) as HTMLAudioElement
        player.volume = 0.34
        player.preload = 'auto'
        player.load()
        linePlayers.push(player)
      }
    }

    if (typeSound.value) {
      for (let i = 0; i < 6; i += 1) {
        const player = typeSound.value.cloneNode(true) as HTMLAudioElement
        player.volume = 0.18
        player.preload = 'auto'
        player.load()
        typePlayers.push(player)
      }
    }

    if (typeTarget.value) {
      const fullWidth = typeTarget.value.scrollWidth + 'px'
      typedStyle.value = {
        width: '0px',
        animation: `typewriterDynamic ${TYPEWRITER_DURATION_MS}ms steps(${sentence.length}) ${TYPEWRITER_START_MS}ms forwards, blink 1s step-end infinite`,
        whiteSpace: 'nowrap',
      }

      dynamicStyleTag = document.createElement('style')
      dynamicStyleTag.innerHTML = `
        @keyframes typewriterDynamic {
          from { width: 0px; }
          to { width: ${fullWidth}; }
        }
        @keyframes blink {
          50% { border-color: transparent; }
        }
      `
      document.head.appendChild(dynamicStyleTag)
    }

    const typeStepMs = TYPEWRITER_DURATION_MS / sentence.length

    for (let index = 0; index < sentence.length; index += 1) {
      schedule(() => playTypeSound(), Math.round(TYPEWRITER_START_MS + index * typeStepMs))
    }

    LASER_SOUND_TIMES.forEach((time) => {
      schedule(() => playLineSound(), time)
    })

    // Play door open
    schedule(() => {
      doorsOpen.value = true
      const click = doorSound.value!.cloneNode(true) as HTMLAudioElement
      click.volume = 0.2
      click.play()
    }, 5850)

    schedule(() => {
      handoff.value = true
    }, 7000)

    schedule(() => {
      emit('completed')
    }, 8450)
  })
})

onBeforeUnmount(() => {
  timeouts.forEach((id) => window.clearTimeout(id))
  dynamicStyleTag?.remove()
})

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&display=swap');

@keyframes typewriterDynamic {
  from { width: 0px; }
  to { width: 100%; }
}
@keyframes blink {
  50% { border-color: transparent; }
}
@keyframes fadeout {
  0% { opacity: 0; }
  30% { opacity: 1; }
  90% { opacity: 1; }
  100% { opacity: 0; }
}
.animate-fadeout {
  animation: fadeout 5s ease-in-out forwards;
}

/* Robotic Doors */
.triangle {
  position: absolute;
  width: 170%;
  height: 100%;
  clip-path: polygon(50% 49%, 100% 0%, 0% 0%);
  transform-origin: center center;
  background-image: url('/seamless-high-tech-metallic-surface-intricate-circuit-like-details-industrial-design-elements-brushed-steel-texture-367067162.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border: 1px solid #0ff;
  overflow: hidden;
  filter: brightness(1.1) contrast(1.2) hue-rotate(150deg) saturate(1.5);
  transition: transform 2s ease-in-out, opacity 0.9s ease;
  will-change: transform, opacity;
}
.triangle::after {
  content: "";
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-image: repeating-linear-gradient(
    45deg,
    rgba(0, 255, 255, 0.08),
    rgba(0, 255, 255, 0.08) 2px,
    transparent 2px,
    transparent 4px
  );
  opacity: 0.3;
  pointer-events: none;
  z-index: 2;
}

/* Laser Beam */
@keyframes laser-horizontal {
  0% { width: 0%; opacity: 1; }
  100% { width: 100%; opacity: 1; }
}
.laser-line-1 {
  animation: laser-horizontal 0.3s ease-out forwards;
  animation-delay: 4.5s;
}
.laser-line-2 {
  animation: laser-horizontal 0.5s ease-out forwards;
  animation-delay: 4.8s;
}
.laser-line-3 {
  animation: laser-horizontal 0.5s ease-out forwards;
  animation-delay: 5.3s;
}
.knife-line {
  clip-path: polygon(0% 0%, 100% 0%, 100% 10%, 95% 100%, 5% 100%, 0% 10%);
}

/* Ring Animations */
@keyframes spin-medium {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(-360deg); }
}
@keyframes spin-fast {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(720deg); }
}
.animate-spin-medium {
  animation: spin-medium 4s linear infinite;
}
.animate-spin-fast {
  animation: spin-fast 2s linear infinite;
}
.animate-spin-fast1 {
  animation: spin-fast 3s linear infinite;
}
.ring-glow-white {
  box-shadow: 0 0 5px 3px rgba(255, 255, 255, 0.3),
              0 0 20px 6px rgba(255, 255, 255, 0.2),
              0 0 40px 10px rgba(255, 255, 255, 0.1);
}
.ring-inner-shadow {
  border-radius: 50%;
  position: absolute;
  inset: 0;
  box-shadow: inset 10px -10px 10px rgba(0, 0, 0, 0.8);
  z-index: 10;
  pointer-events: none;
}
.intro-portal {
  transform: scale(1.04);
  filter: saturate(0.82) brightness(0.88);
  box-shadow:
    inset 0 0 20px rgba(0, 0, 0, 0.45),
    0 0 18px rgba(34, 211, 238, 0.08);
  transition: transform 2.1s cubic-bezier(0.22, 1, 0.36, 1), filter 2.1s ease;
  will-change: transform, filter;
}
.intro-portal-open {
  transform: scale(1.18);
  filter: saturate(1) brightness(1);
}
.intro-portal-enter {
  transform: scale(1.24);
  filter: saturate(1.08) brightness(1.04);
}
.intro-portal-frame {
  position: absolute;
  inset: -35%;
  width: 170%;
  height: 170%;
  border: 0;
  pointer-events: none;
  transform: scale(1);
  transition: transform 1.35s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}
.intro-portal-frame-enter {
  transform: scale(1.04);
}
.intro-shell {
  font-family: 'Space Grotesk', sans-serif;
  background:
    linear-gradient(rgba(103, 232, 249, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(103, 232, 249, 0.03) 1px, transparent 1px),
    radial-gradient(circle at top left, rgba(8, 145, 178, 0.18), transparent 28%),
    radial-gradient(circle at top right, rgba(14, 165, 233, 0.15), transparent 30%),
    linear-gradient(180deg, #04070d 0%, #07111d 50%, #04070d 100%);
  background-size: 34px 34px, 34px 34px, auto, auto, auto;
  opacity: 1;
  transition: opacity 1.1s ease, background-color 1.1s ease;
  will-change: opacity;
}
.intro-shell-exit {
  opacity: 0;
}

.intro-core {
  background:
    linear-gradient(rgba(103, 232, 249, 0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(103, 232, 249, 0.055) 1px, transparent 1px),
    radial-gradient(circle at center, rgba(6, 182, 212, 0.08), transparent 58%),
    #02070d;
  background-size: 18px 18px, 18px 18px, auto, auto;
  transform: scale(1) translateZ(0);
  transition:
    transform 1.35s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 1s ease,
    filter 1.1s ease;
  will-change: transform, opacity, filter;
}
.intro-core-enter {
  transform: scale(4.2) translateZ(0);
  opacity: 0;
  filter: blur(2px);
}
.intro-door-shell {
  transition:
    opacity 0.8s ease,
    background-color 0.8s ease;
}
.intro-door-shell-clear {
  opacity: 0.18;
  background: transparent;
}
.triangle-exit {
  opacity: 0.22;
}
</style>
