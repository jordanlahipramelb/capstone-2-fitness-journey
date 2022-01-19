"use strict";

/** Related functions for posts. */

// Retrieve database
const db = require("../db");
// Retrieve functions that displays an error
const { NotFoundError } = require("../expressError");
// Retrieve function that helps with updating sql
const { sqlForPartialUpdate } = require("../helpers/sql");

const format = require("pg-format");

class Routine {
  /** Create a routine (from data), update db, return new routine data.
   * - data should be {username, name, description}
   *
   * Returns { id, name, username, description }
   */

  static async create({ name, username, description }) {
    const result = await db.query(
      `INSERT INTO routines 
          (name, username, description)
        VALUES ($1, $2, $3)
        RETURNING id, name, username, description`,
      [name, username, description]
    );

    const routine = result.rows[0];

    return routine;
  }

  /** Posts exercises to routine (from data), update db, return new routine exercise data.
   * - data should be
   * [ { username, name, description },
   * { routine_id, exercise_id, dayofweek, sets, reps }, ...  ]
   *
   * Returns
   * [ { username, name, description },
   * { routine_id, exercise_id, dayofweek, sets, reps }, ...  ]
   */

  static async addExercisesToRoutine(data) {
    let query = format(
      "INSERT INTO routines_exercises (routine_id, exercise_id, dayOfWeek, reps, sets) VALUES %L",
      data
    );
    console.log("query =>", query);

    const res = await db.query(query);

    return res.rows;
  }

  /** Find all routines
   *
   * Returns  [{id, name, username }, ...]
   */

  static async findAll(searchFilters = {}) {
    let query = `SELECT id, 
                        name,
                        username,
                        is_private
                      FROM routines`;

    // WHERE part of sql query
    let whereExpressions = [];
    // values of above queries
    let queryValues = [];

    const { name } = searchFilters;

    if (name) {
      // push possible query search terms to whereExpressions and queryValues in order to generate the correct SQL query
      // push name to query values
      queryValues.push(`%${name}%`);
      // matches query value to its index in the whereExpressions array
      whereExpressions.push(`name ILIKE $${queryValues.length}`);

      // if there is something in the array, join the initial query SQL statement with WHERE and AND between each value of the array
      if (whereExpressions.length > 0) {
        query += " WHERE " + whereExpressions.join(" AND ");
      }

      // finalize query
      query += " ORDER BY name";

      const routineRes = await db.query(query, queryValues);

      return routineRes.rows;
    } else {
      const routineRes = await db.query(
        `SELECT id, 
                name,
                username,
                is_private
            FROM routines`
      );

      return routineRes.rows;
    }
  }

  /** Given routine id, return data about routine including its exercises.
   *
   * Returns [{id, name, username, dayOfWeek, exercises: [ name, sets, reps ] }, ...]
   *
   * Throws NotFoundError if id not found
   */

  static async get(id) {
    const routineRes = await db.query(
      `SELECT routines.id,
      routines.name,
      routines.username,
      routines.description,
      routines_exercises.dayOfWeek,
      CASE WHEN COUNT(routines_exercises.id) = 0 THEN JSON '[]' ELSE JSON_AGG(
      JSON_BUILD_OBJECT('exerciseName', exercises.name, 'sets', routines_exercises.sets, 'reps', routines_exercises.reps)
      ) 
      END AS exercises
      FROM routines
      FULL JOIN routines_exercises
      ON routines.id = routines_exercises.routine_id
      FULL JOIN exercises
      ON routines_exercises.exercise_id = exercises.id
      WHERE routines.id = $1
      GROUP BY routines.id, 
            routines_exercises.dayOfWeek
      ORDER BY routines.id`,
      [id]
    );

    const routine = routineRes.rows;
    if (!routine) throw new NotFoundError(`Routine not found: ${id}`);

    return routine;
  }

  /** Given routine id, removes routine from database */

  static async remove(id) {
    const result = await db.query(
      `DELETE
           FROM routines
           WHERE id = $1
           RETURNING id`,
      [id]
    );

    const routine = result.rows[0];

    if (!routine) throw new NotFoundError(`No routine found: ${id}`);
  }
}

module.exports = Routine;

`SELECT routines.id,
routines.name,
routines.username,
routines.description,
routines_exercises.dayOfWeek,
CASE WHEN COUNT(routines_exercises.id) = 0 THEN JSON '[]' ELSE JSON_AGG(
JSON_BUILD_OBJECT('exerciseName', exercises.name, 'sets', routines_exercises.sets, 'reps', routines_exercises.reps)
) 
END AS exercises
FROM routines
FULL JOIN routines_exercises
ON routines.id = routines_exercises.routine_id
FULL JOIN exercises
ON routines_exercises.exercise_id = exercises.id
WHERE routines.id = $1
GROUP BY routines.id, 
      routines_exercises.dayOfWeek
ORDER BY routines.id`;
