import Storage from 'UTIL/storage'

let AppStorage = {
    TOKEN_STORAGE: Storage.localStorage('myzd_local_token'),
    USER_STORAGE: Storage.sessionStorage('myzd_session_user')
}
export default AppStorage;