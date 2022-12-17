import { ErrorMessages } from '../common/constants/errorMessages.js'
import os from 'os'

export class Os {
    async getInfo(type) {
        switch (type) {
            case '--EOL':
                return JSON.stringify(os.EOL)
            case '--cpus':
                return os.cpus()
            case '--homedir':
                return os.homedir()
            case '--username':
                return os.userInfo().username
            case '--arch':
                return os.arch()
            default:
                return ErrorMessages.INVALID_INPUT
        }
    }
}
