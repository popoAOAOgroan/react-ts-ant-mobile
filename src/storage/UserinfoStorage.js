import Storage from 'UTIL/storage'

let UserinfoStorage = {
    USERINFO_STORAGE: Storage.sessionStorage('userinfo_storage'),
    HOSPITAL_STORAGE: Storage.sessionStorage('hospital_storage'),
}

export default UserinfoStorage;