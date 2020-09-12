import AWS = require("aws-sdk");
import {v4 as uuid, validate as uuidValidate} from 'uuid';
import {StatusCodes} from 'http-status-codes';

const tableName = process.env.TODO_TABLE_NAME || ""
const dynamo = new AWS.DynamoDB.DocumentClient()

type Body = string | Todo | Todo[]
type StatusCode = number

interface NewTodo {
    todo: string
}

interface Todo extends NewTodo {
    id: string,
    isComplete: Boolean
}

const createResponse = (
    body: Body,
    statusCode: number = StatusCodes.OK,
) => ({
    body: JSON.stringify(body, null, 2),
    statusCode,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,DELETE',
        'Access-Control-Allow-Headers': 'content-type',
    }
})

const getAllTodos = async (): Promise<[string | Array<Todo>, StatusCode]> => {
    console.log("Getting all todos")
    try {
        const scanResult = await dynamo.scan({
            TableName: tableName
        }).promise()
        return [scanResult["Items"] as Array<Todo>, StatusCodes.OK]
    } catch (error) {
        console.error(error)
        return [error, StatusCodes.INTERNAL_SERVER_ERROR]
    }
}

const addTodo = async (todo: string): Promise<[string | Todo, StatusCode]> => {
    console.log("Adding todo: ", todo)
    try {
        const todoItem: Todo = {
            id: uuid(),
            todo,
            isComplete: false
        }
        await dynamo.put({
            TableName: tableName,
            Item: todoItem
        }).promise()
        return [todoItem, StatusCodes.OK]
    } catch (error) {
        console.error(error)
        return [error, StatusCodes.INTERNAL_SERVER_ERROR]
    }
}

const deleteTodo = async (todoId: string): Promise<[string | Todo, StatusCode]> => {
    console.log("Deleting todo with id: ", todoId)
    try {
        const response = await dynamo.delete({
            TableName: tableName,
            Key: {id: todoId},
            ReturnValues: "ALL_OLD"
        }).promise()
        const deletedItem = response["Attributes"]
        return deletedItem ?
            [deletedItem, StatusCodes.OK] as [Todo, StatusCode] :
            [`No todo with id ${todoId}`, StatusCodes.BAD_REQUEST]
    } catch (error) {
        console.error(error)
        return [error, StatusCodes.INTERNAL_SERVER_ERROR]
    }
}

const toggleTodo = async (todoId: string, isComplete: boolean): Promise<[Todo | string, StatusCode]> => {
    try {
        const response = await dynamo.update({
            TableName: tableName,
            Key: {id: todoId},
            UpdateExpression: 'set isComplete = :newIsComplete',
            ExpressionAttributeValues: {':newIsComplete': isComplete},
            ReturnValues: "ALL_NEW"
        }).promise()
        const updatedItem = response["Attributes"]
        return updatedItem ?
            [updatedItem, StatusCodes.OK] as [Todo, StatusCode] :
            [`No todo with id ${todoId}`, StatusCodes.BAD_REQUEST]
    } catch (error) {
        console.error(error)
        return [error, StatusCodes.INTERNAL_SERVER_ERROR]
    }
}

exports.handler = async (event: AWSLambda.APIGatewayEvent, _: AWSLambda.Context) => {
    console.debug("event: ", event)
    try {
        const {httpMethod, body: requestBody, pathParameters} = event

        if (httpMethod === "GET") {
            const [allTodos, statusCode] = await getAllTodos();
            return createResponse(allTodos, statusCode)
        }

        if (httpMethod === "POST") {
            if (pathParameters?.todoId) {
                if (!requestBody) return createResponse("Missing request body", StatusCodes.BAD_REQUEST)
                const parsedBody = JSON.parse(requestBody)
                const {isComplete} = parsedBody
                if (isComplete === undefined) return ["No 'isComplete' provided in body", StatusCodes.BAD_REQUEST]
                const [response, statusCode] = await toggleTodo(pathParameters.todoId, isComplete)
                return createResponse(response, statusCode)
            }

            if (!requestBody) return createResponse("Missing request body", StatusCodes.BAD_REQUEST)
            const parsedBody = JSON.parse(requestBody)
            const {todo} = parsedBody
            if (!todo || todo.trim() === "") return ["No 'todo' provided in body", StatusCodes.BAD_REQUEST]

            const [createdTodo, statusCode] = await addTodo(todo)
            return createResponse(createdTodo, statusCode)
        } else if (httpMethod === "DELETE") {
            if (
                !pathParameters?.todoId ||
                (pathParameters.todoId && pathParameters.todoId.trim() === "")
            ) return createResponse("Missing path parameter 'todoId'", StatusCodes.BAD_REQUEST)
            const todoId = pathParameters.todoId
            if (!uuidValidate(todoId)) return createResponse("Path parameter 'todoId' is not a valid id", StatusCodes.BAD_REQUEST)

            const [deletedTodoId, statusCode] = await deleteTodo(todoId)
            return createResponse(deletedTodoId, statusCode)
        } else {
            return createResponse("Method not allowed", StatusCodes.METHOD_NOT_ALLOWED)
        }

    } catch (error) {
        console.error(error)
        return createResponse(error, StatusCodes.INTERNAL_SERVER_ERROR)
    }
}