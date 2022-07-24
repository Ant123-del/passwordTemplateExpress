import fetch from 'node-fetch'

async function FEF() {
    try {
        const response = await fetch('http://localhost:6969/login', {
            method: 'POST',
            headers : {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: 'Antonio_123', password: 'masterGamer123'})
        })
        if(response.ok) {
            return await response.json()
        }
        throw new Error(response.status)
    } catch(err) {
        console.warn(err)
    }
}

// async function FEF() {
//     try {
//         const response = await fetch('http://localhost:6969/logout', {
//             method: 'GET',
//             headers : {
//                 'Content-Type': 'application/json'
//             },
//         })
//         if(response.ok) {
//             return await response.json()
//         }
//         throw new Error(response.status)
//     } catch(err) {
//         console.warn(err)
//     }
// }

FEF().then(data => console.log(data))