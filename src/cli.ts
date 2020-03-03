require('dotenv').config();

import beautify from 'json-beautify';
import readline from 'readline';

import { IAction } from './app/interfaces/action';
import { createContainer } from './config/container';

class CLIApplication {
  container;
  rl;
  constructor() {

  }
  private runAction(action: IAction, payload: any) {
    action.execute(payload).then((x) => {
      console.log('Result:', beautify(x, null as any, 2, 100));
      this.prompt();
    }).catch(e => console.log('Error: ', JSON.stringify(e)));
  }
  private getActionNames(action: IAction) {
    const { name } = action.constructor;
    const actionNameShort = action.constructor.name
      .split('')
      .filter(x => x.charCodeAt(0) >= 65 && x.charCodeAt(0) <= 90)
      .join('');
    const actionNameWithoutFinalAction = name.slice(0, -6);
    const actionNameShortWithoutFinalA = actionNameShort.slice(0, -1);
    const names = [
      name,
      actionNameWithoutFinalAction,
      actionNameShort,
      actionNameShortWithoutFinalA,
    ];
    return [...names, ...names.map(x => x.toLowerCase())];
  }

  private listActions() {
    const actions: IAction[] = this.container.getAll('action');
    return actions.map((x) => {
      const [name, ...synonyms] = this.getActionNames(x);
      const { payloadExample, description } = x;
      // tslint:disable-next-line: prefer-template
      return [
        `${name}(${payloadExample})`,
        `Synonyms: ${synonyms.join(', ')}`,
        description,
      ].filter(Boolean).join('\n') + '\n';
    });
  }
  private findActionCommand(command: string) {
    let parseResult = command.match(/^(\w+)\((.*)\)$/);
    if (!parseResult) {
      parseResult = command.match(/^(\w+)$/);
      if (!parseResult) {
        throw new Error('Error: Invalid syntax');
      }
    }
    const [, name, rawPayload] = parseResult;
    const payload = rawPayload ? JSON.parse(`{${rawPayload}}`) : undefined;
    const actions: IAction[] = this.container.getAll('action');
    const action = actions.find((x: IAction) => {
      const names = this.getActionNames(x);
      const lowerName = name.toLowerCase();
      return names.includes(name) || names.includes(lowerName);
    });
    if (!action) {
      throw new Error('Error: Action not found');
    }
    return { action, payload };
  }

  private helpCommand() {
    console.log('Available commands: help, h, actions, a, quit, q');
  }
  private actionsCommand() {
    console.log('List of available actions: ');
    console.log('');
    console.log(
      this.listActions().map(x => `* ${x}`).join('\n'),
    );
    console.log('');
    console.log('Example: CreateBoardAction({ "slug": "b", "name": "bred" })<Enter>');
    console.log('');
    console.log('If action has no payload, parentheses can be omitted.');
    console.log('Example: listboard<Enter>');
    console.log('');

  }

  private handleCommand(command) {
    switch (command) {
      case 'h':
      case 'help':
        return this.helpCommand();
      case 'a':
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
          console.log(e.message);
          return this.helpCommand();
        }
    }
  }

  private prompt() {
    this.rl.prompt();
    // process.stdout.write('> ');
  }
  private initIO() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });
    this.prompt();
    this.rl.on('line', (line) => {
      this.handleCommand(line);
      this.prompt();
    });
  }
  async run() {
    console.log('Load IOC container...');
    this.container = await createContainer();
    console.log('IOC container loaded.');
    this.initIO();
  }
}

const app = new CLIApplication();
app.run().then(() => {

});
