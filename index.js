export default {
  async fetch(request, env) {
    if (env && env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("Static asset binding is not available.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  },
};
