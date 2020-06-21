import * as React from 'react'
import models, { User } from './models'
import Client from './miniclient'

type MinitubeContextT = {
    user: User,
    setUser: React.Dispatch<React.SetStateAction<User>>,
    client: Client
}
const MinitubeContext = React.createContext<MinitubeContextT>({ user: models.defaultUser, setUser: null, client: null })
export default MinitubeContext