import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PERSONAS, PERSONA_ORDER } from './personas'
import PersonaSwitcher from './components/PersonaSwitcher'
import SuggestionChips from './components/SuggestionChips'
import ChatWindow from './components/ChatWindow'
import TypingIndicator from './components/TypingIndicator'

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions'
const DEFAULT_MODEL = 'llama-3.3-70b-versatile'

function App() {
  const [activePersonaId, setActivePersonaId] = useState(PERSONA_ORDER[0])
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const abortRef = useRef(null)
  const inputRef = useRef(null)

  const activePersona = PERSONAS[activePersonaId]

  const themeStyle = useMemo(() => {
    return {
      '--persona-accent': activePersona.accent,
      '--persona-accent-soft': activePersona.accentSoft,
    }
  }, [activePersona.accent, activePersona.accentSoft])

  const resetConversation = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    setIsLoading(false)
    setMessages([])
    setInput('')
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [])

  const switchPersona = useCallback(
    (personaId) => {
      if (personaId === activePersonaId) return
      setActivePersonaId(personaId)
      resetConversation()
    },
    [activePersonaId, resetConversation],
  )

  useEffect(() => {
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [])

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text.trim()
      if (!trimmed || isLoading) return

      const apiKey = import.meta.env.VITE_GROQ_API_KEY
      if (!apiKey) {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            isError: true,
            content:
              'Missing API key. Add `VITE_GROQ_API_KEY` to your `.env` file, restart the dev server, and try again.',
          },
        ])
        return
      }

      const userMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content: trimmed,
      }

      setMessages((prev) => [...prev, userMessage])
      setInput('')
      setIsLoading(true)

      const controller = new AbortController()
      abortRef.current?.abort()
      abortRef.current = controller

      try {
        const groqMessages = [
          { role: 'system', content: activePersona.systemPrompt },
          ...messages
            .filter((m) => (m.role === 'user' || m.role === 'assistant') && !m.isError)
            .map((m) => ({
              role: m.role,
              content: m.content,
            })),
          { role: 'user', content: trimmed },
        ]

        const response = await fetch(GROQ_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: DEFAULT_MODEL,
            temperature: 0.7,
            max_tokens: 900,
            messages: groqMessages,
          }),
          signal: controller.signal,
        })

        if (!response.ok) {
          let details = ''
          try {
            const err = await response.json()
            details = err?.error?.message ? ` (${err.error.message})` : ''
          } catch {
            // ignore JSON parse failures
          }
          throw new Error(`Request failed: ${response.status}${details}`)
        }

        const data = await response.json()
        const reply = data?.choices?.[0]?.message?.content

        if (!reply) {
          throw new Error('No message returned by model.')
        }

        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: 'assistant', content: reply },
        ])
      } catch (err) {
        if (err?.name === 'AbortError') return
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            isError: true,
            content:
              "Sorry — I couldn't reach the model right now. Please check your API key, internet connection, and try again.",
          },
        ])
      } finally {
        setIsLoading(false)
        abortRef.current = null
      }
    },
    [activePersona.systemPrompt, isLoading, messages],
  )

  const onSubmit = useCallback(() => {
    sendMessage(input)
  }, [input, sendMessage])

  const showChips = messages.length === 0 && !isLoading

  return (
    <div className="app" style={themeStyle}>
      <header className="topbar">
        <div className="brand">
          <div className="brandMark" aria-hidden="true" />
          <div className="brandText">
            <div className="brandTitle">Scaler Persona Chatbot</div>
            <div className="brandSub">Prompt Engineering • Persona switching</div>
          </div>
        </div>

        <PersonaSwitcher
          personas={PERSONA_ORDER.map((id) => PERSONAS[id])}
          activePersonaId={activePersonaId}
          onSwitch={switchPersona}
          disabled={isLoading}
        />
      </header>

      <main className="layout">
        <section className="personaCard" aria-label="Active persona">
          <div className="personaAvatar" aria-hidden="true">
            {activePersona.initials}
          </div>
          <div className="personaMeta">
            <div className="personaName">{activePersona.name}</div>
            <div className="personaRole">{activePersona.role}</div>
          </div>
          <button
            className="ghostButton"
            type="button"
            onClick={resetConversation}
            disabled={isLoading}
            aria-label="Reset conversation"
          >
            Reset
          </button>
        </section>

        <section className="chatCard" aria-label="Chat">
          <ChatWindow messages={messages} activePersona={activePersona} />
          {isLoading && (
            <div className="typingRow" aria-live="polite">
              <TypingIndicator />
              <div className="typingLabel">Typing…</div>
            </div>
          )}

          {showChips && (
            <div className="chipsWrap" aria-label="Suggestion chips">
              <SuggestionChips
                chips={activePersona.suggestionChips}
                onPick={(chip) => sendMessage(chip)}
              />
            </div>
          )}

          <form
            className="composer"
            onSubmit={(e) => {
              e.preventDefault()
              onSubmit()
            }}
          >
            <textarea
              ref={inputRef}
              className="composerInput"
              placeholder={`Message ${activePersona.name}…`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  onSubmit()
                }
              }}
            />
            <button
              className="sendButton"
              type="submit"
              disabled={isLoading || !input.trim()}
            >
              Send
            </button>
          </form>

          <div className="footnote">
            Persona switching resets the conversation. API key must be set in `.env`.
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
