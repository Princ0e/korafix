const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const connectDB = require('./config/db');

dotenv.config();

const categories = [
    { name: 'Admin Assistant', group: 'Office', description: 'Virtual assistants, data entry, etc.' },
    { name: 'Web Developer', group: 'Technical', description: 'Websites, apps, software.' },
    { name: 'Plumber', group: 'Home', description: 'Pipe repairs, installation.' },
    { name: 'Electrician', group: 'Home', description: 'Wiring, repairs, installation.' },
    { name: 'Carpenter', group: 'Construction', description: 'Woodworking, furniture, framing.' },
    { name: 'Mechanic', group: 'Mechanical', description: 'Car repair, engine maintenance.' },
    { name: 'Graphic Designer', group: 'Creative', description: 'Logos, branding, illustrations.' },
    { name: 'House Helper', group: 'Home', description: 'Cleaning, housekeeping, general assistance.' },
    { name: 'Others', group: 'Other', description: 'Other services not listed above.' }
];

const importData = async () => {
    try {
        await connectDB();
        await Category.deleteMany();
        await Category.insertMany(categories);
        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    // destroyData();
} else {
    importData();
}
