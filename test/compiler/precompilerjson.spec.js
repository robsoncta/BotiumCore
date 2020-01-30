const path = require('path')
const assert = require('chai').assert
const BotDriver = require('../../').BotDriver
const Capabilities = require('../../').Capabilities

const echoConnector = ({ queueBotSays }) => {
  return {
    UserSays (msg) {
      const botMsg = { sender: 'bot', sourceData: msg.sourceData, messageText: msg.messageText }
      queueBotSays(botMsg)
    }
  }
}

describe('compiler.precompiler.json', function () {
  beforeEach(async function () {
    const myCaps = {
      [Capabilities.PROJECTNAME]: 'compiler.precompiler.json',
      [Capabilities.CONTAINERMODE]: echoConnector,
      [Capabilities.SCRIPTING_ENABLE_MEMORY]: true,
      PRECOMPILERS: {
        name: 'JSON_TO_JSON_JSONPATH',
        rootJsonpath: '$.domains[*].intents[*]',
        intentsJsonpath: '$.name',
        utterancesJsonpath: '$.queries[*].text'
      }
    }
    const driver = new BotDriver(myCaps)
    this.compiler = driver.BuildCompiler()
    this.container = await driver.Build()
  })
  afterEach(async function () {
    this.container && await this.container.Clean()
  })

  it('should execute non-standard json', async function () {
    this.compiler.ReadScript(path.resolve(__dirname, 'convos'), 'convos_precompiler_json_to_json_jsonpath.json')
    this.compiler.ExpandUtterancesToConvos()
    this.compiler.ExpandConvos()
    const transcript = await this.compiler.convos[0].Run(this.container)
    assert.equal(transcript.steps.length, 2)
    assert.equal(transcript.steps[0].actual.messageText, 'What\'s the best hotel between Soho Grand and Paramount Hotel?')
  })
})
