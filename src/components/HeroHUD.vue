<template>
  <div class="portfolio-shell min-h-screen overflow-x-hidden text-slate-100">
    <IntroStart v-if="!introStarted && !introDone" @start="introStarted = true" />

    <nav
      v-if="introDone"
      class="fixed inset-x-0 top-0 z-50 "
    >
      <div class="mx-auto flex min-h-[4.5rem] max-w-8xl items-center justify-between gap-3 border-b border-cyan-400/15 bg-slate-950/75 px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:gap-4">
        <button class="nav-brand" @click="scrollTo('home')">
          <div class="nav-brand-name">{{ portfolio.name }}</div>
          <div class="nav-brand-role">Software Developer</div>
        </button>

        <div class="hidden items-center gap-1.5 xl:flex 2xl:gap-2">
          <button
            v-for="item in navItems"
            :key="item.label"
            class="nav-chip"
            @click="item.action()"
          >
            <component :is="item.icon" class="h-4 w-4" />
            <span>{{ item.label }}</span>
          </button>
        </div>

        <div class="flex shrink-0 items-center gap-2">
          <a
            :href="portfolio.resumeUrl"
            target="_blank"
            rel="noreferrer"
            class="hidden items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-200/40 hover:bg-cyan-300/15 md:flex"
          >
            <FileText class="h-4 w-4" />
            Resume
          </a>
          <button class="mobile-toggle xl:hidden" @click="isMenuOpen = !isMenuOpen">
            <Menu class="h-5 w-5" />
          </button>
        </div>
      </div>

      <transition name="menu-fade">
        <div
          v-if="isMenuOpen"
          class="mx-auto mt-3 max-w-7xl rounded-3xl border border-cyan-400/15 bg-slate-950/90 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl xl:hidden"
        >
          <div class="grid gap-2">
            <button
              v-for="item in navItems"
              :key="`${item.label}-mobile`"
              class="mobile-nav-link"
              @click="item.action()"
            >
              <component :is="item.icon" class="h-4 w-4" />
              <span>{{ item.label }}</span>
            </button>
            <a
              :href="portfolio.resumeUrl"
              target="_blank"
              rel="noreferrer"
              class="mobile-nav-link"
              @click="isMenuOpen = false"
            >
              <FileText class="h-4 w-4" />
              <span>Resume</span>
            </a>
          </div>
        </div>
      </transition>
    </nav>

    <div
      class="relative transition duration-700"
      :class="introStarted || introDone ? 'opacity-100' : 'pointer-events-none opacity-0'"
    >
      <section id="home" class="relative min-h-screen overflow-hidden">
        <iframe
          src="https://my.spline.design/thresholddarkambientui-gwvaPilEOywrJqpAK5XxoaTi/"
          frameborder="0"
          loading="eager"
          class="absolute inset-0 h-full w-full border-0"
        ></iframe>
        <div class="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-950 via-slate-950/65 to-transparent"></div>
        <div class="ask-ai-stack absolute bottom-5 right-4 z-20">
          <div class="ask-ai-tip">
            This is my assistant. Ask anything about me.
          </div>
          <button type="button" class="ask-ai-chip" @click="openBeeAssistant">
            <BeeIcon class="h-10 w-10 " />
            <span>Talk to Bee AI</span>
          </button>
        </div>
      </section>

      <template v-if="introDone">
      <section
        id="about"
        ref="aboutRef"
        class="section-shell"
      >
        <div class="mx-auto max-w-7xl section-reveal" :class="{ 'is-visible': sectionVisible.about }">
          <div class="about-shell">
            <div class="about-copy">
              <h2 class="font-display text-4xl font-bold text-cyan-300 sm:text-5xl">
                About Me
              </h2>
              <p class="mt-6 max-w-4xl text-base leading-8 text-slate-200/82 sm:text-lg">
                {{ portfolio.about }}
              </p>
            </div>

            <img
              src="/black bg.png"
              alt="Decorative art"
              class="about-art"
            />
          </div>
        </div>
      </section>

      <section id="skills" ref="skillsRef" class="section-shell section-shell-alt">
        <div class="mx-auto max-w-7xl section-reveal" :class="{ 'is-visible': sectionVisible.skills }">
          <div class="section-heading">
            <h2 class="section-kicker">Skills</h2>
            <p class="section-copy max-w-3xl">
              My work spans frontend development, backend services, AI workflows, cloud platforms, and design tools used to build practical software products.
            </p>
          </div>

          <div class="mt-10 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <div class="grid gap-4 md:grid-cols-2">
              <article
                v-for="group in portfolio.skillGroups"
                :key="group.key"
                class="panel-frame skill-card"
              >
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="font-display text-xs uppercase tracking-[0.35em] text-cyan-300/55">{{ group.title }}</p>
                    <h3 class=" mt-2 text-white text-md">{{ group.summary }}</h3>
                  </div>
                  <div class="rounded-2xl border border-cyan-300/15 bg-cyan-300/8 p-3 text-cyan-100">
                    <component :is="skillIcons[group.key]" class="h-5 w-5" />
                  </div>
                </div>
                <div class="mt-4 flex flex-wrap gap-2">
                  <span v-for="item in group.items" :key="item" class="chip">
                    <img
                      v-if="skillItemLogo(item)"
                      :src="skillItemLogo(item)?.src"
                      :alt="skillItemLogo(item)?.alt"
                      class="skill-badge-icon"
                      :class="skillItemLogo(item)?.className"
                      loading="lazy"
                    />
                    <span v-else class="skill-badge-fallback">
                      {{ skillItemBadge(item) }}
                    </span>
                    {{ item }}
                  </span>
                </div>
              </article>
            </div>

            <div class="grid gap-5">
              <article class="panel-frame p-6 sm:p-7">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="font-display text-xs uppercase tracking-[0.35em] text-cyan-300/55">Also strong in</p>
                    <h3 class="mt-3 text-xl font-semibold text-white">Problem solving, communication, and product execution.</h3>
                  </div>
                  <div class="rounded-2xl border border-cyan-300/15 bg-cyan-300/8 p-3 text-cyan-100">
                    <Workflow class="h-5 w-5" />
                  </div>
                </div>
                <div class="mt-6 flex flex-wrap gap-2">
                  <span v-for="item in portfolio.supportSkills" :key="item" class="chip chip-accent">
                    {{ item }}
                  </span>
                </div>
              </article>

              <article class="panel-frame p-6 sm:p-7">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="font-display text-xs uppercase tracking-[0.35em] text-cyan-300/55">Leadership and interests</p>
                    <h3 class="mt-3 text-xl font-semibold text-white">Leadership roles, extracurriculars, and creative interests.</h3>
                  </div>
                  <div class="rounded-2xl border border-cyan-300/15 bg-cyan-300/8 p-3 text-cyan-100">
                    <Award class="h-5 w-5" />
                  </div>
                </div>
                <div class="mt-6 grid gap-3">
                  <article
                    v-for="achievement in portfolio.achievements"
                    :key="achievement.title"
                    class="achievement-row"
                  >
                    <div class="achievement-dot"></div>
                    <div class="min-w-0">
                      <div class="text-sm font-semibold text-white">{{ achievement.title }}</div>
                      <div class="mt-1 text-xs uppercase tracking-[0.35em] text-cyan-300/55">{{ achievement.meta }}</div>
                    </div>
                  </article>
                </div>

                <div class="mt-6 flex flex-wrap gap-2">
                  <span v-for="interest in portfolio.interests" :key="interest" class="chip">
                    {{ interest }}
                  </span>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" ref="projectsRef" class="section-shell">
        <div class="mx-auto max-w-7xl section-reveal" :class="{ 'is-visible': sectionVisible.projects }">
          <div class="section-heading">
            <p class="section-kicker">Projects</p>
            <h2 class="section-title">Selected projects in AI, automation, full-stack development, and design.</h2>
            <p class="section-copy max-w-3xl">
              These projects reflect my work across document intelligence, lead automation, content workflows, web generation, campus navigation, and design tools.
            </p>
          </div>

          <div class="mt-10 grid gap-5 xl:grid-cols-2">
            <article
              v-for="(project, index) in portfolio.projects"
              :key="project.title"
              class="panel-frame project-card"
            >
              <div class="project-media">
                <template v-if="isProjectImageReady(project)">
                  <img :src="projectImageSource(project)" :alt="project.title" class="project-cover-image" />
                </template>
                <template v-else>
                  <div class="project-placeholder" aria-hidden="true"></div>
                </template>
                <div class="project-index">0{{ index + 1 }}</div>
              </div>

              <div class="project-body">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="chip chip-accent">{{ project.category }}</span>
                </div>

                <h3 class="mt-3 text-xl font-semibold text-white sm:text-[1.35rem]">{{ project.title }}</h3>
                <p class="mt-3 text-sm leading-6 text-slate-300/78">
                  {{ project.summary }}
                </p>

                <div class="mt-5 flex flex-wrap gap-2">
                  <span v-for="item in project.stack" :key="item" class="chip">
                    {{ item }}
                  </span>
                </div>

                <div class="mt-6 flex flex-wrap gap-3">
                  <a
                    v-if="project.repo"
                    :href="project.repo"
                    target="_blank"
                    rel="noreferrer"
                    class="button-secondary"
                  >
                    <Github class="h-4 w-4" />
                    Code
                  </a>
                  <a
                    v-if="project.live"
                    :href="project.live"
                    target="_blank"
                    rel="noreferrer"
                    class="button-secondary"
                  >
                    <ArrowUpRight class="h-4 w-4" />
                    Live
                  </a>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="experience" ref="experienceRef" class="section-shell section-shell-alt">
        <div class="mx-auto max-w-7xl section-reveal" :class="{ 'is-visible': sectionVisible.experience }">
          <div class="section-heading">
            <p class="section-kicker">Experience</p>
            <h2 class="section-title">Experience in product engineering, AI workflows, and cloud platforms.</h2>
            <p class="section-copy max-w-3xl">
              My recent work includes product development at ChatFin and cloud-focused internship experience with exposure to deployment, automation, and enterprise integrations.
            </p>
          </div>

          <div class="mt-10">
            <div ref="timelineShellRef" class="timeline-shell panel-frame p-6 sm:p-7">
              <div
                v-if="experienceLineHeight > 0"
                class="timeline-progress-shell"
                :style="{
                  top: `${experienceLineTop}px`,
                  left: `${experienceLineLeft}px`,
                  height: `${experienceLineHeight}px`
                }"
              >
                <span
                  class="timeline-progress-line"
                  :style="{ transform: `scaleY(${experienceLineProgress})` }"
                ></span>
              </div>
              <article
                v-for="(role, index) in experienceTimeline"
                :key="`${role.company}-${role.period}`"
                class="timeline-card"
              >
                <div class="timeline-marker">
                  <span
                    :ref="(el) => setExperienceMarker(el, index)"
                    class="timeline-dot"
                    :class="{
                      'timeline-dot-start': index === experienceTimeline.length - 1,
                      'timeline-dot-complete': index === 0 && experienceLineComplete
                    }"
                  ></span>
                </div>
                <div class="timeline-content">
                  <div class="flex flex-wrap items-start justify-between gap-4">
                    <div class="flex items-center gap-4">
                      <img :src="role.logo" :alt="role.company" class="h-12 w-12 rounded-2xl border border-cyan-300/15 object-cover" />
                      <div>
                        <div class="text-xs uppercase tracking-[0.35em] text-cyan-300/50">{{ role.period }}</div>
                        <h3 class="mt-2 text-xl font-semibold text-white">{{ role.company }}</h3>
                        <p class="mt-1 text-sm text-slate-300/75">{{ role.role }} - {{ role.location }}</p>
                      </div>
                    </div>
                  </div>
                  <p class="mt-4 text-sm leading-7 text-slate-300/78 sm:text-base">{{ role.summary }}</p>
                  <div class="mt-5 grid gap-3">
                    <div v-for="item in role.highlights" :key="item" class="timeline-highlight">
                      <div class="achievement-dot"></div>
                      <p class="text-sm leading-6 text-slate-200/80">{{ item }}</p>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="certificates" ref="certificatesRef" class="section-shell">
        <div class="mx-auto max-w-7xl section-reveal" :class="{ 'is-visible': sectionVisible.certificates }">
          <div class="section-heading">
            <p class="section-kicker">Certificates</p>
            <h2 class="section-title">Certifications across web development, cloud, data, and leadership.</h2>
            <p class="section-copy max-w-3xl">
              These certifications reflect my learning across full-stack development, cloud computing, data engineering, leadership, and foundational programming.
            </p>
          </div>

          <div
            class="panel-frame mt-10 overflow-hidden p-4 sm:p-6"
            @mouseenter="stopCertificateAutoplay"
            @mouseleave="startCertificateAutoplay"
          >
            <div class="flex items-center justify-between gap-4">
              <button class="carousel-button" @click="prevCert">
                <ChevronLeft class="h-5 w-5" />
              </button>
              <div class="text-center">
                <div class="font-display text-xs uppercase tracking-[0.4em] text-cyan-300/55">Now showing</div>
                <div class="mt-2 text-sm text-slate-300/75">{{ currentCertificate.title }}</div>
              </div>
              <button class="carousel-button" @click="nextCert">
                <ChevronRight class="h-5 w-5" />
              </button>
            </div>

            <div class="cert-viewport mt-6">
              <div
                class="cert-track"
                :style="{ transform: `translateX(-${currentCertificateIndex * 100}%)` }"
              >
                <article
                  v-for="certificate in portfolio.certificates"
                  :key="certificate.title"
                  class="cert-slide"
                >
                  <div class="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
                    <div class="cert-visual">
                      <img
                        v-if="certificate.image"
                        :src="certificate.image"
                        :alt="certificate.title"
                        class="h-full w-full object-contain"
                        draggable="false"
                      />
                      <div v-else class="cert-fallback">
                        <Award class="h-10 w-10 text-cyan-300/65" />
                        <div class="mt-4 font-display text-lg text-white">{{ certificate.title }}</div>
                        <p class="mt-3 max-w-md text-sm leading-6 text-slate-300/75">{{ certificate.note }}</p>
                      </div>
                    </div>
                    <div class="cert-copy">
                      <p class="font-display text-xs uppercase tracking-[0.45em] text-cyan-300/55">Certificate</p>
                      <h3 class="mt-4 text-2xl font-semibold text-white">{{ certificate.title }}</h3>
                      <p class="mt-4 text-sm leading-7 text-slate-300/78">
                        Issued by {{ certificate.issuer }} in {{ certificate.date }}.
                      </p>
                      <div class="mt-6 flex flex-wrap gap-2">
                        <span class="chip chip-accent">{{ certificate.issuer }}</span>
                        <span class="chip">{{ certificate.date }}</span>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>

            <div class="mt-6 flex flex-wrap justify-center gap-2">
              <button
                v-for="(certificate, index) in portfolio.certificates"
                :key="`${certificate.title}-indicator`"
                class="indicator-dot"
                :class="{ 'indicator-dot-active': index === currentCertificateIndex }"
                @click="currentCertificateIndex = index"
                :aria-label="`Go to ${certificate.title}`"
              ></button>
            </div>
          </div>
        </div>
      </section>

      <section id="art" ref="artRef" class="section-shell section-shell-alt">
        <div class="mx-auto max-w-7xl section-reveal" :class="{ 'is-visible': sectionVisible.art }">
          <div class="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <div class="section-heading lg:pr-10">
              <p class="section-kicker">UI Design</p>
              <h2 class="section-title">UI explorations and visual design work.</h2>
              <p class="section-copy">
                A selection of interface explorations and visual concepts that reflect my interest in product design, layout, and presentation.
              </p>
            </div>

            <div class="grid grid-cols-2 gap-4 sm:gap-5">
              <article
                v-for="(img, index) in portfolio.artImages"
                :key="img"
                class="art-tile panel-frame"
                :class="index === 0 || index === 3 ? 'translate-y-4 lg:translate-y-8' : ''"
              >
                <img
                  :src="img"
                  :alt="`UI concept ${index + 1}`"
                  class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  draggable="false"
                />
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" ref="contactRef" class="section-shell">
        <div class="mx-auto max-w-7xl section-reveal" :class="{ 'is-visible': sectionVisible.contact }">
          <div class="section-heading">
            <p class="section-kicker">Contact</p>
            <h2 class="section-title">Let&apos;s connect for roles, collaborations, and project discussions.</h2>
            <p class="section-copy max-w-3xl">
              I am open to software engineering opportunities, freelance work, collaborations, and conversations around frontend, AI, and full-stack product development.
            </p>
          </div>

          <div class="mt-10 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <form
              class="panel-frame p-6 sm:p-7"
              @submit.prevent="sendEmail"
            >
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="font-display text-xs uppercase tracking-[0.35em] text-cyan-300/55">Message</p>
                  <h3 class="mt-3 text-2xl font-semibold text-white">Send a note</h3>
                </div>
                <div class="rounded-2xl border border-cyan-300/15 bg-cyan-300/8 p-3 text-cyan-100">
                  <Mail class="h-5 w-5" />
                </div>
              </div>

              <div class="mt-6 grid gap-4">
                <label class="grid gap-2">
                  <span class="text-sm text-slate-300/75">Name</span>
                  <input
                    v-model="contactName"
                    type="text"
                    required
                    class="input-shell"
                    placeholder="Your name"
                  />
                </label>

                <label class="grid gap-2">
                  <span class="text-sm text-slate-300/75">Email</span>
                  <input
                    v-model="contactEmail"
                    type="email"
                    required
                    class="input-shell"
                    placeholder="you@example.com"
                  />
                </label>

                <label class="grid gap-2">
                  <span class="text-sm text-slate-300/75">Subject</span>
                  <input
                    v-model="contactSubject"
                    type="text"
                    required
                    class="input-shell"
                    placeholder="Project, collaboration, or question"
                  />
                </label>

                <label class="grid gap-2">
                  <span class="text-sm text-slate-300/75">Message</span>
                  <textarea
                    v-model="contactMessage"
                    rows="6"
                    required
                    class="input-shell resize-none"
                    placeholder="Tell me what you are building or what you need help with."
                  ></textarea>
                </label>
              </div>

              <div class="mt-6 flex flex-wrap gap-3">
                <button type="submit" :disabled="sending" class="button-primary disabled:cursor-not-allowed disabled:opacity-60">
                  <SendHorizonal class="h-4 w-4" />
                  <span>{{ sending ? 'Sending...' : 'Send Message' }}</span>
                </button>
                <a :href="`mailto:${portfolio.email}`" class="button-secondary">
                  <AtSign class="h-4 w-4" />
                  Email Directly
                </a>
              </div>

              <p v-if="successMsg" class="mt-4 text-sm text-emerald-300">{{ successMsg }}</p>
              <p v-if="errorMsg" class="mt-4 text-sm text-rose-300">{{ errorMsg }}</p>
            </form>

            <div class="grid gap-6">
              <article class="panel-frame p-6 sm:p-7">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="font-display text-xs uppercase tracking-[0.35em] text-cyan-300/55">Contact details</p>
                    <h3 class="mt-3 text-2xl font-semibold text-white">Email, phone, and location.</h3>
                  </div>
                  <div class="rounded-2xl border border-cyan-300/15 bg-cyan-300/8 p-3 text-cyan-100">
                    <Phone class="h-5 w-5" />
                  </div>
                </div>

                <div class="mt-6 grid gap-4">
                  <div class="contact-row">
                    <Phone class="h-4 w-4 text-cyan-300" />
                    <span>{{ portfolio.phone }}</span>
                  </div>
                  <div class="contact-row">
                    <Mail class="h-4 w-4 text-cyan-300" />
                    <span>{{ portfolio.email }}</span>
                  </div>
                  <div class="contact-row">
                    <MapPin class="h-4 w-4 text-cyan-300" />
                    <span>{{ portfolio.location }}</span>
                  </div>
                </div>
              </article>

              <article class="panel-frame p-6 sm:p-7">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="font-display text-xs uppercase tracking-[0.35em] text-cyan-300/55">Profiles</p>
                    <h3 class="mt-3 text-2xl font-semibold text-white">GitHub, LinkedIn, LeetCode, and social profiles.</h3>
                  </div>
                  <div class="rounded-2xl border border-cyan-300/15 bg-cyan-300/8 p-3 text-cyan-100">
                    <Link2 class="h-5 w-5" />
                  </div>
                </div>

                <div class="mt-6 grid gap-3">
                  <a
                    v-for="social in portfolio.socials"
                    :key="social.label"
                    :href="social.href"
                    target="_blank"
                    rel="noreferrer"
                    class="social-card"
                  >
                    <div class="flex items-center gap-3">
                      <div class="rounded-2xl border border-cyan-300/15 bg-black/35 p-3 text-cyan-100">
                        <component :is="socialIcons[social.kind]" class="h-5 w-5" />
                      </div>
                      <div>
                        <div class="text-sm font-semibold text-white">{{ social.label }}</div>
                        <div class="mt-1 text-xs text-slate-300/70">{{ social.value }}</div>
                      </div>
                    </div>
                    <ArrowUpRight class="h-4 w-4 text-cyan-300/65" />
                  </a>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <footer class="border-t border-cyan-400/10 bg-slate-950/65">
        <div class="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-sm text-slate-300/65 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span>© {{ year }} {{ portfolio.name }}. All rights reserved.</span>
        </div>
      </footer>
      </template>
    </div>

    <BeeAssistant
      :visible="isBeeOpen"
      :show-launcher="introDone"
      :contact-state="beeContactState"
      :navigate-to="navigateBee"
      :draft-email="draftBeeEmail"
      :update-sender="updateBeeSender"
      :send-email="sendBeeEmail"
      @open="openBeeAssistant"
      @close="isBeeOpen = false"
    />
    <Profile :visible="showProfile" @close="showProfile = false" />
    <IntroSequence v-if="introStarted && !introDone" @completed="introDone = true" />
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, nextTick, onBeforeUnmount, reactive, ref, watch } from 'vue'
import {
  ArrowUpRight,
  AtSign,
  Award,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Code2,
  FileText,
  Folder,
  Github,
  Home,
  Instagram,
  LayoutGrid,
  Link2,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Palette,
  PanelsTopLeft,
  Phone,
  SendHorizonal,
  Trophy,
  User,
  Workflow,
  Braces,
  Database
} from 'lucide-vue-next'
import IntroSequence from './IntroSequence.vue'
import IntroStart from './IntroStart.vue'
import Profile from './Profile.vue'
import BeeIcon from './BeeIcon.vue'
import { portfolio } from '../data/portfolio'
import type { BeeContactState, BeeDestination } from '../lib/beeAgent'

