'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { Sprout, ArrowRight, Zap, Eye, Layers, Menu, X } from 'lucide-react';

const Landing = () => {
  const router = useRouter();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sprout className="w-8 h-8 text-emerald-500" />
              <span className="text-xl font-bold text-white">MegaTree</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-gray-300 hover:text-emerald-400 transition-colors">About</a>
              <a href="#features" className="text-gray-300 hover:text-emerald-400 transition-colors">Features</a>
              <button
                onClick={() => handleNavigate('/visualize')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full transition-all duration-300"
              >
                Get Started
              </button>
            </div>

            <button
              className="md:hidden text-gray-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 space-y-4">
              <a href="#about" className="block text-gray-300 hover:text-emerald-400">About</a>
              <a href="#features" className="block text-gray-300 hover:text-emerald-400">Features</a>
              <button
                onClick={() => handleNavigate('/visualize')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="z-10">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Learn decision trees by
                <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent"> growing them</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 mb-8 leading-relaxed">
                Interactive, visual, and hands-on. Watch trees sprout, branch, and decide—across real-life scenarios from weather to healthcare.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => handleNavigate('/visualize')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 flex items-center gap-2"
                >
                  Start Learning <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Animation */}
            <div className="relative">
              <TreeGrowthAnimation />
            </div>
          </div>
        </div>

        {/* Background Decorations */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-emerald-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-cyan-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
      </section>

      {/* What is Decision Tree Section */}
      <section id="about" className="py-20 px-6 bg-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              What is a Decision Tree?
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              A decision tree is like a flowchart that asks questions to make smart decisions. Each question splits your data, helping you predict outcomes or classify things.
            </p>
          </div>

          {/* Visual Flowchart Example */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 mb-12 max-w-2xl mx-auto">
            <div className="flex flex-col items-center">
              <div className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold mb-6">
                Will I enjoy outdoor activity?
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-sm text-gray-400 font-medium">Is it raining?</div>
              </div>
              <div className="grid grid-cols-2 gap-8 w-full max-w-md">
                <div className="flex flex-col items-center">
                  <div className="text-xs text-emerald-400 font-bold mb-2">YES ☂️</div>
                  <div className="bg-gray-900 border-2 border-cyan-500 text-cyan-400 px-4 py-3 rounded-lg text-center font-medium text-sm">
                    Stay Inside<br />Read a Book
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xs text-emerald-400 font-bold mb-2">NO ☀️</div>
                  <div className="bg-gray-900 border-2 border-amber-500 text-amber-400 px-4 py-3 rounded-lg text-center font-medium text-sm">
                    Go Outside<br />Play Sports
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Why Use Decision Trees */}
          <div className="mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-center text-white mb-8">
              Why Use Decision Trees?
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <WhyCard
                icon="🔍"
                title="Easy to Understand"
                description="You can trace exactly why a decision was made. No black box mystery!"
              />
              <WhyCard
                icon="⚡"
                title="Fast & Efficient"
                description="Quick predictions, works with both numbers and categories."
              />
              <WhyCard
                icon="🌳"
                title="Building Block"
                description="Foundation for powerful methods like Random Forests and Gradient Boosting."
              />
            </div>
          </div>

          {/* Key Terms Section */}
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-center text-white mb-8">
              Key Terms to Know
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <TermCard
                emoji="🟢"
                term="Node"
                definition="A decision point that asks a question about your data."
                color="from-emerald-900/50 to-emerald-800/50"
              />
              <TermCard
                emoji="🍃"
                term="Leaf"
                definition="The final answer—no more questions, just a prediction!"
                color="from-cyan-900/50 to-cyan-800/50"
              />
              <TermCard
                emoji="✂️"
                term="Split"
                definition="Dividing data based on a feature's value (e.g., age > 30)."
                color="from-amber-900/50 to-amber-800/50"
              />
              <TermCard
                emoji="📊"
                term="Gini Impurity"
                definition="Measures how mixed the labels are. Lower = purer groups."
                color="from-purple-900/50 to-purple-800/50"
              />
              <TermCard
                emoji="📏"
                term="Depth"
                definition="How many levels of questions the tree has from top to bottom."
                color="from-teal-900/50 to-teal-800/50"
              />
              <TermCard
                emoji="🌿"
                term="Pruning"
                definition="Cutting back branches to prevent overfitting and simplify the tree."
                color="from-lime-900/50 to-lime-800/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-16">
            Learn by Doing
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Eye className="w-8 h-8 text-emerald-500" />}
              title="Show, Don't Tell"
              description="Watch trees grow node by node. See decisions unfold in real-time with animated branches and glowing paths."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-cyan-500" />}
              title="Hands-On Learning"
              description="Grow, prune, trace, and tweak. Play with real datasets from weather forecasting to medical triage."
            />
            <FeatureCard
              icon={<Layers className="w-8 h-8 text-amber-500" />}
              title="Real-Life Scenarios"
              description="Teacher prioritizing students, doctors triaging patients, farmers choosing crops—see decisions that matter."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to plant your first tree?
            </h2>
            <p className="text-lg text-gray-400 mb-8">
              No coding. No math walls. Just pure, visual learning.
            </p>
            <button
              onClick={() => handleNavigate('/visualize')}
              className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-emerald-500/50 transition-all duration-300"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-500">
          <p>© 2025 Decision Tree Learning Lab. Built for curious minds.</p>
        </div>
      </footer>
    </div>
  );
};

