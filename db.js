import {Pool} from 'pg'

const pool = new Pool({
    database: 'barbearia',
    port: 5432,
    user: 'postgres',
    host: 'localhost',
    password: 'senai'
})

export default pool