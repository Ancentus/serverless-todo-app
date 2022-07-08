import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'

// TODO: Implement businessLogic
const attachmentUtils = new AttachmentUtils()
const todosAccess = new TodosAccess()

export async function createAttachmentPresignedUrl(imageId: string): Promise<string> {
    const uploadUrl = await attachmentUtils.getPresignedUrl(imageId)
    return uploadUrl
}

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
    return todosAccess.getUserTodos(userId)
}
