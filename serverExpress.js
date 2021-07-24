const {listContacts, getContactById, removeContact, addContact, updateContact} = require("./contacts")

const express = require('express')

const fs = require('fs')

const app = express()
app.use(express.json())

app.use((req, res, next) => {
    if(req.header('Content-Type') === 'aplication/json'){
        req.on('data', data => {
            req.body = JSON.parse(data.toString())
            next()
        })
    } else {
        next()
    }
})

app.get("/api/contacts", async (req, res) => {
    res.send(await listContacts())
})

app.get("/api/contacts/:contactId", async (req, res) => {

        const contactId = req.params.contactId
        const contact = await getContactById(+contactId)

        if (contact !== undefined){
            res.send(contact)
        } else {
            res.status(404)
            res.send({message: "Not found" })
        }
    })

app.post("/api/contacts", async (req, res, next) => {
    if(!('name' in req.body)){
        res.status(400)
        res.send({message: "Missing required name field"})
    }
    if(!('email' in req.body)){
        res.status(400)
        res.send({message: "Missing required email field"})
    }
    if(!('phone' in req.body)){
        res.status(400)
        res.send({message: "Missing required phone field"})
    } else {
        next()
    }
},
    async (req, res) => {
        const newContact = await addContact(req.body)

        res.status(201)
        res.send(newContact)

    })


app.delete("/api/contacts/:contactId", async (req, res) => {

        const contactId = req.params.contactId
        const contact = await removeContact(+contactId)

    if (contact){
        res.status(200)
        res.send({ message: "Contact deleted" })
    } else {
        res.status(404)
        res.send({ message: "Contact not found" })
    }
})

app.patch("/api/contacts/:contactId", (req, res, next) => {

            if (Number.isNaN(Number(req.params.contactId))){
            res.status(400)
            res.send({ message: "wrong contactId" })
        }
        else next()
    },
    async (req, res) => {

            const { contactId } = req.params

            const contact = await updateContact(+contactId, req.body)

                if (contact) res.send({ message: "Contact updated" })
                else {
                    res.status(404);
                    res.send({ message: "Contact not found" })
                }

    })

app.listen(3000, () => console.log('Server started on port: 3000'))