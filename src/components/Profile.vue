<template>
  <transition name="profile-fade">
    <div
      v-if="visible"
      class="profile-backdrop fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-slate-950/82 px-4 py-4 backdrop-blur-sm sm:px-6"
    >
      <div class="mx-auto w-full max-w-6xl">
        <div class="profile-shell max-h-[92vh] overflow-y-auto rounded-[2rem] border border-cyan-400/15 bg-slate-950/90 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:p-5">
          <div class="flex shrink-0 items-start justify-between gap-4 border-b border-cyan-300/10 pb-4">
            <div>
              <p class="font-display text-xs uppercase tracking-[0.45em] text-cyan-300/60">Profile</p>
              <h2 class="mt-2 text-2xl font-semibold text-white sm:text-3xl">{{ portfolio.fullName }}</h2>
            </div>
            <button
              class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/15 bg-black/30 text-cyan-100 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-200/30"
              @click="close"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <div class="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.18fr)_minmax(0,0.96fr)]">
            <div class="grid content-start gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
              <aside class="grid content-start">
                <article class="profile-panel p-4">
                  <div class="flex flex-col items-center text-center">
                    <img
                      src="/Screenshot 2025-08-02 at 9.39.42 PM.png"
                      alt="Adhikari Hari Charan"
                      class="h-24 w-24 rounded-full border border-cyan-300/15 object-cover shadow-[0_18px_35px_rgba(0,0,0,0.25)]"
                    />
                    <div class="mt-4 min-w-0">
                      <p class="font-display text-[11px] uppercase tracking-[0.38em] text-cyan-300/58">
                        {{ portfolio.role }}
                      </p>
                      <h3 class="mt-2 text-lg font-semibold text-white">{{ portfolio.name }}</h3>
                      <p class="profile-headline-clamp mt-2 text-xs leading-6 text-slate-300/72">
                        {{ portfolio.headline }}
                      </p>
                    </div>
                  </div>

                  <div class="mt-4 grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
                    <div class="profile-row">
                      <MapPin class="h-4 w-4 text-cyan-300" />
                      <span>{{ portfolio.location }}</span>
                    </div>
                    <div class="profile-row">
                      <Mail class="h-4 w-4 text-cyan-300" />
                      <span>{{ portfolio.email }}</span>
                    </div>
                    <div class="profile-row">
                      <Phone class="h-4 w-4 text-cyan-300" />
                      <span>{{ portfolio.phone }}</span>
                    </div>
                  </div>

                  <div class="mt-4 flex flex-wrap gap-2">
                    <a
                      :href="portfolio.resumeUrl"
                      target="_blank"
                      rel="noreferrer"
                      class="profile-button profile-button-primary"
                    >
                      <FileText class="h-4 w-4" />
                      Resume
                    </a>
                    <a :href="`mailto:${portfolio.email}`" class="profile-button profile-button-secondary">
                      <Mail class="h-4 w-4" />
                      Email
                    </a>
                  </div>
                </article>
              </aside>

              <div class="grid content-start gap-4">
                <article class="profile-panel p-4">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <p class="font-display text-xs uppercase tracking-[0.45em] text-cyan-300/60">About</p>
                      <h3 class="mt-2 text-xl font-semibold text-white">Quick summary</h3>
                    </div>
                    <Sparkles class="h-5 w-5 text-cyan-300" />
                  </div>

                  <p class="profile-summary-extended mt-4 text-sm leading-7 text-slate-300/76">
                    {{ portfolio.about }}
                  </p>
                </article>

                <article class="profile-panel p-4">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <p class="font-display text-xs uppercase tracking-[0.45em] text-cyan-300/60">Experience</p>
                      <h3 class="mt-2 text-xl font-semibold text-white">Recent roles</h3>
                    </div>
                    <BriefcaseBusiness class="h-5 w-5 text-cyan-300" />
                  </div>

                  <div class="mt-4 grid gap-3">
                    <article
                      v-for="item in portfolio.experience"
                      :key="item.company"
                      class="summary-row"
                    >
                      <div class="min-w-0">
                        <div class="text-[10px] uppercase tracking-[0.35em] text-cyan-300/50">{{ item.period }}</div>
                        <h4 class="mt-1 text-base font-semibold text-white">{{ item.company }}</h4>
                        <p class="mt-1 text-xs uppercase tracking-[0.24em] text-cyan-300/50">{{ item.role }}</p>
                        <p class="mt-2 text-xs text-slate-300/72">{{ item.location }}</p>
                      </div>
                    </article>
                  </div>
                </article>
              </div>

              <article class="profile-panel p-4 lg:col-span-2">
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="font-display text-xs uppercase tracking-[0.45em] text-cyan-300/60">Find me online</p>
                  </div>
                </div>

                <div class="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <a
                    v-for="social in portfolio.socials"
                    :key="social.label"
                    :href="social.href"
                    target="_blank"
                    rel="noreferrer"
                    class="profile-link profile-link-compact"
                  >
                    <div class="rounded-2xl border border-cyan-300/15 bg-black/35 p-2.5 text-cyan-100">
                      <component :is="socialIcons[social.kind]" class="h-4.5 w-4.5" />
                    </div>
                    <div class="text-xs font-semibold text-white">{{ social.label }}</div>
                  </a>
                </div>
              </article>
            </div>

            <div class="grid content-start gap-4">
              <article class="profile-panel p-4">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="font-display text-xs uppercase tracking-[0.45em] text-cyan-300/60">Skills</p>
                    <h3 class="mt-2 text-xl font-semibold text-white">Core stack</h3>
                  </div>
                  <Braces class="h-5 w-5 text-cyan-300" />
                </div>

                <div class="mt-4 flex flex-wrap gap-2">
                  <span v-for="skill in coreSkills" :key="skill" class="profile-chip">
                    {{ skill }}
                  </span>
                </div>
              </article>

              <article class="profile-panel p-4">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="font-display text-xs uppercase tracking-[0.45em] text-cyan-300/60">Education</p>
                    <h3 class="mt-2 text-xl font-semibold text-white">Academic background</h3>
                  </div>
                  <GraduationCap class="h-5 w-5 text-cyan-300" />
                </div>

                <div class="mt-4 grid gap-3">
                  <article
                    v-for="item in portfolio.education"
                    :key="item.school"
                    class="summary-row summary-row-education"
                  >
                    <img
                      :src="item.logo"
                      :alt="item.school"
                      class="h-11 w-11 rounded-2xl border border-cyan-300/15 object-cover"
                    />
                    <div class="min-w-0">
                      <div class="text-[10px] uppercase tracking-[0.35em] text-cyan-300/50">{{ item.period }}</div>
                      <h4 class="mt-1 text-base font-semibold text-white">{{ item.school }}</h4>
                      <p class="mt-1 text-xs text-slate-300/72">{{ item.note }}</p>
                    </div>
                    <div class="rounded-2xl border border-cyan-300/10 bg-black/25 px-3 py-2 text-right">
                      <div class="text-[10px] uppercase tracking-[0.32em] text-cyan-300/45">Score</div>
                      <div class="mt-1 text-sm font-semibold text-white">{{ item.score }}</div>
                    </div>
                  </article>
                </div>
              </article>
            </div>

          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  BriefcaseBusiness,
  Braces,
  FileText,
  Github,
  GraduationCap,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  X,
} from 'lucide-vue-next'
import { portfolio } from '../data/portfolio'

