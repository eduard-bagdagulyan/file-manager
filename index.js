import os from 'os'
import { parseArgs } from './src/utils/utils.js'

class App {
    #currentDir = os.homedir()
    #startArgs = parseArgs()
    #username = this.#startArgs.username

    start() {
        if (this.#username !== undefined) {
            console.log(`Welcome to the File Manager, ${this.#username}!`)
            process.stdin.resume().setEncoding('utf8')
            process.stdout.setEncoding('utf8').write(`${this.getCurrentDirMessage()}\n`)
        } else {
            throw new Error('missing argument "--username"')
        }
    }

    setupEvents() {
        process.stdin.on('data', data => console.log(this.handleData(data)))
        process.stdin.on('data', () => console.log(this.getCurrentDirMessage()))
        process.on('SIGINT', () => process.exit(0))
        process.on('exit', () => console.log(`\nThank you for using File Manager, ${this.#startArgs.username}, goodbye!`))

        return this
    }

    handleData(data) {
        const [command, ...args] = data.trim().split(' ')
        switch (command) {
            case '':
                return ''
            case '.exit':
                process.exit(0)
                break
            case 'cd':
                return 'cd received'
            default:
                return 'Error: invalid input'
        }
    }

    getCurrentDirMessage() {
        return `\nYou are currently in ${this.#currentDir}`
    }
}

const app = new App()
app.setupEvents().start()
