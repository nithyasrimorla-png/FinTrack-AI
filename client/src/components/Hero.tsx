export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center text-center px-6 py-24">
      <div className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm mb-6">
        AI-Powered Finance Assistant
      </div>

      <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
        Manage Your Money with <br />
        <span className="text-blue-600">Intelligent AI</span>
      </h1>

      <p className="text-gray-600 text-lg max-w-2xl mb-10">
        Upload bank statements, track expenses, analyze spending patterns, and get
        AI-powered insights to improve your financial health.
      </p>

      <div className="flex gap-4">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
          Get Started
        </button>

        <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition">
          Learn More
        </button>
      </div>
    </section>
  );
}