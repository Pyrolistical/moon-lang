const self = {
  stringFromAst([type, ...parameters]) {
    return {
      Block(definitions, body) {
        const definitionsCode = definitions
          .map(({name, term}) => `${name} = ${self.stringFromAst(term)}`)
        return `{
  ${definitionsCode.join('\n  ')}
  ${self.stringFromAst(body)}
}
`
      },

      Apply(name, parameters) {
        return `${name}(${parameters.map(self.stringFromAst).join(', ')})`
      },

      Variable(name) {
        return name
      },

      Number(value) {
        return String(value)
      }
    }[type](...parameters)
  },

  moonPrimativesToLunua: {
    add: 'Add'
  },

  lunuaAstFromMoonAst([type, ...parameters]) {
    return {
      Pri(name, args) {
        return ['Apply', self.moonPrimativesToLunua[name], args.map(self.lunuaAstFromMoonAst)]
      },
      Var(name) {
        return ['Variable', name]
      },
      Num(num) {
        return ['Number', num]
      },
      Let(name, term, body) {
        const definitions = [
          {
            name,
            term: self.lunuaAstFromMoonAst(term)
          }
        ]
        let lunuaBody = self.lunuaAstFromMoonAst(body)
        if (lunuaBody[0] === 'Block') {
          definitions.push(...lunuaBody[1])
          lunuaBody = lunuaBody[2]
        }
        return ['Block', definitions, lunuaBody]
      }
    }[type](...parameters)
  },

  moonAstFromMoonTerm(moonTerm) {
    return moonTerm({
      App(f, x) {
        return ['App', f, x]
      },
      Lam(name, body) {
        return ['Lam', name, body]
      },
      Var(name) {
        return ['Var', name]
      },
      Let(name, term, body) {
        return ['Let', name, term, body]
      },
      Fix(name, body) {
        return ['Fix', name, body]
      },
      Pri(name, args) {
        return ['Pri', name, args]
      },
      Num(num) {
        return ['Num', num]
      },
      Str(str) {
        return ['Str', str]
      },
      Map(kvs) {
        return ['Map', kvs]
      },
      Dep(name) {
        return['Var', name]
      }
    });
  }
}

module.exports = self