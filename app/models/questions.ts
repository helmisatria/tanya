import { inArray } from "drizzle-orm";
import { questions, usersVotesQuestions, users } from "~/db/db-schema";
import { db } from "~/services/db.server";

export const getAllQuestions = async () => {
  const promiseAllQuestions = db.select().from(questions).all();
  const promiseAllQuestionsVoted = db.select().from(usersVotesQuestions).all();

  const [allQuestions, allQuestionsVoted] = await Promise.all([promiseAllQuestions, promiseAllQuestionsVoted]);

  const allQuestionerIds: number[] = [];
  let questionsWithVotes = allQuestions.map((q) => {
    const votes = allQuestionsVoted.filter((qv) => qv.questionId === q.id);
    const totalVotes = votes.length;
    const voterIds = votes.map((v) => v.userId);
    allQuestionerIds.push(q.questionerId);

    return { ...q, votes: totalVotes, voterIds };
  });

  if (allQuestions.length === 0) {
    return [];
  }

  const allQuestioners = await db.select().from(users).where(inArray(users.id, allQuestionerIds)).all();

  questionsWithVotes = questionsWithVotes
    .map((q) => {
      const questioner = allQuestioners.find((user) => user.id === q.questionerId);

      return { ...q, questioner };
    })
    .sort((a, b) => b.votes - a.votes);

  return questionsWithVotes;
};
