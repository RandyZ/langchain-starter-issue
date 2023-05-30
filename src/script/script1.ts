import { ConsoleCallbackHandler } from 'langchain/callbacks';
import { SqlDatabaseChain } from 'langchain/chains';
import { OpenAI } from 'langchain/llms/openai';
import { SqlDatabase } from 'langchain/sql_db';
import { DataSource } from 'typeorm';

export const run = async (apiKey: string) => {
  const llm = new OpenAI({
    openAIApiKey: apiKey,
    temperature: 0,
    verbose: true,
    callbacks: [new ConsoleCallbackHandler()],
  });
  // const tt = await llm.generate([·
  //   await promotTemplate.format({
  //       top_k: 10,
  //       dialect: '',
  //       table_info: '',
  //       input: 'How many tracks are there?',
  //   }),
  // ]);

  // console.log('Start running', tt);

  const datasource = new DataSource({
    type: 'sqlite',
    database:
      '/Users/randy/workspace/project/opensource/github/langchain-ts-starter/src/Chinook.db',
  });

  // const datasource = new DataSource({
  //   type: 'mysql',
  //   database: 'ddi_data_server_v2',
  //   driver: mysql2,
  //   host: 'rm-8vb21p24ks969ze52.mysql.zhangbei.rds.aliyuncs.com',
  //   port: 3306,
  //   username: 'ddi_dba',
  //   password: 'LodfwDfew32d',
  // });

  // const promotTemplate = getPromptTemplateFromDataSource(datasource);

  const db = await SqlDatabase.fromDataSourceParams({
    appDataSource: datasource,
    // includesTables: ['t_dimension_data', 't_tenant'],
  });

  const chain = new SqlDatabaseChain({
    llm,
    database: db,
    outputKey: 'result',
    sqlOutputKey: 'sql',
  });

  const res = await chain.call({ query: '每个作者的专辑数量和总销量？' });
  console.log(res);
};
