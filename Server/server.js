import app from './src/app.js'
import { config } from 'dotenv';
config()

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`Server in running port ${PORT}`))