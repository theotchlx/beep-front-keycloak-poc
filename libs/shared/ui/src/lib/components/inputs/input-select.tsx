import { ReactNode, useEffect, useId, useState } from 'react'
import Select, {
  GroupBase,
  MenuListProps,
  MenuPlacement,
  MultiValue,
  MultiValueProps,
  NoticeProps,
  OptionProps,
  SingleValue,
  SingleValueProps,
  components,
} from 'react-select'
import { Value } from '@beep/contracts'
import { Tooltip } from '../tooltip/tooltip'
import { Icon } from '../icons/icon'
import IconFa from '../icons/icon-fa/icon-fa'
import { useTranslation } from 'react-i18next'


export interface InputSelectProps {
  className?: string
  label?: string
  value?: string | string[]
  options: Value[]
  disabled?: boolean
  error?: string
  onChange?: (value: string | string[]) => void
  dataTestId?: string
  isMulti?: true
  portal?: boolean
  isSearchable?: boolean
  isClearable?: boolean
  menuListButton?: {
    label: string
    onClick: () => void
    icon?: ReactNode
  }
  isFilter?: boolean
  autoFocus?: boolean
  placeholder?: string
  menuPlacement?: MenuPlacement
}

export function InputSelect({
  className = '',
  label,
  value,
  options,
  disabled,
  error,
  portal,
  onChange,
  dataTestId,
  isMulti = undefined,
  isSearchable = false,
  isClearable = false,
  isFilter = false,
  autoFocus = false,
  placeholder,
  menuListButton,
  menuPlacement = 'auto',
}: InputSelectProps) {
  const { t } = useTranslation()
  const [focused, setFocused] = useState(false)
  const [selectedItems, setSelectedItems] = useState<
    MultiValue<Value> | SingleValue<Value>
  >([])
  const [selectedValue, setSelectedValue] = useState<string | string[]>([])

  const selectedWithIconClassName = 'ml-8'

  const hasFocus = focused
  const hasError = error ? 'input--error' : ''

  const handleChange = (values: MultiValue<Value> | SingleValue<Value>) => {
    setSelectedItems(values)

    if (isMulti) {
      const vals = (values as MultiValue<Value>).map((value) => value.value)
      onChange && onChange(vals)
      setSelectedValue(vals)
    } else {
      if (values) {
        onChange && onChange((values as Value).value)
        setSelectedValue((values as Value).value)
      }
    }
  }

  useEffect(() => {
    const items = options.filter((option) => {
      if (isMulti) {
        return (value as string[])?.includes(option.value)
      } else {
        if (Array.isArray(value)) {
          return (value as string[])?.includes(option.value)
        } else {
          return option.value === (value as string)
        }
      }
    })

    items && setSelectedItems(items)
    if (isMulti) {
      setSelectedValue(items.map((item) => item.value))
    } else {
      if (items && items.length > 0) {
        setSelectedValue(items[0]?.value)
      }
    }
  }, [value, isMulti, options])

  const MenuList = (props: MenuListProps<Value, true, GroupBase<Value>>) => (
    <div role="listbox">
      <components.MenuList {...props}>
        {props.children}
        {menuListButton && (
          <button
            data-testid="input-menu-list-button"
            type="button"
            tabIndex={-1}
            className="input-select__button w-full mt-4 relative before:content-[''] before:w-full before:h-[1px] before:block before:bg-neutral-150 before:absolute before:-top-2 before:left-0"
            onClick={menuListButton.onClick}
          >
            <div className="w-4 h-full flex items-center justify-center">
              {menuListButton.icon}
            </div>
            <Tooltip>
              <label className="ml-2 truncate">{menuListButton.label}</label>
            </Tooltip>
          </button>
        )}
      </components.MenuList>
    </div>
  )

  const Option = (props: OptionProps<Value, true, GroupBase<Value>>) => {
    const id = useId()
    return (
      <div role="option" aria-selected aria-labelledby={id}>
        <components.Option {...props}>
          {isMulti ? (
            <span className="input-select__checkbox">
              {props.isSelected && (
                <Icon name={'ic:round-check'} className="text-xs !text-white" />
              )}
            </span>
          ) : props.isSelected ? (
            <Icon name={'icon-solid-cloud-check'} className="text-green-500" />
          ) : props.data.icon ? (
            <div className="w-4 h-full flex items-center justify-center">
              {props.data.icon}
            </div>
          ) : (
            <Icon name={'icon-solid-cloud-check'} className="opacity-0" />
          )}
          <label id={id} className="ml-2 truncate">
            {props.label}
          </label>
        </components.Option>
      </div>
    )
  }

  const MultiValue = (
    props: MultiValueProps<Value, true, GroupBase<Value>>
  ) => (
    <span className="text-sm text-neutral-400 mr-1">
      {props.data.label}
      {props.index + 1 !== (selectedItems as MultiValue<Value>).length && ', '}
    </span>
  )

  const SingleValue = (props: SingleValueProps<Value>) => (
    <span className="text-sm text-neutral-400 mr-1">{props.data.label}</span>
  )

  const NoOptionsMessage = (props: NoticeProps<Value>) => {
    return (
      <components.NoOptionsMessage {...props}>
        <div className="text-center px-3 py-6">
          <Icon name={'icon-solid-wave-pulse'} className="text-neutral-350" />
          <p className="text-neutral-350 font-medium text-xs mt-1">
            {t('shared.input-select.no_options')}
          </p>
        </div>{' '}
      </components.NoOptionsMessage>
    )
  }

  const currentIcon = options.find((option) => option.value === selectedValue)
  const hasIcon = !isMulti && currentIcon?.icon

  const inputActions =
    hasFocus && !disabled
      ? '!border-brand-500 !shadow-[0_2px_2px_rgba(0, 0, 0, 0.05)] input--focused'
      : disabled
      ? '!bg-neutral-100 !border-neutral-250 !pointer-events-none'
      : hasError
      ? 'input--error'
      : ''

  const [hasLabelUp, setHasLabelUp] = useState(
    value?.length !== 0 ? 'input--label-up' : ''
  )

  useEffect(() => {
    setHasLabelUp(
      hasFocus || selectedValue.length !== 0 ? 'input--label-up' : ''
    )
  }, [hasFocus, selectedValue, setHasLabelUp])

  return (
    <div className={className}>
      <div
        className={`input input--select ${
          hasIcon ? 'input--has-icon' : ''
        } ${inputActions} ${
          disabled ? '!bg-neutral-100 !border-neutral-250' : ''
        } ${isFilter ? 'input--filter' : ''}`}
        data-testid={dataTestId || 'select'}
      >
        {hasIcon && (
          <div
            data-testid="selected-icon"
            className="w-12 h-full absolute left-0 top-0 flex items-center justify-center"
          >
            {currentIcon.icon}
          </div>
        )}
        {label && (
          <label
            htmlFor={label}
            className={
              hasIcon
                ? `!text-xs !translate-y-0 ${selectedWithIconClassName}`
                : `${
                    hasLabelUp
                      ? '!text-xs !translate-y-0'
                      : 'text-sm translate-y-2 top-1.5'
                  }`
            }
          >
            {label}
          </label>
        )}
        <Select
          autoFocus={autoFocus}
          options={options}
          isMulti={isMulti}
          data-testid="select-react-select"
          components={{
            Option,
            MultiValue,
            SingleValue,
            NoOptionsMessage,
            MenuList,
          }}
          name={label}
          inputId={label}
          menuPlacement={menuPlacement}
          closeMenuOnSelect={!isMulti}
          onChange={handleChange}
          classNamePrefix="input-select"
          hideSelectedOptions={false}
          isSearchable={isSearchable}
          placeholder={placeholder}
          isClearable={isClearable}
          isDisabled={disabled}
          value={selectedItems}
          menuPortalTarget={portal ? document.body : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          styles={{
            menuPortal: (base) => ({
              ...base,
              pointerEvents: 'auto',
              zIndex: 100,
              // Prevent misplacement with intercom banner
              marginTop: `-${
                document.body.style.marginTop
                  ? document.body.style.marginTop
                  : 0
              }`,
            }),
          }}
          menuIsOpen={isFilter ? true : undefined}
        />
        <input type="hidden" name={label} value={selectedValue} />
        {!isFilter && (
          <div className="absolute top-1/2 -translate-y-1/2 right-4 pointer-events-none">
            <Icon
              name="flowbite:angle-down-outline"
              className="text-sm text-neutral-400"
            />
          </div>
        )}
        {currentIcon?.onClickEditable && (
          <div
            data-testid="selected-edit-icon"
            className="cursor-pointer flex items-center justify-center text-sm text-neutral-400 hover:text-brand-500 w-8 h-8 absolute right-8 top-[10px]"
            onClick={(event) => {
              event.stopPropagation()
              currentIcon.onClickEditable && currentIcon.onClickEditable()
            }}
          >
            <IconFa name={'icon-solid-pen'} />
          </div>
        )}
      </div>
      {error && (
        <p className="px-4 mt-1 font-medium text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}
