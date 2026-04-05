<template>
  <transition name="bee-float">
    <aside
      ref="beeShellRef"
      v-show="visible"
      class="bee-shell"
      :class="{ 'bee-shell-dragging': isDragging }"
      :style="beeShellStyle"
      aria-live="polite"
    >
      <section ref="beeWindowRef" class="bee-window">
        <header
          class="bee-header"
          :class="{ 'bee-header-draggable': !isCompactViewport, 'bee-header-dragging': isDragging }"
          @pointerdown="beginDrag"
        >
          <div class="bee-brand">
            <div class="bee-brand-icon">
              <BeeIcon class="h-10 w-10" />
            </div>
            <div>
              <div class="bee-title">Bee AI</div>
              <div class="bee-subtitle">This is my assistant. Ask anything about me.</div>
            </div>
          </div>

          <div class="bee-header-actions">
            <div
              class="bee-info-wrap"
              @mouseenter="showInfoTooltip = true"
              @mouseleave="showInfoTooltip = false"
            >
              <button
                type="button"
                class="bee-icon-button"
                aria-label="Bee AI capabilities"
                @focus="showInfoTooltip = true"
                @blur="showInfoTooltip = false"
              >
                <Info class="h-4 w-4" />
              </button>

              <div class="bee-tooltip" :class="{ 'bee-tooltip-visible': showInfoTooltip }">
                <p class="bee-tooltip-title">Bee can help with</p>
                <ul class="bee-tooltip-list">
                  <li v-for="item in capabilities" :key="item">{{ item }}</li>
                </ul>
              </div>
            </div>

            <button type="button" class="bee-icon-button" aria-label="Close Bee AI" @click="emit('close')">
              <X class="h-4 w-4" />
            </button>
          </div>
        </header>

        <div ref="messagesViewport" class="bee-messages">
          <article
            v-for="message in messages"
            :key="message.id"
            class="bee-row"
            :class="message.role === 'user' ? 'bee-row-user' : 'bee-row-assistant'"
          >
            <div class="bee-bubble" :class="message.role === 'user' ? 'bee-bubble-user' : 'bee-bubble-assistant'">
              <p class="whitespace-pre-line">{{ message.content }}</p>
            </div>
          </article>

          <article v-if="isBusy" class="bee-row bee-row-assistant">
            <div class="bee-bubble bee-bubble-assistant bee-bubble-thinking" aria-label="Bee is thinking">
              <span class="bee-thinking-dot"></span>
              <span class="bee-thinking-dot"></span>
              <span class="bee-thinking-dot"></span>
            </div>
          </article>
        </div>

        <div v-if="messages.length === 1 && !isBusy" class="bee-shortcuts">
          <button
            v-for="prompt in quickActions"
            :key="prompt.label"
            type="button"
            class="bee-shortcut"
            @click="useQuickAction(prompt.prompt)"
          >
            {{ prompt.label }}
          </button>
        </div>

        <footer class="bee-footer">

          <div class="bee-composer">
            <textarea
              ref="composerRef"
              v-model="draftMessage"
              rows="2"
              class="bee-input"
              placeholder="Ask about my projects, certificates, or draft an email..."
              @keydown="handleComposerKeydown"
            ></textarea>

            <button
              type="button"
              class="bee-send"
              :disabled="!draftMessage.trim() || isBusy"
              @click="submitMessage()"
            >
              <SendHorizonal class="h-4 w-4" />
              <span>Send</span>
            </button>
          </div>
        </footer>
      </section>
    </aside>
  </transition>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { Info, SendHorizonal, X } from 'lucide-vue-next'
import BeeIcon from './BeeIcon.vue'
import { runBeeAgent } from '../lib/beeAgent'
import type { BeeAgentHandlers, BeeChatTurn, BeeContactState } from '../lib/beeAgent'

type BeeUiMessage = {
  id: string
  role: 'assistant' | 'user'
  content: string
}