type SectionKey = 'about' | 'skills' | 'projects' | 'experience' | 'certificates' | 'art' | 'contact'

const BeeAssistant = defineAsyncComponent(() => import('./BeeAssistant.vue'))
const year = new Date().getFullYear()
const introStarted = ref(false)
const introDone = ref(false)
const showProfile = ref(false)
const isMenuOpen = ref(false)
const isBeeOpen = ref(false)

const aboutRef = ref<HTMLElement | null>(null)
const skillsRef = ref<HTMLElement | null>(null)
const projectsRef = ref<HTMLElement | null>(null)
const experienceRef = ref<HTMLElement | null>(null)
const certificatesRef = ref<HTMLElement | null>(null)
const artRef = ref<HTMLElement | null>(null)
const contactRef = ref<HTMLElement | null>(null)
const timelineShellRef = ref<HTMLElement | null>(null)

const experienceMarkerRefs = ref<Array<HTMLElement | null>>([])
const experienceLineTop = ref(0)
const experienceLineLeft = ref(0)
const experienceLineHeight = ref(0)
const experienceLineProgress = ref(0)
const experienceLineComplete = ref(false)
const experienceTimeline = computed(() => portfolio.experience)
const EXPERIENCE_LINE_DURATION = 1800

const sectionVisible = reactive<Record<SectionKey, boolean>>({
  about: false,
  skills: false,
  projects: false,
  experience: false,
  certificates: false,
  art: false,
  contact: false
})
const skillIcons = {
  programming: Code2,
  frontend: PanelsTopLeft,
  backend: Database,
  cloud: Cloud,
  ai: BrainCircuit,
  design: Palette
} as const

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  leetcode: Braces,
  instagram: Instagram
} as const