defineProps<{ visible: boolean }>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const close = () => emit('close')

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  leetcode: Braces,
  instagram: Instagram
} as const

const coreSkills = computed(() =>
  Array.from(new Set(portfolio.skillGroups.flatMap((group) => group.items)))
)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Space+Grotesk:wght@400;500;700&display=swap');

.profile-shell {
  min-height: 0;
  font-family: 'Space Grotesk', sans-serif;
  background:
    linear-gradient(rgba(103, 232, 249, 0.028) 1px, transparent 1px),
    linear-gradient(90deg, rgba(103, 232, 249, 0.028) 1px, transparent 1px),
    radial-gradient(circle at top right, rgba(34, 211, 238, 0.08), transparent 26%),
    linear-gradient(180deg, rgba(10, 17, 29, 0.9), rgba(5, 10, 18, 0.96));
  background-size: 34px 34px, 34px 34px, auto, auto;
}

.font-display {
  font-family: 'Orbitron', sans-serif;
}

.profile-backdrop {
  background:
    linear-gradient(rgba(103, 232, 249, 0.026) 1px, transparent 1px),
    linear-gradient(90deg, rgba(103, 232, 249, 0.026) 1px, transparent 1px),
    radial-gradient(circle at top left, rgba(8, 145, 178, 0.12), transparent 26%),
    rgba(2, 6, 23, 0.88);
  background-size: 34px 34px, 34px 34px, auto, auto;
}

.profile-panel,
.education-row,
.skill-group,
.experience-row,
.achievement-card,
.profile-link,
.profile-row,
.profile-metric,
.summary-row {
  border-radius: 1.5rem;
}

.profile-panel {
  border: 1px solid rgba(103, 232, 249, 0.14);
  background:
    linear-gradient(rgba(103, 232, 249, 0.024) 1px, transparent 1px),
    linear-gradient(90deg, rgba(103, 232, 249, 0.024) 1px, transparent 1px),
    linear-gradient(180deg, rgba(10, 17, 29, 0.88), rgba(5, 10, 18, 0.94));
  background-size: 28px 28px, 28px 28px, auto;
  box-shadow:
    0 24px 64px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(14px);
}

