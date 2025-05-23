import { MessageEntity } from '@beep/contracts'
import { ButtonIcon, ButtonShadCnProps, InputMessageArea } from '@beep/ui'
import { useCallback, useContext, useRef } from 'react'
import { Controller, UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ServerContext } from '../feature/page-server-feature'
import { Permissions } from '@beep/contracts'

interface InputChannelAreaProps {
  onChange?: (value: string, onChange: (value: string) => void) => void
  onAddFiles: (file: File) => void
  onCursorChange?: () => void
  sendMessage: () => void
  messageForm: UseFormReturn<{
    message: string
    replyTo: MessageEntity | null
  }>
  inputRef?: React.RefObject<HTMLTextAreaElement>
}

export function InputChannelArea({
  onAddFiles,
  inputRef,
  onChange,
  onCursorChange,
  sendMessage,
  messageForm,
}: InputChannelAreaProps) {
  const inputButtonProps: ButtonShadCnProps = {
    variant: 'hoverRounded',
    size: 'responsiveSquare',
  }
  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleKeyDownOnMessage = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.shiftKey) {
        return
      }
      if (event.key === 'Enter') {
        event.preventDefault()
        sendMessage()
      }
    },
    [sendMessage]
  )
  const { myMember } = useContext(ServerContext)
  const canSendMessage =
    !myMember ||
    myMember?.hasAllPermissions([
      Permissions.SEND_MESSAGES,
      Permissions.VIEW_CHANNELS,
    ])

  const placeholder = canSendMessage
    ? 'channels.page-channel.message_placeholder'
    : 'channels.page-channel.no_permission_sending_message'

  const handleButtonClick = () => {
    // Trigger click on the hidden input
    if (fileInputRef.current) fileInputRef.current.click()
  }
  const { t } = useTranslation()
  return (
    <div className="flex flex-row gap-2 md:gap-4 justify-between w-full items-end font-medium">
      {/* text input */}
      <div className="w-full h-full">
        <Controller
          control={messageForm.control}
          name="message"
          render={({ field }) => (
            <InputMessageArea
              disabled={!canSendMessage}
              type="text"
              name={'message'}
              value={field.value}
              className="rounded-xl bg-violet-50 w-full flex-grow h-10 sm:h-12 md:h-14"
              placeholder={t(placeholder)}
              ref={inputRef}
              onChange={
                onChange
                  ? (e) => onChange(e.target.value, field.onChange)
                  : field.onChange
              }
              onMouseUp={onCursorChange}
              onKeyUp={onCursorChange}
              onKeyDown={handleKeyDownOnMessage}
            />
          )}
        />
      </div>

      {/* buttons */}
      <div className="flex flex-row gap-2 md:gap-4">
        <ButtonIcon
          disabled={!canSendMessage}
          buttonProps={inputButtonProps}
          onClick={sendMessage}
          className="bg-violet-50"
          icon="lucide:send"
        />
        <div>
          <label htmlFor="file" className="cursor-pointer">
            <ButtonIcon
              disabled={!canSendMessage}
              buttonProps={inputButtonProps}
              className="bg-violet-50"
              icon="lucide:plus"
              onClick={handleButtonClick}
            />
          </label>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              if (e.target?.files?.[0]) {
                onAddFiles(e.target.files[0])
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