const props = defineProps<{
  visible: boolean
  contactState: BeeContactState
  navigateTo: BeeAgentHandlers['navigateTo']
  draftEmail: BeeAgentHandlers['draftEmail']
  updateSender: BeeAgentHandlers['updateSender']
  sendEmail: BeeAgentHandlers['sendEmail']
}>()

const emit = defineEmits<{
  close: []
}>()

const capabilities = [
  "Explain my experience, skills, projects, and certificates.",
  'Jump to sections like Projects, Experience, Certificates, Contact, and About.',
  'Open the profile summary when you want a compact overview.',
  'Draft a polished email directly into the contact form.',
  'Send that draft when your name and email are ready.'
]

const quickActions = [
  {
    label: 'Show projects',
    prompt: "Show me Hari Charan's best projects."
  },
  {
    label: 'Show certificates',
    prompt: 'Take me to the certificates section.'
  },
  {
    label: 'Draft an email',
    prompt: 'Draft a short email to Hari Charan about a software developer opportunity.'
  }
]

const messages = ref<BeeUiMessage[]>([
  {
    id: 'bee-welcome',
    role: 'assistant',
    content:
      "I'm Bee AI, Hari Charan's assistant. Ask me anything about him, his projects, experience, certificates, or I can help you draft an email."
  }
])

const draftMessage = ref('')
const isBusy = ref(false)
const showInfoTooltip = ref(false)
const isDragging = ref(false)
const isCompactViewport = ref(false)
const messagesViewport = ref<HTMLElement | null>(null)
const composerRef = ref<HTMLTextAreaElement | null>(null)
const beeShellRef = ref<HTMLElement | null>(null)
const beeWindowRef = ref<HTMLElement | null>(null)
const beePosition = ref<{ left: number | null; top: number | null }>({
  left: null,
  top: null
})

let activePointerId: number | null = null
let dragOffsetX = 0
let dragOffsetY = 0

const beeShellStyle = computed(() => {
  if (isCompactViewport.value || beePosition.value.left === null || beePosition.value.top === null) {
    return undefined
  }

  return {
    left: `${beePosition.value.left}px`,
    top: `${beePosition.value.top}px`,
    right: 'auto',
    bottom: 'auto'
  }
})

function createMessage(role: BeeUiMessage['role'], content: string) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content
  }
}

async function scrollToBottom(behavior: ScrollBehavior = 'smooth') {
  await nextTick()
  messagesViewport.value?.scrollTo({
    top: messagesViewport.value.scrollHeight,
    behavior
  })
}

function focusComposer() {
  composerRef.value?.focus()
}

function getViewportMargin() {
  return isCompactViewport.value ? 12 : 20
}

function updateViewportMode() {
  if (typeof window === 'undefined') return

  const nextCompact = window.innerWidth <= 640
  isCompactViewport.value = nextCompact

  if (nextCompact) {
    beePosition.value = {
      left: null,
      top: null
    }
  }
}

function clampBeePosition(left: number, top: number) {
  if (typeof window === 'undefined') {
    return { left, top }
  }

  const rect = beeWindowRef.value?.getBoundingClientRect()
  const width = rect?.width ?? 496
  const height = rect?.height ?? 624
  const margin = getViewportMargin()

  return {
    left: Math.min(Math.max(left, margin), Math.max(margin, window.innerWidth - width - margin)),
    top: Math.min(Math.max(top, margin), Math.max(margin, window.innerHeight - height - margin))
  }
}

async function ensureBeePosition(forceReset = false) {
  if (typeof window === 'undefined') return

  updateViewportMode()
  await nextTick()

  if (isCompactViewport.value) return
  if (!forceReset && beePosition.value.left !== null && beePosition.value.top !== null) return

  const rect = beeWindowRef.value?.getBoundingClientRect()
  const width = rect?.width ?? 496
  const height = rect?.height ?? 624
  const margin = getViewportMargin()

  beePosition.value = clampBeePosition(
    window.innerWidth - width - margin,
    window.innerHeight - height - margin
  )
}

