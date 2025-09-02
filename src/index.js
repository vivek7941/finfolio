export default {
  async fetch(request) {
    return new Response("FinFolio is live!", {
      headers: { "Content-Type": "text/plain" },
    });
  },
};
