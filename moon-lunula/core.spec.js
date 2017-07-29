const {termFromStringSafe} = require('../moon-lang/moon-core')
const {moonAstFromMoonTerm, stringFromAst, lunuaAstFromMoonAst} = require('./core')

describe('core', () => {
  describe('stringFromAst', () => {
    it('should reproduce lunula syntax from moon syntax', () => {
      const moonCode = `x: 100
y: 200
(add x y)
`
      const moonAst = moonAstFromMoonTerm(termFromStringSafe(moonCode))
      const lunuaCode = stringFromAst(lunuaAstFromMoonAst(moonAst))
      expect(lunuaCode).toBe(`{
  x = 100
  y = 200
  Add(x, y)
}
`)
    })
  })
})
