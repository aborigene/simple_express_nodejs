const opentelemetry = require('@opentelemetry/api');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { BasicTracerProvider, ConsoleSpanExporter, SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');

const provider = new BasicTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'kafka-producer',
  }),
});

// Configure span processor to send spans to the exporter
const exporter = new JaegerExporter({
  endpoint: 'http://localhost:14268/api/traces',
});
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

provider.register();
const tracer = opentelemetry.trace.getTracer('node-rdkafka-producer');
/*const tracer = opentelemetry.trace.getTracer('node-rdkafka-producer');
const trace = opentelemetry.trace;
const propagation = opentelemetry.propagation;*/


const express = require("express");
const PORT = process.env.PORT || "8082";
const app = express();

app.get("/", (req, res) => {
  let message = req.query.message;
  if (message == "") message = "Default message..."
  res.status(200).send(doSomething());
});

function doSomething(){
      const span = tracer.startSpan("Doing something", { kind: opentelemetry.SpanKind.SERVER});
      let wait_time = Math.random()*10000;
      let message = "Waited "+wait_time+"s and did something...";
      setTimeout(function(){ console.log(); }, wait_time);          
	    span.end();
      return message;
}

app.listen(parseInt(PORT, 10), () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});