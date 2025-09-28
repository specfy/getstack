import type {
  RepositoryAnalysisInsert,
  RepositoryAnalysisRow,
  RepositoryAnalysisUpdate,
  TX,
} from '../db/types.db.js';

export async function createRepositoryAnalysis(
  trx: TX,
  input: RepositoryAnalysisInsert
): Promise<RepositoryAnalysisRow> {
  return await trx
    .insertInto('repositories_analysis')
    .values(input)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function getRepositoryAnalysis(
  trx: TX,
  repositoryId: string
): Promise<RepositoryAnalysisRow | undefined> {
  const row = await trx
    .selectFrom('repositories_analysis')
    .selectAll()
    .where('repository_id', '=', repositoryId)
    .executeTakeFirst();

  return row;
}

export async function updateRepositoryAnalysis({
  trx,
  id,
  input,
}: {
  trx: TX;
  id: string;
  input: RepositoryAnalysisUpdate;
}): Promise<void> {
  await trx
    .updateTable('repositories_analysis')
    .set({
      analysis: input.analysis,
    })
    .where('id', '=', id)
    .execute();
}

export async function upsertRepositoryAnalysis(
  trx: TX,
  repo: RepositoryAnalysisInsert
): Promise<void> {
  const row = await getRepositoryAnalysis(trx, repo.repository_id);

  if (row) {
    await trx
      .updateTable('repositories_analysis')
      .set({
        analysis: repo.analysis,
      })
      .where('repository_id', '=', repo.repository_id)
      .execute();

    return;
  }

  await trx.insertInto('repositories_analysis').values(repo).execute();
}
