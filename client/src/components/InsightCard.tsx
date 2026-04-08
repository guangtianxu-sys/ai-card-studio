import { forwardRef } from "react";
import { CARD_CATEGORIES, type KnowledgePoint } from "@/lib/types";
import { motion } from "framer-motion";

interface InsightCardProps {
  point: KnowledgePoint;
  index?: number;
}

const PATTERN_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663482149886/nSr4ZpuJdMaxdbXomhXzrs/card-pattern-1-E2nnASLARY5xYnstE48P9w.webp";

const colorMap: Record<string, { accent: string; glow: string; bgTint: string }> = {
  blue: {
    accent: "oklch(0.78 0.15 220)",
    glow: "oklch(0.78 0.15 220 / 0.25)",
    bgTint: "oklch(0.78 0.15 220 / 0.08)",
  },
  green: {
    accent: "oklch(0.85 0.18 160)",
    glow: "oklch(0.85 0.18 160 / 0.25)",
    bgTint: "oklch(0.85 0.18 160 / 0.08)",
  },
  orange: {
    accent: "oklch(0.72 0.18 25)",
    glow: "oklch(0.72 0.18 25 / 0.25)",
    bgTint: "oklch(0.72 0.18 25 / 0.08)",
  },
};

const InsightCard = forwardRef<HTMLDivElement, InsightCardProps>(
  ({ point, index = 0 }, ref) => {
    const cat = CARD_CATEGORIES[point.category];
    const colors = colorMap[cat.color] || colorMap.blue;

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-[400px] rounded-2xl overflow-hidden relative"
        style={{
          background: `linear-gradient(145deg, oklch(0.16 0.03 260), oklch(0.20 0.04 260))`,
          border: `2.5px solid ${colors.accent}`,
          boxShadow: `0 0 30px ${colors.glow}, 0 4px 20px oklch(0 0 0 / 0.3)`,
        }}
      >
        {/* Pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url(${PATTERN_BG})`,
            backgroundSize: "200px",
            backgroundRepeat: "repeat",
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-5">
          {/* Category badge */}
          <div className="flex items-center justify-between mb-4">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: colors.bgTint,
                color: colors.accent,
                border: `1.5px solid ${colors.accent}40`,
              }}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </span>
            <span
              className="text-xs font-mono"
              style={{ color: "oklch(0.45 0.02 260)" }}
            >
              #{String(index + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-lg font-bold mb-3"
            style={{
              fontFamily: "var(--font-display)",
              color: colors.accent,
            }}
          >
            {point.title}
          </h3>

          {/* Accent line */}
          <div
            className="w-12 h-0.5 mb-3 rounded-full"
            style={{ background: colors.accent }}
          />

          {/* Content */}
          <p
            className="text-sm leading-relaxed"
            style={{ color: "oklch(0.82 0.01 260)" }}
          >
            {point.content}
          </p>

          {/* Footer */}
          <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: "1px solid oklch(0.30 0.04 260)" }}>
            <span className="text-xs" style={{ color: "oklch(0.50 0.02 260)" }}>
              南沙AI沙龙
            </span>
            <span className="text-xs" style={{ color: "oklch(0.40 0.02 260)" }}>
              {new Date().toLocaleDateString("zh-CN")}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }
);

InsightCard.displayName = "InsightCard";
export default InsightCard;
