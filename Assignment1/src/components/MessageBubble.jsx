export default function MessageBubble({ message, activePersona }) {
  const isUser = message.role === 'user'
  return (
    <div className={isUser ? 'row rowUser' : 'row rowAssistant'}>
      <div
        className={
          isUser
            ? 'bubble bubbleUser'
            : message.isError
              ? 'bubble bubbleAssistant bubbleError'
              : 'bubble bubbleAssistant'
        }
        style={!isUser ? { '--bubble-accent-soft': activePersona.accentSoft } : undefined}
      >
        {message.content}
      </div>
    </div>
  )
}
