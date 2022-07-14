import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// DONE: Implement the dataLayer logic
export class TodosAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE,
        private readonly createdAtIndex = process.env.TODOS_CREATED_AT_INDEX
    ) { }

    async getUserTodos(userId: string): Promise<TodoItem[]> {
        logger.info('Getting todo items for user with id: ' + userId)

        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.createdAtIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        const items = result.Items
        return items as TodoItem[]
    }

    async createTodo(todo: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
            TableName: this.todosTable,
            Item: todo
        }).promise()

        return todo
    }

    async updateTodo(todoId: String, todoUpdate: TodoUpdate, userId: String): Promise<void> {
        logger.info("Updating to with id: " + todoId)

        this.docClient.update(
            {
                TableName: this.todosTable,
                Key: {
                    todoId,
                    userId,
                },
                UpdateExpression: "set #name = :name, #dueDate = :due, #done = :done",
                ExpressionAttributeValues: {
                    ":name": todoUpdate.name,
                    ":due": todoUpdate.dueDate,
                    ":done": todoUpdate.done,
                },
                ExpressionAttributeNames: {
                    "#name": "name",
                    "#dueDate": "dueDate",
                    "#done": "done",
                },
            },
            function (err, data) {
                if (err) {
                    logger.error(err);
                    throw new Error("Error: " + err);
                } else {
                    logger.info('Item updated', {
                        data: data
                    })
                }
            }
        );
    }

    async deleteTodo(todoId: String, userId: String): Promise<void> {
        this.docClient.delete(
            {
                TableName: this.todosTable,
                Key: {
                    todoId,
                    userId,
                },
            },
            function (err, data) {
                if (err) {
                    logger.error(err);
                    throw new Error("Error: " + err);
                } else {
                    logger.info('Item deleted', {
                        data: data
                    })
                }
            }
        );
    }

}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance')
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}