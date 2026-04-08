export type CardCategory = "skill" | "llm" | "agent" | "mindset" | "philosophy";

export interface KnowledgePoint {
  id: string;
  title: string;
  content: string;
  category: CardCategory;
  source?: string;
  emoji?: string;
}

export interface CardStyle {
  id: string;
  name: string;
  description: string;
  bubbleClass: string;
  glowClass: string;
  accentColor: string;
}

export const CARD_CATEGORIES: Record<CardCategory, { label: string; emoji: string; color: string }> = {
  skill: { label: "技能实操", emoji: "🛠", color: "blue" },
  llm: { label: "LLM 洞察", emoji: "🧠", color: "blue" },
  agent: { label: "Agent 探索", emoji: "🤖", color: "green" },
  mindset: { label: "学习心法", emoji: "💡", color: "orange" },
  philosophy: { label: "人文思考", emoji: "🌱", color: "orange" },
};

export const CARD_STYLES: CardStyle[] = [
  {
    id: "dialogue",
    name: "对话气泡",
    description: "模拟AI大神与新手的对话",
    bubbleClass: "bubble-blue",
    glowClass: "glow-blue",
    accentColor: "oklch(0.78 0.15 220)",
  },
  {
    id: "insight",
    name: "洞察卡片",
    description: "单条核心观点突出展示",
    bubbleClass: "bubble-green",
    glowClass: "glow-green",
    accentColor: "oklch(0.85 0.18 160)",
  },
  {
    id: "summary",
    name: "总结卡片",
    description: "多条知识点汇总",
    bubbleClass: "bubble-orange",
    glowClass: "glow-orange",
    accentColor: "oklch(0.72 0.18 25)",
  },
];

export const SAMPLE_PROMPTS = [
  {
    title: "Agent 工作流设计",
    text: `最近在研究AI Agent的工作流设计，发现一个核心原则：Agent的能力边界不在于模型本身，而在于工具链的设计。一个好的Agent系统应该遵循"最小权限原则"——每个工具只做一件事，但做到极致。比如一个搜索工具不应该同时负责总结，总结应该交给另一个专门的工具。这样不仅降低了出错概率，还让整个系统更容易调试和迭代。另外，Memory的设计也很关键，短期记忆用于当前对话上下文，长期记忆用于用户偏好和历史知识，两者的检索策略完全不同。`,
  },
  {
    title: "Prompt Engineering 心法",
    text: `很多人觉得Prompt Engineering就是写提示词，其实这是一个巨大的误解。真正的Prompt Engineering是在设计一个"思维框架"。我总结了三个层次：第一层是"角色设定"，告诉AI它是谁；第二层是"思维链引导"，通过分步骤的方式引导AI的推理过程；第三层是"输出格式约束"，确保AI的输出是可控的、结构化的。最高级的用法是把这三层组合成一个"元提示词"，让AI自己去优化提示词。这就是所谓的"Prompt的Prompt"。`,
  },
  {
    title: "AI时代的自我定位",
    text: `在AI快速发展的今天，我们需要重新思考"人的价值"这个根本问题。AI擅长的是模式识别和信息处理，但人类独有的能力是"意义赋予"——我们能够为事物赋予意义，能够感受美，能够在不确定中做出价值判断。所以与其焦虑AI会取代我们，不如思考如何成为一个"AI增强的人"。学会与AI协作，把重复性的认知劳动交给AI，自己专注于创造性思考、人际连接和价值判断。这不是躺平，而是一种更高级的"自处之道"。`,
  },
];
