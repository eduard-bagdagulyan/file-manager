export class Utils {
    static parseArgs() {
        const args = {}
        process.argv
            .slice(2)
            .forEach(arg => {
                if (arg.startsWith('--')) {
                    const [param, value] = arg.split('=')
                    args[param.slice(2)] = value
                }
            })
        return args
    }

    static getCurrentDirMessage(dir) {
        return `You are currently in ${dir}: `
    }

    static getExitMessage(username) {
        return `\nThank you for using File Manager, ${username}, goodbye!`
    }
}
