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
  const analogies: { [key: string]: string } = {
    'lldp': "Think of LLDP like a universal translator at a United Nations meeting. While CDP (Cisco Discovery Protocol) is like Cisco employees speaking their own company language, LLDP is the common language that everyone from different vendors (like different countries) can understand. When you need devices from multiple manufacturers to communicate and discover each other, you use LLDP - the universal language of network discovery.",
    
    'cpu acl': "A CPU ACL is like a VIP security checkpoint at a concert venue. While regular ACLs control traffic between different sections of the venue (network segments), a CPU ACL specifically protects the backstage area (the device's management processor). It decides which management traffic can reach the 'brain' of the device, preventing unauthorized access to critical control functions.",
    
    'ipsec': "IPsec is like an armored truck for your data. While IKE (Internet Key Exchange) is the security team that negotiates and sets up the protection plan, IPsec is the actual armored vehicle that transports your valuable cargo (user data) safely through dangerous territory (the internet). IKE sets up the security, but IPsec does the heavy lifting of protecting your data in transit.",
    
    'default': "Think of this networking concept like organizing a large office building. Just as you need clear rules and systems to manage how people, information, and resources flow through the building, networks need protocols and configurations to manage how data flows between devices. The correct answer represents the most efficient or secure way to set up this 'office building' for optimal operation."
  };

  const lowerQuestion = question.toLowerCase();
  const lowerAnswer = correctAnswer.toLowerCase();
  
  for (const [key, analogy] of Object.entries(analogies)) {
    if (lowerQuestion.includes(key) || lowerAnswer.includes(key)) {
      return analogy;
    }
  }
  
  return analogies.default;
}
