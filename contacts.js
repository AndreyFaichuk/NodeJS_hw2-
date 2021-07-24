const fs = require("fs")
const path = require("path")

const contactsPath = path.join(__dirname, "/db", "/contacts.json")


function listContacts() {
    return fs.promises.readFile(contactsPath, "utf8")
        .then(res => JSON.parse(res))
}


function getContactById(contactId) {
    return (async () => (await listContacts()).find(item => item.id === contactId))()
}

function removeContact(contactId) {
    return (async () => {
        const test = await listContacts()
        const list = [...test]
        const arr = list.filter(item => item.id !== +contactId)

        fs.promises.writeFile(contactsPath, JSON.stringify(arr))
            .then(() => listContacts())

        if(list.length === arr.length){
            return false
        } else {
            return true
        }
    })()
}

function addContact({name, email, phone}) {
    return (async () => {
        let arr = await listContacts()

       const newContact = {
            id: arr.length + 1,
            name: name,
            email: email,
            phone: phone
        }

        arr.push(newContact)

        fs.promises.writeFile(contactsPath, JSON.stringify(arr))

        return newContact
    })()
}

function updateContact(id, body) {

    return (async () => {

        const arr = await listContacts()
        const index = arr.findIndex(item => item.id === id)

        if(index !== -1){
            Object.assign(arr[index], body)
            fs.promises.writeFile(contactsPath, JSON.stringify(arr))
            return arr[index]
        }
    })()
}


module.exports = {listContacts, addContact, getContactById, removeContact, updateContact}