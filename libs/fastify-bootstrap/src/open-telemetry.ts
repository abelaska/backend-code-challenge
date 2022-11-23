import { BatchSpanProcessor, ConsoleSpanExporter, TraceIdRatioBasedSampler } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { PrismaInstrumentation } from '@prisma/instrumentation';
import { Resource } from '@opentelemetry/resources';

// Configure a tracer provider.
const provider = new NodeTracerProvider({
  sampler: new TraceIdRatioBasedSampler(1),
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.APP_NAME ?? 'unknown',
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.APP_VERSION ?? 'unknown',
  }),
});

// Add a span exporter.
provider.addSpanProcessor(new BatchSpanProcessor(new ConsoleSpanExporter()));

// Register your auto-instrumentors
registerInstrumentations({
  tracerProvider: provider,
  instrumentations: [new PrismaInstrumentation({ middleware: true })],
});

// Register a global tracer provider.
provider.register();
