const Category = require('../models/Category');
const Job = require('../models/Job');

const DESIRED_CATEGORIES = [
    {
        name: 'Education',
        group: 'Education',
        description: 'Primary teachers, language tutors, music coaches, and academic educators.'
    },
    {
        name: 'Web Developer',
        group: 'Technical',
        description: 'Web designers, software developers, frontend & backend engineers.'
    },
    {
        name: 'Driver & Transport',
        group: 'Other',
        description: 'Personal drivers, cab and taxi drivers, transport, and delivery.'
    },
    {
        name: 'Admin Assistant',
        group: 'Office',
        description: 'Virtual assistants, data entry, administrative tasks.'
    },
    {
        name: 'Graphic Designer',
        group: 'Creative',
        description: 'Logos, branding, social media graphics, UI/UX design.'
    },
    {
        name: 'Plumber',
        group: 'Home',
        description: 'Pipe repairs, bathroom & kitchen installation.'
    },
    {
        name: 'Electrician',
        group: 'Home',
        description: 'Electrical wiring, repairs, appliance installation.'
    },
    {
        name: 'House Helper',
        group: 'Home',
        description: 'Housekeeping, cleaning, general home assistance.'
    },
    {
        name: 'Mechanic',
        group: 'Mechanical',
        description: 'Car repair, engine maintenance, diagnostics.'
    },
    {
        name: 'Carpenter',
        group: 'Construction',
        description: 'Woodworking, furniture making, framing.'
    },
    {
        name: 'Painter',
        group: 'Construction',
        description: 'Interior and exterior wall painting services.'
    },
    {
        name: 'Others',
        group: 'Other',
        description: 'Other specialized services not listed above.'
    }
];

const syncCategoriesAndJobs = async () => {
    try {
        console.log('[Sync] Verifying categories in database...');
        for (const cat of DESIRED_CATEGORIES) {
            const existing = await Category.findOne({ name: cat.name });
            if (!existing) {
                await Category.create(cat);
                console.log(`[Sync] Created category: ${cat.name} (${cat.group})`);
            }
        }

        // Get category IDs
        const educationCat = await Category.findOne({ name: 'Education' });
        const driverCat = await Category.findOne({ name: 'Driver & Transport' });
        const webDevCat = await Category.findOne({ name: 'Web Developer' });

        // Update jobs that belong to Education:
        if (educationCat) {
            const eduUpdate = await Job.updateMany(
                {
                    $or: [
                        { title: { $regex: 'teacher|teach|primary|tutor|school', $options: 'i' } },
                        { description: { $regex: 'teacher|teach|piano|guitar|french', $options: 'i' } }
                    ]
                },
                { category: educationCat._id }
            );
            if (eduUpdate.modifiedCount > 0) {
                console.log(`[Sync] Linked ${eduUpdate.modifiedCount} job(s) to Education category`);
            }
        }

        // Update jobs that belong to Driver & Transport:
        if (driverCat) {
            const driverUpdate = await Job.updateMany(
                {
                    $or: [
                        { title: { $regex: 'driver|cab|taxi|chauffeur', $options: 'i' } },
                        { description: { $regex: 'driver|driving|taxi|cab', $options: 'i' } }
                    ]
                },
                { category: driverCat._id }
            );
            if (driverUpdate.modifiedCount > 0) {
                console.log(`[Sync] Linked ${driverUpdate.modifiedCount} job(s) to Driver & Transport category`);
            }
        }

        // Update jobs that belong to Web Developer:
        if (webDevCat) {
            const webUpdate = await Job.updateMany(
                {
                    $or: [
                        { title: { $regex: 'web designer|web developer|website|developer|frontend|backend', $options: 'i' } },
                        { description: { $regex: 'websites|web applications|code', $options: 'i' } }
                    ]
                },
                { category: webDevCat._id }
            );
            if (webUpdate.modifiedCount > 0) {
                console.log(`[Sync] Linked ${webUpdate.modifiedCount} job(s) to Web Developer category`);
            }
        }

        console.log('[Sync] Category and job synchronization completed.');
    } catch (error) {
        console.error('[Sync] Error during syncCategoriesAndJobs:', error.message);
    }
};

module.exports = { syncCategoriesAndJobs, DESIRED_CATEGORIES };
