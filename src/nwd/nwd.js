import os from 'os'
import fs from 'fs/promises'
import path from 'path'

export class Nwd {
    up(currentDir) {
        if (currentDir === os.homedir()) {
            return currentDir
        } else {
            return path.resolve(currentDir, '..')
        }
    }

    async cd(currentDir, destination) {
        const finalPath = path.resolve(currentDir, destination)
        const stats = await fs.stat(finalPath)
        if (stats.isDirectory()) {
            return finalPath
        } else {
            throw new Error()
        }
    }

    async ls(currentDir) {
        const result = []
        const files = await fs.readdir(currentDir, { withFileTypes: true })
        files.forEach(file => {
            if (file.isFile()) {
                result.push({ Name: file.name, Type: 'file' })
            } else if (file.isDirectory()) {
                result.push({ Name: file.name, Type: 'directory'})
            }
        })

        return result.sort((a, b) => {
            if (a['Type'] === b['Type']) {
                return a['Name'] < b['Name'] ? -1 : 1
            } else {
                return a['Type'] < b['Type'] ? -1 : 1
            }
        })
    }
}
