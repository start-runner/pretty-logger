import path from 'path';
import decamelize from 'decamelize';
import chalk from 'chalk';

export default (options = { mute: [] }) => (rawName, type, message) => {
    const name = '→ ' + decamelize(rawName, ' ');

    if (options.mute.indexOf(rawName) !== -1 || options.mute.indexOf(name) !== -1) {
        return;
    }

    if (type === 'start') {
        console.log(`${chalk.yellow(name)}: start`);
        return;
    }

    if (type === 'resolve') {
        console.log(`${chalk.green(name)}: done\n`);
        return;
    }

    if (type === 'reject') {
        // hard error
        if (message instanceof Error) {
            console.error(chalk.red(message.stack));
        // soft error(s)
        } else {
            [].concat(message).forEach(msg => {
                console.log(`${chalk.red(name)}: ${msg}`);
            });
        }

        console.log(`${chalk.red(name)}: error`);
        return;
    }

    if (type === 'info') {
        [].concat(message)
            .map(msg => {
                if (path.isAbsolute(msg)) {
                    return './' + path.relative(process.cwd(), msg);
                }

                return msg;
            })
            .forEach(msg => {
                console.log(`${chalk.blue(name)}: ${msg}`);
            });
    }
};