function stopDrag() {
  if (typeof window === 'undefined') return

  isDragging.value = false

  if (activePointerId !== null) {
    beeShellRef.value?.releasePointerCapture?.(activePointerId)
    activePointerId = null
  }

  window.removeEventListener('pointermove', handleDragMove)
  window.removeEventListener('pointerup', stopDrag)
  window.removeEventListener('pointercancel', stopDrag)
}

function handleDragMove(event: PointerEvent) {
  if (!isDragging.value || isCompactViewport.value) return

  beePosition.value = clampBeePosition(
    event.clientX - dragOffsetX,
    event.clientY - dragOffsetY
  )
}

function beginDrag(event: PointerEvent) {
  if (isCompactViewport.value || event.button !== 0) return

  const target = event.target as HTMLElement | null
  if (target?.closest('button, a, input, textarea')) return

  const shellRect = beeShellRef.value?.getBoundingClientRect()
  if (!shellRect) return

  event.preventDefault()
  showInfoTooltip.value = false

  activePointerId = event.pointerId
  beeShellRef.value?.setPointerCapture?.(event.pointerId)
  dragOffsetX = event.clientX - shellRect.left
  dragOffsetY = event.clientY - shellRect.top
  isDragging.value = true

  window.addEventListener('pointermove', handleDragMove)
  window.addEventListener('pointerup', stopDrag)
  window.addEventListener('pointercancel', stopDrag)
}

async function handleViewportResize() {
  const wasCompact = isCompactViewport.value
  updateViewportMode()

  if (isCompactViewport.value) {
    stopDrag()
    return
  }

  if (wasCompact) {
    await ensureBeePosition(true)
    return
  }

  if (beePosition.value.left !== null && beePosition.value.top !== null) {
    beePosition.value = clampBeePosition(beePosition.value.left, beePosition.value.top)
    return
  }

  await ensureBeePosition(true)
}

watch(
  () => props.visible,
  async (visible) => {
    if (!visible) {
      showInfoTooltip.value = false
      stopDrag()
      return
    }

    await ensureBeePosition()
    await scrollToBottom('auto')
    focusComposer()
  }
)

watch(
  () => messages.value.length,
  async () => {
    if (props.visible) {
      await scrollToBottom()
    }
  }
)

async function submitMessage(messageText = draftMessage.value) {
  const trimmed = messageText.trim()
  if (!trimmed || isBusy.value) return

  const history: BeeChatTurn[] = messages.value
    .map((message) => ({
      role: message.role,
      content: message.content
    }))
    .slice(-10)

  messages.value.push(createMessage('user', trimmed))
  draftMessage.value = ''
  isBusy.value = true

  await scrollToBottom()

  try {
    const result = await runBeeAgent({
      conversation: history,
      userMessage: trimmed,
      contactState: props.contactState,
      handlers: {
        navigateTo: props.navigateTo,
        draftEmail: props.draftEmail,
        updateSender: props.updateSender,
        sendEmail: props.sendEmail
      }
    })

    messages.value.push(createMessage('assistant', result.reply))
  } catch (error) {
    console.error(error)
    messages.value.push(
      createMessage(
        'assistant',
        'I ran into an unexpected issue while answering that. Please try again once more.'
      )
    )
  } finally {
    isBusy.value = false
    await scrollToBottom()
    focusComposer()
  }
}

function useQuickAction(prompt: string) {
  void submitMessage(prompt)
}

function handleComposerKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    void submitMessage()
  }
}

if (typeof window !== 'undefined') {
  updateViewportMode()
  window.addEventListener('resize', handleViewportResize)
}

onBeforeUnmount(() => {
  stopDrag()

  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleViewportResize)
  }
})
</script>

