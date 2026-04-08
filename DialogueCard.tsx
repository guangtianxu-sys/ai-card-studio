import { forwardRef } from "react";
import { CARD_CATEGORIES, type CardCategory } from "@/lib/types";
import { motion } from "framer-motion";

interface DialogueMessage {
  role: "user" | "expert";
  content: string;
  category?: CardCategory;
}

interface DialogueCardProps {
  messages: DialogueMessage[];
  title?: string;
  date?: string;
}

const AVATAR_AI = "https://d2xsxph8kpxj0f.cloudfront.net/310519663482149886/nSr4ZpuJdMaxdbXomhXzrs/avatar-ai-XSE3EWVxoDyReiYxLvsbtC.webp";

const categoryColors: Record<string, { border: string; bg: string; text: string }> = {
  blue: {
    border: "border-electric-blue",
    bg: "bg-electric-blue/10",
    text: "text-electric-blue",
  },
  green: {
    border: "border-mint-green",
    bg: "bg-mint-green/10",
    text: "text-mint-green",
  },
  orange: {
    border: "border-coral-orange",
    bg: "bg-coral-orange/10",
    text: "text-coral-orange",
  },
};

function getCategoryStyle(category?: CardCategory) {
  if (!category) return categoryColors.blue;
  const cat = CARD_CATEGORIES[category];
  return categoryColors[cat.color] || categoryColors.blue;
}

const DialogueCard = forwardRef<HTMLDivElement, DialogueCardProps>(
  ({ messages, title, date }, ref) => {
    return (
      <div
        ref={ref}
        className="w-full max-w-[540px] rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, oklch(0.16 0.03 260), oklch(0.20 0.04 260))",
          border: "2.5px solid oklch(0.30 0.04 260)",
        }}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{
                background: "linear-gradient(135deg, oklch(0.78 0.15 220), oklch(0.85 0.18 160))",
                color: "oklch(0.14 0.02 260)",
              }}
            >
              AI
            </div>
            <div>
              <h3
                className="text-sm font-semibold"
                style={{ fontFamily: "var(--font-display)", color: "oklch(0.93 0.01 260)" }}
              >
                {title || "南沙AI沙龙"}
              </h3>
              <p className="text-xs" style={{ color: "oklch(0.55 0.02 260)" }}>
                {date || new Date().toLocaleDateString("zh-CN")}
              </p>
            </div>
          </div>
          <div
            className="px-2.5 py-1 rounded-full text-xs font-medium"
            style={{
              background: "oklch(0.78 0.15 220 / 0.15)",
              color: "oklch(0.78 0.15 220)",
              border: "1.5px solid oklch(0.78 0.15 220 / 0.3)",
            }}
          >
            知识卡片
          </div>
        </div>

        {/* Divider */}
        <div className="mx-5 h-px" style={{ background: "oklch(0.30 0.04 260)" }} />

        {/* Messages */}
        <div className="px-5 py-4 space-y-3">
          {messages.map((msg, index) => {
            const style = getCategoryStyle(msg.category);
            const isUser = msg.role === "user";

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
                className={`flex ${isUser ? "justify-end" : "justify-start"} gap-2`}
              >
                {!isUser && (
                  <img
                    src={AVATAR_AI}
                    alt="AI"
                    className="w-7 h-7 rounded-full flex-shrink-0 mt-1"
                    style={{ border: "1.5px solid oklch(0.78 0.15 220 / 0.5)" }}
                  />
                )}
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 text-sm leading-relaxed ${
                    isUser ? "rounded-2xl rounded-tr-sm" : "rounded-2xl rounded-tl-sm"
                  }`}
                  style={{
                    background: isUser
                      ? "oklch(0.30 0.04 260)"
                      : "oklch(0.78 0.15 220 / 0.12)",
                    border: isUser
                      ? "1.5px solid oklch(0.38 0.04 260)"
                      : "1.5px solid oklch(0.78 0.15 220 / 0.3)",
                    color: "oklch(0.90 0.01 260)",
                  }}
                >
                  {msg.content}
                  {msg.category && (
                    <span
                      className="inline-block ml-2 px-1.5 py-0.5 rounded text-xs font-medium"
                      style={{
                        background: "oklch(0.78 0.15 220 / 0.2)",
                        color: "oklch(0.78 0.15 220)",
                      }}
                    >
                      {CARD_CATEGORIES[msg.category].label}
                    </span>
                  )}
                </div>
                {isUser && (
                  <div
                    className="w-7 h-7 rounded-full flex-shrink-0 mt-1 flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "oklch(0.72 0.18 25 / 0.2)",
                      border: "1.5px solid oklch(0.72 0.18 25 / 0.5)",
                      color: "oklch(0.72 0.18 25)",
                    }}
                  >
                    你
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className="mx-5 mb-4 mt-1 px-3.5 py-2.5 rounded-xl flex items-center justify-between"
          style={{
            background: "oklch(0.14 0.02 260 / 0.6)",
            border: "1px solid oklch(0.30 0.04 260)",
          }}
        >
          <span className="text-xs" style={{ color: "oklch(0.55 0.02 260)" }}>
            南沙AI沙龙 · 知识卡片工坊
          </span>
          <span className="text-xs" style={{ color: "oklch(0.45 0.02 260)" }}>
            AI Card Studio
          </span>
        </div>
      </div>
    );
  }
);

DialogueCard.displayName = "DialogueCard";
export default DialogueCard;