const skillItemLogos = {
  Java: {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
    alt: 'Java logo'
  },
  Python: {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
    alt: 'Python logo'
  },
  C: {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg',
    alt: 'C logo'
  },
  TypeScript: {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
    alt: 'TypeScript logo'
  },
  'Vue.js': {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg',
    alt: 'Vue.js logo'
  },
  React: {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
    alt: 'React logo'
  },
  HTML: {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
    alt: 'HTML5 logo'
  },
  CSS: {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
    alt: 'CSS3 logo'
  },
  JavaScript: {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
    alt: 'JavaScript logo'
  },
  Vite: {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg',
    alt: 'Vite logo'
  },
  'Tailwind CSS': {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
    alt: 'Tailwind CSS logo'
  },
  'Node.js': {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
    alt: 'Node.js logo'
  },
  Express: {
    src: 'https://cdn.simpleicons.org/express/FFFFFF',
    alt: 'Express logo'
  },
  MongoDB: {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
    alt: 'MongoDB logo'
  },
  Supabase: {
    src: 'https://cdn.simpleicons.org/supabase/3ECF8E',
    alt: 'Supabase logo'
  },
  AWS: {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
    alt: 'AWS logo',
    className: 'skill-badge-icon-wide'
  },
  'Microsoft Azure': {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg',
    alt: 'Microsoft Azure logo'
  },
  'Google Cloud': {
    src: 'https://cdn.simpleicons.org/googlecloud/4285F4',
    alt: 'Google Cloud logo'
  },
  Docker: {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
    alt: 'Docker logo'
  },
  OpenAI: {
    src: '/chatgpt ic on.png',
    alt: 'OpenAI logo',
    className: 'skill-badge-icon-light'
  },
  Gemini: {
    src: 'https://cdn.simpleicons.org/googlegemini/8E75FF',
    alt: 'Gemini logo'
  },
  LangChain: {
    src: 'https://cdn.simpleicons.org/langchain/1C3C3C',
    alt: 'LangChain logo',
    className: 'skill-badge-icon-light'
  },
  'Azure Document Intelligence': {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg',
    alt: 'Azure logo'
  },
  Figma: {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg',
    alt: 'Figma logo'
  },
  Blender: {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg',
    alt: 'Blender logo'
  },
  Photoshop: {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/photoshop/photoshop-plain.svg',
    alt: 'Photoshop logo'
  },
  Illustrator: {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/illustrator/illustrator-plain.svg',
    alt: 'Illustrator logo'
  },
  'After Effects': {
    src: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/aftereffects/aftereffects-plain.svg',
    alt: 'After Effects logo'
  }
} as const

