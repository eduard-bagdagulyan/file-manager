import os from 'os'
import { parseArgs } from './src/common/utils/utils.js'
import { Nwd } from './src/nwd/nwd.js'
import { ErrorMessages } from './src/common/constants/errorMessages.js'

class App {
    #currentDir = os.homedir()
    #startArgs = parseArgs()
    #username = this.#startArgs.username

    constructor() {
        this.nwd = new Nwd()
    }

    start() {
        if (this.#username !== undefined) {
            console.log(`Welcome to the File Manager, ${this.#username}!`)
            process.stdin.resume().setEncoding('utf8')
            process.stdout.setEncoding('utf8').write(`${this.getCurrentDirMessage()}`)
        } else {
            throw new Error(ErrorMessages.MISSING_USERNAME)
        }
    }

    setupEvents() {
        process.on('SIGINT', () => process.exit(0))
        process.on('exit', () => console.log(this.getExitMessage()))
        process.stdin.on('data', data => {
            this.handleData(data).then(result => {
                if (result && typeof result === 'string') {
                    console.log(result)
                } else if (result && typeof result === 'object') {
                    console.table(result)
                }
                process.stdout.write(`${this.getCurrentDirMessage()}`)
            })
        })

        return this
    }

    async handleData(data) {
        const [command, ...args] = data.trim().split(' ')

        switch (command) {
            case '':
                break
            case '.exit':
                process.exit(0)
                break
            case 'up':
                try {
                    this.#currentDir = this.nwd.up(this.#currentDir)
                    break
                } catch (e) {
                    return ErrorMessages.OPERATION_FAILED
                }
            case 'cd':
                try {
                    if (!args[0]) return ErrorMessages.INVALID_INPUT
                    this.#currentDir = await this.nwd.cd(this.#currentDir, args[0])
                    break
                } catch (e) {
                    return ErrorMessages.OPERATION_FAILED
                }
            case 'ls':
                try {
                    return this.nwd.ls(this.#currentDir)
                } catch (e) {
                    return ErrorMessages.OPERATION_FAILED
                }
            default:
                return ErrorMessages.INVALID_INPUT
        }
    }

    getCurrentDirMessage() {
        return `You are currently in ${this.#currentDir}: `
    }

    getExitMessage() {
        return `\nThank you for using File Manager, ${this.#username}, goodbye!`
    }
}

const app = new App()
app.setupEvents().start()
