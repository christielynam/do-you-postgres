
exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(promise => {
      // Inserts seed entries
      return knex('users').insert([
        {
          email: 'christielynam@gmail.com',
          password: 'auburn'
        },
        {
          email: 'margoschaedel@gmail.com',
          password: 'texas'
        }
      ]);
    });
};
