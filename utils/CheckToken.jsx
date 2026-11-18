import cookie from 'js-cookie'

function CheckToken() {
   let token=null

    try {
        let token = cookie.get("admintoken")        
        return token
    }
    catch (e) {
        return token
    }
}

export default CheckToken