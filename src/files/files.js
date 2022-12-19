import { createReadStream, createWriteStream, promises as fs } from 'fs'
import { pipeline } from 'stream/promises'
import path from 'path'

export class Files {
    cat(currentDir, fileName) {
        const filePath = path.resolve(currentDir, fileName)

        return new Promise((resolve, reject) => {
            let result = ''
            createReadStream(filePath, 'utf8')
                .on('error', err => reject(err))
                .on('data', chunk => result += chunk)
                .on('end', () => resolve(result))
        })
    }

    async add(currentDir, fileName) {
        const filePath = path.resolve(currentDir, fileName)
        await fs.writeFile(filePath, '', {flag: 'wx'})
    }

    async rn(currentDir, oldFileName, newFileName) {
        const oldFilePath = path.resolve(currentDir, oldFileName)
        let newFilePath = path.resolve(currentDir, newFileName)
        return await fs.rename(oldFilePath, newFilePath)
    }

    async cp(currentDir, fileName, directory) {
        const filePath = path.resolve(currentDir, fileName)
        const directoryPath = path.resolve(currentDir, directory)
        const destination = path.resolve(directoryPath, path.basename(filePath))

        const directoryStats = await fs.stat(directoryPath)
        const fileStats = await fs.stat(filePath)
        let destinationStats
        try {
            destinationStats = await fs.stat(destination)
        } catch (e) {}

        if (!directoryStats.isDirectory() || !fileStats.isFile() || destinationStats) {
            throw new Error()
        }

        return await pipeline(createReadStream(filePath, 'utf8'), createWriteStream(destination))
    }

    async mv(currentDir, fileName, directory) {
        const filePath = path.resolve(currentDir, fileName)
        const destination = path.resolve(directory, path.basename(filePath))

        if (filePath === destination) {
            return
        }

        await this.cp(currentDir, fileName, directory)
        return await this.rm(currentDir, filePath)
    }

    async rm(currentDir, fileName) {
        const filePath = path.resolve(currentDir, fileName)
        return await fs.unlink(filePath)
    }
}
