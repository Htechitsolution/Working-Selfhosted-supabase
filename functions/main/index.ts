import { serve } from "https://deno.land/std@0.131.0/http/server.ts"

console.log('main function started');

serve(async (req: Request) => {
  const url = new URL(req.url);
  const { pathname } = url;

  console.log(`Request received: ${req.method} ${pathname}`);

  // Get the function name from the path
  let functionName = pathname.split('/')[1];
  
  if (functionName === 'v1' || functionName === 'functions') {
    functionName = pathname.split('/')[2];
  }
  
  if (functionName === 'v1' && pathname.split('/')[1] === 'functions') {
      functionName = pathname.split('/')[3];
  }

  if (!functionName || functionName === 'main') {
    return new Response('Function name not provided or invalid', { status: 400 });
  }

  console.log(`serving the request with /home/deno/functions/${functionName}`);

  try {
    const userWorkerApi = (globalThis as any).EdgeRuntime?.userWorkers;
    
    if (!userWorkerApi) {
        throw new Error('EdgeRuntime userWorkers API not found');
    }

    const worker = await userWorkerApi.create({
      servicePath: `/home/deno/functions/${functionName}`,
      memoryLimitMb: 150,
      workerTimeoutMs: 60 * 1000,
      noModuleCache: false,
      importMapPath: null,
      envVars: Object.entries(Deno.env.toObject())
    });

    return await worker.fetch(req);
  } catch (e: any) {
    console.error(`worker boot error: ${e.message}`);
    return new Response(JSON.stringify({ error: e.message }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
  }
}, { port: 9000 })
