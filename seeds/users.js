
exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(promise => {
      // Inserts seed entries
      return knex('users').insert([
        {
          name: 'Christie Lynam',
          email: 'christielynam@gmail.com',
          password: 'auburn'
        },
        {
          name: 'Margo Schaedel',
          email: 'margoschaedel@gmail.com',
          password: 'texas'
        }
      ]);
    });
};
