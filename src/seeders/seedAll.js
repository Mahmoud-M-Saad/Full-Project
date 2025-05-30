const { User, Product, Project, Task, Staff } = require('../models'); // adjust model imports as needed
const { mode } = require('../../config/config');
const users_data = [
    {
        username: 'MSaad Super Admin',
        email: 'msaad@mail.com',
        password: 'msaad123', // Hash this in a real application
        phone: 1234567890,
        address:'123 Main St',
        secAddress: '536 Next St',
        role: 'super_admin'
    }, {
        username: 'admin',
        email: 'admin@mail.com',
        password: 'admin123',
        phone: 9876543210,
        address: '456 Elm St',
        secAddress: '1234 Elm St',
        role: 'admin'
    }, {
        username: 'employee',
        email: 'employee@example.com',
        password: 'emp123',
        phone: 5555555555,
        address: '789 Oak St',
        secAddress: '456 Oak St',
        role: 'employee'
    }, {
        username: 'customer',
        email: 'customer@example.com',
        password: 'cust123',
        phone: 1111111111,
        address: '101 Pine St',
        secAddress: '202 Pine St',
        role: 'customer'
    }, {
        username: 'guest',
        role: 'guest'
    }
];

const main_seed = async () => {
    try {    
        const existingUsers = await User.findAll({
            where: { role: users_data.map(u => u.role) },
            attributes: ['role']
        });
        const existingRoles = existingUsers.map(u => u.role);
        const usersToCreate = users_data.filter(u => !existingRoles.includes(u.role));

        if (usersToCreate.length > 0) {
            await User.bulkCreate(usersToCreate);
            console.info('😎😎 Users seeded successfully');
        }

        if (mode === 'development') await seed_all();  
    } catch (error) {
        console.error('Error seeding super user:', error);
    }
};

const seed_all = async () => {
    try {
        // Clear tables in correct order (children first, then parents)
        await Task.destroy({ where: {}, truncate: { cascade: true } });
        await Project.destroy({ where: {}, truncate: { cascade: true } });
        await Staff.destroy({ where: {}, truncate: { cascade: true } });
        await Product.destroy({ where: {}, truncate: { cascade: true } });

        //! Example: Seed staff
        await Staff.bulkCreate([
            { userId: 2, department: "Back-end", experience: 5, skills: ["communication", "recruitment"], salary: 60000, appointmentDate: new Date(), employmentType: "full-time" },
            { userId: 3, department: "IT", experience: 3.5, skills: ["JavaScript", "React"], salary: 80000, appointmentDate: new Date(), employmentType: "full-time" },
        ]);

        //! Example: Seed projects //! For admins
        await Project.bulkCreate([
            { userId: 1, name: "Project A", description:"Description for Project A", status: "Done" },
            { userId: 1, name: "Project B", description:"Description for Project B", status: "In Progress" },
        ]);

        //! Example: Seed tasks //! For employees
        await Task.bulkCreate([
            { name:"Task 1", userId: 2, title: "Task 1", description: "Description for Task 1", status: "In Progress", projectId: 1 },
            { name:"Task 2", userId: 2, title: "Task 2", description: "Description for Task 2", status: "Completed", projectId: 2 },
        ]);

        //! Example: Seed products
        await Product.bulkCreate([
            { name: 'Product 1', description: "It's a wonderful product", price: 10.99 },
            { name: 'Product 2', description: "It's a great product", price: 19.99 },
        ]);
    } catch (error) {
        console.error('Error in seed_all:', error);
        throw error;
    }
};

module.exports = {
    main_seed,
    seed_all,
};