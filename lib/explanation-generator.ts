export async function generateEnhancedExplanation(
  question: string,
  correctAnswer: string,
  originalExplanation?: string
): Promise<string> {
  const prompt = `Question: ${question}
Correct Answer: ${correctAnswer}
Original Explanation: ${originalExplanation || 'None provided'}

Provide a clear, concise explanation of why this is the correct answer. Focus on the key concepts and make it easy to understand.`;

  return originalExplanation || `The correct answer is ${correctAnswer}. This is a fundamental concept in networking that requires understanding of the underlying protocols and configurations.`;
}

export async function generateHumanAnalogy(
  question: string,
  correctAnswer: string,
  originalExplanation?: string
): Promise<string> {
  const questionHash = `${question}-${correctAnswer}`.toLowerCase();
  
  const architectureAnalogies = [
    "building a house",
    "organizing a kitchen",
    "planning a road trip",
    "managing a restaurant",
    "running a coffee shop",
    "designing a garden",
    "arranging furniture in a room",
    "packing a suitcase",
    "organizing a closet",
    "setting up a home office"
  ];
  
  const randomAnalogy = architectureAnalogies[Math.abs(hashCode(questionHash)) % architectureAnalogies.length];
  
  if (originalExplanation) {
    return `Think of this like ${randomAnalogy}: ${originalExplanation} Just as you need to follow proper steps and standards when ${randomAnalogy}, the same principle applies here - the correct answer (${correctAnswer}) represents the proper standard or method that ensures everything works correctly and safely.`;
  }
  
  return `Imagine ${randomAnalogy} - you need to follow specific rules and standards to do it right. The answer "${correctAnswer}" is like following the building code or best practice that ensures everything is done properly. Just as you wouldn't skip important steps when ${randomAnalogy}, you can't skip this fundamental principle in architecture and construction.`;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash;
}
