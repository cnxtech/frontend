import redirect from './redirect'
import {setCookie, getCookie, removeCookie} from './session'
import {
  authenticate,
  confirmUser,
  redefinePassword as redefinePass,
  resetPassword as resetPass
} from 'services/auth-api'
import {createUser} from 'services/user-api'
import {
  validateCredentials,
  validateNewUser,
  validateEmail,
  validatePasswords
} from './validation'

export const signIn = async (email, password) => {
  try {
    validateCredentials(email, password)
    const res = await authenticate(email, password)
    setCookie('jwt', res.user.token)
    setCookie('loggedIn', 1)
    setCookie('currentUserId', res.user.id)
    setCookie('userRole', res.user.role)
    redirect(getCookie('redirectTo') || '/')
    return res.user
  } catch (e) {
    throw e
  }
}

export const signUp = async (name, email, password, url, phone) => {
  try {
    validateNewUser(name, email, password)
    const res = await createUser(name, email, password, phone)
    const {user} = res.data
    setCookie('jwt', user.token)
    setCookie('currentUserId', user.id)
    setCookie('userRole', user.role)
    redirect(getCookie('redirectTo') || '/')
    return user
  } catch (e) {
    throw e
  }
}

export const signUpUser = async ({jwt, id, role}) => {
  setCookie('jwt', jwt)
  setCookie('currentUserId', id)
  setCookie('userRole', role)
}

export const signOut = (ctx = {}) => {
  if (process.browser) {
    removeCookie('jwt')
    removeCookie('currentUserId')
    removeCookie('userRole')
    localStorage.removeItem('user')
    redirect('/', ctx)
  }
}

export const redefinePassword = async (email) => {
  try {
    validateEmail(email)
    const res = await redefinePass(email)
    return res.data
  } catch (e) {
    throw e
  }
}

export const resetPassword = async (password, password_confirm, token) => {
  try {
    validatePasswords(password, password_confirm)
    const res = await resetPass(password, token)
    redirect('/login')
    return res.data
  } catch (e) {
    throw e
  }
}

export const confirm = async (token) => {
  try {
    const res = await confirmUser(token)
    if (res.data.user) {
      const {user} = res.data
      return user
    }
    throw 'Ocorreu um erro ao confirmar sua conta. Tente novamente.'
  } catch (e) {
    throw e
  }
}

export const getJwt = (ctx) => {
  return getCookie('jwt', ctx.req)
}

const getUserRole = (ctx) => {
  return getCookie('userRole', ctx.req)
}

export const getCurrentUserId = (ctx) => getCookie('currentUserId', ctx.req)

export const isAuthenticated = (ctx) => !!getJwt(ctx)

export const isAdmin = (ctx) => getUserRole(ctx) == 'admin'

export const redirectIfAuthenticated = (ctx) => {
  if (isAuthenticated(ctx)) {
    redirect('/', ctx)
    return true
  }
  return false
}

export const redirectIfNotAuthenticated = (ctx) => {
  const {asPath, pathname, query} = ctx
  if (!isAuthenticated(ctx)) {
    const baseUrl = ctx.req ? ctx.req.baseUrl : ''
    const asPathWithBaseUrl = baseUrl + asPath
    setCookie('redirectTo', `${pathname}#as#${asPathWithBaseUrl}`)
    redirect('/auth/login', ctx, false, {
      asPath: asPathWithBaseUrl,
      pathname,
      query
    })
    return true
  }
  return false
}

export const redirectIfNotAdmin = (ctx) => {
  if (!isAdmin(ctx)) {
    redirect('/login', ctx)
    return false
  }
  isAdmin(ctx)
}
