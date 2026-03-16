import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from '../src/app.module'
import { ExpressAdapter } from '@nestjs/platform-express'
import express from 'express'

let cachedServer: any

async function bootstrap() {
  if (cachedServer) {
    return cachedServer
  }

  const expressApp = express()

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  )

  app.enableCors({
    origin: ['https://adityayufnanda.my.id', 'http://localhost:3000'],
    credentials: true,
  })

  await app.init()

  cachedServer = expressApp

  return cachedServer
}

export default async function handler(req: any, res: any) {
  const server = await bootstrap()
  return server(req, res)
}