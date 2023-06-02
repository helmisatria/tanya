import { relations, type InferModel, sql } from "drizzle-orm";
import { sqliteTable, text, integer, uniqueIndex, primaryKey } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey(),
    googleId: text("google_id"),
    email: text("email").notNull(),
    name: text("name").notNull(),
  },
  (table) => {
    return {
      emailIdx: uniqueIndex("email_idx").on(table.email),
      googleIdIdx: uniqueIndex("google_id_idx").on(table.googleId),
    };
  }
);

export const usersRelations = relations(users, ({ many }) => ({
  questions: many(questions),
  votes: many(questions),
}));

export const questions = sqliteTable("questions", {
  id: integer("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer"),
  label: text("label"),
  questionerId: integer("questioner_id").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const questionsRelations = relations(questions, ({ one, many }) => ({
  questioner: one(users, {
    fields: [questions.questionerId],
    references: [users.id],
  }),
  voters: many(users),
}));

export const usersVotesQuestions = sqliteTable(
  "users_votes_questions",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    questionId: integer("question_id")
      .notNull()
      .references(() => questions.id),
  },
  (t) => ({
    pk: primaryKey(t.userId, t.questionId),
  })
);

export const usersVotesQuestionsRelations = relations(usersVotesQuestions, ({ one }) => ({
  questions: one(questions, {
    fields: [usersVotesQuestions.questionId],
    references: [questions.id],
  }),
  voters: one(users, {
    fields: [usersVotesQuestions.userId],
    references: [users.id],
  }),
}));

export type User = InferModel<typeof users>; // return type when queried
