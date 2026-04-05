import { portfolio } from '../data/portfolio'

export type BeeSection =
  | 'about'
  | 'skills'
  | 'projects'
  | 'experience'
  | 'certificates'
  | 'art'
  | 'contact'

export type BeeDestination = BeeSection | 'profile'

export type BeeChatTurn = {
  role: 'user' | 'assistant'
  content: string
}

export type BeeContactState = {
  name: string
  email: string
  subject: string
  message: string
}

type MaybePromise<T> = T | Promise<T>

export type BeeAgentHandlers = {
  navigateTo: (destination: BeeDestination) => MaybePromise<string>
  draftEmail: (draft: { subject: string; body: string }) => MaybePromise<string>
  updateSender: (details: { name?: string; email?: string }) => MaybePromise<string>
  sendEmail: () => Promise<{ ok: boolean; message: string }>
}

export type BeeAgentResult = {
  reply: string
}

type BeeRuntimeImports = {
  AIMessage: any
  HumanMessage: any
  SystemMessage: any
  ToolMessage: any
  ChatGoogleGenerativeAI: any
  z: any
}

const GEMINI_MODEL = 'gemini-2.5-flash-lite'
const MAX_RATE_LIMIT_RETRIES = 2
const RATE_LIMIT_RETRY_DELAYS_MS = [1800, 4200]
const MAX_CONVERSATION_TURNS = 4

const SECTION_CHOICES = [
  'about',
  'skills',
  'projects',
  'experience',
  'certificates',
  'art',
  'contact',
  'profile'
] as const

const beeCapabilities = [
  "Answer questions using Hari Charan's portfolio and resume content.",
  'Scroll the site to projects, experience, certificates, contact, and other sections.',
  'Open the profile summary when the user asks for a quick overview.',
  'Draft polished email subject lines and message bodies inside the contact form.',
  'Send the drafted email when the user clearly asks for it and sender details are available.'
].join('\n')

const portfolioContext = [
  `Name: ${portfolio.fullName}`,
  `Role: ${portfolio.role}`,
  `Headline: ${portfolio.headline}`,
  `Summary: ${portfolio.summary}`,
  `Location: ${portfolio.location}`,
  `Contact: ${portfolio.email} | ${portfolio.phone}`,
  `Current focus: ${portfolio.heroStats.map((item) => `${item.label} - ${item.value}`).join(' | ')}`,
  `Core skills: ${portfolio.skillGroups.flatMap((group) => group.items).slice(0, 18).join(', ')}`,
  `Experience: ${portfolio.experience.map((item) => `${item.company} - ${item.role} (${item.period})`).join(' | ')}`,
  `Projects: ${portfolio.projects.map((project) => `${project.title} [${project.category}]`).join(' | ')}`,
  `Certificates: ${portfolio.certificates.map((certificate) => `${certificate.title} - ${certificate.issuer}`).join(' | ')}`,
  `Education: ${portfolio.education.map((item) => `${item.school} - ${item.note} (${item.score})`).join(' | ')}`,
  `Profiles: ${portfolio.socials.map((social) => `${social.label} - ${social.href}`).join(' | ')}`,
  `Bee capabilities: ${beeCapabilities}`
].join('\n')

const beeSystemPrompt = `
You are Bee AI, the interactive website assistant for Adhikari Hari Charan.

Your job:
- Answer questions about Hari Charan using the provided portfolio context only.
- Help visitors discover sections of the portfolio by using tools when navigation is useful.
- Draft and optionally send contact emails through the existing portfolio contact form.

Important identity rules:
- Hari Charan's primary role is Software Developer.
- Do not describe him as an "AI agent builder".
- You may highlight his AI skills, AI workflows, automation work, LLM integrations, and intelligent systems experience when relevant.

Behavior rules:
- Be warm, concise, and useful.
- Speak like Hari's own assistant who already knows his work well.
- Sound human, direct, and confident.
- Use natural phrases like "I can show you that", "Here are the relevant projects", or "I don't see that exact name here".
- Do not talk like an external search tool or auditor.
- Avoid phrases like "I couldn't find any information in Hari Charan's portfolio", "according to the profile", or "the portfolio says".
- If the user asks to see certificates, projects, experience, skills, contact, or the profile summary, use a navigation tool.
- If the user asks for an email draft, create a strong subject and body in the contact form.
- If the user provides their name or email in chat, store them with the sender tool.
- Only use the send-email tool when the user clearly asks you to send the email now.
- Never claim an email was sent unless the send-email tool reports success.
- If information is not present in the portfolio context, say it is not listed rather than inventing it.
- When something is not listed, say that naturally and suggest the closest relevant match if there is one.
- Keep normal replies under 120 words unless the user asks for detail.
- After any tool action, respond with a natural acknowledgement in your own words.
- Do not copy tool result text verbatim.
- Do not sound robotic or say internal status phrases like "navigation completed" unless the user explicitly asks for technical details.

Portfolio context:
${portfolioContext}
`.trim()