function skillItemLogo(item: string) {
  return skillItemLogos[item as keyof typeof skillItemLogos] ?? null
}

function skillItemBadge(item: string) {
  return item
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  isMenuOpen.value = false
}

function openBeeAssistant() {
  isBeeOpen.value = true
}

const navItems = [
  { label: 'Home', icon: Home, action: () => scrollTo('home') },
  { label: 'Profile', icon: User, action: () => { showProfile.value = true; isMenuOpen.value = false } },
  { label: 'Skills', icon: LayoutGrid, action: () => scrollTo('skills') },
  { label: 'Projects', icon: Folder, action: () => scrollTo('projects') },
  { label: 'Experience', icon: Trophy, action: () => scrollTo('experience') },
  { label: 'Contact', icon: Phone, action: () => scrollTo('contact') }
]

let sectionObserver: IntersectionObserver | null = null

function projectImageSource(project: { image?: string; imagePath: string }) {
  return project.image || project.imagePath
}

function isProjectImageReady(project: { image?: string; imagePath: string }) {
  return !projectImageSource(project).startsWith('/paste/')
}

let experienceFrame: number | null = null
let experienceTrackingActive = false
let experienceLineTimer: ReturnType<typeof setTimeout> | null = null

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max)
}

function setExperienceMarker(el: unknown, index: number) {
  experienceMarkerRefs.value[index] = el instanceof HTMLElement ? el : null
  scheduleExperienceTimelineUpdate()
}

