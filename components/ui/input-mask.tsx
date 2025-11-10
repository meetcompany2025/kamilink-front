"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface InputMaskProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask?: string
  replacement?: Record<string, RegExp>
}

const InputMask = React.forwardRef<HTMLInputElement, InputMaskProps>(
  ({ className, mask, replacement = { "9": /\d/ }, ...props }, ref) => {
    const [value, setValue] = React.useState(props.value || "")

    const applyMask = (inputValue: string) => {
      if (!mask) return inputValue

      let maskedValue = ""
      let valueIndex = 0

      for (let i = 0; i < mask.length && valueIndex < inputValue.length; i++) {
        const maskChar = mask[i]
        const inputChar = inputValue[valueIndex]

        if (replacement[maskChar]) {
          if (replacement[maskChar].test(inputChar)) {
            maskedValue += inputChar
            valueIndex++
          } else {
            break
          }
        } else {
          maskedValue += maskChar
          if (inputChar === maskChar) {
            valueIndex++
          }
        }
      }

      return maskedValue
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value.replace(/\D/g, "")
      const maskedValue = applyMask(rawValue)
      setValue(maskedValue)

      if (props.onChange) {
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: maskedValue,
          },
        }
        props.onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>)
      }
    }

    return <Input className={cn(className)} {...props} ref={ref} value={value} onChange={handleChange} />
  },
)
InputMask.displayName = "InputMask"

export { InputMask }