<style scoped>
.bee-shell {
  position: fixed;
  right: 1.2rem;
  bottom: 1.2rem;
  z-index: 10010;
}

.bee-shell-dragging {
  transition: none !important;
}

.bee-window {
  display: flex;
  width: min(31rem, calc(100vw - 1.6rem));
  min-width: 22rem;
  max-width: min(38rem, calc(100vw - 1.6rem));
  height: min(39rem, calc(100vh - 1.8rem));
  min-height: 26rem;
  max-height: calc(100vh - 1.6rem);
  flex-direction: column;
  overflow: hidden;
  resize: both;
  border-radius: 1.6rem;
  border: 1px solid rgba(103, 232, 249, 0.18);
  background:
    linear-gradient(rgba(103, 232, 249, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(103, 232, 249, 0.03) 1px, transparent 1px),
    linear-gradient(180deg, rgba(4, 12, 22, 0.9), rgba(3, 9, 18, 0.94));
  background-size: 24px 24px, 24px 24px, auto;
  box-shadow:
    0 24px 80px rgba(0, 0, 0, 0.42),
    0 0 0 1px rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(22px);
}

.bee-header,
.bee-footer {
  flex-shrink: 0;
  border-bottom: 1px solid rgba(103, 232, 249, 0.1);
  background: rgba(3, 9, 18, 0.44);
}

.bee-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1rem 0.9rem;
}

.bee-header-draggable {
  cursor: grab;
  user-select: none;
}

.bee-header-dragging {
  cursor: grabbing;
}

.bee-brand {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.bee-brand-icon,
.bee-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid rgba(103, 232, 249, 0.18);
  background: rgba(10, 17, 28, 0.64);
  color: rgba(224, 242, 254, 0.92);
}

.bee-brand-icon {
  width: 2.4rem;
  height: 2.4rem;
  box-shadow: 0 0 26px rgba(34, 211, 238, 0.12);
}

.bee-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.95rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(224, 242, 254, 0.95);
}

.bee-subtitle {
  margin-top: 0.15rem;
  font-size: 0.78rem;
  color: rgba(186, 230, 253, 0.62);
}

.bee-header-actions {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.bee-info-wrap {
  position: relative;
}

.bee-icon-button {
  width: 2.1rem;
  height: 2.1rem;
  transition:
    transform 220ms ease,
    border-color 220ms ease,
    background-color 220ms ease;
}

.bee-icon-button:hover {
  transform: translateY(-1px);
  border-color: rgba(103, 232, 249, 0.34);
  background: rgba(10, 17, 28, 0.82);
}

.bee-tooltip {
  position: absolute;
  top: calc(100% + 0.65rem);
  right: 0;
  width: min(18rem, 72vw);
  padding: 0.95rem 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(103, 232, 249, 0.14);
  background: rgba(4, 10, 18, 0.92);
  color: rgba(226, 232, 240, 0.84);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.34);
  opacity: 0;
  pointer-events: none;
  transform: translateY(-4px);
  transition: opacity 180ms ease, transform 180ms ease;
}

.bee-tooltip-visible {
  opacity: 1;
  transform: translateY(0);
}

.bee-tooltip-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(103, 232, 249, 0.82);
}

.bee-tooltip-list {
  margin: 0.7rem 0 0;
  padding-left: 1rem;
  display: grid;
  gap: 0.45rem;
  font-size: 0.8rem;
  line-height: 1.55;
}

.bee-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.bee-row {
  display: flex;
}

.bee-row-user {
  justify-content: flex-end;
}

.bee-row-assistant {
  justify-content: flex-start;
}

.bee-bubble {
  max-width: min(87%, 30rem);
  padding: 0.92rem 1rem;
  border-radius: 1.15rem;
  font-size: 0.92rem;
  line-height: 1.65;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.22);
}

.bee-bubble-assistant {
  border: 1px solid rgba(103, 232, 249, 0.12);
  background: rgba(7, 15, 28, 0.84);
  color: rgba(226, 232, 240, 0.9);
  border-top-left-radius: 0.45rem;
}