function updateExperienceTimelineMetrics() {
  const shell = timelineShellRef.value
  const markers = experienceMarkerRefs.value.filter((marker): marker is HTMLElement => marker instanceof HTMLElement)

  if (!shell || markers.length < 2) {
    experienceLineTop.value = 0
    experienceLineLeft.value = 0
    experienceLineHeight.value = 0
    return
  }

  const shellRect = shell.getBoundingClientRect()
  const firstRect = markers[0].getBoundingClientRect()
  const lastRect = markers[markers.length - 1].getBoundingClientRect()

  experienceLineTop.value = firstRect.top - shellRect.top + firstRect.height / 2
  experienceLineLeft.value = firstRect.left - shellRect.left + firstRect.width / 2
  experienceLineHeight.value = Math.max(lastRect.top - firstRect.top + lastRect.height / 2 - firstRect.height / 2, 0)
}

function triggerExperienceLine() {
  if (experienceLineProgress.value >= 1 || experienceLineComplete.value) return

  experienceLineProgress.value = 1

  if (experienceLineTimer) {
    clearTimeout(experienceLineTimer)
  }

  experienceLineTimer = setTimeout(() => {
    experienceLineComplete.value = true
    experienceLineTimer = null
  }, EXPERIENCE_LINE_DURATION)
}

function scheduleExperienceTimelineUpdate() {
  if (typeof window === 'undefined' || experienceFrame !== null) return

  experienceFrame = window.requestAnimationFrame(() => {
    experienceFrame = null
    updateExperienceTimelineMetrics()
  })
}

function startExperienceTracking() {
  if (typeof window === 'undefined' || experienceTrackingActive) return
  experienceTrackingActive = true
  window.addEventListener('resize', scheduleExperienceTimelineUpdate)
}

function stopExperienceTracking() {
  if (typeof window === 'undefined' || !experienceTrackingActive) return
  experienceTrackingActive = false
  window.removeEventListener('resize', scheduleExperienceTimelineUpdate)

  if (experienceFrame !== null) {
    window.cancelAnimationFrame(experienceFrame)
    experienceFrame = null
  }

  if (experienceLineTimer) {
    clearTimeout(experienceLineTimer)
    experienceLineTimer = null
  }
}

function observeSections() {
  const sections: Array<[SectionKey, HTMLElement | null]> = [
    ['about', aboutRef.value],
    ['skills', skillsRef.value],
    ['projects', projectsRef.value],
    ['experience', experienceRef.value],
    ['certificates', certificatesRef.value],
    ['art', artRef.value],
    ['contact', contactRef.value]
  ]

  sectionObserver?.disconnect()
  sectionObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const key = (entry.target as HTMLElement).dataset.section as SectionKey | undefined
        if (key && entry.isIntersecting) {
          sectionVisible[key] = true
        }
      }
    },
    {
      threshold: 0.18,
      rootMargin: '0px 0px -10% 0px'
    }
  )

  for (const [key, element] of sections) {
    if (!element) continue
    element.dataset.section = key
    sectionObserver.observe(element)
  }
}

const currentCertificateIndex = ref(0)
const currentCertificate = computed(() => portfolio.certificates[currentCertificateIndex.value])

let certificateTimer: ReturnType<typeof setInterval> | null = null

const nextCert = () => {
  currentCertificateIndex.value = (currentCertificateIndex.value + 1) % portfolio.certificates.length
}

const prevCert = () => {
  currentCertificateIndex.value =
    (currentCertificateIndex.value - 1 + portfolio.certificates.length) % portfolio.certificates.length
}

const stopCertificateAutoplay = () => {
  if (certificateTimer) {
    clearInterval(certificateTimer)
    certificateTimer = null
  }
}

const startCertificateAutoplay = () => {
  stopCertificateAutoplay()
  if (portfolio.certificates.length <= 1) return
  certificateTimer = setInterval(() => {
    nextCert()
  }, 4600)
}

const contactName = ref('')
const contactEmail = ref('')
const contactSubject = ref('')
const contactMessage = ref('')
const sending = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const beeContactState = computed<BeeContactState>(() => ({
  name: contactName.value,
  email: contactEmail.value,
  subject: contactSubject.value,
  message: contactMessage.value
}))

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit'
const WEB3FORMS_ACCESS_KEY = 'a4f9aef0-671c-4d5e-9ea9-105dc8c261e5'

const sendEmail = async () => {
  if (
    !contactName.value.trim()
    || !contactEmail.value.trim()
    || !contactSubject.value.trim()
    || !contactMessage.value.trim()
  ) {
    errorMsg.value = 'Please fill in name, email, subject, and message before sending.'
    successMsg.value = ''
    return false
  }

  sending.value = true
  successMsg.value = ''
  errorMsg.value = ''

  try {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `Portfolio contact: ${contactSubject.value}`,
        from_name: portfolio.name,
        name: contactName.value,
        email: contactEmail.value,
        replyto: contactEmail.value,
        message: contactMessage.value,
        botcheck: ''
      })
    })

    const result = await response.json().catch(() => ({}))

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to send. Please try again.')
    }

    successMsg.value = 'Message sent! I will get back to you soon.'
    contactName.value = ''
    contactEmail.value = ''
    contactSubject.value = ''
    contactMessage.value = ''
    return true
  } catch (error: any) {
    errorMsg.value = error?.message || 'Failed to send. Please try again.'
    console.error(error)
    return false
  } finally {
    sending.value = false
  }
}

async function navigateBee(destination: BeeDestination) {
  openBeeAssistant()

  if (destination === 'profile') {
    showProfile.value = true
    isMenuOpen.value = false
    return `${portfolio.summary} The profile summary is open as well for a quick overview.`
  }

  scrollTo(destination)

  switch (destination) {
    case 'about':
      return `${portfolio.about}`
    case 'skills':
      return 'These are Hari Charan’s core skills across frontend, backend, AI workflows, cloud platforms, and design tools.'
    case 'projects':
      return 'These are Hari Charan’s projects across AI, automation, full-stack development, and product design.'
    case 'experience':
      return 'This section covers Hari Charan’s experience at ChatFin and his cloud computing internship at Academor.'
    case 'certificates':
      return "These are Hari Charan's certificates across full-stack development, cloud, data, and leadership."
    case 'art':
      return 'This section shows Hari Charan’s UI design explorations and visual interface work.'
    case 'contact':
      return `You can reach Hari Charan here by email at ${portfolio.email} or through the contact form.`
  }
}

async function draftBeeEmail(draft: { subject: string; body: string }) {
  successMsg.value = ''
  errorMsg.value = ''
  contactSubject.value = draft.subject.trim()
  contactMessage.value = draft.body.trim()
  scrollTo('contact')
  await nextTick()
  return `I drafted an email for Hari Charan with the subject "${draft.subject}". You can review it here and send it when you're ready.`
}

