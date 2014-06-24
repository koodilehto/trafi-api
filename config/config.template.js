module.exports = {
    port: 8000,
    mongo: {
        hostname: 'localhost',
        port: 27017,
        db: 'trafi_api',
        username: '',
        password: ''
    },
    maxItemsPerPage: 100,
    datasets: ['brands', 'cabins', 'chassis', 'classes', 'colors', 'fuels', 'municipalities', 'powers', 'transmissions', 'usage'],
    registrationPath: './trafi.csv'
};
