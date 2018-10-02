
const data = {
    
    success1 : { account:{ login: '04141212345', password: '1234567' } },
    success2 : { account:{ login: 'test@gmail.com', password: '1234567' } },

    error1   : { account: { password: '1234567' } },
    error2   : { account: { email: 'test@gmail.com' } },
    error3   : { account: { email: '04141212345' } },
    
    malformed1 : { body: 'adasdaqwwiqoqps' },
    malformed2 : { account: 'adasdaqwwiqoqps' },
    malformed3 : { 'asdasdasdasd': 'adasdaqwwiqoqps' },
    malformed4 : { account:{ username: 'test@gmail.com', password: '1234567' } },
    empty : {},

    success3 : () => {
        let num = Math.floor(Math.random()*89999+10000)
        let email = `test${num}@tested.com`
        let phone = `041612${num}`

        return {'account': {
            'name': 'Testing User',
            'email': email,
            'phone': phone,
            'password': '1234567',
            'document_type':  'cc',
            'document_number': '123456789',
            'type': 'juridica'
        } }
    },
    error4 : ( missing ) => {
        let num = Math.floor(Math.random()*89999+10000)
        let email = `test${num}@gmail.com`
        let phone = `041612${num}`

        let data = {'account': {
                    'name': 'Testing User',
                    'email': email,
                    'phone': phone,
                    'password': '1234567',
                    'document_type':  'cc',
                    'document_number': '123456789',
                    'type': 'juridica'
                }
        }
        data.account[ missing ] = ''
        return data
    },
    error5 : () => {
        let num = Math.floor(Math.random()*89999+10000)
        let email = `test${num}@gmail.com`
        let phone = '04141212345'
        
        return {'account': {
            'name': 'Testing User',
            'email': email,
            'phone': phone,
            'password': '1234567',
            'document_type':  'cc',
            'document_number': '123456789',
            'type': 'juridica'
        } }
    },
    error6 : () => {
        let num = Math.floor(Math.random()*89999+10000)
        let email = 'test@gmail.com'
        let phone = `041612${num}`
        
        return {'account': {
            'name': 'Testing User',
            'email': email,
            'phone': phone,
            'password': '1234567',
            'document_type':  'cc',
            'document_number': '123456789',
            'type': 'juridica'
        } }
    },
    error7 : ( custom ) => {
        let num = Math.floor(Math.random()*89999+10000)
        let email = `test${num}@gmail.com`
        let phone = `041612${num}`
 
        let data = {'account': {
                    'name': 'Testing User',
                    'email': email,
                    //'phone': phone,
                    'password': '1234567',
                    'document_type':  'cc',
                    'document_number': '123456789',
                    'type': 'juridica'
                }
        }
        data.account[ custom ] = 'xyz'
        return data
    },
    seed:  {
        
            account : {
                name: 'Testing User',
                email: 'test@gmail.com',
                phone: '04141212345',
                document_type: 'cc',
                document_number: '123456789',
                type: 'juridica',
                website: 'website.ext'
            }
    }
}

module.exports = data




