const util = require('util')
const moment = require('moment')
const debug = require('debug')('botium-core-ConditionalTimeBasedLogicHook')

module.exports = class ConditionalTimeBasedLogicHook {
  constructor (context, caps, globalArgs) {
    this.context = context
    this.caps = caps
    this.globalArgs = globalArgs
  }

  _isBetween (start, end) {
    const startTime = moment(start, [moment.ISO_8601, 'HH:mm'])
    const endTime = moment(end, [moment.ISO_8601, 'HH:mm'])
    if (startTime.isSameOrAfter(endTime)) {
      if (moment().isSameOrAfter(startTime)) {
        endTime.add(1, 'days')
      } else {
        startTime.add(-1, 'days')
      }
    }
    return moment().isBetween(startTime, endTime, 'minutes', '[]')
  }

  onBotPrepare ({ convo, convoStep, args }) {
    const conditionGroupId = args[1]
    let params
    try {
      params = JSON.parse(args[0])
    } catch (e) {
      throw new Error(`ConditionalTimeBasedLogicHook: No parsable JSON object found in params: ${e}`)
    }
    convoStep.conditional = {
      conditionGroupId
    }
    convoStep.conditional.skip = !this._isBetween(params.start, params.end)
    debug(`ConditionalTimeBasedLogicHook onBotPrepare ${convo.header.name}/${convoStep.stepTag}, args: ${util.inspect(args)}, convoStep.conditional: ${convoStep.conditional}`)
  }
}
