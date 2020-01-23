import readline from 'readline';
import { createContainer } from "./config/container";

class CLIApplication {
    container;
    rl;
    constructor() {
        
    }
    runAction(action, payload) {
        action.execute(payload).then(x => {
            console.log('Result:', JSON.stringify(x));
        }).catch(e => console.log('Error: ', JSON.stringify(e)));
    }
    findActionCommand(command: string) {
        const result = command.match(/^(\w+)\((.*)\)$/);
        if (!result) {
            throw new Error('Parsing error');
        }
        const [, name, rawPayload] = result;
        const payload = rawPayload ? JSON.parse(rawPayload) : undefined;
        const actions = this.container.getAll('action');
        const action = actions.find(x => x.constructor.name === name);
        return { action, payload };
    }

    helpCommand() {
        console.log('Available commands: actions, quit, q');
    }
    actionsCommand() {
        const actions = this.container.getAll('action');
        console.log('List of available actions: ');
        console.log('');
        console.log(
            actions.map(x => {
                const { name } = x.constructor;
                const description = x.request;
                return `${name}(${description})`
            }).join('\n'),
        );
        console.log('');
        console.log('Example to type: CreateBoardAction({ "slug": "b", "name": "bred" })<Enter>');
    }

    handleCommand(command) {
        switch (command) {
            case 'actions':
                return this.actionsCommand();
            case 'q':
            case 'quit':
                process.exit(0);
            default:
                try {
                    const { action, payload } = this.findActionCommand(command);
                    this.runAction(action, payload);
                } catch (e) {
                    return this.helpCommand();
                }
        }
    }

    prompt() {
        this.rl.prompt();
        // process.stdout.write('> ');
    }
    initIO() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false
        });
        this.prompt();
        this.rl.on('line', (line) => {
            this.handleCommand(line);
            this.prompt();
        });
    }
    async run() {
        console.log('Load IOC container...')
        this.container = await createContainer();
        console.log('IOC container loaded.')
        this.initIO();
    }
}

const app = new CLIApplication();
app.run().then(() => {

});