.profile-row,
.education-row,
.skill-group,
.experience-row,
.achievement-card,
.profile-link,
.profile-metric,
.summary-row {
  border: 1px solid rgba(103, 232, 249, 0.09);
  background: rgba(6, 10, 18, 0.36);
}

.profile-link,
.profile-row,
.profile-metric {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  color: rgba(226, 232, 240, 0.8);
}

.profile-link {
  justify-content: space-between;
  padding: 0.9rem 0.95rem;
}

.profile-link-compact {
  flex-direction: column;
  justify-content: center;
  padding: 0.82rem 0.55rem;
  gap: 0.55rem;
  text-align: center;
}

.profile-row {
  justify-content: flex-start;
  padding: 0.82rem 0.95rem;
  font-size: 0.82rem;
}

.profile-row span {
  min-width: 0;
  overflow-wrap: anywhere;
}

.profile-metric {
  justify-content: space-between;
  padding: 0.78rem 0.95rem;
}

.profile-metric span:last-child {
  text-align: right;
}

.summary-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem;
}

.summary-row-education {
  align-items: center;
}

.education-row {
  display: grid;
  gap: 0.85rem;
  align-items: center;
  padding: 0.9rem;
}

.skill-group,
.experience-row {
  padding: 0.9rem;
}

.achievement-card {
  display: flex;
  gap: 0.9rem;
  padding: 0.9rem;
}

.profile-dot {
  width: 0.72rem;
  height: 0.72rem;
  flex-shrink: 0;
  margin-top: 0.35rem;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(34, 211, 238, 1), rgba(59, 130, 246, 0.9));
  box-shadow: 0 0 16px rgba(34, 211, 238, 0.45);
}

.profile-chip {
  border-radius: 999px;
  border: 1px solid rgba(103, 232, 249, 0.12);
  background: rgba(6, 10, 18, 0.34);
  padding: 0.46rem 0.72rem;
  font-size: 0.72rem;
  color: rgba(226, 232, 240, 0.84);
}

.profile-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  border-radius: 999px;
  padding: 0.74rem 0.96rem;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transition:
    transform 240ms ease,
    border-color 240ms ease,
    background-color 240ms ease;
}

.profile-button-primary {
  border: 1px solid rgba(34, 211, 238, 0.28);
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(14, 165, 233, 0.12));
  color: rgba(236, 254, 255, 0.96);
}

.profile-button-secondary {
  border: 1px solid rgba(103, 232, 249, 0.12);
  background: rgba(8, 13, 22, 0.38);
  color: rgba(226, 232, 240, 0.86);
}

.profile-button:hover,
.profile-link:hover {
  transform: translateY(-2px);
  border-color: rgba(103, 232, 249, 0.28);
}

.profile-fade-enter-active,
.profile-fade-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
}

.profile-fade-enter-from,
.profile-fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

.profile-copy-clamp,
.profile-summary-clamp,
.profile-summary-extended,
.profile-headline-clamp {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
}

.profile-copy-clamp {
  -webkit-line-clamp: 4;
}

.profile-summary-clamp {
  -webkit-line-clamp: 3;
}

.profile-summary-extended {
  -webkit-line-clamp: 5;
}

.profile-headline-clamp {
  -webkit-line-clamp: 3;
}

.profile-count {
  display: inline-flex;
  min-width: 1.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid rgba(103, 232, 249, 0.14);
  background: rgba(34, 211, 238, 0.08);
  padding: 0.2rem 0.45rem;
  font-size: 0.68rem;
  color: rgba(207, 250, 254, 0.9);
}

.profile-bullet-row {
  display: flex;
  align-items: flex-start;
  gap: 0.55rem;
}

.profile-mini-dot {
  margin-top: 0.42rem;
  width: 0.38rem;
  height: 0.38rem;
  flex-shrink: 0;
  border-radius: 999px;
  background: rgba(103, 232, 249, 0.84);
  box-shadow: 0 0 12px rgba(34, 211, 238, 0.28);
}

* {
  scrollbar-width: thin;
  scrollbar-color: rgba(103, 232, 249, 0.24) transparent;
}

*::-webkit-scrollbar {
  width: 8px;
}

*::-webkit-scrollbar-track {
  background: transparent;
}

*::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(103, 232, 249, 0.2);
}

@media (min-width: 640px) {
  .education-row {
    grid-template-columns: auto 1fr auto;
  }

  .summary-row-education {
    display: grid;
    grid-template-columns: auto 1fr auto;
  }
}
</style>