async function updateBeeSender(details: { name?: string; email?: string }) {
  const updated: string[] = []

  if (typeof details.name === 'string' && details.name.trim()) {
    contactName.value = details.name.trim()
    updated.push('name')
  }

  if (typeof details.email === 'string' && details.email.trim()) {
    contactEmail.value = details.email.trim()
    updated.push('email')
  }

  if (updated.length > 0) {
    successMsg.value = ''
    errorMsg.value = ''
    scrollTo('contact')
    await nextTick()
    return `I added your ${updated.join(' and ')} to the contact form.`
  }

  return 'Sender details were not changed.'
}

async function sendBeeEmail() {
  scrollTo('contact')
  await nextTick()
  const ok = await sendEmail()

  return {
    ok,
    message: ok
      ? successMsg.value || 'Email sent successfully.'
      : errorMsg.value || 'I could not send the email yet.'
  }
}

watch(
  () => sectionVisible.experience,
  (visible) => {
    if (!visible) return
    scheduleExperienceTimelineUpdate()
    triggerExperienceLine()
  }
)

watch(
  introDone,
  async (done) => {
    if (done) {
      await nextTick()
      observeSections()
      startCertificateAutoplay()
      startExperienceTracking()
      scheduleExperienceTimelineUpdate()
      return
    }

    isBeeOpen.value = false
    sectionObserver?.disconnect()
    stopCertificateAutoplay()
    stopExperienceTracking()
    experienceLineProgress.value = 0
    experienceLineComplete.value = false
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  sectionObserver?.disconnect()
  stopCertificateAutoplay()
  stopExperienceTracking()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Space+Grotesk:wght@400;500;700&display=swap');

.portfolio-shell {
  --shell-bg: #050913;
  --shell-bg-soft: rgba(12, 18, 30, 0.82);
  --shell-panel: linear-gradient(180deg, rgba(12, 18, 30, 0.88), rgba(6, 10, 18, 0.92));
  --shell-border: rgba(103, 232, 249, 0.14);
  --shell-border-strong: rgba(103, 232, 249, 0.25);
  --shell-copy: rgba(226, 232, 240, 0.78);
  --shell-copy-soft: rgba(186, 230, 253, 0.62);
  --shell-grid:
    linear-gradient(rgba(103, 232, 249, 0.028) 1px, transparent 1px),
    linear-gradient(90deg, rgba(103, 232, 249, 0.028) 1px, transparent 1px);
  font-family: 'Space Grotesk', sans-serif;
  background:
    var(--shell-grid),
    radial-gradient(circle at top left, rgba(8, 145, 178, 0.18), transparent 28%),
    radial-gradient(circle at top right, rgba(14, 165, 233, 0.15), transparent 30%),
    linear-gradient(180deg, #04070d 0%, #07111d 50%, #04070d 100%);
  background-size: 34px 34px, 34px 34px, auto, auto, auto;
}

.font-display,
.section-kicker,
.section-title,
.hero-pill,
.nav-chip,
.button-primary,
.button-secondary,
.mobile-nav-link {
  font-family: 'Orbitron', sans-serif;
}

.hero-scrim {
  background:
    radial-gradient(circle at 20% 20%, rgba(34, 211, 238, 0.18), transparent 25%),
    linear-gradient(180deg, rgba(3, 7, 14, 0.2) 0%, rgba(3, 7, 14, 0.52) 45%, rgba(3, 7, 14, 0.9) 100%);
}

.ask-ai-chip {
  display: inline-flex;
  align-items: center;
  border-radius: 0.6rem;
  border: 1px solid rgba(34, 211, 238, 0.2);
  background: rgba(12, 74, 110);
  padding: 0.45rem 0.5rem;
  gap:0.2rem;
  color: rgba(103, 232, 249, 0.9);
  font-family: 'Orbitron', sans-serif;
  font-size: 1.0rem;
  letter-spacing: 0.08em;
  cursor: pointer;
  box-shadow:
    0 14px 30px rgba(0, 0, 0, 0.3),
    0 0 22px rgba(34, 211, 238, 0.12);
  transition:
    transform 220ms ease,
    border-color 220ms ease,
    background-color 220ms ease;
}

.ask-ai-chip:hover {
  transform: translateY(-2px);
  border-color: rgba(103, 232, 249, 0.34);
  background: rgb(10 64 94 / 1);
}

.ask-ai-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.7rem;
}

.ask-ai-tip {
  position: relative;
  max-width: 18rem;
  border-radius: 1rem;
  border: 1px solid rgba(103, 232, 249, 0.16);
  background:
    linear-gradient(rgba(103, 232, 249, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(103, 232, 249, 0.03) 1px, transparent 1px),
    rgba(4, 12, 22, 0.82);
  background-size: 18px 18px, 18px 18px, auto;
  padding: 0.8rem 0.95rem;
  color: rgba(226, 232, 240, 0.92);
  font-size: 0.82rem;
  line-height: 1.5;
  box-shadow:
    0 18px 40px rgba(0, 0, 0, 0.28),
    0 0 18px rgba(34, 211, 238, 0.08);
  backdrop-filter: blur(14px);
}

.ask-ai-tip::after {
  content: '';
  position: absolute;
  right: 1.35rem;
  top: 100%;
  width: 0.85rem;
  height: 0.85rem;
  border-right: 1px solid rgba(103, 232, 249, 0.16);
  border-bottom: 1px solid rgba(103, 232, 249, 0.16);
  background: rgba(4, 12, 22, 0.9);
  transform: translateY(-45%) rotate(45deg);
}

.section-shell {
  padding: 5.5rem 1.5rem;
}

.section-shell-alt {
  background:
    linear-gradient(rgba(103, 232, 249, 0.018) 1px, transparent 1px),
    linear-gradient(90deg, rgba(103, 232, 249, 0.018) 1px, transparent 1px),
    linear-gradient(180deg, rgba(7, 14, 24, 0.2), rgba(10, 17, 28, 0.5), rgba(7, 14, 24, 0.2));
  background-size: 34px 34px, 34px 34px, auto;
}

.section-reveal {
  opacity: 0;
  transform: translateY(28px) scale(0.985);
  transition:
    opacity 700ms cubic-bezier(0.22, 1, 0.36, 1),
    transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
}

.section-reveal.is-visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.section-heading {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-kicker {
  font-size: 0.75rem;
  letter-spacing: 0.45em;
  text-transform: uppercase;
  color: rgba(103, 232, 249, 0.7);
}

.section-title {
  max-width: 52rem;
  font-size: clamp(1.9rem, 3vw, 3.2rem);
  line-height: 1.15;
  color: white;
}

.section-copy {
  color: var(--shell-copy);
  line-height: 1.9;
}

.about-shell {
  position: relative;
  overflow: hidden;
  min-height: 34rem;
  border: 1px solid var(--shell-border);
  border-radius: 2rem;
  background:
    linear-gradient(rgba(103, 232, 249, 0.022) 1px, transparent 1px),
    linear-gradient(90deg, rgba(103, 232, 249, 0.022) 1px, transparent 1px),
    radial-gradient(circle at top left, rgba(8, 145, 178, 0.12), transparent 25%),
    linear-gradient(180deg, rgba(8, 13, 22, 0.94), rgba(5, 10, 18, 0.98));
  background-size: 30px 30px, 30px 30px, auto, auto;
  display: flex;
  align-items: center;
  padding: 4.5rem 1.5rem;
  box-shadow:
    0 24px 64px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.about-copy {
  position: relative;
  z-index: 1;
  max-width: 58rem;
}

.about-art {
  position: absolute;
  right: 0;
  bottom: 0;
  height: 100%;
  object-fit: contain;
  object-position: right bottom;
  padding-top: 6rem;
  opacity: 0.58;
  pointer-events: none;
  z-index: 0;
}

.panel-frame {
  border: 1px solid var(--shell-border);
  background:
    linear-gradient(rgba(103, 232, 249, 0.018) 1px, transparent 1px),
    linear-gradient(90deg, rgba(103, 232, 249, 0.018) 1px, transparent 1px),
    var(--shell-panel);
  background-size: 28px 28px, 28px 28px, auto;
  box-shadow:
    0 24px 64px rgba(0, 0, 0, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  border-radius: 1.9rem;
  transition:
    transform 360ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 360ms ease,
    box-shadow 360ms ease;
}

.panel-frame:hover {
  transform: translateY(-4px);
  border-color: var(--shell-border-strong);
  box-shadow:
    0 28px 72px rgba(0, 0, 0, 0.32),
    0 0 0 1px rgba(103, 232, 249, 0.03);
}

.hero-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  width: fit-content;
  border-radius: 999px;
  border: 1px solid rgba(103, 232, 249, 0.2);
  background: rgba(10, 17, 29, 0.62);
  padding: 0.8rem 1rem;
  color: rgba(224, 242, 254, 0.92);
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.hero-side-panel,
.metric-card,
.info-tile,
.skill-card,
.project-card,
.contribution-card,
.social-card,
.education-card,
.timeline-card {
  border-radius: 1.75rem;
}

.hero-side-panel {
  align-self: end;
  border: 1px solid var(--shell-border);
  background:
    linear-gradient(rgba(103, 232, 249, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(103, 232, 249, 0.02) 1px, transparent 1px),
    linear-gradient(180deg, rgba(7, 13, 22, 0.9), rgba(5, 10, 18, 0.94));
  background-size: 28px 28px, 28px 28px, auto;
  padding: 1.5rem;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(18px);
}

.status-row,
.contact-row {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  border-radius: 1rem;
  border: 1px solid rgba(103, 232, 249, 0.09);
  background: rgba(6, 10, 18, 0.42);
  padding: 0.9rem 1rem;
  color: rgba(226, 232, 240, 0.78);
}

.metric-card {
  border: 1px solid rgba(103, 232, 249, 0.1);
  background: rgba(8, 15, 26, 0.72);
  padding: 1rem 1.1rem;
}

.nav-chip,
.mobile-nav-link,
.button-primary,
.button-secondary,
.carousel-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  border-radius: 999px;
  transition:
    transform 260ms ease,
    border-color 260ms ease,
    background-color 260ms ease,
    color 260ms ease;
}

.nav-brand {
  display: flex;
  max-width: min(62vw, 24rem);
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  flex-shrink: 1;
  text-align: left;
}

.nav-brand-name {
  font-family: 'Orbitron', sans-serif;
  overflow: visible;
  white-space: normal;
  text-overflow: clip;
  text-transform: uppercase;
  line-height: 1.12;
  color: rgba(103, 232, 249, 0.8);
  font-size: clamp(0.62rem, 0.58rem + 0.28vw, 0.84rem);
  letter-spacing: clamp(0.08em, 0.05em + 0.12vw, 0.18em);
}

.nav-brand-role {
  margin-top: 0.32rem;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: clamp(0.9rem, 0.84rem + 0.24vw, 1.1rem);
  font-weight: 600;
  line-height: 1.05;
  color: white;
}

.nav-chip {
  border: 1px solid rgba(103, 232, 249, 0.1);
  background: rgba(6, 10, 18, 0.3);
  padding: 0.75rem 1rem;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(226, 232, 240, 0.84);
}

@media (min-width: 1280px) and (max-width: 1480px) {
  .nav-brand {
    max-width: min(26vw, 22rem);
  }

  .nav-chip {
    padding: 0.68rem 0.82rem;
    font-size: 0.67rem;
    letter-spacing: 0.14em;
  }
}

@media (max-width: 639px) {
  .nav-brand {
    max-width: calc(100vw - 6rem);
  }

  .nav-brand-role {
    display: none;
  }
}

.nav-chip:hover,
.mobile-nav-link:hover,
.button-secondary:hover,
.carousel-button:hover,
.social-card:hover {
  transform: translateY(-2px);
  border-color: rgba(103, 232, 249, 0.28);
}

.mobile-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid rgba(103, 232, 249, 0.12);
  background: rgba(6, 10, 18, 0.32);
  padding: 0.75rem;
  color: rgba(224, 242, 254, 0.92);
}

.mobile-nav-link {
  justify-content: flex-start;
  border: 1px solid rgba(103, 232, 249, 0.1);
  background: rgba(6, 10, 18, 0.3);
  padding: 0.95rem 1rem;
  color: rgba(226, 232, 240, 0.84);
}

.button-primary {
  border: 1px solid rgba(34, 211, 238, 0.28);
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(14, 165, 233, 0.12));
  padding: 0.95rem 1.2rem;
  color: rgba(236, 254, 255, 0.96);
  font-size: 0.78rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.button-secondary,
.carousel-button {
  border: 1px solid rgba(103, 232, 249, 0.12);
  background: rgba(8, 13, 22, 0.38);
  padding: 0.95rem 1.2rem;
  color: rgba(226, 232, 240, 0.86);
  font-size: 0.78rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.info-tile,
.education-card,
.achievement-row,
.timeline-highlight,
.contribution-card,
.social-card {
  border: 1px solid rgba(103, 232, 249, 0.09);
  background: rgba(6, 10, 18, 0.34);
}

.info-tile {
  padding: 1rem;
}

.education-card {
  display: grid;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
}

.achievement-row,
.timeline-highlight,
.contribution-card {
  display: flex;
  gap: 0.9rem;
  padding: 1rem;
}

.achievement-dot {
  flex-shrink: 0;
  width: 0.7rem;
  height: 0.7rem;
  margin-top: 0.35rem;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(34, 211, 238, 1), rgba(59, 130, 246, 0.9));
  box-shadow: 0 0 18px rgba(34, 211, 238, 0.45);
}

.timeline-dot {
  display: block;
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
  margin-top: 0.18rem;
  border-radius: 999px;
  border: 1px solid rgba(103, 232, 249, 0.42);
  background: rgba(7, 14, 24, 0.96);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.03),
    inset 0 0 0 1px rgba(255, 255, 255, 0.03);
  transition:
    transform 320ms ease,
    border-color 320ms ease,
    background 320ms ease,
    box-shadow 320ms ease;
}

.timeline-dot::after {
  content: '';
  display: block;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.92), rgba(59, 130, 246, 0.82));
  transform: scale(0.52);
}

.timeline-dot-start {
  border-color: rgba(103, 232, 249, 0.55);
  box-shadow:
    0 0 18px rgba(34, 211, 238, 0.18),
    inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}

.timeline-dot-complete {
  border-color: rgba(167, 243, 208, 0.92);
  background: rgba(8, 24, 22, 0.98);
  transform: scale(1.2);
  box-shadow:
    0 0 0 6px rgba(52, 211, 153, 0.12),
    0 0 22px rgba(52, 211, 153, 0.45),
    0 0 36px rgba(34, 211, 238, 0.28);
}

.timeline-dot-complete::after {
  background: linear-gradient(135deg, rgba(110, 231, 183, 1), rgba(34, 211, 238, 0.9));
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  border-radius: 999px;
  border: 1px solid rgba(103, 232, 249, 0.12);
  background: rgba(6, 10, 18, 0.34);
  padding: 0.6rem 0.85rem;
  font-size: 0.78rem;
  color: rgba(226, 232, 240, 0.84);
}

.skill-badge-icon,
.skill-badge-fallback {
  flex-shrink: 0;
  width: 0.95rem;
  height: 0.95rem;
}

.skill-badge-icon {
  object-fit: contain;
}

.skill-badge-icon-wide {
  width: 1.35rem;
}

.skill-badge-icon-light {
  filter: brightness(0) invert(1);
  opacity: 0.92;
}

.skill-badge-fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: rgba(34, 211, 238, 0.12);
  color: rgba(207, 250, 254, 0.92);
  font-size: 0.5rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.chip-accent {
  background: rgba(34, 211, 238, 0.08);
  color: rgba(224, 242, 254, 0.95);
}

.skill-card {
  padding: 1.05rem 1.1rem;
}

.skill-card-summary {
  display: -webkit-box;
  overflow: hidden;

}

.skill-card .chip {
  padding: 0.5rem 0.72rem;
  font-size: 0.72rem;
}

.project-card {
  overflow: hidden;
}

.project-media {
  position: relative;
  height: 14.75rem;
  border-bottom: 1px solid rgba(103, 232, 249, 0.08);
  background:
    radial-gradient(circle at top left, rgba(34, 211, 238, 0.1), transparent 28%),
    linear-gradient(180deg, rgba(6, 10, 18, 0.92), rgba(2, 4, 8, 0.98));
}

.project-cover-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  padding: 0.85rem 0.9rem;
}

.project-placeholder {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  padding: 1.8rem;
  background:
    linear-gradient(135deg, rgba(7, 10, 16, 0.98), rgba(2, 4, 8, 1)),
    repeating-linear-gradient(
      -45deg,
      rgba(103, 232, 249, 0.03),
      rgba(103, 232, 249, 0.03) 14px,
      transparent 14px,
      transparent 28px
    );
}

.project-index {
  position: absolute;
  right: 0.85rem;
  top: 0.85rem;
  border-radius: 999px;
  border: 1px solid rgba(103, 232, 249, 0.14);
  background: rgba(6, 10, 18, 0.8);
  padding: 0.45rem 0.72rem;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.72rem;
  letter-spacing: 0.24em;
  color: rgba(103, 232, 249, 0.78);
}

.project-body {
  padding: 1.28rem;
}

.project-card .chip {
  padding: 0.48rem 0.72rem;
  font-size: 0.72rem;
}

.timeline-shell {
  position: relative;
  overflow: visible;
}

.timeline-card {
  position: relative;
  margin-left: 0.8rem;
  padding-left: 1.6rem;
  z-index: 1;
}

.timeline-card + .timeline-card {
  margin-top: 1.8rem;
}

.timeline-marker {
  position: absolute;
  left: -0.45rem;
  top: 1.4rem;
  z-index: 3;
}

.timeline-progress-shell {
  position: absolute;
  width: 3px;
  pointer-events: none;
  transform: translateX(-50%);
  z-index: 2;
}

.timeline-progress-line {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 999px;
  transform-origin: bottom center;
  background: linear-gradient(180deg, rgba(34, 211, 238, 0.95), rgba(59, 130, 246, 0.92));
  box-shadow:
    0 0 18px rgba(34, 211, 238, 0.45),
    0 0 36px rgba(59, 130, 246, 0.2);
  transition: transform 1800ms cubic-bezier(0.22, 1, 0.36, 1);
}

.timeline-content {
  position: relative;
  z-index: 1;
  border: 1px solid rgba(103, 232, 249, 0.09);
  background: rgba(6, 10, 18, 0.34);
  border-radius: 1.5rem;
  padding: 1.2rem;
}

.cert-viewport {
  overflow: hidden;
}

.cert-track {
  display: flex;
  transition: transform 760ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.cert-slide {
  width: 100%;
  flex: 0 0 100%;
  padding: 0.25rem;
}

.cert-visual {
  min-height: 21rem;
  overflow: hidden;
  border-radius: 1.75rem;
  border: 1px solid rgba(103, 232, 249, 0.12);
  background: linear-gradient(180deg, rgba(6, 10, 18, 0.9), rgba(2, 4, 8, 0.98));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
}

.cert-fallback,
.cert-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.indicator-dot {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 999px;
  border: 1px solid rgba(103, 232, 249, 0.22);
  background: rgba(6, 10, 18, 0.48);
  transition: transform 240ms ease, background-color 240ms ease, border-color 240ms ease;
}

.indicator-dot-active {
  transform: scale(1.15);
  border-color: rgba(103, 232, 249, 0.8);
  background: rgba(34, 211, 238, 0.84);
}

.art-tile {
  overflow: hidden;
  padding: 0;
}

.social-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
}

.input-shell {
  border-radius: 1.2rem;
  border: 1px solid rgba(103, 232, 249, 0.1);
  background: rgba(4, 8, 15, 0.55);
  padding: 0.95rem 1rem;
  color: white;
  transition: border-color 220ms ease, box-shadow 220ms ease, transform 220ms ease;
}

.input-shell::placeholder {
  color: rgba(186, 230, 253, 0.32);
}

.input-shell:focus {
  outline: none;
  border-color: rgba(103, 232, 249, 0.35);
  box-shadow: 0 0 0 4px rgba(34, 211, 238, 0.08);
  transform: translateY(-1px);
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition: opacity 220ms ease, transform 220ms ease;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (min-width: 640px) {
  .education-card {
    grid-template-columns: auto 1fr auto;
  }
}

@media (max-width: 1024px) {
  .section-shell {
    padding: 4.5rem 1.25rem;
  }

  .about-shell {
    min-height: 28rem;
    padding: 3.5rem 1.25rem;
  }

  .timeline-card {
    margin-left: 0.45rem;
  }
}

@media (max-width: 640px) {
  .ask-ai-tip {
    max-width: 13.5rem;
    padding: 0.68rem 0.8rem;
    font-size: 0.72rem;
  }

  .ask-ai-chip {
    font-size: 1rem;
  }

  .about-art {
    opacity: 0.38;
  }
}

@media (prefers-reduced-motion: reduce) {
  .section-reveal,
  .panel-frame,
  .cert-track,
  .nav-chip,
  .mobile-nav-link,
  .button-primary,
  .button-secondary,
  .carousel-button,
  .social-card,
  .input-shell,
  .indicator-dot {
    transition: none !important;
    transform: none !important;
  }
}
</style>
