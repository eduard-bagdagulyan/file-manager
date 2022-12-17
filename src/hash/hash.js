import { pipeline } from 'stream/promises'
import { createReadStream } from 'fs'
import path from 'path'
import crypto from 'crypto'

export class Hash {
    async calcHash(currentDir, fileName) {
        const filePath = path.resolve(currentDir, fileName)
        const hashStream = crypto.createHash('sha256').setEncoding('hex')
        await pipeline(createReadStream(filePath), hashStream)
        return hashStream.read()
    }
}
