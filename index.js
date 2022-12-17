import os from 'os'
import { Utils } from './src/common/utils/utils.js'
import { Nwd } from './src/nwd/nwd.js'
import { ErrorMessages } from './src/common/constants/errorMessages.js'

class App {
    #currentDir = os.homedir()
    #startArgs = Utils.parseArgs()
    #username = this.#startArgs.username

    constructor() {
        this.nwd = new Nwd()
    }

    start() {
        if (this.#username !== undefined) {
            console.log(`Welcome to the File Manager, ${this.#username}!`)
            process.stdin.resume().setEncoding('utf8')
            process.stdout.setEncoding('utf8').write(`${Utils.getCurrentDirMessage(this.#currentDir)}`)
        } else {
            throw new Error(ErrorMessages.MISSING_USERNAME)
        }
    }

    setupEvents() {
        process.on('SIGINT', () => process.exit(0))
        process.on('exit', () => console.log(Utils.getExitMessage(this.#username)))
        process.stdin.on('data', data => {
            this.handleData(data).then(result => {
                if (result && typeof result === 'string') {
                    console.log(result)
                } else if (result && typeof result === 'object') {
                    console.table(result)
                }
                process.stdout.write(`${Utils.getCurrentDirMessage(this.#currentDir)}`)
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
                    return await this.nwd.ls(this.#currentDir)
                } catch (e) {
                    return ErrorMessages.OPERATION_FAILED
                }
            default:
                return ErrorMessages.INVALID_INPUT
        }
    }
}

const app = new App()
app.setupEvents().start()