const TreeGrowthAnimation = () => {
  return (
    <div className="relative w-full h-96 flex items-end justify-center">
      {/* Trunk */}
      <div className="w-4 h-32 bg-gradient-to-t from-amber-900 to-amber-700 rounded-t-lg animate-[grow_1s_ease-out_0.5s_forwards] origin-bottom"
        style={{ animation: 'grow 1s ease-out 0.5s forwards', transformOrigin: 'bottom' }} />

      {/* Branches */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
        {/* Left Branch */}
        <line x1="200" y1="280" x2="120" y2="200" stroke="#10b981" strokeWidth="3"
          className="animate-[draw_0.8s_ease-out_1.5s_forwards]"
          strokeDasharray="113" strokeDashoffset="113"
          style={{ animation: 'draw 0.8s ease-out 1.5s forwards' }} />

        {/* Right Branch */}
        <line x1="200" y1="280" x2="280" y2="200" stroke="#10b981" strokeWidth="3"
          className="animate-[draw_0.8s_ease-out_1.5s_forwards]"
          strokeDasharray="113" strokeDashoffset="113"
          style={{ animation: 'draw 0.8s ease-out 1.5s forwards' }} />

        {/* Sub-branches */}
        <line x1="120" y1="200" x2="80" y2="140" stroke="#34d399" strokeWidth="2"
          strokeDasharray="72" strokeDashoffset="72"
          style={{ animation: 'draw 0.6s ease-out 2.3s forwards' }} />
        <line x1="120" y1="200" x2="160" y2="140" stroke="#34d399" strokeWidth="2"
          strokeDasharray="72" strokeDashoffset="72"
          style={{ animation: 'draw 0.6s ease-out 2.3s forwards' }} />
        <line x1="280" y1="200" x2="240" y2="140" stroke="#34d399" strokeWidth="2"
          strokeDasharray="72" strokeDashoffset="72"
          style={{ animation: 'draw 0.6s ease-out 2.3s forwards' }} />
        <line x1="280" y1="200" x2="320" y2="140" stroke="#34d399" strokeWidth="2"
          strokeDasharray="72" strokeDashoffset="72"
          style={{ animation: 'draw 0.6s ease-out 2.3s forwards' }} />
      </svg>

      {/* Leaves - positioned at branch endpoints */}
      {[
        { x: 80, y: 140 },
        { x: 160, y: 140 },
        { x: 240, y: 140 },
        { x: 320, y: 140 }
      ].map((pos, i) => (
        <div
          key={i}
          className="absolute w-8 h-8 bg-emerald-500 rounded-full opacity-0 animate-[fadeIn_0.4s_ease-out_forwards]"
          style={{
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            transform: 'translate(-50%, -50%)',
            animationDelay: `${2.9 + i * 0.1}s`
          }}
        />
      ))}

      {/* Sapling Icon */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-0 animate-[spin-in_0.6s_ease-out_3.5s_forwards]"
        style={{ animation: 'spin-in 0.6s ease-out 3.5s forwards' }}>
        <Sprout className="w-16 h-16 text-emerald-500" />
      </div>

      <style jsx>{`
        @keyframes grow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
        @keyframes spin-in {
          from { 
            opacity: 0;
            transform: translateX(-50%) scale(0) rotate(-180deg);
          }
          to { 
            opacity: 1;
            transform: translateX(-50%) scale(1) rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:bg-gray-800/70 hover:border-gray-600 hover:-translate-y-2 transition-all duration-300">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
};

const WhyCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/70 hover:scale-105 transition-all duration-300 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
      <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
};

const TermCard = ({ emoji, term, definition, color }: { emoji: string; term: string; definition: string; color: string }) => {
  return (
    <div className={`bg-gradient-to-br ${color} backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:scale-105 hover:rotate-2 transition-all duration-300`}>
      <div className="text-4xl mb-3">{emoji}</div>
      <h4 className="text-lg font-bold text-white mb-2">{term}</h4>
      <p className="text-sm text-gray-300 leading-relaxed">{definition}</p>
    </div>
  );
};

export default Landing;
