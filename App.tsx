import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, Text, Trail, PerspectiveCamera, MeshTransmissionMaterial, Image, OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import { 
  Cpu, 
  Code2, 
  BrainCircuit, 
  Send, 
  Sparkles, 
  ArrowRight, 
  Github, 
  Linkedin, 
  Mail,
  Box,
  Layers,
  Terminal,
  Globe,
  Zap
} from 'lucide-react';
import { Project, ChatMessage } from './types';

// --- Constants & Data ---

const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Neural Vision Core',
    category: 'Computer Vision',
    description: 'Real-time object detection system optimized for edge devices using pruned ResNet architectures.',
    techStack: ['Python', 'PyTorch', 'OpenCV'],
    imageGradient: 'from-purple-600 to-blue-600'
  },
  {
    id: '2',
    title: 'Predictive Market Bot',
    category: 'FinTech AI',
    description: 'LSTM-based time series forecasting model for cryptocurrency trends with sentiment analysis integration.',
    techStack: ['TensorFlow', 'FastAPI', 'React'],
    imageGradient: 'from-emerald-500 to-teal-700'
  },
  {
    id: '3',
    title: 'Generative Art Engine',
    category: 'Creative AI',
    description: 'StyleGAN implementation allowing users to generate synthetic landscapes via text prompts.',
    techStack: ['GANs', 'Flask', 'Three.js'],
    imageGradient: 'from-pink-500 to-rose-600'
  },
  {
    id: '4',
    title: 'Smart Health Ledger',
    category: 'Blockchain + AI',
    description: 'Decentralized patient data management with federated learning modules for privacy-preserving diagnostics.',
    techStack: ['Solidity', 'Federated Learning', 'Web3.js'],
    imageGradient: 'from-orange-500 to-amber-600'
  }
];

// --- Utility Components ---

