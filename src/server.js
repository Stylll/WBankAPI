import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const port = process.env.PORT || 3000;

// Listen at designated port
app.listen(port, (error) => {
    console.log(`Server running on port ${port}`);
});

export default app;