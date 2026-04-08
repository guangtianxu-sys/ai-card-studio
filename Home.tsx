/**
 * AI Card Studio - 南沙AI沙龙知识卡片工坊
 * Design: Conversational Cosmos - Neo-Brutalism meets Chat UI
 * Colors: Deep navy bg, electric blue / mint green / coral orange accents
 * Typography: Space Grotesk (display) + Noto Sans SC (body) + JetBrains Mono (code)
 */

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toPng } from "html-to-image";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Lightbulb,
  FileText,
  Download,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Zap,
  Copy,
  RotateCcw,
} from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
import DialogueCard from "@/components/DialogueCard";
import InsightCard from "@/components/InsightCard";
import SummaryCard from "@/components/SummaryCard";
import {
  extractKnowledgePoints,
  generateDialogue,
} from "@/lib/ai-extract";
import { SAMPLE_PROMPTS, CARD_STYLES, type KnowledgePoint } from "@/lib/types";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663482149886/nSr4ZpuJdMaxdbXomhXzrs/hero-bg-HbbU8NAvHLMwhfcrnVSHEG.webp";
const CAMPFIRE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663482149886/nSr4ZpuJdMaxdbXomhXzrs/campfire-scene-MG5dpgWpfrP8HfiApEgpj2.webp";

