import { TinesToRouteProcessor } from './TinesToRouteProcessor'

describe('TinesToRouteProcessor', () => {
  describe('constructor', () => {
    let tinesToRouteProcessor: TinesToRouteProcessor
    it('instanciates', () => {
      tinesToRouteProcessor = new TinesToRouteProcessor('0x', new Map())
      expect(tinesToRouteProcessor).toBeInstanceOf(TinesToRouteProcessor)
    })
  })
  describe('#getRouteProcessorCode', () => {
    //
  })
})