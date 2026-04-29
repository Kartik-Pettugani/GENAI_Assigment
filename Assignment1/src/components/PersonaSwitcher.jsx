export default function PersonaSwitcher({
  personas,
  activePersonaId,
  onSwitch,
  disabled,
}) {
  return (
    <nav className="personaSwitcher" aria-label="Persona switcher">
      {personas.map((p) => {
        const isActive = p.id === activePersonaId
        return (
          <button
            key={p.id}
            type="button"
            className={isActive ? 'personaTab personaTabActive' : 'personaTab'}
            onClick={() => onSwitch(p.id)}
            disabled={disabled}
            style={{
              '--tab-accent': p.accent,
              '--tab-accent-soft': p.accentSoft,
            }}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="personaDot" aria-hidden="true" />
            {p.name.split(' ')[0]}
          </button>
        )
      })}
    </nav>
  )
}
