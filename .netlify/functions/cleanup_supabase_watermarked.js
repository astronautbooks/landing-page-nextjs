const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = 'astronautbooks-pdfs';
const FOLDER = 'watermarked-pdfs/';
const DAYS_TO_KEEP = 7;

exports.handler = async (event, context) => {
  console.error('🚀 INICIANDO LIMPEZA DE ARQUIVOS SUPABASE');
  console.error('📅 Data/Hora:', new Date().toISOString());
  console.error('🔧 Verificando variáveis de ambiente...');
  
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ ERRO: SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY não definidas');
    return { statusCode: 500, body: 'Configuração ausente.' };
  }
  
  console.log('✅ Variáveis de ambiente OK');

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: files, error } = await supabase.storage.from(BUCKET).list(FOLDER);
  if (error) {
    console.error('Erro ao listar arquivos:', error.message);
    return { statusCode: 500, body: error.message };
  }

  if (files.length === 0) {
    console.log('Nenhum arquivo encontrado.');
    return { statusCode: 200, body: 'Nenhum arquivo encontrado.' };
  }

  const now = new Date();
  let deleted = 0;
  for (const file of files) {
    const name = `${FOLDER}${file.name}`;
    const created_at = new Date(file.created_at);
    const age_days = Math.floor((now - created_at) / (1000 * 60 * 60 * 24));
    if (age_days > DAYS_TO_KEEP) {
      const { error: delError } = await supabase.storage.from(BUCKET).remove([name]);
      if (delError) {
        console.error(`Erro ao deletar ${name}:`, delError.message);
      } else {
        console.log(`Deletado: ${name} (idade: ${age_days} dias)`);
        deleted++;
      }
    }
  }
  return { statusCode: 200, body: `Limpeza concluída. ${deleted} arquivos deletados.` };
};

exports.config = {
  schedule: "@daily" // todo dia às 3h da manhã (UTC)
};