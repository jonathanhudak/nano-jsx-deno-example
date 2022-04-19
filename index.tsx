/// <reference types="https://deno.land/x/nano_jsx@v0.0.30/core.types.ts" />
import { h, renderSSR, Helmet } from "nano_jsx";
import { Application, Router } from "oak";
import { buildStyleTagForSSR } from "./twind-style.ts";

const App = () => (
  <div>
    <Helmet>
      <title>Nano JSX SSR</title>
      <meta
        name="description"
        content="Server Side Rendered Nano JSX Application"
      />
    </Helmet>
    <main class="min-h-full p-8 dark:bg-gray-800 dark:text-white">
      <figure>
        <div class="pt-6 space-y-4">
          <blockquote>
            <p class="text-lg">
              “Tailwind CSS is the only framework that I've seen scale on large
              teams. It’s easy to customize, adapts to any design, and the build
              size is tiny.”
            </p>
          </blockquote>
          <figcaption>
            <div>Sarah Dayan</div>
            <div>Staff Engineer, Algolia</div>
          </figcaption>
        </div>
      </figure>
    </main>
  </div>
);

const ssr = renderSSR(<App />);
const styleTag = buildStyleTagForSSR(ssr);
const { body, head, footer } = Helmet.SSR(ssr);

const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${head.join("\n")}
    ${styleTag}
  </head>
  <body>
    ${body}
    ${footer.join("\n")}
  </body>
</html>`;

const router = new Router();
router.get("/", (context) => {
  context.response.body = html;
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", ({ port }) => {
  console.log(`Listening on: http://localhost:${port}`);
});

await app.listen({ port: 5000 });