let runtimePromise: Promise<BeeRuntimeImports> | null = null
let modelPromise: Promise<any> | null = null

function readGoogleApiKey() {
  return import.meta.env.VITE_GOOGLE_API_KEY?.trim() ?? ''
}

function normalizeValue(value: string) {
  return value.trim()
}

function canSendEmail(state: BeeContactState) {
  return [
    state.name,
    state.email,
    state.subject,
    state.message
  ].every((value) => normalizeValue(value).length > 0)
}

function contentToText(content: unknown): string {
  if (typeof content === 'string') {
    return content.trim()
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') return part
        if (part && typeof part === 'object' && 'text' in part && typeof part.text === 'string') {
          return part.text
        }
        return ''
      })
      .join('\n')
      .trim()
  }

  if (content && typeof content === 'object' && 'text' in content && typeof content.text === 'string') {
    return content.text.trim()
  }

  return ''
}

async function getBeeRuntime() {
  if (!runtimePromise) {
    runtimePromise = Promise.all([
      import('@langchain/google-genai'),
      import('@langchain/core/messages'),
      import('zod')
    ]).then(([googleGenAI, langchainMessages, zodModule]) => ({
      ChatGoogleGenerativeAI: googleGenAI.ChatGoogleGenerativeAI,
      AIMessage: langchainMessages.AIMessage,
      HumanMessage: langchainMessages.HumanMessage,
      SystemMessage: langchainMessages.SystemMessage,
      ToolMessage: langchainMessages.ToolMessage,
      z: zodModule.z
    }))
  }

  return runtimePromise
}

async function getBeeModel() {
  const apiKey = readGoogleApiKey()
  if (!apiKey) {
    return null
  }

  if (!modelPromise) {
    modelPromise = getBeeRuntime().then(({ ChatGoogleGenerativeAI }) => new ChatGoogleGenerativeAI({
      model: GEMINI_MODEL,
      apiKey,
      temperature: 0.25,
      maxOutputTokens: 320
    }))
  }

  return modelPromise
}

function createRuntimeSnapshot(state: BeeContactState, userMessage: string) {
  return [
    'Current portfolio UI state:',
    `- Sender name: ${normalizeValue(state.name) || '[empty]'}`,
    `- Sender email: ${normalizeValue(state.email) || '[empty]'}`,
    `- Email subject: ${normalizeValue(state.subject) || '[empty]'}`,
    `- Email message: ${normalizeValue(state.message) || '[empty]'}`,
    '',
    `User request: ${userMessage}`
  ].join('\n')
}

function createAssistantMessage(AIMessage: any, source: any) {
  return new AIMessage({
    content: source.content,
    tool_calls: source.tool_calls,
    invalid_tool_calls: source.invalid_tool_calls,
    usage_metadata: source.usage_metadata
  })
}

function createToolResultMessage(input: {
  toolName: string
  status: 'success' | 'error'
  args: Record<string, unknown>
  detail?: string
}) {
  const lines = [
    `tool=${input.toolName}`,
    `status=${input.status}`
  ]

  if (Object.keys(input.args).length > 0) {
    lines.push(`args=${JSON.stringify(input.args)}`)
  }

  if (input.detail) {
    lines.push(`detail=${input.detail}`)
  }

  return lines.join('\n')
}

function joinToolReplies(toolReplies: string[]) {
  return toolReplies
    .map((reply) => reply.trim())
    .filter(Boolean)
    .join(' ')
    .trim()
}

