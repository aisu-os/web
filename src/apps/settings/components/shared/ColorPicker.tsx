import { cn } from '@/lib/cn'

interface ColorPickerProps {
  colors: readonly { readonly name: string; readonly value: string }[]
  selected: string
  onChange: (value: string) => void
}

export default function ColorPicker({
  colors,
  selected,
  onChange,
}: ColorPickerProps) {
  return (
    <div className="flex items-center gap-2">
      {colors.map((color) => (
        <button
          key={color.value}
          type="button"
          aria-label={color.name}
          onClick={() => onChange(color.value)}
          className={cn(
            'w-7 h-7 rounded-full cursor-pointer transition-transform hover:scale-110',
            selected === color.value
              ? 'ring-2 ring-white ring-offset-2 ring-offset-[#1E1E2E]'
              : 'ring-1 ring-white/10'
          )}
          style={{ backgroundColor: color.value }}
        />
      ))}
    </div>
  )
}
