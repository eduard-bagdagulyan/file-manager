export function parseArgs() {
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
