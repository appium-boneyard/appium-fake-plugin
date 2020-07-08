import BasePlugin from '@appium/base-plugin';
import B from 'bluebird';


export default class FakePlugin extends BasePlugin {

  constructor (pluginName) {
    super(pluginName);
    this.handleCommands = ['getPageSource'];
    this.wrapCommands = ['findElement'];
  }

  fakeRoute (req, res) {
    this.logger.debug('Sending fake route response');
    res.send(JSON.stringify({fake: 'fakeResponse'}));
  }

  async updateServer (expressApp/*, httpServer*/) { // eslint-disable-line require-await
    this.logger.debug('Updating server');
    expressApp.all('/fake', this.fakeRoute.bind(this));
  }

  async handleCommand (driver, cmdName, ...args) {
    if (cmdName === 'getPageSource') {
      await B.delay(10);
      return `<Fake>${JSON.stringify(args)}</Fake>`;
    }

    throw new Error(`Don't know how to handle command ${cmdName}`);
  }

  async wrapCommand (runCmd, driver, cmdName, ...args) {
    this.logger.info(`Before the command ${cmdName} is run with args ${JSON.stringify(args)}`);
    const res = await runCmd();
    this.logger.info(`After the command ${cmdName} is run`);
    res.fake = true;
    return res;
  }
}