type CardMode = "dialogue" | "insight" | "summary";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [knowledgePoints, setKnowledgePoints] = useState<KnowledgePoint[]>([]);
  const [cardMode, setCardMode] = useState<CardMode>("dialogue");
  const [hasGenerated, setHasGenerated] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleExtract = useCallback(async () => {
    if (!inputText.trim()) {
      toast.error("请先粘贴或输入内容");
      return;
    }

    setIsProcessing(true);

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const points = extractKnowledgePoints(inputText);
    if (points.length === 0) {
      toast.error("未能提取到有效的知识点，请尝试输入更详细的内容");
      setIsProcessing(false);
      return;
    }

    setKnowledgePoints(points);
    setHasGenerated(true);
    setIsProcessing(false);
    toast.success(`成功提取 ${points.length} 条知识要点`);

    // Scroll to results
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  }, [inputText]);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;

    try {
      toast.info("正在生成图片...");
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#0F1729",
      });

      const link = document.createElement("a");
      link.download = `ai-card-${cardMode}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("卡片已下载");
    } catch (err) {
      toast.error("下载失败，请重试");
      console.error(err);
    }
  }, [cardMode]);

  const handleCopyText = useCallback(() => {
    const text = knowledgePoints
      .map((p, i) => `${i + 1}. ${p.title}\n${p.content}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    toast.success("知识要点已复制到剪贴板");
  }, [knowledgePoints]);

  const handleReset = useCallback(() => {
    setInputText("");
    setKnowledgePoints([]);
    setHasGenerated(false);
  }, []);

  const handleSampleClick = useCallback((text: string) => {
    setInputText(text);
    setHasGenerated(false);
    setKnowledgePoints([]);
  }, []);

  const dialogueMessages = generateDialogue(knowledgePoints);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <ParticleBackground />

      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Hero background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${HERO_BG})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.35,
          }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, oklch(0.14 0.02 260 / 0.3) 0%, oklch(0.14 0.02 260 / 0.95) 100%)",
          }}
        />

        <div className="relative z-10 container text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full"
              style={{
                background: "oklch(0.78 0.15 220 / 0.1)",
                border: "1.5px solid oklch(0.78 0.15 220 / 0.3)",
              }}
            >
              <Zap className="w-4 h-4" style={{ color: "oklch(0.78 0.15 220)" }} />
              <span className="text-sm font-medium" style={{ color: "oklch(0.78 0.15 220)" }}>
                南沙区 AI 线下沙龙
              </span>
            </div>

            {/* Title */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <span style={{ color: "oklch(0.95 0.01 260)" }}>AI Card </span>
              <span
                style={{
                  background: "linear-gradient(135deg, oklch(0.78 0.15 220), oklch(0.85 0.18 160))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Studio
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-lg sm:text-xl max-w-2xl mx-auto mb-4 leading-relaxed"
              style={{ color: "oklch(0.72 0.02 260)" }}
            >
              将飞书文档、录音转写、大神分享的长文本
            </p>
            <p
              className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
              style={{ color: "oklch(0.72 0.02 260)" }}
            >
              一键提炼为精美的
              <span className="font-semibold" style={{ color: "oklch(0.78 0.15 220)" }}> 知识卡片</span>
              ，轻松引题与分享
            </p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                size="lg"
                className="text-base px-8 py-6 rounded-xl font-semibold"
                style={{
                  background: "linear-gradient(135deg, oklch(0.78 0.15 220), oklch(0.65 0.18 220))",
                  color: "oklch(0.98 0 0)",
                  border: "none",
                  boxShadow: "0 0 30px oklch(0.78 0.15 220 / 0.4)",
                }}
                onClick={() => {
                  document.getElementById("workspace")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                开始制作卡片
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronDown className="w-6 h-6" style={{ color: "oklch(0.50 0.02 260)" }} />
          </motion.div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section className="relative z-10 py-20">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2
                className="text-3xl sm:text-4xl font-bold mb-6"
                style={{ fontFamily: "var(--font-display)", color: "oklch(0.93 0.01 260)" }}
              >
                围坐篝火，
                <br />
                <span style={{ color: "oklch(0.85 0.18 160)" }}>聊聊AI那些事</span>
              </h2>
              <p className="text-base leading-relaxed mb-4" style={{ color: "oklch(0.70 0.02 260)" }}>
                每周一个主题，邀请南沙区对AI感兴趣的小伙伴，在露营风格的场地里，围绕Skills、LLM、Agent、学习方法等话题展开分享与讨论。
              </p>
              <p className="text-base leading-relaxed" style={{ color: "oklch(0.70 0.02 260)" }}>
                这个工具帮你将飞书上各路大神的思路、活动中的精彩分享，提炼成精美的知识卡片——用于活动前的引题预热，也用于活动后的知识沉淀与传播。
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl overflow-hidden"
              style={{
                border: "2.5px solid oklch(0.30 0.04 260)",
                boxShadow: "0 0 40px oklch(0.78 0.15 220 / 0.1)",
              }}
            >
              <img
                src={CAMPFIRE}
                alt="AI沙龙露营场景"
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="relative z-10 py-16">
        <div className="container max-w-5xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold text-center mb-12"
            style={{ fontFamily: "var(--font-display)", color: "oklch(0.93 0.01 260)" }}
          >
            三种卡片风格，满足不同场景
          </motion.h2>

          <div className="grid sm:grid-cols-3 gap-6">
            {CARD_STYLES.map((style, i) => {
              const icons = [MessageSquare, Lightbulb, FileText];
              const Icon = icons[i];
              return (
                <motion.div
                  key={style.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="p-6 rounded-2xl"
                  style={{
                    background: "oklch(0.18 0.03 260)",
                    border: `2px solid ${style.accentColor}40`,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: `${style.accentColor}15`,
                      border: `1.5px solid ${style.accentColor}40`,
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: style.accentColor }} />
                  </div>
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ fontFamily: "var(--font-display)", color: style.accentColor }}
                  >
                    {style.name}
                  </h3>
                  <p className="text-sm" style={{ color: "oklch(0.65 0.02 260)" }}>
                    {style.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== WORKSPACE ===== */}
      <section id="workspace" className="relative z-10 py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2
              className="text-3xl sm:text-4xl font-bold mb-3"
              style={{ fontFamily: "var(--font-display)", color: "oklch(0.93 0.01 260)" }}
            >
              <Sparkles className="w-8 h-8 inline-block mr-2" style={{ color: "oklch(0.78 0.15 220)" }} />
              知识卡片工坊
            </h2>
            <p className="text-base" style={{ color: "oklch(0.60 0.02 260)" }}>
              粘贴内容，一键提炼，生成精美卡片
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Input area */}
            <div className="space-y-5">
              {/* Text input */}
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "oklch(0.18 0.03 260)",
                  border: "2px solid oklch(0.30 0.04 260)",
                }}
              >
                <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: "1px solid oklch(0.28 0.04 260)" }}>
                  <span className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)", color: "oklch(0.78 0.15 220)" }}>
                    输入内容
                  </span>
                  <span className="text-xs" style={{ color: "oklch(0.50 0.02 260)" }}>
                    {inputText.length} 字
                  </span>
                </div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="粘贴飞书文档内容、录音转写文字、或任何AI相关的分享内容..."
                  className="w-full h-52 px-5 py-4 text-sm leading-relaxed resize-none focus:outline-none"
                  style={{
                    background: "transparent",
                    color: "oklch(0.88 0.01 260)",
                    fontFamily: "var(--font-body)",
                  }}
                />
              </div>

              {/* Sample prompts */}
              <div>
                <p className="text-xs mb-3 font-medium" style={{ color: "oklch(0.55 0.02 260)" }}>
                  试试这些示例内容：
                </p>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_PROMPTS.map((sample) => (
                    <button
                      key={sample.title}
                      onClick={() => handleSampleClick(sample.text)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
                      style={{
                        background: "oklch(0.22 0.04 260)",
                        color: "oklch(0.75 0.02 260)",
                        border: "1.5px solid oklch(0.32 0.04 260)",
                      }}
                    >
                      {sample.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleExtract}
                  disabled={isProcessing || !inputText.trim()}
                  className="flex-1 py-5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: isProcessing
                      ? "oklch(0.30 0.04 260)"
                      : "linear-gradient(135deg, oklch(0.78 0.15 220), oklch(0.65 0.18 220))",
                    color: "oklch(0.98 0 0)",
                    border: "none",
                    boxShadow: isProcessing ? "none" : "0 0 20px oklch(0.78 0.15 220 / 0.3)",
                  }}
                >
                  {isProcessing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                      </motion.div>
                      AI 正在提炼...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      提炼知识要点
                    </>
                  )}
                </Button>
                {hasGenerated && (
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="py-5 rounded-xl"
                    style={{
                      background: "transparent",
                      color: "oklch(0.65 0.02 260)",
                      border: "1.5px solid oklch(0.35 0.04 260)",
                    }}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Card style selector */}
              {hasGenerated && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <p className="text-xs font-medium" style={{ color: "oklch(0.55 0.02 260)" }}>
                    选择卡片风格：
                  </p>
                  <div className="flex gap-2">
                    {(["dialogue", "insight", "summary"] as CardMode[]).map((mode) => {
                      const labels: Record<CardMode, { icon: typeof MessageSquare; label: string }> = {
                        dialogue: { icon: MessageSquare, label: "对话气泡" },
                        insight: { icon: Lightbulb, label: "洞察卡片" },
                        summary: { icon: FileText, label: "总结卡片" },
                      };
                      const { icon: Icon, label } = labels[mode];
                      const isActive = cardMode === mode;
                      return (
                        <button
                          key={mode}
                          onClick={() => setCardMode(mode)}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all"
                          style={{
                            background: isActive ? "oklch(0.78 0.15 220 / 0.15)" : "oklch(0.22 0.04 260)",
                            color: isActive ? "oklch(0.78 0.15 220)" : "oklch(0.60 0.02 260)",
                            border: isActive
                              ? "1.5px solid oklch(0.78 0.15 220 / 0.5)"
                              : "1.5px solid oklch(0.32 0.04 260)",
                          }}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Export buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={handleDownload}
                      size="sm"
                      className="rounded-lg text-xs"
                      style={{
                        background: "oklch(0.85 0.18 160 / 0.15)",
                        color: "oklch(0.85 0.18 160)",
                        border: "1.5px solid oklch(0.85 0.18 160 / 0.4)",
                      }}
                    >
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      下载图片
                    </Button>
                    <Button
                      onClick={handleCopyText}
                      size="sm"
                      className="rounded-lg text-xs"
                      style={{
                        background: "oklch(0.72 0.18 25 / 0.15)",
                        color: "oklch(0.72 0.18 25)",
                        border: "1.5px solid oklch(0.72 0.18 25 / 0.4)",
                      }}
                    >
                      <Copy className="w-3.5 h-3.5 mr-1.5" />
                      复制文字
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Right: Card preview */}
            <div ref={resultRef} className="flex items-start justify-center">
              <AnimatePresence mode="wait">
                {!hasGenerated ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full max-w-[540px] h-80 rounded-2xl flex flex-col items-center justify-center gap-4"
                    style={{
                      background: "oklch(0.18 0.03 260)",
                      border: "2px dashed oklch(0.30 0.04 260)",
                    }}
                  >
                    <MessageSquare className="w-12 h-12" style={{ color: "oklch(0.35 0.04 260)" }} />
                    <p className="text-sm" style={{ color: "oklch(0.45 0.02 260)" }}>
                      卡片预览区
                    </p>
                    <p className="text-xs" style={{ color: "oklch(0.35 0.02 260)" }}>
                      输入内容并点击"提炼知识要点"后，卡片将在此处生成
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={cardMode}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="w-full flex justify-center"
                  >
                    {cardMode === "dialogue" && (
                      <DialogueCard
                        ref={cardRef}
                        messages={dialogueMessages}
                        title="南沙AI沙龙 · 本期话题"
                      />
                    )}
                    {cardMode === "insight" && (
                      <div ref={cardRef} className="space-y-4">
                        {knowledgePoints.slice(0, 3).map((point, i) => (
                          <InsightCard key={point.id} point={point} index={i} />
                        ))}
                      </div>
                    )}
                    {cardMode === "summary" && (
                      <SummaryCard
                        ref={cardRef}
                        points={knowledgePoints}
                        title="本期知识要点"
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 py-10" style={{ borderTop: "1px solid oklch(0.25 0.03 260)" }}>
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <p className="text-sm mb-2" style={{ color: "oklch(0.50 0.02 260)" }}>
            南沙AI沙龙 · 知识卡片工坊
          </p>
          <p className="text-xs" style={{ color: "oklch(0.38 0.02 260)" }}>
            每周一个主题，围坐篝火，聊聊AI那些事
          </p>
        </div>
      </footer>
    </div>
  );
}
