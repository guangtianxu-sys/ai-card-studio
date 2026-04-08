import { CardCategory, KnowledgePoint } from "./types";

/**
 * 模拟AI提炼核心观点的逻辑
 * 在纯前端版本中，我们使用规则引擎来提取关键句子
 * 后续可以接入真实的LLM API
 */

const CATEGORY_KEYWORDS: Record<CardCategory, string[]> = {
  skill: ["工具", "技术", "实操", "代码", "API", "框架", "开发", "部署", "配置", "搭建", "编程", "调试"],
  llm: ["模型", "LLM", "GPT", "大语言", "训练", "推理", "Token", "上下文", "参数", "微调", "Prompt", "提示词"],
  agent: ["Agent", "智能体", "工作流", "自动化", "工具链", "Memory", "记忆", "规划", "执行", "多模态"],
  mindset: ["学习", "方法", "效率", "思维", "习惯", "认知", "成长", "迭代", "实践", "复盘"],
  philosophy: ["人类", "价值", "意义", "未来", "社会", "伦理", "自处", "哲学", "反思", "人文", "情感"],
};

function detectCategory(text: string): CardCategory {
  const scores: Record<CardCategory, number> = {
    skill: 0, llm: 0, agent: 0, mindset: 0, philosophy: 0,
  };

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      const regex = new RegExp(keyword, "gi");
      const matches = text.match(regex);
      if (matches) {
        scores[category as CardCategory] += matches.length;
      }
    }
  }

  const maxCategory = Object.entries(scores).reduce((a, b) =>
    a[1] > b[1] ? a : b
  )[0] as CardCategory;

  return maxCategory;
}

function splitIntoSentences(text: string): string[] {
  return text
    .split(/[。！？\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);
}

function extractKeyPoints(text: string): string[] {
  const sentences = splitIntoSentences(text);
  const scored = sentences.map((sentence) => {
    let score = 0;
    // Longer sentences tend to have more substance
    if (sentence.length > 30) score += 1;
    if (sentence.length > 50) score += 1;
    // Sentences with key signal words
    const signalWords = ["核心", "关键", "重要", "本质", "原则", "发现", "总结", "其实", "真正", "最", "应该", "必须"];
    for (const word of signalWords) {
      if (sentence.includes(word)) score += 2;
    }
    // Sentences with structure markers
    const structureWords = ["第一", "第二", "第三", "首先", "其次", "最后", "比如", "例如"];
    for (const word of structureWords) {
      if (sentence.includes(word)) score += 1;
    }
    // Sentences with quotes or emphasis
    if (sentence.includes('\u201c') || sentence.includes('\u300c')) score += 1;
    return { sentence, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 5).map((s) => s.sentence);
}

function generateTitle(point: string): string {
  // Extract the first meaningful phrase as title
  const shortVersion = point.slice(0, 20);
  if (point.includes("——")) {
    return point.split("——")[0].trim().slice(0, 15);
  }
  if (point.includes("：")) {
    return point.split("：")[0].trim().slice(0, 15);
  }
  if (point.includes("，")) {
    return point.split("，")[0].trim().slice(0, 15);
  }
  return shortVersion + "...";
}

let idCounter = 0;

export function extractKnowledgePoints(text: string): KnowledgePoint[] {
  if (!text.trim()) return [];

  const category = detectCategory(text);
  const keyPoints = extractKeyPoints(text);

  return keyPoints.map((point) => {
    idCounter++;
    const pointCategory = detectCategory(point) || category;
    return {
      id: `kp-${Date.now()}-${idCounter}`,
      title: generateTitle(point),
      content: point,
      category: pointCategory,
    };
  });
}

export function generateDialogue(points: KnowledgePoint[]): Array<{
  role: "user" | "expert";
  content: string;
  category?: CardCategory;
}> {
  const dialogue: Array<{ role: "user" | "expert"; content: string; category?: CardCategory }> = [];

  const userQuestions = [
    "这个概念能再展开说说吗？",
    "实际应用中要注意什么？",
    "有什么具体的例子吗？",
    "这对我们普通人意味着什么？",
    "怎么才能快速上手？",
  ];

  points.forEach((point, index) => {
    if (index === 0) {
      dialogue.push({
        role: "user",
        content: `关于「${point.title}」，能分享一下你的见解吗？`,
      });
    } else {
      dialogue.push({
        role: "user",
        content: userQuestions[index % userQuestions.length],
      });
    }
    dialogue.push({
      role: "expert",
      content: point.content,
      category: point.category,
    });
  });

  return dialogue;
}
