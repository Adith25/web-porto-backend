import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from '../src/app.module'
import { ExpressAdapter } from '@nestjs/platform-express'
import express from 'express'

let cachedApp: any

async function bootstrap() {
  if (cachedApp) {
    return cachedApp
  }

  const server = express()

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(server),
  )

  await app.init()

  cachedApp = server

  return server
}

export default async function handler(req: any, res: any) {
  const app = await bootstrap()
  return app(req, res)
}