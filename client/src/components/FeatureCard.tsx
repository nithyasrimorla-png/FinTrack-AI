type Props = {
  title: string;
  description: string;
};

export default function FeatureCard({ title, description }: Props) {
  return (
    <div className="p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition bg-white">
      <h3 className="text-xl font-semibold mb-3 text-gray-900">
        {title}
      </h3>

      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
}