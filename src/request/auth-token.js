import Cookie from 'js-cookie'

class AuthToken {
  constructor (tokenKey = 's_token') {
    this.tokenKey = tokenKey
  }

  getToken () {
    const token = Cookie.get(this.tokenKey)
    if (!token) {
      return null
    }
    return token
  }

  setToken (token, option = {}) {
    Cookie.set(this.tokenKey, token, option)
  }
}

export default AuthToken
