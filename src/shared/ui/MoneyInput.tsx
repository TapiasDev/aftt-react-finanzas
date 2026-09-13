import type { ChangeEvent, KeyboardEvent } from 'react'
import { formatMoneyInput, parseMoneyInput } from '../lib/format'

interface MoneyInputProps {
  value: string
  onValueChange: (value: string) => void
  disabled?: boolean
  label?: string
}

export function MoneyInput({ value, onValueChange, disabled, label }: MoneyInputProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget
    const caret = input.selectionStart ?? input.value.length
    const charactersBeforeCaret = input.value.slice(0, caret).replace(/[^\d,]/g, '').length
    const nextValue = parseMoneyInput(input.value)
    const formatted = formatMoneyInput(nextValue)
    let nextCaret = 0
    let characters = 0

    while (nextCaret < formatted.length && characters < charactersBeforeCaret) {
      if (formatted[nextCaret] !== '.') characters += 1
      nextCaret += 1
    }

    // Restore the caret by digit position, even when grouping adds a new dot.
    input.value = formatted
    input.setSelectionRange(nextCaret, nextCaret)
    onValueChange(nextValue)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    const input = event.currentTarget
    const start = input.selectionStart
    if (start === null || start !== input.selectionEnd || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return

    // Delete the adjacent digit along with its separator, rather than re-inserting
    // a dot and making Backspace/Delete appear to do nothing.
    if (event.key === 'Backspace' && input.value[start - 1] === '.') {
      input.setSelectionRange(Math.max(0, start - 2), start)
    } else if (event.key === 'Delete' && input.value[start] === '.') {
      input.setSelectionRange(start, start + 2)
    }
  }

  return (
    <div className="planner-money-input">
      <span className="planner-money-prefix" aria-hidden="true">$</span>
      <input
        className="planner-input planner-input-money"
        type="text"
        inputMode="decimal"
        aria-label={label}
        placeholder="0"
        autoComplete="off"
        spellCheck={false}
        value={formatMoneyInput(value)}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <span className="planner-money-suffix">COP</span>
    </div>
  )
}
