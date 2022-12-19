import path from 'path'
import { pipeline } from 'stream/promises'
import { createReadStream, createWriteStream, promises as fs } from 'fs'
import zlib from 'zlib'

export class Archiver {
    async compress(currentDir, fileName, directory) {
        const filePath = path.resolve(currentDir, fileName)
        const directoryPath = path.resolve(currentDir, directory)
        const fileStats = await fs.stat(filePath)
        const directoryStats = await fs.stat(directoryPath)
        const compressedFileName = path.basename(filePath) + '.br'
        const destinationPath = path.resolve(directoryPath, compressedFileName)
        let destinationStats
        try {
            destinationStats = await fs.stat(destinationPath)
        } catch (e) {}

        if (!fileStats.isFile() || !directoryStats.isDirectory() || destinationStats) {
            throw new Error()
        }

        return await pipeline(createReadStream(filePath), zlib.createBrotliCompress(), createWriteStream(destinationPath))
    }

    async decompress(currentDir, fileName, directory) {
        const filePath = path.resolve(currentDir, fileName)
        const directoryPath = path.resolve(currentDir, directory)
        const fileStats = await fs.stat(filePath)
        const directoryStats = await fs.stat(directoryPath)

        if (!fileStats.isFile() || !directoryStats.isDirectory() || !path.basename(filePath).endsWith('.br')) {
            throw new Error()
        }

        const decompressedFileName = path.basename(filePath).replace('.br', '')
        const destinationPath = path.resolve(directoryPath, decompressedFileName)

        return await pipeline(createReadStream(filePath), zlib.createBrotliDecompress(), createWriteStream(destinationPath))
    }
}
