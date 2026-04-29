import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'

export default function ChatWindow({ messages, activePersona }) {
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <div className="chatWindow">
      {messages.length === 0 ? (
        <div className="emptyState">
          <div className="emptyTitle">Start a conversation</div>
          <div className="emptySub">
            Pick a chip below or ask anything — the active persona stays visible above.
          </div>
        </div>
      ) : (
        messages.map((m) => (
          <MessageBubble key={m.id} message={m} activePersona={activePersona} />
        ))
      )}
      <div ref={endRef} />
    </div>
  )
}
