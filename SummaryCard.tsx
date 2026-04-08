import { forwardRef } from "react";
import { CARD_CATEGORIES, type KnowledgePoint } from "@/lib/types";
import { motion } from "framer-motion";

interface SummaryCardProps {
  points: KnowledgePoint[];
  title?: string;
  date?: string;
}

const SummaryCard = forwardRef<HTMLDivElement, SummaryCardProps>(
  ({ points, title, date }, ref) => {
    return (
      <div
        ref={ref}
        className="w-full max-w-[540px] rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, oklch(0.16 0.03 260), oklch(0.20 0.04 260))",
          border: "2.5px solid oklch(0.72 0.18 25)",
          boxShadow: "0 0 30px oklch(0.72 0.18 25 / 0.2), 0 4px 20px oklch(0 0 0 / 0.3)",
        }}
      >
        {/* Header */}
        <div
          className="px-5 py-4"
          style={{
            background: "linear-gradient(135deg, oklch(0.72 0.18 25 / 0.15), oklch(0.72 0.18 25 / 0.05))",
            borderBottom: "1.5px solid oklch(0.72 0.18 25 / 0.3)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
              style={{
                background: "oklch(0.72 0.18 25 / 0.2)",
                border: "1.5px solid oklch(0.72 0.18 25 / 0.4)",
              }}
            >
              📋
            </div>
            <div>
              <h3
                className="text-base font-bold"
                style={{ fontFamily: "var(--font-display)", color: "oklch(0.72 0.18 25)" }}
              >
                {title || "本期知识要点"}
              </h3>
              <p className="text-xs" style={{ color: "oklch(0.55 0.02 260)" }}>
                {date || new Date().toLocaleDateString("zh-CN")} · 共 {points.length} 条洞察
              </p>
            </div>
          </div>
        </div>

        {/* Points list */}
        <div className="px-5 py-4 space-y-3">
          {points.map((point, index) => {
            const cat = CARD_CATEGORIES[point.category];
            return (
              <motion.div
                key={point.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
                className="flex gap-3"
              >
                {/* Number badge */}
                <div
                  className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5"
                  style={{
                    background: "oklch(0.72 0.18 25 / 0.15)",
                    color: "oklch(0.72 0.18 25)",
                    border: "1px solid oklch(0.72 0.18 25 / 0.3)",
                  }}
                >
                  {index + 1}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "oklch(0.90 0.01 260)" }}
                    >
                      {point.title}
                    </span>
                    <span
                      className="px-1.5 py-0.5 rounded text-xs"
                      style={{
                        background: "oklch(0.25 0.03 260)",
                        color: "oklch(0.65 0.02 260)",
                      }}
                    >
                      {cat.label}
                    </span>
                  </div>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "oklch(0.70 0.01 260)" }}
                  >
                    {point.content.length > 80
                      ? point.content.slice(0, 80) + "..."
                      : point.content}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className="mx-5 mb-4 px-3.5 py-2.5 rounded-xl flex items-center justify-between"
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

SummaryCard.displayName = "SummaryCard";
export default SummaryCard;
