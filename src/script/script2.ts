import { OpenAI } from "langchain/llms/openai";
import { SqlDatabase } from "langchain/sql_db";
import { createSqlAgent, SqlToolkit } from "langchain/agents";
import { DataSource } from "typeorm";
import { ConsoleCallbackHandler } from "langchain/callbacks";

export const run = async (apiKey: string) => {
  const llm = new OpenAI({
    openAIApiKey: apiKey,
    temperature: 0,
    verbose: true,
    callbacks: [new ConsoleCallbackHandler()],
  });

  const datasource = new DataSource({
    type: "sqlite",
    database: '/Users/randy/workspace/project/opensource/github/langchain-ts-starter/src/Chinook.db',
  });
  const db = await SqlDatabase.fromDataSourceParams({
    appDataSource: datasource,
  });
  const toolkit = new SqlToolkit(db);
  const executor = createSqlAgent(llm, toolkit);
  

  // const input = `List the total sales per country. Which country's customers spent the most?`;
  // const input = `列出每个国家总销量。哪个国家消费者花费最多？`;
  const input = `接下来所有的问题都用中文来回复。我的第一个问题是：每张表都是什么含义？`;

  console.log(`Executing with input "${input}"...`);

  const result = await executor.call({ input });

  console.log(`Got output ${result.output}`);
  let stepNo = 0;
  result.intermediateSteps.forEach((step) => {
    stepNo += 1;
    console.log(`Got intermediate step[${stepNo}] ${JSON.stringify(step, null, 2)}`);
  });

  await datasource.destroy();
};
