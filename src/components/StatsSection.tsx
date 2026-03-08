const stats = [
  { value: "50K+", label: "Developers" },
  { value: "120", label: "Countries" },
  { value: "2.4K", label: "Projects shipped" },
  { value: "98%", label: "Would recommend" },
];

const StatsSection = () => {
  return (
    <section id="community" className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-1">
                {stat.value}
              </div>
              <div className="text-[13px] text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