.bee-bubble-user {
  border: 1px solid rgba(34, 211, 238, 0.18);
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.18), rgba(14, 165, 233, 0.12));
  color: rgba(240, 249, 255, 0.98);
  border-top-right-radius: 0.45rem;
}

.bee-bubble-thinking {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.bee-thinking-dot {
  width: 0.42rem;
  height: 0.42rem;
  border-radius: 999px;
  background: rgba(103, 232, 249, 0.86);
  animation: bee-pulse 900ms ease-in-out infinite;
}

.bee-thinking-dot:nth-child(2) {
  animation-delay: 150ms;
}

.bee-thinking-dot:nth-child(3) {
  animation-delay: 300ms;
}

.bee-shortcuts {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  padding: 0 1rem 1rem;
}

.bee-shortcut {
  border-radius: 999px;
  border: 1px solid rgba(103, 232, 249, 0.14);
  background: rgba(8, 13, 22, 0.44);
  padding: 0.62rem 0.82rem;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.67rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(226, 232, 240, 0.86);
  transition:
    transform 220ms ease,
    border-color 220ms ease,
    background-color 220ms ease;
}

.bee-shortcut:hover {
  transform: translateY(-1px);
  border-color: rgba(103, 232, 249, 0.3);
  background: rgba(12, 19, 30, 0.7);
}

.bee-footer {
  border-bottom: none;
  border-top: 1px solid rgba(103, 232, 249, 0.1);
  padding: 0.9rem 1rem 1rem;
}

.bee-footer-note {
  margin-bottom: 0.72rem;
  font-size: 0.74rem;
  color: rgba(186, 230, 253, 0.48);
}

.bee-composer {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.75rem;
  align-items: end;
}

.bee-input {
  min-height: 3.4rem;
  max-height: 8.75rem;
  resize: none;
  border-radius: 1.15rem;
  border: 1px solid rgba(103, 232, 249, 0.12);
  background: rgba(4, 10, 18, 0.72);
  padding: 0.92rem 1rem;
  color: rgba(255, 255, 255, 0.96);
  line-height: 1.55;
  transition: border-color 220ms ease, box-shadow 220ms ease;
}

.bee-input::placeholder {
  color: rgba(186, 230, 253, 0.34);
}

.bee-input:focus {
  outline: none;
  border-color: rgba(103, 232, 249, 0.34);
  box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.08);
}

.bee-send {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 999px;
  border: 1px solid rgba(34, 211, 238, 0.24);
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(14, 165, 233, 0.16));
  padding: 0.95rem 1.05rem;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.72rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(240, 249, 255, 0.98);
  transition:
    transform 220ms ease,
    border-color 220ms ease,
    opacity 220ms ease;
}

.bee-send:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: rgba(103, 232, 249, 0.4);
}

.bee-send:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.bee-float-enter-active,
.bee-float-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
}

.bee-float-enter-from,
.bee-float-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.985);
}

@keyframes bee-pulse {
  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.35;
  }

  40% {
    transform: translateY(-2px);
    opacity: 1;
  }
}

@media (max-width: 640px) {
  .bee-shell {
    left: 0.75rem;
    right: 0.75rem;
    bottom: 0.75rem;
  }

  .bee-window {
    width: 100%;
    min-width: 0;
    max-width: none;
    min-height: 24rem;
    height: min(34rem, calc(100vh - 1.5rem));
    resize: none;
  }

  .bee-composer {
    grid-template-columns: 1fr;
  }

  .bee-send {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bee-icon-button,
  .bee-shortcut,
  .bee-send,
  .bee-tooltip,
  .bee-float-enter-active,
  .bee-float-leave-active,
  .bee-thinking-dot {
    transition: none !important;
    animation: none !important;
    transform: none !important;
  }
}
</style>