const ScrambleText = ({ text, className = "" }: { text: string, className?: string }) => {
  const [display, setDisplay] = useState(text);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  
  const scramble = () => {
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplay(text.split("").map((letter, index) => {
        if (index < iterations) return text[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(""));
      
      if (iterations >= text.length) clearInterval(interval);
      iterations += 1 / 2;
    }, 30);
  };

  return (
    <span 
      className={`inline-block cursor-default ${className}`} 
      onMouseEnter={scramble}
    >
      {display}
    </span>
  );
};

// --- 3D Components (R3F) ---

const FloatingGrid = () => {
  return (
    <group rotation={[Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
      <gridHelper args={[60, 60, 0x4c1d95, 0x111111]} />
    </group>
  );
};

// A futuristic, stylized laptop/terminal floating in space
const CyberDeck = ({ imageUrl }: { imageUrl?: string }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.02;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.2, -0.4, 0]}>
      {/* Base */}
      <mesh position={[0, -0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.2, 0.2, 2.2]} />
        <meshStandardMaterial color="#111" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Glow Strip on Base */}
      <mesh position={[0, -0.1, 1.11]}>
         <boxGeometry args={[3.2, 0.05, 0.05]} />
         <meshBasicMaterial color="#22d3ee" />
      </mesh>
      
      {/* Screen Hinge */}
      <mesh position={[0, 0.05, -1.0]}>
        <cylinderGeometry args={[0.08, 0.08, 3.2, 32]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#222" metalness={0.9} />
      </mesh>

      {/* Screen Frame Group */}
      <group position={[0, 0.9, -1.05]} rotation={[-0.25, 0, 0]}>
         {/* Back of Screen */}
         <mesh>
            <boxGeometry args={[3.2, 2.2, 0.1]} />
            <meshStandardMaterial color="#080808" metalness={0.9} roughness={0.1} />
         </mesh>
         
         {/* Screen Bezel Front */}
         <mesh position={[0, 0, 0.06]}>
            <planeGeometry args={[3.0, 2.0]} />
            <meshBasicMaterial color="#000" />
         </mesh>

         {/* Screen Image / Content */}
         <group position={[0, 0, 0.07]}>
            {imageUrl ? (
              <Image 
                url={imageUrl} 
                scale={[2.8, 1.8]} 
                transparent 
                opacity={0.9}
                toneMapped={false}
              />
            ) : (
              <mesh>
                <planeGeometry args={[2.8, 1.8]} />
                <meshBasicMaterial color="#1a1a1a" />
              </mesh>
            )}
            
            {/* Scanline Overlay */}
            <mesh position={[0, 0, 0.01]}>
               <planeGeometry args={[2.8, 1.8]} />
               <meshBasicMaterial color="#000" opacity={0.2} transparent side={THREE.DoubleSide} />
            </mesh>
         </group>
         
         {/* Holographic Projection Text floating in front of screen */}
         <group position={[0, 0, 0.4]}>
            <Text 
                position={[-0.8, -0.6, 0]} 
                fontSize={0.1} 
                color="#22d3ee" 
                font="https://fonts.gstatic.com/s/jetbrainsmono/v13/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0Pn5qRS8.woff"
                anchorX="left" 
            >
              {`> IDENTITY_VERIFIED`}
            </Text>
         </group>
      </group>

      {/* Floating Elements around Deck */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text 
            position={[-2, 1, 0.5]} 
            fontSize={0.15} 
            color="#bef264" 
            font="https://fonts.gstatic.com/s/jetbrainsmono/v13/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0Pn5qRS8.woff"
        >
          {`{ dev }`}
        </Text>
        <Text 
            position={[2, 0.5, 0]} 
            fontSize={0.15} 
            color="#a78bfa" 
            font="https://fonts.gstatic.com/s/jetbrainsmono/v13/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0Pn5qRS8.woff"
        >
          {`git commit`}
        </Text>
      </Float>
    </group>
  );
};

const NeuralSphere = ({ count = 150 }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = new THREE.Object3D();
  
  // Create points on a sphere
  const particles = useMemo(() => {
    const temp = [];
    const phiSpan = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phiSpan * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      temp.push({ 
        pos: new THREE.Vector3(x * 4.5, y * 4.5, z * 4.5), 
        originalPos: new THREE.Vector3(x * 4.5, y * 4.5, z * 4.5),
        speed: Math.random() * 0.2 
      });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    particles.forEach((p, i) => {
      // Pulse effect
      const scale = 1 + Math.sin(time * 2 + i) * 0.1;
      
      dummy.position.copy(p.pos);
      // Slight orbit
      dummy.rotation.y = time * 0.1;
      dummy.scale.setScalar(0.04 * scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.rotation.y = time * 0.05;
    meshRef.current.rotation.z = Math.sin(time * 0.1) * 0.1;
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial 
        color="#22d3ee" 
        emissive="#22d3ee"
        emissiveIntensity={1.5}
        toneMapped={false}
      />
    </instancedMesh>
  );
};

const BackgroundScene = () => {
  return (
    <div className="fixed inset-0 z-0 opacity-40">
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ antialias: true }}>
        <fog attach="fog" args={['#030303', 5, 30]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#a78bfa" />
        <pointLight position={[-10, 5, 10]} intensity={0.8} color="#22d3ee" />
        
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.2}>
          <NeuralSphere />
        </Float>
        
        <FloatingGrid />
        <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
};

// --- UI Components ---

interface BentoCardProps {
  children?: React.ReactNode;
  className?: string;
  delay?: number;
  noPadding?: boolean;
}

const BentoCard: React.FC<BentoCardProps> = ({ children, className = "", delay = 0, noPadding = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`relative overflow-hidden glass-panel rounded-[2rem] group hover:border-winter-cyan/40 transition-colors duration-500 ${className} ${noPadding ? '' : 'p-8'}`}
    >
      {/* Dynamic Gradient Background on Hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-winter-cyan/5 via-transparent to-winter-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      <div className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </motion.div>
  );
};

const SectionHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="mb-16">
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 mb-4"
    >
      <div className="h-px w-8 bg-winter-cyan" />
      <h2 className="text-xs font-mono text-winter-cyan uppercase tracking-[0.2em]">
        {subtitle}
      </h2>
    </motion.div>
    <motion.h3 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="text-5xl md:text-7xl font-sans font-medium text-white tracking-tight"
    >
      {title}
    </motion.h3>
  </div>
);

// --- Feature: Gemini AI Chat ---

const AIAssistant = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Initialize Protocol: 2026. Waiting for input...', timestamp: Date.now() }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = process.env.API_KEY; 
      if (!apiKey) throw new Error("API Key not found");

      const ai = new GoogleGenAI({ apiKey });
      
      const systemPrompt = `
        You are a high-end AI assistant for a 2nd-year B.Tech student's portfolio named "Winter Edition". 
        The student is interested in AI/ML, Computer Vision, and Solving Real World Problems.
        
        Knowledge Base:
        - Skills: Python, React, Three.js, PyTorch, TensorFlow, Solidity.
        - Projects: Neural Vision Core (CV), Predictive Market Bot (Finance), Generative Art Engine, Smart Health Ledger.
        - Interests: Building scalable solutions, futurism, generative AI, edge computing.
        
        Persona: Futuristic, precise, slightly cryptic but helpful. Use technical jargon appropriately.
        Response Style: Short, punchy, markdown enabled.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: systemPrompt + "\n\nUser Input: " + userMsg.text }] }
        ]
      });

      const text = response.text;
      setMessages(prev => [...prev, { role: 'model', text: text || "Data stream empty.", timestamp: Date.now() }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Connection severed. Check API uplinks.", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BentoCard className="h-[600px] flex flex-col col-span-1 lg:col-span-2 border-winter-cyan/20" noPadding>
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-winter-cyan animate-pulse" />
          <h3 className="font-mono text-sm text-gray-300 tracking-wider">GEMINI_2.5_FLASH // LIVE</h3>
        </div>
        <div className="flex gap-2">
           <div className="w-3 h-3 rounded-full border border-white/20" />
           <div className="w-3 h-3 rounded-full border border-white/20" />
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-black/20" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <span className="text-[10px] font-mono text-gray-600 mb-1 uppercase">
              {msg.role === 'user' ? 'You' : 'System'}
            </span>
            <div className={`max-w-[85%] p-4 text-sm leading-relaxed font-mono ${
              msg.role === 'user' 
                ? 'bg-winter-glow/30 text-white border border-winter-glow/50 rounded-2xl rounded-tr-sm' 
                : 'bg-white/5 text-gray-300 border border-white/10 rounded-2xl rounded-tl-sm shadow-lg'
            }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex flex-col items-start">
             <span className="text-[10px] font-mono text-gray-600 mb-1">SYSTEM</span>
             <div className="bg-white/5 p-3 rounded-2xl rounded-tl-sm border border-white/10 flex gap-1 items-center h-10">
               <div className="w-1 h-4 bg-winter-cyan/50 animate-[pulse_1s_ease-in-out_infinite]" />
               <div className="w-1 h-6 bg-winter-cyan/50 animate-[pulse_1s_ease-in-out_0.2s_infinite]" />
               <div className="w-1 h-3 bg-winter-cyan/50 animate-[pulse_1s_ease-in-out_0.4s_infinite]" />
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white/5 border-t border-white/10">
        <div className="relative group">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Initialize query..."
            className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-5 text-white placeholder-gray-600 focus:outline-none focus:border-winter-cyan/50 transition-all font-mono text-sm pr-12 group-hover:bg-black/60"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="absolute right-2 top-2 p-2 rounded-lg text-winter-cyan opacity-50 hover:opacity-100 hover:bg-winter-cyan/10 transition-all disabled:opacity-20"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </BentoCard>
  );
};

// --- Main Layout Sections ---

const Hero = () => {
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="container mx-auto px-6 z-10 relative">
        <motion.div 
          style={{ y: yText, opacity }}
          className="max-w-6xl mx-auto flex flex-col-reverse md:flex-row items-center gap-4 md:gap-16"
        >
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left z-20">
            {/* Status Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-gray-300 font-mono text-xs mb-8 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-winter-lime opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-winter-lime"></span>
              </span>
              <ScrambleText text="SYSTEM STATUS: ONLINE" />
            </motion.div>

            <h1 className="text-5xl md:text-8xl font-sans font-bold tracking-tighter text-white mb-8 leading-[0.9]">
              <motion.span 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="block"
              >
                BUILDING
              </motion.span>
              <motion.span 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="block text-transparent bg-clip-text bg-gradient-to-r from-winter-cyan via-winter-accent to-winter-lime"
              >
                INTELLIGENCE
              </motion.span>
            </h1>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-lg text-gray-400 max-w-lg font-light leading-relaxed mb-8 mx-auto md:mx-0"
            >
              2nd Year B.Tech Student. Crafting neural architectures and scalable systems for the next generation of the web.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="flex gap-4 justify-center md:justify-start"
            >
              <button 
                onClick={() => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-winter-cyan hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                Exploration <ArrowRight size={18} className="group-hover:-rotate-45 transition-transform" />
              </button>
            </motion.div>
          </div>

          {/* 3D CyberDeck Model */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="w-full h-[400px] md:w-[600px] md:h-[500px] flex-shrink-0 cursor-grab active:cursor-grabbing"
          >
             <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} gl={{ antialias: true }}>
                <ambientLight intensity={1.5} />
                <pointLight position={[10, 10, 10]} intensity={2} color="#a78bfa" />
                <pointLight position={[-5, -5, 5]} intensity={1} color="#22d3ee" />
                
                <Float rotationIntensity={0.2} floatIntensity={0.5} speed={2}>
                  <CyberDeck imageUrl="https://api.dicebear.com/9.x/avataaars/svg?seed=Felix" />
                </Float>
                
                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                <Environment preset="city" />
             </Canvas>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const SkillsSection = () => {
  return (
    <section id="skills" className="py-32 container mx-auto px-6 relative z-10">
      <SectionHeader title="Technical Core" subtitle="01 // Capabilities" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: BrainCircuit, title: "Machine Learning", desc: "Predictive models, Neural Networks, PyTorch", color: "text-winter-cyan" },
          { icon: Code2, title: "Full Stack", desc: "React, Node.js, High-performance Web", color: "text-winter-accent" },
          { icon: Globe, title: "Web3", desc: "Solidity, Smart Contracts, DApps", color: "text-winter-lime" }
        ].map((skill, i) => (
          <BentoCard key={i} delay={i * 0.1} className="min-h-[250px]">
            <div className="flex flex-col h-full justify-between">
              <div>
                <skill.icon className={`${skill.color} mb-6`} size={32} />
                <h4 className="text-2xl font-bold text-white mb-2">{skill.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{skill.desc}</p>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full mt-6 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '85%' }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                  className={`h-full bg-current ${skill.color}`} 
                />
              </div>
            </div>
          </BentoCard>
        ))}
      </div>
    </section>
  );
};

const ProjectShowcase = () => {
  return (
    <section id="projects" className="py-32 container mx-auto px-6 relative z-10">
      <SectionHeader title="Selected Works" subtitle="02 // Portfolio" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {PROJECTS.map((project, idx) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className="group relative h-[450px] rounded-[2.5rem] overflow-hidden cursor-pointer border border-white/5 bg-winter-800"
          >
            {/* Dynamic Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${project.imageGradient} opacity-10 group-hover:opacity-20 transition-all duration-700 scale-100 group-hover:scale-110`} />
            
            {/* Content Container */}
            <div className="absolute inset-0 p-10 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono border border-white/20 px-3 py-1 rounded-full text-white/70 backdrop-blur-md">
                  {project.category}
                </span>
                <div className="bg-white text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  <ArrowRight size={20} />
                </div>
              </div>

              <div>
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  <ScrambleText text={project.title} />
                </h3>
                <p className="text-gray-400 text-sm max-w-sm mb-6 line-clamp-3">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map(tech => (
                    <span key={tech} className="text-[10px] font-bold bg-white/5 border border-white/10 px-3 py-1 rounded-md text-gray-300">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const AISandbox = () => {
  return (
    <section id="ai-sandbox" className="py-32 container mx-auto px-6 relative z-10">
      <SectionHeader title="Neural Link" subtitle="03 // Interactive AI" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Card */}
        <BentoCard className="lg:col-span-1 flex flex-col justify-between bg-winter-900/80">
          <div>
            <div className="w-12 h-12 bg-winter-accent/10 rounded-2xl flex items-center justify-center mb-6 text-winter-accent border border-winter-accent/20">
              <Zap size={24} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Gemini 2.5 Integration</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Experience a real-time conversation with my portfolio context. Powered by Google's latest Gemini 2.5 Flash model.
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-mono text-gray-500 border-b border-white/10 pb-2">
              <span>LATENCY</span>
              <span className="text-green-400">12ms</span>
            </div>
             <div className="flex justify-between text-xs font-mono text-gray-500 border-b border-white/10 pb-2">
              <span>CONTEXT</span>
              <span className="text-winter-cyan">1M Tokens</span>
            </div>
            <div className="flex justify-between text-xs font-mono text-gray-500">
              <span>STATUS</span>
              <span className="text-winter-lime animate-pulse">ACTIVE</span>
            </div>
          </div>
        </BentoCard>

        {/* Chat Interface */}
        <AIAssistant />
      </div>
    </section>
  );
};

const Footer = () => (
  <footer id="contact" className="py-20 border-t border-white/5 bg-black relative z-10">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
        <div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tighter">Let's Create<br />The Future</h2>
          <a href="mailto:hello@example.com" className="text-xl text-gray-400 hover:text-winter-cyan transition-colors border-b border-gray-800 hover:border-winter-cyan pb-1 inline-block">
            hello@portfolio.dev
          </a>
        </div>
        
        <div className="flex gap-4">
          {[Github, Linkedin, Mail].map((Icon, i) => (
            <a key={i} href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all duration-300">
              <Icon size={20} />
            </a>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between text-xs text-gray-600 font-mono border-t border-white/5 pt-8">
        <p>© 2026 WINTER EDITION PORTFOLIO.</p>
        <p>DESIGNED & ENGINEERED WITH REACT + THREE.JS</p>
      </div>
    </div>
  </footer>
);

// --- App Root ---

export default function App() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-winter-900 text-white min-h-screen selection:bg-winter-cyan selection:text-black font-sans">
      <div className="bg-noise" />
      <BackgroundScene />
      
      <main className="relative z-10">
        <Hero />
        <SkillsSection />
        <ProjectShowcase />
        <AISandbox />
      </main>

      <Footer />
      
      {/* Floating Navigation */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="flex items-center gap-1 p-1.5 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-black/50">
          <button 
            onClick={() => scrollTo('projects')} 
            className="p-3 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
            aria-label="Projects"
          >
            <Box size={20} />
          </button>
          <button 
            onClick={() => scrollTo('ai-sandbox')} 
            className="p-3 rounded-full hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
            aria-label="AI Terminal"
          >
            <Terminal size={20} />
          </button>
          <div className="w-px h-6 bg-white/10 mx-2"></div>
          <button 
            onClick={() => scrollTo('contact')} 
            className="px-5 py-2 bg-white text-black font-bold rounded-full text-xs hover:bg-winter-cyan transition-colors"
          >
            GET IN TOUCH
          </button>
        </div>
      </motion.div>
    </div>
  );
}