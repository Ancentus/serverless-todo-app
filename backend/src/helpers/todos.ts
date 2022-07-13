import { TodosAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import * as createError from 'http-errors'
import { TodoUpdate } from '../models/TodoUpdate';

// DONE: Implement businessLogic
const attachmentUtils = new AttachmentUtils()
const todosAccess = new TodosAccess()
const bucketName = process.env.ATTACHMENT_S3_BUCKET

export async function createAttachmentPresignedUrl(imageId: string): Promise<string> {
  const uploadUrl = await attachmentUtils.getPresignedUrl(imageId)
  return uploadUrl
}

export async function getTodosForUser(userId: string): Promise<TodoItem[]> {
  return await todosAccess.getUserTodos(userId)
}

export async function createTodo(createTodoRequest: CreateTodoRequest, userId: string): Promise<TodoItem> {
  const itemId = uuid.v4()

  return await todosAccess.createTodo({
    todoId: itemId,
    userId: userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${itemId}`
  })
}

export async function updateTodo(todoId: String, todoUpdate: TodoUpdate, userId: String): Promise<void> {
  return await todosAccess.updateTodo(todoId, todoUpdate, userId);
}

export async function deleteTodo(todoId: String, userId: String): Promise<void> {
  return await todosAccess.deleteTodo(todoId, userId);
}