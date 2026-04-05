<template>
  <div class="intro-shell fixed inset-0 z-[95] flex min-h-screen items-center justify-center px-6 py-10">
    <div class="intro-panel w-full max-w-4xl overflow-hidden rounded-[2rem] border border-cyan-400/15">
      <div class="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
        <div class="flex flex-col justify-center">
          <p class="font-display text-xs uppercase tracking-[0.55em] text-cyan-300/60">Portfolio</p>
          <h1 class="mt-5 font-display text-4xl leading-tight text-white sm:text-5xl">
            Adhikari Hari Charan
          </h1>
          <p class="mt-4 max-w-2xl text-base leading-8 text-slate-300/80 sm:text-lg">
            Software developer focused on full-stack products, automation, and strong AI workflow integration.
          </p>

          <div class="mt-7 flex flex-wrap gap-3">
            <span class="intro-chip">AI Automation</span>
            <span class="intro-chip">LLM Workflows</span>
            <span class="intro-chip">Vue + TypeScript</span>
          </div>

          <div class="mt-8">
            <button
              @click="$emit('start')"
              class="intro-button"
            >
              Enter Portfolio
            </button>
          </div>
        </div>

        <div class="intro-card border rounded-xl p-5  border-cyan-400/15 sm:p-6">
          <div class="flex items-start gap-4">
            <img
              src="/Screenshot 2025-08-02 at 9.39.42 PM.png"
              alt="Adhikari Hari Charan"
              class="h-16 w-16 rounded-2xl border border-cyan-300/15 object-cover"
            />
          
          </div>

          <div class="mt-6 grid gap-3">
            <div class="intro-row">
              <span class="intro-label">Role</span>
              <span class="intro-value">Software Developer</span>
            </div>
            <div class="intro-row">
              <span class="intro-label">Focus</span>
              <span class="intro-value">OpenAI, LangChain, Gemini, Intelligent Automation</span>
            </div>
            <div class="intro-row">
              <span class="intro-label">Base</span>
              <span class="intro-value">Palakol, Andhra Pradesh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  (event: 'start'): void
}>()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Space+Grotesk:wght@400;500;700&display=swap');

.intro-shell {
  font-family: 'Space Grotesk', sans-serif;
  background:
    linear-gradient(rgba(103, 232, 249, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(103, 232, 249, 0.035) 1px, transparent 1px),
    radial-gradient(circle at top left, rgba(8, 145, 178, 0.18), transparent 28%),
    radial-gradient(circle at top right, rgba(14, 165, 233, 0.15), transparent 30%),
    linear-gradient(180deg, #04070d 0%, #07111d 50%, #04070d 100%);
  background-size: 32px 32px, 32px 32px, auto, auto, auto;
}

.font-display {
  font-family: 'Orbitron', sans-serif;
}

.intro-panel {
  background:
    linear-gradient(rgba(103, 232, 249, 0.026) 1px, transparent 1px),
    linear-gradient(90deg, rgba(103, 232, 249, 0.026) 1px, transparent 1px),
    radial-gradient(circle at top right, rgba(34, 211, 238, 0.08), transparent 26%),
    linear-gradient(180deg, rgba(10, 17, 29, 0.88), rgba(5, 10, 18, 0.94));
  background-size: 30px 30px, 30px 30px, auto, auto;
  box-shadow:
    0 30px 90px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
}

.intro-card {
  background:
    linear-gradient(rgba(103, 232, 249, 0.022) 1px, transparent 1px),
    linear-gradient(90deg, rgba(103, 232, 249, 0.022) 1px, transparent 1px),
    linear-gradient(180deg, rgba(8, 13, 22, 0.52), rgba(6, 10, 18, 0.42));
  background-size: 24px 24px, 24px 24px, auto;
}

.intro-chip {
  border-radius: 999px;
  border: 1px solid rgba(103, 232, 249, 0.12);
  background: rgba(6, 10, 18, 0.34);
  padding: 0.6rem 0.85rem;
  font-size: 0.78rem;
  color: rgba(226, 232, 240, 0.84);
}

.intro-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.85rem;
  border: 1px solid rgba(34, 211, 238, 0.28);
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.22), rgba(14, 165, 233, 0.14));
  padding: 0.95rem 1.7rem;
  color: rgba(236, 254, 255, 0.96);
  font-family: 'Orbitron', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  transition:
    transform 240ms ease,
    color 240ms ease,
    border-color 240ms ease,
    background-color 240ms ease;
  box-shadow:
    0 18px 45px rgba(0, 0, 0, 0.35),
    0 0 24px rgba(34, 211, 238, 0.12);
}

.intro-button:hover {
  transform: translateY(-2px);
  border-color: rgba(103, 232, 249, 0.34);
  color: white;
}

.intro-row {
  display: grid;
  gap: 0.35rem;
  border-radius: 1rem;
  border: 1px solid rgba(103, 232, 249, 0.08);
  background:
    linear-gradient(rgba(103, 232, 249, 0.018) 1px, transparent 1px),
    linear-gradient(90deg, rgba(103, 232, 249, 0.018) 1px, transparent 1px),
    rgba(6, 10, 18, 0.34);
  background-size: 20px 20px, 20px 20px, auto;
  padding: 0.9rem 1rem;
}

.intro-label {
  font-size: 0.72rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(103, 232, 249, 0.55);
  font-family: 'Orbitron', sans-serif;
}

.intro-value {
  font-size: 0.92rem;
  color: rgba(226, 232, 240, 0.84);
  line-height: 1.6;
}
</style>
