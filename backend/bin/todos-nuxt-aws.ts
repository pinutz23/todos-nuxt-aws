#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { TodosNuxtAwsStack } from '../lib/todos-nuxt-aws-stack';

const app = new cdk.App();
new TodosNuxtAwsStack(app, 'TodosNuxtAwsStack');
