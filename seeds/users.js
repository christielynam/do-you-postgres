
exports.seed = (knex, Promise) => {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {
          name: 'Christie',
          email: 'christielynam@gmail.com',
          password: 'auburn'
        },

      ]);
    });
};
