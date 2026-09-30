"use client"

import { useState, type ComponentProps, type ReactNode } from "react"
import {
  Controller,
  type Control,
  type ControllerFieldState,
  type ControllerRenderProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { TagInput } from "./tag-input"

interface BaseFieldProps<T extends FieldValues> {
  control: Control<T>
  name: FieldPath<T>
  label: string
  description?: ReactNode
  disabled?: boolean
}

type RenderArgs<T extends FieldValues> = {
  field: ControllerRenderProps<T, FieldPath<T>>
  fieldState: ControllerFieldState
  id: string
}

function FormField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
  render,
}: BaseFieldProps<T> & { render: (args: RenderArgs<T>) => ReactNode }) {
  return (
    <Controller
      control={control}
      name={name}
      disabled={disabled}
      render={({ field, fieldState }) => {
        const id = `field-${name}`
        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            {render({ field, fieldState, id })}
            {description && !fieldState.invalid && <FieldDescription>{description}</FieldDescription>}
            <FieldError errors={[fieldState.error]} />
          </Field>
        )
      }}
    />
  )
}

type InputProps = Omit<ComponentProps<"input">, "name" | "disabled">

export function InputField<T extends FieldValues>({
  inputProps,
  ...props
}: BaseFieldProps<T> & { inputProps?: InputProps }) {
  return (
    <FormField
      {...props}
      render={({ field, fieldState, id }) => (
        <Input {...inputProps} {...field} value={field.value ?? ""} id={id} aria-invalid={fieldState.invalid} />
      )}
    />
  )
}

export function PasswordField<T extends FieldValues>({
  autoComplete = "current-password",
  ...props
}: BaseFieldProps<T> & { autoComplete?: string }) {
  const [visible, setVisible] = useState(false)
  return (
    <FormField
      {...props}
      render={({ field, fieldState, id }) => (
        <InputGroup>
          <InputGroupInput
            {...field}
            id={id}
            type={visible ? "text" : "password"}
            autoComplete={autoComplete}
            aria-invalid={fieldState.invalid}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              aria-label={visible ? "Hide password" : "Show password"}
              onClick={() => setVisible((v) => !v)}
            >
              {visible ? <EyeOffIcon /> : <EyeIcon />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      )}
    />
  )
}

export function TextareaField<T extends FieldValues>({
  rows = 4,
  maxLength,
  placeholder,
  ...props
}: BaseFieldProps<T> & { rows?: number; maxLength?: number; placeholder?: string }) {
  return (
    <FormField
      {...props}
      render={({ field, fieldState, id }) => (
        <div className="relative">
          <Textarea
            {...field}
            id={id}
            rows={rows}
            placeholder={placeholder}
            aria-invalid={fieldState.invalid}
            className="min-h-24 resize-y"
          />
          {maxLength && (
            <span className="pointer-events-none absolute right-2 bottom-1.5 text-xs text-muted-foreground tabular-nums">
              {String(field.value ?? "").length}/{maxLength}
            </span>
          )}
        </div>
      )}
    />
  )
}

export function TagsField<T extends FieldValues>({
  placeholder,
  max,
  ...props
}: BaseFieldProps<T> & { placeholder?: string; max?: number }) {
  return (
    <FormField
      {...props}
      render={({ field, fieldState, id }) => (
        <TagInput
          id={id}
          value={field.value ?? []}
          onChange={field.onChange}
          onBlur={field.onBlur}
          placeholder={placeholder}
          max={max}
          invalid={fieldState.invalid}
          disabled={field.disabled}
        />
      )}
    />
  )
}

export interface Option<V extends string = string> {
  label: string
  value: V
  description?: string
}

export function SelectField<T extends FieldValues>({
  options,
  ...props
}: BaseFieldProps<T> & { options: Option[] }) {
  return (
    <FormField
      {...props}
      render={({ field, fieldState, id }) => (
        <Select value={field.value} onValueChange={field.onChange} disabled={field.disabled}>
          <SelectTrigger id={id} aria-invalid={fieldState.invalid} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  )
}

export function SwitchField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
}: BaseFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      disabled={disabled}
      render={({ field }) => (
        <Field orientation="horizontal" className="rounded-lg border p-3">
          <FieldContent>
            <FieldLabel htmlFor={`field-${name}`}>{label}</FieldLabel>
            {description && <FieldDescription>{description}</FieldDescription>}
          </FieldContent>
          <Switch
            id={`field-${name}`}
            checked={!!field.value}
            onCheckedChange={field.onChange}
            disabled={field.disabled}
          />
        </Field>
      )}
    />
  )
}

export function CheckboxGroupField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
  options,
}: BaseFieldProps<T> & { options: Option[] }) {
  return (
    <Controller
      control={control}
      name={name}
      disabled={disabled}
      render={({ field, fieldState }) => {
        const selected: string[] = field.value ?? []
        const toggle = (value: string, checked: boolean) =>
          field.onChange(
            checked
              ? options.map((o) => o.value).filter((v) => v === value || selected.includes(v))
              : selected.filter((v) => v !== value)
          )
        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>{label}</FieldLabel>
            <div className="grid gap-2 sm:grid-cols-2">
              {options.map((option) => (
                <Field
                  key={option.value}
                  orientation="horizontal"
                  className="rounded-lg border p-3 has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary/5"
                >
                  <Checkbox
                    id={`field-${name}-${option.value}`}
                    checked={selected.includes(option.value)}
                    onCheckedChange={(checked) => toggle(option.value, checked === true)}
                    disabled={field.disabled}
                  />
                  <FieldContent>
                    <FieldLabel htmlFor={`field-${name}-${option.value}`}>{option.label}</FieldLabel>
                    {option.description && <FieldDescription>{option.description}</FieldDescription>}
                  </FieldContent>
                </Field>
              ))}
            </div>
            {description && !fieldState.invalid && <FieldDescription>{description}</FieldDescription>}
            <FieldError errors={[fieldState.error]} />
          </Field>
        )
      }}
    />
  )
}
