import 'reflect-metadata'
import { NestFactory } from '@nestjs/core'
import { AppModule } from '../src/app.module'
import { ExpressAdapter } from '@nestjs/platform-express'
import express from 'express'
import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'

let cachedApp: any

async function bootstrap() {
  const uploadsPath = join(process.cwd(), 'uploads')
  const certificatesPath = join(uploadsPath, 'certificates')
  const cvPath = join(uploadsPath, 'cv')

  ;[uploadsPath, certificatesPath, cvPath].forEach((path) => {
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true })
    }
  })

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