import * as cdk from '@aws-cdk/core';


import { TodoNuxtAwsBackend } from "./todo-nuxt-aws-backend";
import * as apiGateway from "@aws-cdk/aws-apigateway";


export class TodosNuxtAwsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const todoNuxtAwsBackend = new TodoNuxtAwsBackend(this, "TodoNuxtAwsBackend")

    const api = new apiGateway.LambdaRestApi(this, "TodoEndpoint", {
      handler: todoNuxtAwsBackend.handler,
      proxy: false,
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
        allowHeaders: ["content-type"],
      }
    })

    const todos = api.root.addResource('todos');
    todos.addMethod("GET");
    todos.addMethod("POST");

    const todo = todos.addResource('{todoId}');
    todo.addMethod("DELETE");
    todo.addMethod("POST");
  }
}