function navigationReply(destination: BeeDestination) {
  switch (destination) {
    case 'about':
      return portfolio.about
    case 'skills':
      return "These are Hari Charan's core skills across frontend, backend, AI workflows, cloud platforms, and design tools."
    case 'projects':
      return `These are Hari Charan's projects across AI, automation, full-stack development, and product design, including ${portfolio.projects.slice(0, 5).map((project) => project.title).join(', ')}.`
    case 'experience':
      return "These are Hari Charan's experience highlights from ChatFin and his cloud computing internship at Academor."
    case 'certificates':
      return "These are Hari Charan's certificates across full-stack development, cloud, data, and leadership."
    case 'art':
      return "These are Hari Charan's UI design explorations and visual interface concepts."
    case 'contact':
      return `These are Hari Charan's contact details. You can reach him at ${portfolio.email}.`
    case 'profile':
      return `${portfolio.summary} This is the quick profile overview.`
  }
}

function finalizeBeeReply(reply: string, lastNavigationDestination: BeeDestination | null) {
  const trimmed = reply.trim()

  if (!lastNavigationDestination) {
    return trimmed
  }

  if (!trimmed) {
    return navigationReply(lastNavigationDestination)
  }

  const lower = trimmed.toLowerCase()
  const soundsLikeUiNarration =
    lower.startsWith('i can show you')
    || lower.startsWith("i've scrolled")
    || lower.startsWith('i have scrolled')
    || lower.startsWith("i've taken you")
    || lower.startsWith('i have taken you')
    || lower.includes('scroll')
    || lower.includes('you can see them all here')
    || lower.includes('you can see them here')
    || lower.includes('let me know if any particular')

  if (soundsLikeUiNarration) {
    return navigationReply(lastNavigationDestination)
  }

  return trimmed
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function extractErrorMessage(error: unknown) {
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  return ''
}

function isRateLimitError(error: unknown) {
  const message = extractErrorMessage(error).toLowerCase()
  return (
    message.includes('429')
    || message.includes('too many requests')
    || message.includes('rate limit')
    || message.includes('quota')
  )
}

async function invokeWithRetry(runnable: { invoke: (messages: unknown[]) => Promise<any> }, messages: unknown[]) {
  let attempt = 0

  while (true) {
    try {
      return await runnable.invoke(messages)
    } catch (error) {
      if (!isRateLimitError(error) || attempt >= MAX_RATE_LIMIT_RETRIES) {
        throw error
      }

      await sleep(RATE_LIMIT_RETRY_DELAYS_MS[attempt] ?? 5000)
      attempt += 1
    }
  }
}

function formatBeeError(error: unknown) {
  const rawMessage =
    typeof error === 'string'
      ? error
      : error instanceof Error
        ? error.message
        : ''

  const message = rawMessage.trim()
  const lower = message.toLowerCase()

  if (!message) {
    return 'Bee AI could not reach the server. Please try again.'
  }
  return `Unexpected Error. Please try again later.`
}

export async function runBeeAgent(input: {
  conversation: BeeChatTurn[]
  userMessage: string
  contactState: BeeContactState
  handlers: BeeAgentHandlers
}): Promise<BeeAgentResult> {
  if (!readGoogleApiKey()) {
    return {
      reply: 'Bee AI needs `VITE_GOOGLE_API_KEY` in your `.env` file before I can answer or automate the portfolio.'
    }
  }

  try {
    const runtime = await getBeeRuntime()
    const model = await getBeeModel()

    if (!model) {
      return {
        reply: 'Bee AI could not start because the Google API key is missing.'
      }
    }

    const { AIMessage, HumanMessage, SystemMessage, ToolMessage, z } = runtime

    const navigateTool = {
      name: 'navigate_portfolio',
      description: 'Scroll the portfolio to a relevant section or open the profile summary modal.',
      schema: z.object({
        destination: z.enum(SECTION_CHOICES),
        reason: z.string().optional()
      })
    }

    const updateSenderTool = {
      name: 'update_sender_details',
      description: 'Fill or update the sender name and sender email in the portfolio contact form.',
      schema: z.object({
        name: z.string().optional(),
        email: z.string().optional()
      })
    }

    const draftEmailTool = {
      name: 'draft_email_to_hari',
      description: 'Fill the portfolio contact form with a subject and message body for an email to Hari Charan.',
      schema: z.object({
        subject: z.string().min(3).max(140),
        body: z.string().min(12).max(2400)
      })
    }

    const sendEmailTool = {
      name: 'send_drafted_email',
      description: 'Send the email currently prepared in the portfolio contact form. Use only when the user clearly asks to send it now.',
      schema: z.object({
        confirm: z.boolean().describe('Always true when the user explicitly wants the email sent now.')
      })
    }

    const llmWithTools = model.bindTools([
      navigateTool,
      updateSenderTool,
      draftEmailTool,
      sendEmailTool
    ])

    const runtimeState: BeeContactState = {
      ...input.contactState
    }

    const messages = [
      new SystemMessage(beeSystemPrompt),
      ...input.conversation.slice(-MAX_CONVERSATION_TURNS).map((turn) => (
        turn.role === 'user'
          ? new HumanMessage(turn.content)
          : new AIMessage(turn.content)
      )),
      new HumanMessage(createRuntimeSnapshot(runtimeState, input.userMessage))
    ]

    let assistantMessage = createAssistantMessage(AIMessage, await invokeWithRetry(llmWithTools, messages))
    let lastNavigationDestination: BeeDestination | null = null
    const toolReplies: string[] = []

    if (assistantMessage.tool_calls?.length) {
      for (const [index, toolCall] of assistantMessage.tool_calls.entries()) {
        const toolCallId = toolCall.id ?? `${toolCall.name}-0-${index}`
        let status: 'success' | 'error' = 'success'
        let toolResult = 'Done.'

        try {
          switch (toolCall.name) {
            case 'navigate_portfolio': {
              lastNavigationDestination = toolCall.args.destination as BeeDestination
              toolResult = await input.handlers.navigateTo(lastNavigationDestination)
              break
            }
            case 'update_sender_details': {
              if (typeof toolCall.args.name === 'string' && toolCall.args.name.trim()) {
                runtimeState.name = toolCall.args.name.trim()
              }

              if (typeof toolCall.args.email === 'string' && toolCall.args.email.trim()) {
                runtimeState.email = toolCall.args.email.trim()
              }

              toolResult = await input.handlers.updateSender({
                name: toolCall.args.name,
                email: toolCall.args.email
              })
              break
            }
            case 'draft_email_to_hari': {
              runtimeState.subject = toolCall.args.subject
              runtimeState.message = toolCall.args.body
              toolResult = await input.handlers.draftEmail({
                subject: toolCall.args.subject,
                body: toolCall.args.body
              })
              break
            }
            case 'send_drafted_email': {
              if (!toolCall.args.confirm) {
                status = 'error'
                toolResult = 'Email was not sent because the user did not clearly confirm sending.'
                break
              }

              if (!canSendEmail(runtimeState)) {
                status = 'error'
                toolResult = 'Email cannot be sent yet because sender name, sender email, subject, or message is missing.'
                break
              }

              const sendResult = await input.handlers.sendEmail()
              status = sendResult.ok ? 'success' : 'error'
              toolResult = sendResult.message
              break
            }
            default: {
              status = 'error'
              toolResult = `Unknown Bee tool: ${toolCall.name}`
            }
          }
        } catch (error) {
          status = 'error'
          toolResult = error instanceof Error ? error.message : 'Tool execution failed.'
        }

        messages.push(new ToolMessage({
          content: createToolResultMessage({
            toolName: toolCall.name,
            status,
            args: toolCall.args ?? {},
            detail: toolResult
          }),
          tool_call_id: toolCallId,
          status
        }))

        toolReplies.push(toolResult)
      }

      return {
        reply: finalizeBeeReply(
          joinToolReplies(toolReplies),
          lastNavigationDestination
        ) || "I'm ready. Ask me about Hari Charan, his projects, experience, certificates, or let me draft an email for you."
      }
    }

    return {
      reply: finalizeBeeReply(
        contentToText(assistantMessage.content) || "I'm ready. Ask me about Hari Charan, his projects, experience, certificates, or let me draft an email for you.",
        lastNavigationDestination
      )
    }
  } catch (error) {
    console.error(error)

    return {
      reply: formatBeeError(error)
    }
  }
}
