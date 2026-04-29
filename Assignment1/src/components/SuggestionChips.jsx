export default function SuggestionChips({ chips, onPick }) {
  return (
    <div className="chips">
      {chips.map((chip) => (
        <button
          key={chip}
          type="button"
          className="chip"
          onClick={() => onPick(chip)}
        >
          {chip}
        </button>
      ))}
    </div>
  )
}
