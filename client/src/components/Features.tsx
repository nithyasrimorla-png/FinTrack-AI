import FeatureCard from "./FeatureCard";

export default function Features() {
  return (
    <section
      id="features"
      className="py-20 px-6 bg-white"
    >
      <h2 className="text-4xl font-bold text-center mb-12">
        Features
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <FeatureCard
          title="AI Categorization"
          description="Automatically categorize your expenses using AI."
        />

        <FeatureCard
          title="Smart Analytics"
          description="Analyze your spending with interactive charts."
        />

        <FeatureCard
          title="CSV Upload"
          description="Upload your bank statements in seconds."
        />

        <FeatureCard
          title="Savings Goals"
          description="Track your financial goals with AI insights."
        />
      </div>
    </section>
  );
}