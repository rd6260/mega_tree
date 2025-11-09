import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, ArrowRight, Zap, Eye, Layers } from 'lucide-react';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F5E9] via-[#FAFAFA] to-[#E3F2FD]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="z-10"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1B5E20] mb-6 leading-tight">
                Learn decision trees by
                <span className="bg-gradient-to-r from-[#2E7D32] to-[#1E88E5] bg-clip-text text-transparent"> growing them</span>
              </h1>
              <p className="text-lg sm:text-xl text-[#6B7280] mb-8 leading-relaxed">
                Interactive, visual, and hands-on. Watch trees sprout, branch, and decide—across real-life scenarios from weather to healthcare.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  data-testid="start-learning-btn"
                  onClick={() => navigate('/lab')}
                  className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                >
                  Start Learning <ArrowRight className="w-5 h-5" />
                </Button>
                <Button
                  data-testid="quick-demo-btn"
                  onClick={() => navigate('/lab?demo=weather')}
                  variant="outline"
                  className="border-2 border-[#2E7D32] text-[#2E7D32] hover:bg-[#E8F5E9] px-8 py-6 text-lg rounded-full transition-all duration-300"
                >
                  Quick Demo
                </Button>
              </div>
            </motion.div>

            {/* Right Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              <TreeGrowthAnimation />
            </motion.div>
          </div>
        </div>

        {/* Background Decorations */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-[#81C784] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-[#90CAF9] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      </section>

      {/* What is Decision Tree Section */}
      <section className="py-20 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-4">
              What is a Decision Tree?
            </h2>
            <p className="text-lg text-[#6B7280] max-w-3xl mx-auto">
              A decision tree is like a flowchart that asks questions to make smart decisions. Each question splits your data, helping you predict outcomes or classify things.
            </p>
          </motion.div>

          {/* Visual Flowchart Example */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] rounded-2xl p-8 mb-12 max-w-2xl mx-auto"
          >
            <div className="flex flex-col items-center">
              <div className="bg-[#2E7D32] text-white px-6 py-3 rounded-lg font-semibold mb-6">
                Will I enjoy outdoor activity?
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-sm text-[#6B7280] font-medium">Is it raining?</div>
              </div>
              <div className="grid grid-cols-2 gap-8 w-full max-w-md">
                <div className="flex flex-col items-center">
                  <div className="text-xs text-[#1B5E20] font-bold mb-2">YES ☂️</div>
                  <div className="bg-white border-2 border-[#1E88E5] text-[#1E88E5] px-4 py-3 rounded-lg text-center font-medium text-sm">
                    Stay Inside<br/>Read a Book
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-xs text-[#1B5E20] font-bold mb-2">NO ☀️</div>
                  <div className="bg-white border-2 border-[#F9A825] text-[#F9A825] px-4 py-3 rounded-lg text-center font-medium text-sm">
                    Go Outside<br/>Play Sports
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Why Use Decision Trees */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-center text-[#111827] mb-8">
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
          </motion.div>

          {/* Key Terms Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-center text-[#111827] mb-8">
              Key Terms to Know
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <TermCard
                emoji="🟢"
                term="Node"
                definition="A decision point that asks a question about your data."
                color="from-[#E8F5E9] to-[#C8E6C9]"
              />
              <TermCard
                emoji="🍃"
                term="Leaf"
                definition="The final answer—no more questions, just a prediction!"
                color="from-[#E3F2FD] to-[#BBDEFB]"
              />
              <TermCard
                emoji="✂️"
                term="Split"
                definition="Dividing data based on a feature's value (e.g., age > 30)."
                color="from-[#FFF3E0] to-[#FFE082]"
              />
              <TermCard
                emoji="📊"
                term="Gini Impurity"
                definition="Measures how mixed the labels are. Lower = purer groups."
                color="from-[#F3E5F5] to-[#E1BEE7]"
              />
              <TermCard
                emoji="📏"
                term="Depth"
                definition="How many levels of questions the tree has from top to bottom."
                color="from-[#E0F2F1] to-[#B2DFDB]"
              />
              <TermCard
                emoji="🌿"
                term="Pruning"
                definition="Cutting back branches to prevent overfitting and simplify the tree."
                color="from-[#FFF9C4] to-[#FFF59D]"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-center text-[#111827] mb-16"
          >
            Learn by Doing
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Eye className="w-8 h-8 text-[#2E7D32]" />}
              title="Show, Don't Tell"
              description="Watch trees grow node by node. See decisions unfold in real-time with animated branches and glowing paths."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-[#1E88E5]" />}
              title="Hands-On Learning"
              description="Grow, prune, trace, and tweak. Play with real datasets from weather forecasting to medical triage."
            />
            <FeatureCard
              icon={<Layers className="w-8 h-8 text-[#F9A825]" />}
              title="Real-Life Scenarios"
              description="Teacher prioritizing students, doctors triaging patients, farmers choosing crops—see decisions that matter."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mb-6">
              Ready to plant your first tree?
            </h2>
            <p className="text-lg text-[#6B7280] mb-8">
              No coding. No math walls. Just pure, visual learning.
            </p>
            <Button
              data-testid="get-started-cta-btn"
              onClick={() => navigate('/lab')}
              className="bg-gradient-to-r from-[#2E7D32] to-[#1E88E5] hover:from-[#1B5E20] hover:to-[#1565C0] text-white px-10 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started Now
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-white/30 border-t border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto text-center text-sm text-[#6B7280]">
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
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: 120 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="w-4 bg-gradient-to-t from-[#6D4C41] to-[#8D6E63] rounded-t-lg"
      />
      
      {/* Branches */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 400 400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        {/* Left Branch */}
        <motion.line
          x1="200" y1="280" x2="120" y2="200"
          stroke="#2E7D32"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        />
        {/* Right Branch */}
        <motion.line
          x1="200" y1="280" x2="280" y2="200"
          stroke="#2E7D32"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        />
        {/* Sub-branches */}
        <motion.line
          x1="120" y1="200" x2="80" y2="140"
          stroke="#81C784"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 2.3 }}
        />
        <motion.line
          x1="120" y1="200" x2="160" y2="140"
          stroke="#81C784"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 2.3 }}
        />
        <motion.line
          x1="280" y1="200" x2="240" y2="140"
          stroke="#81C784"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 2.3 }}
        />
        <motion.line
          x1="280" y1="200" x2="320" y2="140"
          stroke="#81C784"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 2.3 }}
        />
      </motion.svg>
      
      {/* Leaves */}
      {[80, 160, 240, 320].map((x, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 2.9 + i * 0.1 }}
          className="absolute w-8 h-8 bg-[#4CAF50] rounded-full"
          style={{ left: x, top: 130 }}
        />
      ))}
      
      {/* Sapling Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, delay: 3.5 }}
        className="absolute top-8 left-1/2 -translate-x-1/2"
      >
        <Sprout className="w-16 h-16 text-[#2E7D32]" />
      </motion.div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-[#E5E7EB]"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-[#111827] mb-3">{title}</h3>
      <p className="text-[#6B7280] leading-relaxed">{description}</p>
    </motion.div>
  );
};

const WhyCard = ({ icon, title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05 }}
      className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-[#E5E7EB] text-center"
    >
      <div className="text-4xl mb-3">{icon}</div>
      <h4 className="text-lg font-semibold text-[#111827] mb-2">{title}</h4>
      <p className="text-sm text-[#6B7280] leading-relaxed">{description}</p>
    </motion.div>
  );
};

const TermCard = ({ emoji, term, definition, color }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, rotate: 2 }}
      className={`bg-gradient-to-br ${color} rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border-2 border-white`}
    >
      <div className="text-4xl mb-3">{emoji}</div>
      <h4 className="text-lg font-bold text-[#111827] mb-2">{term}</h4>
      <p className="text-sm text-[#6B7280] leading-relaxed">{definition}</p>
    </motion.div>
  );
};

export default Landing;
