
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.string('email').unique();
      table.string('password');
      table.timestamps(true, true);
    }),

    knex.schema.createTable('results', function(table) {
      table.increments('id').primary();
      table.string('test_id').unique();
      table.string('deck_id');
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('users.id');
      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('results'),
    knex.schema.dropTable('users'),

  ])
};
