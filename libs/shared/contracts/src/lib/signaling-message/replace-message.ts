import { MessageEntity } from "../entities"

// This is used by the message slice
// The message id is the one generated by the client
// The message entity is the one sent by the server
export interface ReplaceMessage {
  messageId: string
  message: MessageEntity
}
